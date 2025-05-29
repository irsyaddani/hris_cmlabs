<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class EmployeeController extends Controller
{
    private function getPositionCode($position)
    {
        $map = [
            'backend_dev' => 'BD',
            'frontend_dev' => 'FD',
            'fullstack_dev' => 'FS',
            'hr_manager' => 'HR',
            'mobile_dev' => 'MD',
            'project_manager' => 'PM',
            'qa_engineer' => 'QA',
            'recruiter' => 'RQ',
            'ui_designer' => 'UI',
        ];

        return $map[$position] ?? 'XX';
    }

    private function generateUniqueEmployeeCode($position)
    {
        $prefix = $this->getPositionCode($position);

        do {
            $randomNumber = str_pad(random_int(1, 99999), 5, '0', STR_PAD_LEFT);
            $code = $prefix . $randomNumber;

            $exists = Employee::where('employee_code', $code)->exists();
        } while ($exists); // Ulangi jika sudah dipakai

        return $code;
    }


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
            'email' => 'required|email|unique:users,email',
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
        } try {

            $employeeCode = $this->generateUniqueEmployeeCode($validated['position']);
            $companyId = Auth::user()->company_id;

            $user = User::create([
                'email'    => $validated['email'],
                'password' => Hash::make($employeeCode),
                'company_id'  => $companyId,
            ]);

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
                'employee_code' => $employeeCode,
                'level' => strtolower($validated['position']) === 'hr_manager' ? 'admin' : 'user',
                'user_id' => $user->id,
                'company_id'  => $companyId,
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

/// AMBIL DATA KARYAWAN ///

    public function index()
    {
        try {
            $employees = Employee::all(); // Ambil semua data dari tabel employees

            return response()->json([
                'message' => 'Data karyawan berhasil diambil.',
                'data' => $employees,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat mengambil data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

/// AMBIL DETAIL KARYAWAN ///

    public function show($id)
    {
        $employee = Employee::with('user')->find($id);

        if (!$employee) {
            return response()->json([
                'message' => 'Data karyawan tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'message' => 'Detail karyawan berhasil diambil.',
            'data' => $employee
        ], 200);
    }

/// update //

    public function update(Request $request, $id)
    {
        $employee = Employee::with('user')->find($id);

        if (!$employee) {
            return response()->json([
                'message' => 'Data karyawan tidak ditemukan.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'birthPlace' => 'required|string',
            'birthDate' => 'required|date',
            'nik' => 'required|string|size:16',
            'gender' => 'required|in:male,female',
            'lastEducation' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $employee->user_id . ',id',
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
        
        if (empty($employee->employee_code) || $validated['position'] !== $employee->position) {
            $employee->employee_code = $this->generateUniqueEmployeeCode($validated['position']);
        }

        // Cek apakah NIK sudah digunakan oleh karyawan lain (bukan ini)
        if (Employee::where('nik', $validated['nik'])->where('id', '!=', $id)->exists()) {
            return response()->json([
                'message' => 'NIK sudah terdaftar.',
                'errors' => ['nik' => ['NIK sudah digunakan oleh karyawan lain.']],
            ], 422);
        }

        try {

            if ($employee->user) {
                $employee->user->update(['email' => $validated['email']]);
            }

            $employee->update([
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
                'level'=> strtolower($validated['position']) === 'hr_manager' ? 'admin' : 'user',
                'employee_code' => $employee->employee_code,
            ]);

            return response()->json([
                'message' => 'Data karyawan berhasil diperbarui.',
                'data' => $employee,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat memperbarui data.',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

/// destroy ///

    public function destroy($id)
    {
        $employee = Employee::with('user')->find($id);

        if (!$employee) {
            return response()->json([
                'message' => 'Data karyawan tidak ditemukan.'
            ], 404);
        }

        try {
            if ($employee->user) {
                $employee->user->delete();
            }

            $employee->delete();

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
