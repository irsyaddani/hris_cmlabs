<?php

namespace App\Http\Controllers;

use App\Models\CheckClock;
use App\Models\CheckClockSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
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

    public function show($id)
    {
        $checkclock = CheckClock::with('employee')->find($id);

        if (!$checkclock) {
            return response()->json([
                'message' => 'Data karyawan tidak ditemukan.'
            ], 404);
        }

        $employee = $checkclock->employee;

        return response()->json([
            'message' => 'Detail karyawan berhasil diambil.',
            'data' => [
                'id' => $checkclock->id,
                'clock_in' => $checkclock->clock_in,
                'clock_out' => $checkclock->clock_out,
                'type' => $checkclock->type,
                'status_approval' => $checkclock->status_approval,
                'reason' => $checkclock->reason,
                'start_date' => $checkclock->start_date,
                'end_date' => $checkclock->end_date,
                'latitude' => $checkclock->latitude,
                'longitude' => $checkclock->longitude,
                'created_at' => $checkclock->created_at,
                'updated_at' => $checkclock->updated_at,
                'employee' => $employee ? [
                    'firstName' => $employee->firstName ?? '-',
                    'lastName' => $employee->lastName ?? '-',
                    'position' => $employee->position ?? '-',
                    'avatarUrl' => $employee->avatar_url ?? null,
                ] : null,
            ]
        ], 200);
    }

    public function updateApproval(Request $request, $id)
    {
        $user = Auth::user();

        // Check if user is authenticated and has a company
        if (!$user || !$user->company) {
            return response()->json(['message' => 'Unauthorized or company not found'], 403);
        }

        // Validate the request payload
        $request->validate([
            'status_approval' => 'required|in:approved,rejected',
        ]);

        // Find the CheckClock record
        $checkclock = CheckClock::where('id', $id)
            ->whereHas('employee', function ($query) use ($user) {
                $query->where('company_id', $user->company->id);
            })->first();

        if (!$checkclock) {
            return response()->json(['message' => 'CheckClock record not found or not authorized'], 404);
        }

        try {
            // Update the status_approval
            $checkclock->status_approval = $request->status_approval;
            $checkclock->save();

            // Log the update for debugging


            return response()->json([
                'message' => 'Approval status updated successfully',
                'data' => [
                    'id' => $checkclock->id,
                    'status_approval' => $checkclock->status_approval,
                ],
            ], 200);
        } catch (\Exception $e) {
            
            return response()->json([
                'message' => 'Failed to update approval status',
                'error' => $e->getMessage(),
            ], 500);
        }
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

    public function getByUserId()
{
    $user = Auth::user();

    // Pastikan user terautentikasi dan memiliki relasi employee
    if (!$user || !$user->employee) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized or employee data not found.',
        ], 403);
    }

    try {
        $employeeId = $user->employee->id;

        $checkClocks = CheckClock::where('id_employee', $employeeId)
            ->orderBy('id_employee', 'desc')
            ->get();

        // Format data satu per satu
        $formattedData = $checkClocks->map(function ($item) {
            return [
                'id' => $item->id,
                'clockIn' => $item->clock_in,
                'clockOut' => $item->clock_out,
                'type' => $item->type,
                'startDate' => $item->start_date,
                'endDate' => $item->end_date,
                'status' => $item->type,
                'statusApproval' => $item->status_approval,
                'reason' => $item->reason,
                'file' => $item->file,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Check clock data fetched successfully.',
            'data' => $formattedData,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch check clock data.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'type' => 'nullable|string|in:wfo,wfh,sick,annual leave,permit',
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date|after_or_equal:start_date',
        'clock_in' => 'nullable|date',
        'clock_out' => 'nullable|date',
        'reason' => 'nullable|string|max:255',
        'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        'latitude' => 'nullable|numeric',
        'longitude' => 'nullable|numeric',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }

    $filePath = null;
    if ($request->hasFile('file')) {
        $filePath = $request->file('file')->store('absent_files', 'public');
    }

    // Tentukan status approval berdasarkan type
    $statusApproval = in_array($request->type, ['wfo', 'wfh', 'sick']) ? null : 'pending';

    $checkClock = CheckClock::create([
        'id_employee'     => Auth::user()->employee->id,
        'type'            => $request->type ?? null,
        'start_date'      => $request->start_date ?? null,
        'end_date'        => $request->end_date ?? null,
        'clock_in'        => $request->clock_in ?? null,
        'clock_out'       => $request->clock_out ?? null,
        'reason'          => $request->reason ?? null,
        'file'            => $filePath,
        'status_approval' => $statusApproval,
        'latitude'        => $request->latitude ?? null,
        'longitude'       => $request->longitude ?? null,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'CheckClock record created successfully.',
        'data' => $checkClock,
    ], 201);
}

public function addEmptyRowIfNotHoliday(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            if (!$user || !$user->company) {
                return response()->json(['message' => 'Unauthorized or company not found'], 403);
            }

            $employeeId = Auth::user()->employee->id;

            $today = now()->toDateString(); // Format: YYYY-MM-DD

            // Check if a record already exists for today and this user
            $existingRecord = CheckClock::where('id_employee', $employeeId)
                ->where('created_at', $today)
                ->first();

            if ($existingRecord) {
                return response()->json(['message' => 'Record already exists for today.'], 200);
            }

            // Create new record with null values
            $checkclock = CheckClock::create([
                'id_employee' => $employeeId,
                'startDate' => null,
                'endDate' => null,
                'clock_in' => null,
                'clock_out' => null,
                'reason' => null,
                'file' => null,
                'work_hours' => null,
                'status_approval' => null,
                'type' => "wfo",
                'latitude' => null,
                'longitude' => null,
            ]);

            return response()->json([
                'data' => $checkclock,
                'message' => 'Empty row added successfully.',
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error adding empty row: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to add empty row.'], 500);
        }
    }

}
