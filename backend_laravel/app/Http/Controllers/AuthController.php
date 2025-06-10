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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Carbon\Carbon;

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
            $user = User::with('employee')->where('email', $identifier)->first();
            if ($user && Hash::check($password, $user->password)) {
                $token = $user->createToken('auth_token')->plainTextToken;
                $level = $user->employee->level;

                return response()->json([
                    'message' => 'Login via email sukses',
                    'token'   => $token,
                    'user'    => $user,
                    'level'   => $user->employee->level
                ]);
            }
        } else {
            $employee = Employee::with('user')->where('employee_code', $identifier)->first();
            
            if ($employee && $employee->user) {
                $user = $employee->user;

                if (Hash::check($password, $user->password)) {
                    $token = $user->createToken('auth_token')->plainTextToken;
                    $level = $employee->level;

                    $isDefaultPassword = Hash::check($employee->employee_code, $user->password);

                    return response()->json([
                        'message'              => 'Login via employee id sukses',
                        'token'                => $token,
                        'user'                 => $user,
                        'level'                => $employee->level,
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


    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $existing = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if ($existing && Carbon::parse($existing->created_at)->diffInMinutes(now()) < 2) {
            return response()->json([
                'message' => 'Link sudah dikirim sebelumnya. Silakan cek email Anda.',
            ], 429);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => Carbon::now()
            ]
        );

        $resetUrl = config('app.frontend_url') . '/auth/reset-password?email=' . urlencode($request->email) . '&token=' . $token;

        Mail::raw("Klik link ini untuk reset password Anda:\n\n" . $resetUrl, function ($message) use ($request) {
            $message->to($request->email)
                    ->subject('Reset Password HRIS App');
        });

        return response()->json([
            'message' => 'Link reset password berhasil dikirim ke email.'
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',       // huruf besar
                'regex:/[a-z]/',       // huruf kecil
                'regex:/[^A-Za-z0-9]/' // karakter khusus
            ],
        ]);

        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$record) {
            return response()->json(['message' => 'Token tidak ditemukan.'], 404);
        }

        if (!Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Token tidak valid.'], 400);
        }

        if (Carbon::parse($record->created_at)->addHours(24)->isPast()) {
            return redirect()->to(config('app.frontend_url') . '/auth/link-expired');
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Password berhasil direset.',
        ]);
    }
}
