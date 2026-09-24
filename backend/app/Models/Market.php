<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Market extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';

    protected $fillable = [
        'name',
        'address',
        'latitude',
        'longitude',
        'map_provider',
        'map_embed_url',
        'description',
        'image',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'deleted_at' => 'datetime',
        ];
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(MarketSchedule::class);
    }

    public function farmerMarkets(): HasMany
    {
        return $this->hasMany(FarmerMarket::class);
    }

    public function farmers(): BelongsToMany
    {
        return $this->belongsToMany(Farmer::class, 'farmer_markets')
            ->withPivot([
                'stall_location',
                'pickup_days',
                'pickup_start_time',
                'pickup_end_time',
                'slot_minutes',
                'cutoff_hours',
                'is_active',
            ])
            ->withTimestamps();
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function favorites(): MorphMany
    {
        return $this->morphMany(Favorite::class, 'favoritable');
    }
}
