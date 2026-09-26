<?php

declare(strict_types=1);

namespace App\Http\Requests\Market;

use Illuminate\Foundation\Http\FormRequest;

class StoreMarketRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'map_provider' => ['nullable', 'string', 'max:30'],
            'map_embed_url' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:active,inactive'],
            'schedules' => ['nullable', 'array'],
            'schedules.*.day_of_week' => ['required', 'integer', 'between:0,6', 'distinct'],
            'schedules.*.open_time' => ['required', 'date_format:H:i'],
            'schedules.*.close_time' => ['required', 'date_format:H:i', 'after:schedules.*.open_time'],
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
            'name.required' => 'Market name is required.',
            'address.required' => 'Market address is required.',
            'latitude.required' => 'Latitude coordinate is required.',
            'longitude.required' => 'Longitude coordinate is required.',
            'schedules.*.day_of_week.distinct' => 'Each schedule day of the week must be unique for this market.',
            'schedules.*.close_time.after' => 'Closing time must be after opening time.',
        ];
    }
}
