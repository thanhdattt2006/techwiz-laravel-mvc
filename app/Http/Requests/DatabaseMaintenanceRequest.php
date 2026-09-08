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
            'password.required' => 'Vui lòng nhập mật khẩu xác thực bảo trì CSDL.',
            'step.integer' => 'Số bước rollback phải là số nguyên.',
            'step.min' => 'Số bước rollback tối thiểu là 1.',
        ];
    }
}
