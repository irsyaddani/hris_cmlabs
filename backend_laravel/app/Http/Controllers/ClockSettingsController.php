<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CheckClockSetting;
use Illuminate\Http\Request;

class ClockSettingsController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|integer',
            'clockIn' => 'required|string',
            'clockOut' => 'required|string',
            'breakStart' => 'nullable|string',
            'breakEnd' => 'nullable|string',
        ]);

        // Cek apakah sudah ada setting untuk company_id ini, update jika ada, buat baru jika tidak
        $setting = CheckClockSetting::updateOrCreate(
            ['company_id' => $validated['company_id']],
            [
                'clockIn' => $validated['clockIn'],
                'clockOut' => $validated['clockOut'],
                'breakStart' => $validated['breakStart'],
                'breakEnd' => $validated['breakEnd'],
            ]
        );

        return response()->json(['message' => 'Settings saved successfully', 'data' => $setting]);
    }
}
