<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\CheckClockController;
use App\Http\Controllers\ClockSettingsController;
use App\Http\Controllers\UserController;


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
    Route::get('/user', [UserController::class, 'getProfile']);
    Route::post('/change-password', [UserController::class, 'changePassword']);

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
        Route::post('/', 'store');
        Route::get('/{companyId}', 'show');
    });

    Route::prefix('/checkclock')->controller(CheckClockController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/user', 'getByUserId');
        Route::get('/{id}', 'show');
        Route::post('/', 'store');
        Route::post('/add-empty-row', 'addEmptyRowIfNotHoliday');
        Route::put('/approval/{id}', 'updateApproval');
        Route::delete('/{id}', 'destroy');
    });
});


