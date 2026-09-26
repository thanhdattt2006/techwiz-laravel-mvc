<?php

declare(strict_types=1);

namespace App\Http\Requests\Farmer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFarmerMarketRequest extends FormRequest
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
            'stall_location' => ['nullable', 'string', 'max:150'],
            'pickup_days' => ['sometimes', 'required', 'array', 'min:1'],
            'pickup_days.*' => ['integer', 'between:0,6', 'distinct'],
            'pickup_start_time' => ['sometimes', 'required', 'date_format:H:i'],
            'pickup_end_time' => ['sometimes', 'required', 'date_format:H:i', 'after:pickup_start_time'],
            'slot_minutes' => ['sometimes', 'required', 'integer', 'in:15,20,30,45,60'],
            'cutoff_hours' => ['sometimes', 'required', 'integer', 'min:1', 'max:72'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Custom messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'pickup_days.required' => 'At least one pickup day must be selected.',
            'pickup_start_time.required' => 'Pickup start time is required.',
            'pickup_end_time.required' => 'Pickup end time is required.',
            'pickup_end_time.after' => 'Pickup end time must be after pickup start time.',
            'slot_minutes.in' => 'Pickup slot duration must be 15, 20, 30, 45, or 60 minutes.',
            'cutoff_hours.min' => 'Order cutoff notice must be at least 1 hour.',
            'cutoff_hours.max' => 'Order cutoff notice cannot exceed 72 hours.',
        ];
    }
}
