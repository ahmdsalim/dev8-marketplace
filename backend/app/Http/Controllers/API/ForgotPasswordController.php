<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Classes\ApiResponseClass;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Password;
use App\Http\Requests\ForgotPasswordRequest;

class ForgotPasswordController extends Controller
{
    public function __invoke(ForgotPasswordRequest $request)
    {
        try {
            $user = User::where('email', $request->email)->firstOrFail();

            if($user->email_verified_at === null) {
                return response()->json(['success' => false, 'data' => ['email' => 'Please verify your email first. Check your email for verification link.']], 400);
            }

            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status === Password::RESET_LINK_SENT) {
                return ApiResponseClass::sendResponse([], __($status));
            }

            return response()->json(['success' => false, 'data' => ['email' => __($status)]], 400);
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, 'Password reset failed');
        }
    }
}
