<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Market
 */
class MarketResource extends JsonResource
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
            'name' => $this->name,
            'address' => $this->address,
            'latitude' => (float) $this->latitude,
            'longitude' => (float) $this->longitude,
            'map_provider' => $this->map_provider,
            'map_embed_url' => $this->map_embed_url,
            'description' => $this->description,
            'image' => $this->image,
            'status' => $this->status,
            'active_stalls_count' => $this->farmers_count ?? ($this->relationLoaded('farmers') ? $this->farmers->count() : 0),
            'schedules' => MarketScheduleResource::collection($this->whenLoaded('schedules')),
            'farmers' => $this->when($this->relationLoaded('farmers'), function () {
                return $this->farmers->map(function ($farmer) {
                    return [
                        'id' => $farmer->id,
                        'stall_name' => $farmer->stall_name,
                        'contact_person' => $farmer->contact_person,
                        'contact_phone' => $farmer->contact_phone,
                        'stall_location' => $farmer->pivot?->stall_location,
                        'pickup_days' => $farmer->pivot?->pickup_days,
                        'pickup_start_time' => $farmer->pivot?->pickup_start_time ? substr((string) $farmer->pivot->pickup_start_time, 0, 5) : null,
                        'pickup_end_time' => $farmer->pivot?->pickup_end_time ? substr((string) $farmer->pivot->pickup_end_time, 0, 5) : null,
                        'slot_minutes' => $farmer->pivot?->slot_minutes,
                        'cutoff_hours' => $farmer->pivot?->cutoff_hours,
                        'avg_rating' => (float) $farmer->avg_rating,
                        'review_count' => (int) $farmer->review_count,
                        'logo' => $farmer->logo,
                    ];
                });
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
