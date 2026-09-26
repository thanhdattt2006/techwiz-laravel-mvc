<?php

declare(strict_types=1);

namespace App\Http\Requests\WeeklyStock;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWeeklyStockRequest extends FormRequest
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
            'templates' => ['required', 'array', 'min:1'],
            'templates.*.day_of_week' => ['required', 'integer', 'between:0,6', 'distinct'],
            'templates.*.default_quantity' => ['required', 'numeric', 'min:0'],
            'templates.*.is_active' => ['nullable', 'boolean'],
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
            'templates.required' => 'Stock templates array is required.',
            'templates.min' => 'At least one stock template must be provided.',
            'templates.*.day_of_week.required' => 'Day of week is required for each template.',
            'templates.*.day_of_week.between' => 'Day of week must be between 0 (Sunday) and 6 (Saturday).',
            'templates.*.day_of_week.distinct' => 'Each day of the week must be unique in the template list.',
            'templates.*.default_quantity.required' => 'Default quantity is required for each template.',
            'templates.*.default_quantity.min' => 'Default stock quantity cannot be negative.',
        ];
    }
}
