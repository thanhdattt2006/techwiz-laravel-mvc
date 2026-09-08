<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class MaintenanceTest extends TestCase
{
    /**
     * Test health check endpoint returns status ok.
     */
    public function test_health_check_returns_ok_status(): void
    {
        $response = $this->get('/health');

        $response->assertStatus(200);
        $response->assertJsonPath('status', 'ok');
    }

    /**
     * Test database maintenance view renders successfully with all 3 actions.
     */
    public function test_db_maintenance_view_renders_successfully(): void
    {
        $response = $this->get('/db-maintenance');

        $response->assertStatus(200);
        $response->assertSee('Database Maintenance Console');
        $response->assertSee('Chạy Migrate mới');
        $response->assertSee('migrate:fresh');
        $response->assertSee('Rollback');
    }

    /**
     * Test database maintenance rejects invalid password on all routes.
     */
    public function test_db_maintenance_rejects_invalid_password(): void
    {
        Config::set('maintenance.db_password', 'valid_secret_pass');

        // Test migrate
        $response = $this->post('/db-maintenance/migrate', [
            'password' => 'wrong_password',
        ]);
        $response->assertRedirect();
        $response->assertSessionHas('error');

        // Test fresh
        $response = $this->post('/db-maintenance/fresh', [
            'password' => 'wrong_password',
        ]);
        $response->assertRedirect();
        $response->assertSessionHas('error');

        // Test rollback
        $response = $this->post('/db-maintenance/rollback', [
            'password' => 'wrong_password',
        ]);
        $response->assertRedirect();
        $response->assertSessionHas('error');
    }

    /**
     * Test database maintenance rejects when password is not configured.
     */
    public function test_db_maintenance_rejects_when_not_configured(): void
    {
        Config::set('maintenance.db_password', null);

        $response = $this->post('/db-maintenance/migrate', [
            'password' => 'any_password',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('error');
    }
}
