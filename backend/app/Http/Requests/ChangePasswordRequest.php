<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ChangePasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8',
            'confirm_password' => 'required|string|same:new_password'
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success'   => false,
            'message'   => 'Validation errors',
            'data'      => $validator->errors()
        ]));
    }

    public function after()
    {
        return [
            function(Validator $validator) {
                if (!$this->currentPasswordIsCorrect()) {
                    $validator->errors()->add('current_password', 'Current password is incorrect.');
                }
            },
            function(Validator $validator) {
                if ($this->isNewPasswordSameAsOld()) {
                    $validator->errors()->add('new_password', 'New password cannot be the same as the current password.');
                }
            }
        ];
    }

    protected function currentPasswordIsCorrect()
    {
        return Hash::check($this->current_password, $this->user()->password);
    }

    protected function isNewPasswordSameAsOld()
    {
        if(!$this->currentPasswordIsCorrect()) return false;

        return Hash::check($this->new_password, $this->user()->password);
    }
}
