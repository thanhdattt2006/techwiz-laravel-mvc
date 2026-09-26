<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\DayOfWeek;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\WeeklyStockTemplate
 */
class WeeklyStockTemplateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $dayOfWeek = (int) $this->day_of_week;

        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'day_of_week' => $dayOfWeek,
            'day_name' => DayOfWeek::nameOf($dayOfWeek),
            'default_quantity' => (float) $this->default_quantity,
            'is_active' => (bool) $this->is_active,
        ];
    }
}
