<?php

declare(strict_types=1);

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

abstract class QueryFilter
{
    protected Builder $builder;

    public function __construct(protected Request $request)
    {
    }

    /**
     * Apply the query filters to the given Eloquent builder.
     */
    public function apply(Builder $builder): Builder
    {
        $this->builder = $builder;

        foreach ($this->filters() as $name => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            $method = Str::camel((string) $name);

            if (method_exists($this, $method)) {
                $this->{$method}($value);
            }
        }

        return $this->builder;
    }

    /**
     * Get all request parameters for filtering.
     *
     * @return array<string, mixed>
     */
    public function filters(): array
    {
        return $this->request->all();
    }
}
