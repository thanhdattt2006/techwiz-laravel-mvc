<?php

declare(strict_types=1);

namespace App\Http\Requests\Favorite;

use Illuminate\Foundation\Http\FormRequest;

class ToggleFavoriteRequest extends FormRequest
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
            'favoritable_type' => ['required', 'string', 'in:farmer,product,market'],
            'favoritable_id' => ['required', 'integer'],
        ];
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'favoritable_type.required' => 'Please specify the item type (farmer, product, or market).',
            'favoritable_type.in' => 'Item type must be one of: farmer, product, market.',
            'favoritable_id.required' => 'Please provide the item ID to favorite or unfavorite.',
        ];
    }
}
