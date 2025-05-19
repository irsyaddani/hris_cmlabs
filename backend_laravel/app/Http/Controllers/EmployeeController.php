<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    public function store(Request $request)
    {
        // Validasi input dari frontend
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'birthPlace' => 'required|string',
            'birthDate' => 'required|date',
            'nik' => 'required|string|size:16',
            'gender' => 'required|in:male,female',
            'lastEducation' => 'required|string',
            'mobileNumber' => 'required|string',
            'position' => 'required|string',
            'employeeType' => 'required|string',
            'grade' => 'required|string',
            'joinDate' => 'required|date',
            'branch' => 'required|string',
            'bank' => 'required|string',
            'accountNumber' => 'required|string',
            'bankAccountName' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

            if (Employee::where('nik', $validated['nik'])->exists()) {
        return response()->json([
            'message' => 'NIK sudah terdaftar.',
            'errors' => ['nik' => ['NIK sudah digunakan oleh karyawan lain.']],
        ], 422);
    }

        try {
         $employee = Employee::create([
    'firstName' => $validated['firstName'],
    'lastName' => $validated['lastName'],
    'birthPlace' => $validated['birthPlace'],
    'birthDate' => $validated['birthDate'],
    'nik' => $validated['nik'],
    'gender' => ucfirst(strtolower($validated['gender'])),
    'lastEducation' => $validated['lastEducation'],
    'mobileNumber' => $validated['mobileNumber'],
    'position' => $validated['position'],
    'employeeType' => $validated['employeeType'],
    'grade' => $validated['grade'],
    'joinDate' => $validated['joinDate'],
    'branch' => $validated['branch'],
    'bank' => $validated['bank'],
    'accountNumber' => $validated['accountNumber'],
    'bankAccountName' => $validated['bankAccountName'],
    // 'id_user' => auth()->id(), // opsional
    // 'id_ck_settings' => ... // opsional
]);

            return response()->json([
                'message' => 'Data karyawan berhasil disimpan.',
                'data' => $employee,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
