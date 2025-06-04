<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\CheckClockController;
use App\Http\Controllers\API\ClockSettingsController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::controller(AuthController::class)->group(function () {
    Route::post('/signup', 'signup');
    Route::post('/login', 'login');
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

        return response()->json([
            'id'    => $user->id,
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

});
// routes/api.php
Route::get('/checkclocks', [CheckClockController::class, 'index']);
Route::post('/clock-settings', [ClockSettingsController::class, 'store']);


