<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    public const AVAILABILITY_AVAILABLE = 'available';
    public const AVAILABILITY_SOLD_OUT = 'sold_out';
    public const AVAILABILITY_UNAVAILABLE = 'unavailable';

    protected $fillable = [
        'farmer_id',
        'category_id',
        'name',
        'description',
        'price',
        'unit',
        'stock_quantity',
        'availability',
        'image',
        'is_hidden',
        'avg_rating',
        'review_count',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock_quantity' => 'decimal:2',
            'is_hidden' => 'boolean',
            'avg_rating' => 'decimal:2',
            'review_count' => 'integer',
            'deleted_at' => 'datetime',
        ];
    }

    public function isAvailable(): bool
    {
        return $this->availability === self::AVAILABILITY_AVAILABLE
            && (float) $this->stock_quantity > 0
            && ! $this->is_hidden;
    }

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(Farmer::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function weeklyStockTemplates(): HasMany
    {
        return $this->hasMany(WeeklyStockTemplate::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favorites(): MorphMany
    {
        return $this->morphMany(Favorite::class, 'favoritable');
    }
}
