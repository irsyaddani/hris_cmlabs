<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post("/signup", [AuthController::class, "signup"]);
Route::post("/login", [AuthController::class, "login"]);
Route::post('/employees', [EmployeeController::class, 'store']);

Route::group([
    "middleware" => ["auth:sanctum"]
], function(){

    // Route::get("/profile", [AuthController::class, "profile"]);
    Route::post("/logout", [AuthController::class, "logout"]);
});