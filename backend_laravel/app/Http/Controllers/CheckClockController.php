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

            $workTime = $this->calculateWorkHours($item->clock_in, $item->clock_out);

            return [
                'id' => $item->id,
                'name' => $fullName,
                'avatarUrl' => $employee?->avatar_url ?? 'https://yourcdn.com/avatars/default.jpg',
                'position' => $employee?->position ?? '-',
                'clockIn' => $item->clock_in ? $item->clock_in->format('Y-m-d H:i:s') : null,
                'clockOut' => $item->clock_out ? $item->clock_out->format('Y-m-d H:i:s') : null,
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
        // Validasi input
        $validated = $request->validate([
            'status_approval' => 'required|string|in:pending,approved,rejected',
        ]);

        // Cari data CheckClock berdasarkan ID
        $checkclock = CheckClock::find($id);

        // Jika data tidak ditemukan
        if (!$checkclock) {
            return response()->json([
                'message' => 'CheckClock data not found.',
            ], 404);
        }

        // Update status approval
        $checkclock->status_approval = $validated['status_approval'];
        $checkclock->save();

        // Response sukses
        return response()->json([
            'message' => 'Approval status updated successfully.',
            'data' => $checkclock,
        ]);
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
