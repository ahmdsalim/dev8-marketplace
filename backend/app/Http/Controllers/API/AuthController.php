<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use App\Classes\ApiResponseClass;
use App\Events\NewUserNotification;
use App\Events\UserVerification;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\UserVerify;
use Illuminate\Support\Str;

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

            $verify_token = Str::random(64);

            UserVerify::create([
                'user_id' => $user->id,
                'token' => $verify_token
            ]);

            event(new UserVerification($user, $verify_token));
            event(new NewUserNotification($user));

            $success['token'] =  $user->createToken('authToken')->plainTextToken;
            $success['user'] =  $user;
            DB::commit();
            return ApiResponseClass::sendResponse($success, "User registered successfully", 201);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e, "User registration failed");
        }
    }

    public function login(LoginUserRequest $request) {
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
            return ApiResponseClass::throw(new \Exception(), "Invalid credentials", 401);
        }
    }
    
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return ApiResponseClass::sendResponse([], "User logged out successfully");
    }

    public function verifyUser($token) {
        try {
            $userVerify = UserVerify::where('token', $token)->first();
            if(!$userVerify) {
                return response()->json(["success" => false, "message" => "Invalid token"], 404);
            }
            $user = $userVerify->user;
            $user->email_verified_at = now();
            $user->save();
            UserVerify::where('token', $token)->delete();
            return ApiResponseClass::sendResponse([], "User verified successfully");
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e, "User verification failed");
        }
    }

    public function changePassword(ChangePasswordRequest $request) {
        try {
            Auth::user()->fill([
                'password' => bcrypt($request->new_password)
            ])->save();
            return ApiResponseClass::sendResponse([], "Password changed successfully");
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, "Password change failed");
        }
    }

    public function updateProfile(UpdateProfileRequest $request) {
        try {
            Auth::user()->fill($request->validated())->save();
            return ApiResponseClass::sendResponse([], "Profile updated successfully");
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, "Profile update failed");
        }
    }
}
