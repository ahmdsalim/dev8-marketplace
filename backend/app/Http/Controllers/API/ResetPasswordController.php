<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Classes\ApiResponseClass;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use App\Http\Requests\ResetPasswordRequest;

class ResetPasswordController extends Controller
{
    public function __invoke(ResetPasswordRequest $request)
    {
        try {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function (User $user, string $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ]);
        
                    $user->save();
        
                    event(new PasswordReset($user));
                }
            );
    
            if ($status === Password::PASSWORD_RESET) {
                return ApiResponseClass::sendResponse([], __($status));
            }

            return response()->json(['data' => ['success' => false, 'message' => __($status)]], 400);
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, 'Password reset failed');
        }
    }
}
