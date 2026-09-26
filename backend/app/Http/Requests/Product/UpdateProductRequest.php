<?php

declare(strict_types=1);

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
            'category_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'unit' => ['sometimes', 'required', 'string', 'max:20'],
            'stock_quantity' => ['sometimes', 'required', 'numeric', 'min:0'],
            'availability' => ['sometimes', 'required', 'string', 'in:available,sold_out,unavailable'],
            'image' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Custom error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'category_id.exists' => 'The selected category does not exist.',
            'name.required' => 'Product name cannot be empty.',
            'price.min' => 'Product price cannot be negative.',
            'stock_quantity.min' => 'Stock quantity cannot be negative.',
            'availability.in' => 'Availability status must be available, sold_out, or unavailable.',
        ];
    }
}
