<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Farmer;
use App\Models\FarmerMarket;
use App\Models\Market;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_public_user_can_list_products(): void
    {
        $farmer = Farmer::factory()->create();
        $category = Category::factory()->create();

        $product = Product::factory()->create([
            'farmer_id' => $farmer->id,
            'category_id' => $category->id,
            'name' => 'Organic Rainbow Chard',
            'is_hidden' => false,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);

        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'farmer_id',
                        'category_id',
                        'name',
                        'description',
                        'price',
                        'unit',
                        'stock_quantity',
                        'availability',
                        'is_hidden',
                        'avg_rating',
                        'review_count',
                        'category',
                        'farmer',
                    ],
                ],
                'errors',
            ]);

        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertContains($product->id, $ids);
    }

    public function test_public_user_can_filter_products_by_category(): void
    {
        $cat1 = Category::factory()->create(['name' => 'Berries', 'slug' => 'berries']);
        $cat2 = Category::factory()->create(['name' => 'Roots', 'slug' => 'roots']);

        $prod1 = Product::factory()->create(['category_id' => $cat1->id, 'name' => 'Wild Blueberries']);
        $prod2 = Product::factory()->create(['category_id' => $cat2->id, 'name' => 'Dutch Carrots']);

        $response = $this->getJson("/api/v1/products?category_id={$cat1->id}");

        $response->assertStatus(200);
        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertContains($prod1->id, $ids);
        $this->assertNotContains($prod2->id, $ids);

        // Filter by category_slug
        $responseSlug = $this->getJson('/api/v1/products?category_slug=roots');
        $responseSlug->assertStatus(200);
        $idsSlug = collect($responseSlug->json('data'))->pluck('id')->toArray();
        $this->assertContains($prod2->id, $idsSlug);
        $this->assertNotContains($prod1->id, $idsSlug);
    }

    public function test_public_user_can_filter_products_by_market(): void
    {
        $market1 = Market::factory()->create();
        $market2 = Market::factory()->create();

        $farmer1 = Farmer::factory()->create();
        $farmer2 = Farmer::factory()->create();

        FarmerMarket::create([
            'farmer_id' => $farmer1->id,
            'market_id' => $market1->id,
            'stall_location' => 'A1',
            'pickup_days' => [0, 6],
            'pickup_start_time' => '08:00',
            'pickup_end_time' => '12:00',
            'slot_minutes' => 30,
            'cutoff_hours' => 12,
            'is_active' => true,
        ]);

        FarmerMarket::create([
            'farmer_id' => $farmer2->id,
            'market_id' => $market2->id,
            'stall_location' => 'B2',
            'pickup_days' => [0, 6],
            'pickup_start_time' => '08:00',
            'pickup_end_time' => '12:00',
            'slot_minutes' => 30,
            'cutoff_hours' => 12,
            'is_active' => true,
        ]);

        $prod1 = Product::factory()->create(['farmer_id' => $farmer1->id, 'name' => 'Farmer 1 Kale']);
        $prod2 = Product::factory()->create(['farmer_id' => $farmer2->id, 'name' => 'Farmer 2 Beets']);

        $response = $this->getJson("/api/v1/products?market_id={$market1->id}");

        $response->assertStatus(200);
        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertContains($prod1->id, $ids);
        $this->assertNotContains($prod2->id, $ids);
    }

    public function test_public_user_can_filter_products_by_price_range(): void
    {
        $p1 = Product::factory()->create(['price' => 5.00]);
        $p2 = Product::factory()->create(['price' => 25.00]);
        $p3 = Product::factory()->create(['price' => 50.00]);

        $response = $this->getJson('/api/v1/products?min_price=10&max_price=30');

        $response->assertStatus(200);
        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertNotContains($p1->id, $ids);
        $this->assertContains($p2->id, $ids);
        $this->assertNotContains($p3->id, $ids);
    }

    public function test_public_user_can_search_products_by_name(): void
    {
        $p1 = Product::factory()->create(['name' => 'Crisp Gala Apples', 'description' => 'Sweet fresh apples']);
        $p2 = Product::factory()->create(['name' => 'Raw Clover Honey', 'description' => 'Pure hive honey']);

        $response = $this->getJson('/api/v1/products?search=Apples');

        $response->assertStatus(200);
        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertContains($p1->id, $ids);
        $this->assertNotContains($p2->id, $ids);
    }

    public function test_public_catalog_excludes_hidden_and_unavailable_products(): void
    {
        $visibleProd = Product::factory()->create([
            'is_hidden' => false,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);

        $hiddenProd = Product::factory()->create([
            'is_hidden' => true,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);

        $unavailableProd = Product::factory()->create([
            'is_hidden' => false,
            'availability' => Product::AVAILABILITY_UNAVAILABLE,
        ]);

        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200);
        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertContains($visibleProd->id, $ids);
        $this->assertNotContains($hiddenProd->id, $ids);
        $this->assertNotContains($unavailableProd->id, $ids);
    }

    public function test_public_user_can_view_product_details(): void
    {
        $product = Product::factory()->create([
            'name' => 'Artisanal Goat Cheese',
            'is_hidden' => false,
        ]);

        $response = $this->getJson("/api/v1/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.id', $product->id)
            ->assertJsonPath('data.name', 'Artisanal Goat Cheese');
    }

    public function test_public_user_cannot_view_hidden_product(): void
    {
        $hiddenProduct = Product::factory()->create([
            'is_hidden' => true,
        ]);

        $response = $this->getJson("/api/v1/products/{$hiddenProduct->id}");

        $response->assertStatus(404)
            ->assertJsonPath('success', false);
    }

    public function test_admin_and_owner_farmer_can_view_hidden_product(): void
    {
        $farmerUser = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_ACTIVE,
        ]);
        $farmer = Farmer::factory()->create(['user_id' => $farmerUser->id]);

        $hiddenProduct = Product::factory()->create([
            'farmer_id' => $farmer->id,
            'is_hidden' => true,
        ]);

        // Owner farmer can view
        $responseFarmer = $this->actingAs($farmerUser)->getJson("/api/v1/products/{$hiddenProduct->id}");
        $responseFarmer->assertStatus(200);

        // Admin can view
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'status' => User::STATUS_ACTIVE]);
        $responseAdmin = $this->actingAs($admin)->getJson("/api/v1/products/{$hiddenProduct->id}");
        $responseAdmin->assertStatus(200);
    }

    public function test_farmer_can_list_own_products(): void
    {
        $farmerUser = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer = Farmer::factory()->create(['user_id' => $farmerUser->id]);

        $myProd = Product::factory()->create(['farmer_id' => $farmer->id, 'name' => 'My Fresh Spinach']);
        $otherProd = Product::factory()->create(['name' => 'Someone Elses Celery']);

        $response = $this->actingAs($farmerUser)->getJson('/api/v1/farmer/products');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertContains($myProd->id, $ids);
        $this->assertNotContains($otherProd->id, $ids);
    }

    public function test_farmer_can_create_product(): void
    {
        $farmerUser = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer = Farmer::factory()->create(['user_id' => $farmerUser->id]);
        $category = Category::factory()->create();

        $payload = [
            'category_id' => $category->id,
            'name' => 'Crisp Butterhead Lettuce',
            'description' => 'Hydroponically grown pesticide-free butterhead lettuce heads.',
            'price' => 3.75,
            'unit' => 'head',
            'stock_quantity' => 40,
            'availability' => 'available',
        ];

        $response = $this->actingAs($farmerUser)->postJson('/api/v1/farmer/products', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Crisp Butterhead Lettuce')
            ->assertJsonPath('data.farmer_id', $farmer->id)
            ->assertJsonPath('data.price', 3.75);

        $this->assertDatabaseHas('products', [
            'farmer_id' => $farmer->id,
            'name' => 'Crisp Butterhead Lettuce',
            'price' => 3.75,
            'unit' => 'head',
        ]);
    }

    public function test_farmer_cannot_create_product_with_non_existent_category(): void
    {
        $farmerUser = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        Farmer::factory()->create(['user_id' => $farmerUser->id]);

        $payload = [
            'category_id' => 999999,
            'name' => 'Invalid Veggie',
            'price' => 4.00,
            'unit' => 'kg',
        ];

        $response = $this->actingAs($farmerUser)->postJson('/api/v1/farmer/products', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category_id']);
    }

    public function test_farmer_can_update_own_product(): void
    {
        $farmerUser = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer = Farmer::factory()->create(['user_id' => $farmerUser->id]);

        $product = Product::factory()->create([
            'farmer_id' => $farmer->id,
            'name' => 'Old Name',
            'price' => 10.00,
        ]);

        $response = $this->actingAs($farmerUser)->putJson("/api/v1/farmer/products/{$product->id}", [
            'name' => 'New Premium Name',
            'price' => 12.50,
            'availability' => 'sold_out',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'New Premium Name')
            ->assertJsonPath('data.price', 12.50)
            ->assertJsonPath('data.availability', 'sold_out');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'New Premium Name',
            'price' => 12.50,
            'availability' => 'sold_out',
        ]);
    }

    public function test_farmer_cannot_update_another_farmers_product(): void
    {
        $farmerUser1 = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        Farmer::factory()->create(['user_id' => $farmerUser1->id]);

        $farmerUser2 = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer2 = Farmer::factory()->create(['user_id' => $farmerUser2->id]);

        $product = Product::factory()->create(['farmer_id' => $farmer2->id]);

        $response = $this->actingAs($farmerUser1)->putJson("/api/v1/farmer/products/{$product->id}", [
            'name' => 'Hacked Name',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }

    public function test_farmer_can_soft_delete_own_product(): void
    {
        $farmerUser = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer = Farmer::factory()->create(['user_id' => $farmerUser->id]);

        $product = Product::factory()->create(['farmer_id' => $farmer->id]);

        $response = $this->actingAs($farmerUser)->deleteJson("/api/v1/farmer/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertSoftDeleted('products', ['id' => $product->id]);
    }

    public function test_farmer_cannot_delete_another_farmers_product(): void
    {
        $farmerUser1 = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        Farmer::factory()->create(['user_id' => $farmerUser1->id]);

        $farmerUser2 = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer2 = Farmer::factory()->create(['user_id' => $farmerUser2->id]);

        $product = Product::factory()->create(['farmer_id' => $farmer2->id]);

        $response = $this->actingAs($farmerUser1)->deleteJson("/api/v1/farmer/products/{$product->id}");

        $response->assertStatus(403);
        $this->assertNotSoftDeleted('products', ['id' => $product->id]);
    }

    public function test_admin_can_toggle_product_hide_status(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'status' => User::STATUS_ACTIVE]);
        $product = Product::factory()->create(['is_hidden' => false]);

        $response = $this->actingAs($admin)->patchJson("/api/v1/admin/products/{$product->id}/toggle-hide");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_hidden', true);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'is_hidden' => true,
        ]);

        // Toggle back to visible
        $responseBack = $this->actingAs($admin)->patchJson("/api/v1/admin/products/{$product->id}/toggle-hide");
        $responseBack->assertStatus(200)
            ->assertJsonPath('data.is_hidden', false);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'is_hidden' => false,
        ]);
    }

    public function test_non_admin_cannot_toggle_product_hide(): void
    {
        $farmer = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $product = Product::factory()->create();

        $response = $this->actingAs($farmer)->patchJson("/api/v1/admin/products/{$product->id}/toggle-hide");

        $response->assertStatus(403);
    }
}
