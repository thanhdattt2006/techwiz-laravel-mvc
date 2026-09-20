<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DatabaseMaintenanceRequest extends FormRequest
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
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'password' => ['required', 'string'],
            'seed' => ['nullable', 'boolean'],
            'step' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }

    /**
     * Custom validation error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'password.required' => 'Database maintenance authorization password is required.',
            'step.integer' => 'Rollback step must be an integer.',
            'step.min' => 'Rollback step must be at least 1.',
        ];
    }
}
