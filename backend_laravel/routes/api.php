<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\CheckClockController;
use App\Http\Controllers\ClockSettingsController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::controller(AuthController::class)->group(function () {
    Route::post('/signup', 'signup');
    Route::post('/login', 'login');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});


/*
|--------------------------------------------------------------------------
| Protected Routes (Authenticated Only)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Authenticated user
    Route::get('/user', function (Request $request) {
        $user = $request->user();
        $employee = $user->employee; // pastikan relasi 'employee' ada di model User
        $company = $user->company; // pastikan relasi 'employee' ada di model User

        return response()->json([
            'id' => $user->id,
            'company_id' => $company->id,
            'email' => $user->email,
            'level' => $employee->level ?? null,
        ]);
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Employees CRUD
    Route::prefix('/employees')->controller(EmployeeController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

    Route::prefix('/clock-settings')->controller(ClockSettingsController::class)->group(function () {
        Route::post('/', 'store'); // Ubah GET menjadi POST untuk menyimpan data
        Route::get('/{companyId}', 'show'); // Gunakan nama parameter yang lebih jelas
    });

    Route::prefix('/checkclock')->controller(CheckClockController::class)->group(function () {
        Route::get('/', 'index');
        Route::put('/approval/{id}', 'updateApproval');
        Route::delete('/{id}', 'destroy');
    });
});


