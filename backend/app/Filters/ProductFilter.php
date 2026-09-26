<?php

declare(strict_types=1);

namespace App\Filters;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class ProductFilter extends QueryFilter
{
    /**
     * Apply default sort order if not explicitly specified.
     */
    public function apply(Builder $builder): Builder
    {
        parent::apply($builder);

        if (! $this->request->filled('sort_by')) {
            $this->builder->orderBy('id', 'desc');
        }

        return $this->builder;
    }

    /**
     * Filter products by category ID.
     */
    public function categoryId(mixed $value): void
    {
        $this->builder->where('category_id', (int) $value);
    }

    /**
     * Filter products by category slug.
     */
    public function categorySlug(mixed $value): void
    {
        $slug = trim((string) $value);
        $this->builder->whereRelation('category', 'slug', $slug);
    }

    /**
     * Filter products by farmer ID.
     */
    public function farmerId(mixed $value): void
    {
        $this->builder->where('farmer_id', (int) $value);
    }

    /**
     * Filter products by market ID (farmers who sell at this market).
     */
    public function marketId(mixed $value): void
    {
        $marketId = (int) $value;

        $this->builder->whereHas('farmer.farmerMarkets', function (Builder $q) use ($marketId): void {
            $q->where('market_id', $marketId)->where('is_active', true);
        });
    }

    /**
     * Filter products by minimum price.
     */
    public function minPrice(mixed $value): void
    {
        $this->builder->where('price', '>=', (float) $value);
    }

    /**
     * Filter products by maximum price.
     */
    public function maxPrice(mixed $value): void
    {
        $this->builder->where('price', '<=', (float) $value);
    }

    /**
     * Filter products by availability status.
     */
    public function availability(mixed $value): void
    {
        $this->builder->where('availability', (string) $value);
    }

    /**
     * Filter products by in-stock status only.
     */
    public function inStockOnly(mixed $value): void
    {
        $shouldFilter = filter_var($value, FILTER_VALIDATE_BOOLEAN);

        if ($shouldFilter) {
            $this->builder->where('stock_quantity', '>', 0)
                ->where('availability', Product::AVAILABILITY_AVAILABLE);
        }
    }

    /**
     * Search products by name or description using MySQL Fulltext index with LIKE fallback.
     */
    public function search(mixed $value): void
    {
        $search = trim((string) $value);

        if ($search === '') {
            return;
        }

        if (DB::getDriverName() === 'mysql' && mb_strlen($search) >= 3) {
            $sanitized = preg_replace('/[+\-><()~*\"@]+/', ' ', $search) ?? $search;
            $words = array_filter(explode(' ', trim($sanitized)));
            $booleanQuery = implode(' ', array_map(static fn (string $w): string => "+{$w}*", $words));

            if (! empty($booleanQuery)) {
                $this->builder->where(function (Builder $q) use ($booleanQuery, $search): void {
                    $q->whereRaw('MATCH(name, description) AGAINST(? IN BOOLEAN MODE)', [$booleanQuery])
                        ->orWhere('name', 'like', "%{$search}%");
                });

                return;
            }
        }

        $this->builder->where(function (Builder $q) use ($search): void {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }

    /**
     * Sort products by selected criteria.
     */
    public function sortBy(mixed $value): void
    {
        match ((string) $value) {
            'price_asc' => $this->builder->orderBy('price', 'asc'),
            'price_desc' => $this->builder->orderBy('price', 'desc'),
            'rating_desc' => $this->builder->orderBy('avg_rating', 'desc'),
            'name_asc' => $this->builder->orderBy('name', 'asc'),
            default => $this->builder->orderBy('id', 'desc'),
        };
    }
}
