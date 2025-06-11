<?php

namespace App\Http\Controllers;

use App\Models\CheckClock;
use App\Models\CheckClockSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CheckClockController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user || !$user->company) {
            return response()->json(['message' => 'Unauthorized or company not found'], 403);
        }

        $companyId = $user->company->id;

        $settings = CheckClockSetting::where('company_id', $companyId)->first();
        $clockInTime = $settings && $settings->clockIn
            ? Carbon::parse($settings->clockIn)
            : Carbon::createFromTime(8, 0, 0);
        $lateThreshold = $clockInTime->copy()->addMinutes(15);
        $clockOutTime = $settings && $settings->clockOut
            ? Carbon::parse($settings->clockOut)
            : Carbon::createFromTime(17, 0, 0);

        $checkClocks = CheckClock::whereHas('employee', function ($query) use ($companyId) {
            $query->where('company_id', $companyId);
        })->with('employee')->get();

        $data = $checkClocks->map(function ($item) use ($clockInTime, $lateThreshold, $clockOutTime) {
            $employee = $item->employee;

            $fullName = '-';
            if ($employee) {
                $firstName = $employee->firstName ?? '';
                $lastName = $employee->lastName ?? '';
                $fullName = trim($firstName . ' ' . $lastName) ?: '-';
            }

            $clockIn = $item->clock_in;
            $clockOut = $item->clock_out;

            // Auto-clockout jika sudah lewat pukul 00:01 dari tanggal clock_in
            if ($clockIn && !$clockOut) {
                $clockInDate = Carbon::parse($clockIn)->startOfDay();
                $now = now();
                $afterMidnight = $clockInDate->copy()->addDay()->addMinute(); // 00:01 esok harinya

                if ($now->greaterThanOrEqualTo($afterMidnight)) {
                    $autoClockOut = $clockInDate->copy()->setTime(
                        $clockOutTime->hour,
                        $clockOutTime->minute,
                        $clockOutTime->second
                    );
                    $item->clock_out = $autoClockOut;
                    $item->save();
                    $clockOut = $autoClockOut;
                }
            }

            $status = 'no-show';
            $absentType = $item->type;
            $clockInTimeParsed = $clockIn ? Carbon::parse($clockIn) : null;
            $clockOutTimeParsed = $clockOut ? Carbon::parse($clockOut) : null;
            $clockInStatus = !!$clockIn;

            if ($absentType === 'sick') {
                $status = 'permit';
            } elseif ($absentType === 'annual leave') {
                $status = 'annual leave';
            } elseif (!$clockInStatus && $clockOutTimeParsed) {
                $status = 'no-show';
            } elseif (in_array($absentType, ['wfo', 'wfh']) && $clockInTimeParsed) {
                // Sesuaikan late threshold dengan tanggal clockIn
                $lateThresholdSameDate = $clockInTimeParsed->copy()->setTime(
                    $lateThreshold->hour,
                    $lateThreshold->minute,
                    $lateThreshold->second
                );

                \Log::info('ClockIn: ' . $clockInTimeParsed->format('Y-m-d H:i:s'));
                \Log::info('Late Threshold (adjusted): ' . $lateThresholdSameDate->format('Y-m-d H:i:s'));

                if ($clockInTimeParsed->lessThanOrEqualTo($lateThresholdSameDate)) {
                    $status = 'on time';
                } else {
                    $status = 'late';
                }
            }

            $workTime = $this->calculateWorkHours($clockIn, $clockOut);

            return [
                'id' => $item->id,
                'name' => $fullName,
                'avatarUrl' => $employee?->avatar_url ?? 'https://yourcdn.com/avatars/default.jpg',
                'position' => $employee?->position ?? '-',
                'clockIn' => $clockIn ? Carbon::parse($clockIn)->format('Y-m-d H:i:s') : null,
                'clockOut' => $clockOut ? Carbon::parse($clockOut)->format('Y-m-d H:i:s') : null,
                'workHours' => $workTime,
                'approval' => $item->status_approval ?? '-',
                'status' => $status,
                'reason' => $item->reason ?? '',
                'proofFile' => $item->proof_file ? [
                    'fileName' => basename($item->proof_file),
                    'fileUrl' => asset('storage/' . $item->proof_file),
                    'fileType' => $this->getFileMimeType($item->proof_file),
                ] : null,
                'startDate' => $item->start_date ? Carbon::parse($item->start_date)->format('Y-m-d') : null,
                'endDate' => $item->end_date ? Carbon::parse($item->end_date)->format('Y-m-d') : null,
            ];
        });

        return response()->json([
            'data' => $data,
            'message' => $data->isEmpty() ? 'No results found.' : 'Success',
        ]);
    }

    private function calculateWorkHours($clockIn, $clockOut)
    {
        if (!$clockIn || !$clockOut) {
            return ['hours' => 0, 'minutes' => 0];
        }

        $start = Carbon::parse($clockIn);
        $end = Carbon::parse($clockOut);
        $diff = $end->diff($start);

        return [
            'hours' => $diff->h,
            'minutes' => $diff->i,
        ];
    }

    private function getFileMimeType($filePath)
    {
        $fullPath = storage_path('app/public/' . $filePath);
        return mime_content_type($fullPath) ?? 'application/octet-stream';
    }

    public function destroy($id)
    {
        $checkclock = CheckClock::find($id);

        if (!$checkclock) {
            return response()->json([
                'message' => 'Data karyawan tidak ditemukan.'
            ], 404);
        }

        try {
            if ($checkclock->user) {
                $checkclock->user->delete();
            }

            $checkclock->delete();

            return response()->json([
                'message' => 'Data karyawan berhasil dihapus.'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat menghapus data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
