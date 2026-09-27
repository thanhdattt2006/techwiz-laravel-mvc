<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class CorsAndHttpStatusApiTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Test CORS pre-flight OPTIONS request response headers.
     */
    public function test_cors_preflight_options_response(): void
    {
        $response = $this->call('OPTIONS', '/api/v1/products', [], [], [], [
            'HTTP_ORIGIN' => 'http://localhost:5173',
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'GET',
            'HTTP_ACCESS_CONTROL_REQUEST_HEADERS' => 'Authorization, Content-Type, Accept',
        ]);

        $response->assertStatus(204);
        $this->assertContains(
            $response->headers->get('Access-Control-Allow-Origin'),
            ['*', 'http://localhost:5173']
        );
        $this->assertNotEmpty($response->headers->get('Access-Control-Allow-Methods'));
    }

    /**
     * Test consistent 200 OK on catalog queries.
     */
    public function test_http_status_200_on_catalog_queries(): void
    {
        $this->getJson('/api/v1/markets')->assertStatus(200)->assertJsonPath('success', true);
        $this->getJson('/api/v1/categories')->assertStatus(200)->assertJsonPath('success', true);
        $this->getJson('/api/v1/farmers')->assertStatus(200)->assertJsonPath('success', true);
        $this->getJson('/api/v1/products')->assertStatus(200)->assertJsonPath('success', true);
    }

    /**
     * Test consistent 201 Created on resource creations.
     */
    public function test_http_status_201_on_resource_creation(): void
    {
        $response = $this->postJson('/api/v1/contact', [
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'subject' => 'Test Subject',
            'message' => 'Test Message Content',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);
    }

    /**
     * Test consistent 401 Unauthorized when unauthenticated.
     */
    public function test_http_status_401_on_unauthenticated_request(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401)
            ->assertJsonPath('success', false);
    }

    /**
     * Test consistent 403 Forbidden when unauthorized role.
     */
    public function test_http_status_403_on_forbidden_role(): void
    {
        $customer = User::factory()->create([
            'role' => User::ROLE_CUSTOMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $response = $this->actingAs($customer)
            ->getJson('/api/v1/admin/stats/overview');

        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }

    /**
     * Test consistent 404 Not Found on missing resources.
     */
    public function test_http_status_404_on_missing_resource(): void
    {
        $response = $this->getJson('/api/v1/markets/999999');

        $response->assertStatus(404)
            ->assertJsonPath('success', false);
    }

    /**
     * Test consistent 422 Unprocessable Entity on validation errors.
     */
    public function test_http_status_422_on_validation_failure(): void
    {
        $response = $this->postJson('/api/v1/contact', []);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors']);
    }
}
