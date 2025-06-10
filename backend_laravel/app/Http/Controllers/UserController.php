<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // Ambil data user dan relasinya (employee & company)
    public function getProfile(Request $request)
    {
        $user = $request->user();

        $employee = $user->employee; // relasi ke Employee model
        $company = $user->company;   // relasi ke Company model

        return response()->json([
            'id' => $user->id,
            'company_id' => $company->id ?? null,
            'email' => $user->email,
            'position' => $employee->position ?? null,
            'firstName' => $employee->firstName ?? null,
            'lastName' => $employee->lastName ?? null,
            'name' => $employee ? "{$employee->firstName} {$employee->lastName}" : null,
            'level' => $employee->level ?? null,
        ]);
    }

    // Ubah password user
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'newPassword' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->password = Hash::make($request->input('newPassword'));
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }
}
