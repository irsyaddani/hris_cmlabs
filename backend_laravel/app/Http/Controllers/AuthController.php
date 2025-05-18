<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
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

        $employee = Employee::create([
            'firstName' => $request->firstName,
            'lastName'  => $request->lastName,
        ]);

        $user = User::create([
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'employee_id' => $employee->id,
            'company_id'  => $company->id,
        ]);

        return response()->json([
            'message' => 'Registration successful',
            'user'    => $user,
        ], 201);
    }


    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => $user,
        ]);
    }
}
