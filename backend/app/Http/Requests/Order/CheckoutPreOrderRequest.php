<?php

declare(strict_types=1);

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutPreOrderRequest extends FormRequest
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
            'market_id' => ['required', 'integer', 'exists:markets,id'],
            'pickup_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'pickup_start_time' => ['required', 'date_format:H:i'],
            'pickup_end_time' => ['required', 'date_format:H:i', 'after:pickup_start_time'],
            'note' => ['nullable', 'string', 'max:1000'],
            'farmer_id' => ['nullable', 'integer', 'exists:farmers,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'market_id.required' => 'Please select a farmers market for stall pickup.',
            'market_id.exists' => 'The selected market does not exist.',
            'pickup_date.required' => 'Please specify a pickup date.',
            'pickup_date.date_format' => 'Pickup date must match YYYY-MM-DD format.',
            'pickup_date.after_or_equal' => 'Pickup date cannot be in the past.',
            'pickup_start_time.required' => 'Please specify a pickup start time.',
            'pickup_start_time.date_format' => 'Pickup start time must match HH:MM format.',
            'pickup_end_time.required' => 'Please specify a pickup end time.',
            'pickup_end_time.date_format' => 'Pickup end time must match HH:MM format.',
            'pickup_end_time.after' => 'Pickup end time must be after the start time.',
        ];
    }
}
