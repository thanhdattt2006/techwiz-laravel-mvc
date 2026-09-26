<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\MarketSchedule
 */
class MarketScheduleResource extends JsonResource
{
    /**
     * Day of week name mapping (0 = Sunday, 1 = Monday, ..., 6 = Saturday).
     */
    private const DAY_NAMES = [
        0 => 'Sunday',
        1 => 'Monday',
        2 => 'Tuesday',
        3 => 'Wednesday',
        4 => 'Thursday',
        5 => 'Friday',
        6 => 'Saturday',
    ];

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'day_of_week' => $this->day_of_week,
            'day_name' => self::DAY_NAMES[$this->day_of_week] ?? 'Unknown',
            'open_time' => substr((string) $this->open_time, 0, 5),
            'close_time' => substr((string) $this->close_time, 0, 5),
        ];
    }
}
