<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;

class CheckClockController extends Controller
{
    public function index()
    {
        $data = DB::table('check_clocks as cc')
            ->select(
                'cc.id_user',
                'users.name',
                'users.position',
                DB::raw("DATE(cc.check_clock_time) as date"),
                DB::raw("MAX(CASE WHEN cc.check_clock_type = 'clock_in' THEN cc.check_clock_time END) as clock_in"),
                DB::raw("MAX(CASE WHEN cc.check_clock_type = 'clock_out' THEN cc.check_clock_time END) as clock_out")
            )
            ->join('users', 'users.id', '=', 'cc.id_user')
            ->groupBy('cc.id_user', DB::raw("DATE(cc.check_clock_time)"))
            ->get();

        $mapped = $data->map(function ($item) {
            $clockIn = $item->clock_in ? Carbon::parse($item->clock_in) : null;
            $clockOut = $item->clock_out ? Carbon::parse($item->clock_out) : null;

            $workHours = $clockIn && $clockOut ? $clockOut->diffInMinutes($clockIn) / 60 : 0;

            $status = 'no-show';
            if ($clockIn) {
                $status = $clockIn->hour > 8 || ($clockIn->hour == 8 && $clockIn->minute > 0) ? 'late' : 'on time';
            }

            return [
                'user_id' => $item->id_user,
                'name' => $item->name,
                'position' => $item->position,
                'date' => $item->date,
                'clock_in' => $item->clock_in,
                'clock_out' => $item->clock_out,
                'work_hours' => round($workHours, 2),
                'status' => $status,
            ];
        });

        return response()->json($mapped);
    }
}
?>