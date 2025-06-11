<?php

use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Employee;
use App\Models\Company;
use App\Models\CheckClockSetting;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/auth/google', function (Request $request) {
    $mode = $request->query('mode', 'login');
    $redirectUrl = Socialite::driver('google')->stateless()->with(['state' => $mode])->redirect()->getTargetUrl();
    return redirect($redirectUrl);
});

Route::get('/api/auth/google/callback', function (Request $request) {
    $googleUser = Socialite::driver('google')->stateless()->user();
    $authMode = $request->query('state', 'login');
    $email = $googleUser->getEmail();

    
    $firstName = $googleUser->getRaw()['given_name'] ?? null;
    $lastName = $googleUser->getRaw()['family_name'] ?? null;
    
    $user = User::where('email', $email)->first();
    
    if (!$user && $authMode === 'signup') {
        $company = Company::create([
            'companyName' => $googleUser->getRaw()['name'] . "'s Company",
        ]);

        $user = User::create([
            'email' => $email,
            'password' => bcrypt(Str::random(16)),
            'company_id' => $company->id,
        ]);

        Employee::create([
            'firstName' => $firstName,
            'lastName' => $lastName,
            'user_id' => $user->id,
            'company_id' => $company->id,
            'level' => 'admin',
        ]);

        $checkclocksetting = CheckclockSetting::create([
            'locationName' => $request->locationName ?? null,
            'detailAddress' => $request->detailAddress ?? null,
            'latitude' => $request->latitude ?? null,
            'longitude' => $request->longitude ?? null,
            'radius' => $request->radius ?? null,
            'clockIn' => $request->clockIn ?? null,
            'clockOut' => $request->clockOut ?? null,
            'breakStart' => $request->breakStart ?? null,
            'breakEnd' => $request->breakEnd ?? null,
            'company_id'  => $company->id,
        ]);
    }

    if (!$user && $authMode === 'login') {
        return redirect("http://localhost:3000/auth/social?error=unregistered");
    }
    
    if (!$user->employee) {
        if ($authMode === 'signup') {
            return redirect("http://localhost:3000/auth/social?error=invalid_signup");
        }

        Employee::create([
            'firstName' => $firstName,
            'lastName' => $lastName,
            'user_id' => $user->id,
            'company_id' => $user->company_id,
            'level' => 'user',
        ]);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return redirect("http://localhost:3000/auth/social?token={$token}");
});
