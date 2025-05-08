<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //
    public function signup(Request $request){

        $data = $request->validate([
            "firstName" => "required|string",
            "lastName" => "required|string",
            "email" => "required|email|unique:users,email",
            "password" => "required",
        ]);

        $data['password'] = Hash::make($data['password']);
        User::create($data);

        // return response()->json([
        //     "status" => true,
        //     "message" => "User registered succesfuly"
        // ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required",
        ]);

        if (!Auth::attempt($request->only("email", "password"))) {
            return response()->json([
                "status" => false,
                "message" => "Invalid Credentials",
            ], 401);
        }

        // Ambil user yang berhasil login
        $user = Auth::user();

        // Buat token Sanctum
        $token = $user->createToken("myToken")->plainTextToken;

        return response()->json([
            "status" => true,
            "message" => "User logged in",
            "token" => $token,
            "user" => $user, 
        ]);
    }

    public function profile(){
        
        $user = Auth::user();

        return response()->json([
            "status" => true,
            "message" => "User profile data",
            "user" => $user,
        ]);
    }

    public function logout(Request $request){
        $user = $request->user(); // atau Auth::user()
    
        if (!$user) {
            return response()->json([
                "status" => false,
                "message" => "Unauthorized. Token tidak dikenali.",
            ], 401);
        }
    
        $user->currentAccessToken()->delete();
    
    }
    
}
