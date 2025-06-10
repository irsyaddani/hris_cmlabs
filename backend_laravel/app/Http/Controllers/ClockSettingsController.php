<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CheckClockSetting;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ClockSettingsController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|integer|exists:companies,id',
            'locationName' => 'required|string',
            'detailAddress' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|integer',
            'clockIn' => 'required|date_format:H:i',
            'clockOut' => 'required|date_format:H:i',
            'breakStart' => 'nullable|date_format:H:i',
            'breakEnd' => 'nullable|date_format:H:i',
        ]);

        // Update jika sudah ada, jika tidak maka buat baru
        $setting = CheckClockSetting::updateOrCreate(
            ['company_id' => $validated['company_id']],
            [
                'locationName' => $validated['locationName'],
                'detailAddress' => $validated['detailAddress'],
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'radius' => $validated['radius'],
                'clockIn' => $validated['clockIn'],
                'clockOut' => $validated['clockOut'],
                'breakStart' => $validated['breakStart'],
                'breakEnd' => $validated['breakEnd'],
            ]
        );

        return response()->json([
            'message' => 'Settings saved successfully',
            'data' => $setting
        ]);
    }

    public function show($companyId)
    {
        Log::debug('Processing show request for company ID', ['companyId' => $companyId]);

        if (!is_numeric($companyId) || $companyId <= 0) {
            Log::warning('Invalid company ID provided', ['companyId' => $companyId]);
            return response()->json([
                'data' => [],
                'message' => 'ID perusahaan tidak valid.'
            ], 400);
        }

        try {
            Log::info('Fetching clock settings for company ID', ['companyId' => $companyId]);
            $setting = CheckClockSetting::where('company_id', $companyId)->first();

            if (!$setting) {
                Log::info('No clock settings found for company ID', ['companyId' => $companyId]);
                return response()->json([
                    'data' => [],
                    'message' => 'Pengaturan jam tidak ditemukan untuk perusahaan ini.'
                ], 404);
            }

            Log::debug('Transforming clock settings data', ['setting' => $setting->toArray()]);
            $data = [
                'id' => $setting->id,
                'company_id' => $setting->company_id,
                'locationName' => $setting->locationName ?? '-',
                'detailAddress' => $setting->detailAddress ?? '-',
                'latitude' => $setting->latitude ? (float)$setting->latitude : null,
                'longitude' => $setting->longitude ? (float)$setting->longitude : null,
                'radius' => $setting->radius ? (int)$setting->radius : null,
                'clockIn' => $this->formatTime($setting->clockIn, 'H:i'),
                'clockOut' => $this->formatTime($setting->clockOut, 'H:i'),
                'breakStart' => $this->formatTime($setting->breakStart, 'H:i'),
                'breakEnd' => $this->formatTime($setting->breakEnd, 'H:i'),
                'created_at' => $this->formatTime($setting->created_at, 'Y-m-d H:i:s'),
                'updated_at' => $this->formatTime($setting->updated_at, 'Y-m-d H:i:s'),
            ];

            Log::info('Clock settings retrieved successfully', ['companyId' => $companyId]);
            return response()->json([
                'data' => $data,
                'message' => 'Pengaturan jam berhasil diambil.'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching clock settings for company ID', [
                'companyId' => $companyId,
                'error_message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'data' => [],
                'message' => 'Terjadi kesalahan saat mengambil pengaturan jam.'
            ], 500);
        }
    }

    private function formatTime($time, $format)
    {
        if (!$time) {
            Log::debug('Time is null or empty', ['time' => $time, 'format' => $format]);
            return null;
        }

        try {
            return Carbon::parse($time)->format($format);
        } catch (\Exception $e) {
            Log::warning('Failed to parse time', [
                'time' => $time,
                'format' => $format,
                'error_message' => $e->getMessage()
            ]);
            return null;
        }
    }

}
