<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Farmer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_public_user_can_list_active_categories_with_product_count(): void
    {
        $category = Category::factory()->create([
            'name' => 'Heirloom Squash',
            'is_active' => true,
        ]);

        $farmer = Farmer::factory()->create();

        Product::factory()->create([
            'category_id' => $category->id,
            'farmer_id' => $farmer->id,
            'is_hidden' => false,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);

        $response = $this->getJson('/api/v1/categories');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'description',
                        'is_active',
                        'products_count',
                    ],
                ],
                'errors',
            ]);

        $item = collect($response->json('data'))->firstWhere('id', $category->id);
        $this->assertNotNull($item);
        $this->assertEquals(1, $item['products_count']);
    }

    public function test_public_user_can_view_single_category(): void
    {
        $category = Category::factory()->create([
            'name' => 'Organic Herbs',
        ]);

        $response = $this->getJson("/api/v1/categories/{$category->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.id', $category->id)
            ->assertJsonPath('data.name', 'Organic Herbs');
    }

    public function test_admin_can_create_new_category(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

        $payload = [
            'name' => 'Specialty Mushrooms',
            'description' => 'Locally foraged and indoor cultivated gourmet mushrooms.',
            'is_active' => true,
        ];

        $response = $this->actingAs($admin)
            ->postJson('/api/v1/admin/categories', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Specialty Mushrooms')
            ->assertJsonPath('data.slug', 'specialty-mushrooms');

        $this->assertDatabaseHas('categories', [
            'name' => 'Specialty Mushrooms',
            'slug' => 'specialty-mushrooms',
        ]);
    }

    public function test_admin_category_creation_validates_unique_name(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

        Category::factory()->create(['name' => 'Root Veggies']);

        $response = $this->actingAs($admin)
            ->postJson('/api/v1/admin/categories', [
                'name' => 'Root Veggies',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_admin_can_update_category(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

        $category = Category::factory()->create([
            'name' => 'Bakery Items',
            'description' => 'Original description',
        ]);

        $response = $this->actingAs($admin)
            ->putJson("/api/v1/admin/categories/{$category->id}", [
                'name' => 'Artisanal Bakery & Pastry',
                'description' => 'Updated artisan pastries and sourdough.',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Artisanal Bakery & Pastry');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Artisanal Bakery & Pastry',
        ]);
    }

    public function test_admin_can_delete_category_without_products(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

        $category = Category::factory()->create();

        $response = $this->actingAs($admin)
            ->deleteJson("/api/v1/admin/categories/{$category->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_admin_cannot_delete_category_with_products(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

        $category = Category::factory()->create();
        $farmer = Farmer::factory()->create();
        Product::factory()->create([
            'category_id' => $category->id,
            'farmer_id' => $farmer->id,
        ]);

        $response = $this->actingAs($admin)
            ->deleteJson("/api/v1/admin/categories/{$category->id}");

        $response->assertStatus(422)
            ->assertJsonPath('success', false);

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_non_admin_cannot_create_or_update_categories(): void
    {
        $customer = User::factory()->create([
            'role' => User::ROLE_CUSTOMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/admin/categories', ['name' => 'Forbidden Category']);

        $response->assertStatus(403);
    }
}
