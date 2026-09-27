<?php

declare(strict_types=1);

namespace App\Http\Requests\Announcement;

use App\Models\Announcement;
use Illuminate\Foundation\Http\FormRequest;

class StoreAnnouncementRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:150'],
            'content' => ['required', 'string', 'max:10000'],
            'target_role' => ['required', 'string', 'in:' . implode(',', [
                Announcement::TARGET_ALL,
                Announcement::TARGET_FARMER,
                Announcement::TARGET_CUSTOMER,
            ])],
            'is_active' => ['nullable', 'boolean'],
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
            'title.required' => 'Please provide an announcement title.',
            'title.max' => 'The title may not exceed 150 characters.',
            'content.required' => 'Please provide the announcement content.',
            'target_role.required' => 'Please select the target role (all, farmer, or customer).',
            'target_role.in' => 'Target role must be one of: all, farmer, customer.',
        ];
    }
}
