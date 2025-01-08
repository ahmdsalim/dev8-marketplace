<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreProductRequest extends FormRequest
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
            'name' => 'required',
            'category' => 'required|exists:categories,id',
            'images' => 'required|array|min:2',
            'images.*' => 'required|image|mimes:png,jpg,jpeg|max:2048',
            'description' => 'required',
            'variants' => 'required|array|min:1',
            'variants.*.id' => 'required|exists:variants,id|distinct',
            'variants.*.stock' => 'required|integer|min:1',
            'variants.*.additional_price' => 'nullable|integer',
            'weight' => 'required|integer',
            'price' => 'required|integer',
            'collaboration' => 'nullable|exists:collaborations,id'
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success'   => false,
            'message'   => 'Validation errors',
            'data'      => $validator->errors()
        ], 400));
    }
}
