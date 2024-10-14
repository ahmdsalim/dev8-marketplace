<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use App\Classes\ApiResponseClass;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\RegisterUserRequest;

class AuthController extends Controller
{
    public function register(RegisterUserRequest $request) {
        $details = [
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'user',
            'phone' => $request->phone
        ];

        DB::beginTransaction();
        try {
            $user = User::create($details);
            $success['token'] =  $user->createToken('authToken')->plainTextToken;
            $success['name'] =  $user->name;
            DB::commit();
            return ApiResponseClass::sendResponse($success, "User registered successfully", 201);
        } catch (\Exception $e) {
            ApiResponseClass::rollback($e, "User registration failed");
        }
    }

    public function login(Request $request) {
        $credentials = $request->only('username', 'password');
        $field = filter_var($credentials['username'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $credentials = [
            $field => $credentials['username'],
            'password' => $credentials['password']
        ];

        if(Auth::attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::user(); 
            $data['token'] =  $user->createToken('authToken')->plainTextToken; 
            $data['user'] =  $user;
            return ApiResponseClass::sendResponse($data, "User logged in successfully");
        } else {
            return ApiResponseClass::throw(new \Exception(), "Invalid credentials");
        }
    }
    
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return ApiResponseClass::sendResponse([], "User logged out successfully");
    }
}
