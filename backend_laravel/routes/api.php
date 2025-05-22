<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\Api\CheckClockController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post("/signup", [AuthController::class, "signup"]);
Route::post("/login", [AuthController::class, "login"]);
Route::post('/employees', [EmployeeController::class, 'store']);

Route::group(["middleware" => ["auth:sanctum"]], function(){
    Route::post("/logout", [AuthController::class, "logout"]);
});

Route::get('/check-clocks', [CheckClockController::class, 'index']);