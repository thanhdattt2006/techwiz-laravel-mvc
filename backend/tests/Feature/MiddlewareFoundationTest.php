<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Http\Middleware\EnsureFarmerActive;
use App\Http\Middleware\RoleMiddleware;
use App\Models\User;
use Illuminate\Http\Request;
use Tests\TestCase;

class MiddlewareFoundationTest extends TestCase
{
    public function test_role_middleware_blocks_unauthenticated_request(): void
    {
        $middleware = new RoleMiddleware();
        $request = Request::create('/api/v1/test', 'GET');

        $response = $middleware->handle($request, function () {
            return response('OK');
        }, 'admin');

        $this->assertEquals(401, $response->getStatusCode());
        $content = json_decode($response->getContent(), true);
        $this->assertFalse($content['success']);
    }

    public function test_role_middleware_allows_matching_role(): void
    {
        $middleware = new RoleMiddleware();
        $request = Request::create('/api/v1/test', 'GET');

        $user = new User();
        $user->role = User::ROLE_ADMIN;
        $request->setUserResolver(fn () => $user);

        $response = $middleware->handle($request, function () {
            return response('OK');
        }, 'admin', 'farmer');

        $this->assertEquals('OK', $response->getContent());
    }

    public function test_role_middleware_blocks_non_matching_role(): void
    {
        $middleware = new RoleMiddleware();
        $request = Request::create('/api/v1/test', 'GET');

        $user = new User();
        $user->role = User::ROLE_CUSTOMER;
        $request->setUserResolver(fn () => $user);

        $response = $middleware->handle($request, function () {
            return response('OK');
        }, 'admin', 'farmer');

        $this->assertEquals(403, $response->getStatusCode());
        $content = json_decode($response->getContent(), true);
        $this->assertFalse($content['success']);
    }

    public function test_ensure_farmer_active_allows_active_farmer(): void
    {
        $middleware = new EnsureFarmerActive();
        $request = Request::create('/api/v1/farmer/test', 'GET');

        $user = new User();
        $user->role = User::ROLE_FARMER;
        $user->status = User::STATUS_ACTIVE;
        $request->setUserResolver(fn () => $user);

        $response = $middleware->handle($request, function () {
            return response('Farmer OK');
        });

        $this->assertEquals('Farmer OK', $response->getContent());
    }

    public function test_ensure_farmer_active_blocks_pending_farmer(): void
    {
        $middleware = new EnsureFarmerActive();
        $request = Request::create('/api/v1/farmer/test', 'GET');

        $user = new User();
        $user->role = User::ROLE_FARMER;
        $user->status = User::STATUS_PENDING;
        $request->setUserResolver(fn () => $user);

        $response = $middleware->handle($request, function () {
            return response('Farmer OK');
        });

        $this->assertEquals(403, $response->getStatusCode());
        $content = json_decode($response->getContent(), true);
        $this->assertFalse($content['success']);
        $this->assertEquals(User::STATUS_PENDING, $content['errors']['status']);
    }

    public function test_ensure_farmer_active_blocks_inactive_farmer(): void
    {
        $middleware = new EnsureFarmerActive();
        $request = Request::create('/api/v1/farmer/test', 'GET');

        $user = new User();
        $user->role = User::ROLE_FARMER;
        $user->status = User::STATUS_INACTIVE;
        $request->setUserResolver(fn () => $user);

        $response = $middleware->handle($request, function () {
            return response('Farmer OK');
        });

        $this->assertEquals(403, $response->getStatusCode());
        $content = json_decode($response->getContent(), true);
        $this->assertFalse($content['success']);
        $this->assertEquals(User::STATUS_INACTIVE, $content['errors']['status']);
    }

    public function test_ensure_farmer_active_blocks_non_farmer_user(): void
    {
        $middleware = new EnsureFarmerActive();
        $request = Request::create('/api/v1/farmer/test', 'GET');

        $user = new User();
        $user->role = User::ROLE_CUSTOMER;
        $user->status = User::STATUS_ACTIVE;
        $request->setUserResolver(fn () => $user);

        $response = $middleware->handle($request, function () {
            return response('Farmer OK');
        });

        $this->assertEquals(403, $response->getStatusCode());
        $content = json_decode($response->getContent(), true);
        $this->assertFalse($content['success']);
    }
}
