<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Filters\ProductFilter;
use App\Models\Category;
use App\Models\Farmer;
use App\Models\Product;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\Request;
use Tests\TestCase;

class ProductFilterTest extends TestCase
{
    use DatabaseTransactions;

    public function test_filters_by_category_id(): void
    {
        $cat1 = Category::factory()->create();
        $cat2 = Category::factory()->create();

        $prod1 = Product::factory()->create(['category_id' => $cat1->id]);
        $prod2 = Product::factory()->create(['category_id' => $cat2->id]);

        $request = new Request(['category_id' => (string) $cat1->id]);
        $filter = new ProductFilter($request);

        $results = Product::query()->filter($filter)->get();

        $this->assertTrue($results->contains($prod1));
        $this->assertFalse($results->contains($prod2));
    }

    public function test_filters_by_price_range(): void
    {
        $cheap = Product::factory()->create(['price' => 5.00]);
        $mid = Product::factory()->create(['price' => 20.00]);
        $expensive = Product::factory()->create(['price' => 60.00]);

        $request = new Request([
            'min_price' => '10.00',
            'max_price' => '30.00',
        ]);
        $filter = new ProductFilter($request);

        $results = Product::query()->filter($filter)->get();

        $this->assertFalse($results->contains($cheap));
        $this->assertTrue($results->contains($mid));
        $this->assertFalse($results->contains($expensive));
    }

    public function test_filters_by_in_stock_only(): void
    {
        $inStock = Product::factory()->create([
            'stock_quantity' => 10,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);
        $outOfStock = Product::factory()->create([
            'stock_quantity' => 0,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);

        $request = new Request(['in_stock_only' => 'true']);
        $filter = new ProductFilter($request);

        $results = Product::query()->filter($filter)->get();

        $this->assertTrue($results->contains($inStock));
        $this->assertFalse($results->contains($outOfStock));
    }

    public function test_ignores_null_or_empty_parameters(): void
    {
        $p = Product::factory()->create();

        $request = new Request([
            'category_id' => '',
            'search' => null,
            'min_price' => '',
        ]);
        $filter = new ProductFilter($request);

        $results = Product::query()->filter($filter)->get();

        $this->assertTrue($results->contains($p));
    }
}
