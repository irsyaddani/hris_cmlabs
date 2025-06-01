<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use App\Models\Employee;
use App\Models\Checkclock;
use App\Models\CheckclockSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:100',
            'lastName'  => 'required|string|max:100',
            'email'     => 'required|email|unique:users,email',
            'password'  => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',       // huruf besar
                'regex:/[a-z]/',       // huruf kecil
                'regex:/[^A-Za-z0-9]/' // karakter khusus
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $company = Company::create([
            'companyName' => $request->companyName ?? null,
        ]);
        
        $checkclocksetting = CheckclockSetting::create([
            'clockIn' => $request->clockIn ?? null,
            'clockOut' => $request->clockOut ?? null,
            'breakStart' => $request->breakStart ?? null,
            'breakEnd' => $request->breakEnd ?? null,
            'company_id'  => $company->id,
        ]);

        $user = User::create([
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'company_id'  => $company->id,
        ]);
        
        $employee = Employee::create([
            'firstName' => $request->firstName,
            'lastName'  => $request->lastName,
            'user_id'  => $user->id,
            'company_id'  => $company->id,
            'level'       => 'admin',
        ]);

        return response()->json([
            'message' => 'Registration successful',
            'user'    => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'identifier' => 'required|string',
            'password'   => 'required|string',
        ]);

        $identifier = $credentials['identifier'];
        $password = $credentials['password'];

        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            $user = User::where('email', $identifier)->first();

            if ($user && Hash::check($password, $user->password)) {
                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'message' => 'Login via email sukses',
                    'token'   => $token,
                    'user'    => $user,
                ]);
            }
        } else {
            $employee = Employee::where('employee_code', $identifier)->first();

            if ($employee && $employee->user) {
                $user = $employee->user;

                if (Hash::check($password, $user->password)) {
                    $token = $user->createToken('auth_token')->plainTextToken;

                    $isDefaultPassword = Hash::check($employee->employee_code, $user->password);

                    return response()->json([
                        'message'              => 'Login via employee id sukses',
                        'token'                => $token,
                        'user'                 => $user,
                        'need_reset_password'  => $isDefaultPassword,
                    ]);
                }
            }
        }
        
        return response()->json([
            'message' => 'Login gagal.',
        ], 401);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Token tidak valid atau tidak dikirim.',
            ], 401);
        }

        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }

}
