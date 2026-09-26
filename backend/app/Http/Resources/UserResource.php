<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\User
 */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'fullname' => $this->fullname,
            'username' => $this->username,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'role' => $this->role,
            'status' => $this->status,
            'farmer' => $this->when($this->relationLoaded('farmer') && $this->farmer !== null, function () {
                return [
                    'id' => $this->farmer->id,
                    'stall_name' => $this->farmer->stall_name,
                    'contact_person' => $this->farmer->contact_person,
                    'contact_phone' => $this->farmer->contact_phone,
                    'address' => $this->farmer->address,
                    'latitude' => $this->farmer->latitude !== null ? (float) $this->farmer->latitude : null,
                    'longitude' => $this->farmer->longitude !== null ? (float) $this->farmer->longitude : null,
                    'description' => $this->farmer->description,
                    'logo' => $this->farmer->logo,
                    'avg_rating' => (float) $this->farmer->avg_rating,
                    'review_count' => (int) $this->farmer->review_count,
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
