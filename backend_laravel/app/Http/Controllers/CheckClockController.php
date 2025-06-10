<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CheckClock;
use Carbon\Carbon;

class CheckClockController extends Controller
{
    // Method untuk ambil data checkclock
    public function index()
    {
        $data = CheckClock::with('employee')->get()->map(function ($item) {
            $employee = $item->employee ?? null;

            $fullName = '-';
            if ($employee) {
                $firstName = $employee->firstName ?? '';
                $lastName = $employee->lastName ?? '';
                $fullName = trim($firstName . ' ' . $lastName);
                if ($fullName === '') {
                    $fullName = '-';
                }
            }

            // Default clockIn dan clockOut
            $clockIn = $item->clock_in;
            $clockOut = $item->clock_out;

            // Tambahkan logika auto-clockout jika clockIn ada, clockOut kosong, dan sudah ganti hari
            if ($clockIn && !$clockOut) {
                $clockInDate = Carbon::parse($clockIn)->startOfDay(); // hanya tanggal
                $today = now()->startOfDay();

                if ($today->greaterThan($clockInDate)) {
                    // Set clockOut ke jam 17:00 pada hari clockIn
                    $autoClockOut = Carbon::parse($clockInDate)->setTime(17, 0, 0);
                    $item->clock_out = $autoClockOut;
                    $item->save(); // SIMPAN PERUBAHAN KE DATABASE
                    $clockOut = $autoClockOut;
                }
            }

            // Hitung work time
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
                'status' => $item->type ?? '-',
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

        if ($data->isEmpty()) {
            return response()->json([
                'data' => [],
                'message' => 'No results found.'
            ]);
        }

        return response()->json(['data' => $data]);
    }



    // Method untuk update approval status
    public function updateApproval(Request $request, $id)
    {
        // Validasi input status_approval
        $validated = $request->validate([
            'status_approval' => 'required|string|in:pending,approved,rejected',
        ]);

        // Ambil data checkclock + relasi employee
        $checkclock = CheckClock::with('employee')->find($id);

        if (!$checkclock) {
            return response()->json([
                'message' => 'CheckClock data not found.',
            ], 404);
        }

        // Hanya izinkan update jika type adalah permit atau annual leave
        if (!in_array($checkclock->type, ['permit', 'annual leave'])) {
            return response()->json([
                'message' => 'Approval can only be updated for permit or annual leave.',
            ], 400);
        }

        // Jangan izinkan mengubah status jika sudah final
        if (in_array($checkclock->status_approval, ['approved', 'rejected'])) {
            return response()->json([
                'message' => 'Approval status is already final.',
            ], 400);
        }

        // Update status_approval
        $checkclock->status_approval = $validated['status_approval'];
        $checkclock->save();

        // Format data konsisten seperti di index()
        $employee = $checkclock->employee ?? null;
        $fullName = '-';
        if ($employee) {
            $firstName = $employee->firstName ?? '';
            $lastName = $employee->lastName ?? '';
            $fullName = trim($firstName . ' ' . $lastName) ?: '-';
        }

        $workTime = $this->calculateWorkHours($checkclock->clock_in, $checkclock->clock_out);

        return response()->json([
            'message' => 'Approval status updated successfully.',
            'data' => [
                'id' => $checkclock->id,
                'name' => $fullName,
                'avatarUrl' => $employee?->avatar_url ?? 'https://yourcdn.com/avatars/default.jpg',
                'position' => $employee?->position ?? '-',
                'clockIn' => $checkclock->clock_in ? $checkclock->clock_in->format('Y-m-d H:i:s') : null,
                'clockOut' => $checkclock->clock_out ? $checkclock->clock_out->format('Y-m-d H:i:s') : null,
                'workHours' => $workTime,
                'approval' => $checkclock->status_approval ?? '-',
                'status' => $checkclock->type ?? '-',
                'reason' => $checkclock->reason ?? '',
                'proofFile' => $checkclock->proof_file ? [
                    'fileName' => basename($checkclock->proof_file),
                    'fileUrl' => asset('storage/' . $checkclock->proof_file),
                    'fileType' => $this->getFileMimeType($checkclock->proof_file),
                ] : null,
                'startDate' => $checkclock->start_date ? Carbon::parse($checkclock->start_date)->format('Y-m-d') : null,
                'endDate' => $checkclock->end_date ? Carbon::parse($checkclock->end_date)->format('Y-m-d') : null,
            ]
        ]);
    }

    public function destroy($id)
    {
        $checkclock = Checkclock::find($id);

        if (!$checkclock) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        try {
            $checkclock->delete();
            return response()->json(['message' => 'Data berhasil dihapus']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menghapus data', 'error' => $e->getMessage()], 500);
        }
    }

    // Hitung durasi kerja (jam, menit)
    private function calculateWorkHours($clockIn, $clockOut)
    {
        if (!$clockIn) {
            return ['hours' => 0, 'minutes' => 0];
        }

        $start = Carbon::parse($clockIn);
        $end = $clockOut ? Carbon::parse($clockOut) : Carbon::now();

        if ($end->lessThanOrEqualTo($start)) {
            return ['hours' => 0, 'minutes' => 0];
        }

        $diffMinutes = $start->diffInMinutes($end);
        $hours = intdiv($diffMinutes, 60);
        $minutes = $diffMinutes % 60;

        return ['hours' => $hours, 'minutes' => $minutes];
    }

    private function getFileMimeType($filePath)
    {
        $fullPath = storage_path('app/public/' . $filePath);

        if (!file_exists($fullPath)) {
            return 'application/octet-stream';
        }

        return mime_content_type($fullPath);
    }
}
