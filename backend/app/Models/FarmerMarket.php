<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FarmerMarket extends Model
{
    use HasFactory;

    protected $table = 'farmer_markets';

    protected $fillable = [
        'farmer_id',
        'market_id',
        'stall_location',
        'pickup_days',
        'pickup_start_time',
        'pickup_end_time',
        'slot_minutes',
        'cutoff_hours',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'pickup_days' => 'array',
            'slot_minutes' => 'integer',
            'cutoff_hours' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(Farmer::class);
    }

    public function market(): BelongsTo
    {
        return $this->belongsTo(Market::class);
    }
}
