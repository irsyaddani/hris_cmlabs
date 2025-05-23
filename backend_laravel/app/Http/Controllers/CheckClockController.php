<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CheckClock;
use App\Models\Employee;
use Carbon\Carbon;

class CheckClockController extends Controller
{
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
$workHoursString = "{$workTime['hours']}.{$workTime['minutes']}";

            return [
                'name' => $fullName,
                'avatarUrl' => $employee?->avatar_url ?? 'https://yourcdn.com/avatars/default.jpg',
                'position' => $employee->position ?? '-',
                'clockIn' => $item->clock_in ? $item->clock_in->format('Y-m-d H:i:s') : null,
                'clockOut' => $item->clock_out ? $item->clock_out->format('Y-m-d H:i:s') : null,
                'workHours' => $workHoursString,
                'approval' => $item->status_approval ?? '-',
                'status' => $item->type,
            ];
        });
    
        return response()->json(['data' => $data]);
    }
    


    private function calculateWorkHours($clockIn, $clockOut)
    {
        if (!$clockIn || !$clockOut) return ['hours' => 0, 'minutes' => 0];
    
        $start = Carbon::parse($clockIn);
        $end = Carbon::parse($clockOut);
    
        if ($end->lessThanOrEqualTo($start)) {
            return ['hours' => 0, 'minutes' => 0];
        }
    
        $diffMinutes = $start->diffInMinutes($end);
    
        $hours = intdiv($diffMinutes, 60);        // hitung jam utuh
        $minutes = ($diffMinutes % 60);              // sisa menit
    
        return ['hours' => $hours, 'minutes' => $minutes];
    }
    

}
