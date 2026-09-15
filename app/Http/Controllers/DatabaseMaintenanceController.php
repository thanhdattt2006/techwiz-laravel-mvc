<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\DatabaseMaintenanceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Artisan;
use Illuminate\View\View;
use Throwable;

class DatabaseMaintenanceController extends Controller
{
    /**
     * Display the database maintenance management interface.
     */
    public function index(): View
    {
        $isConfigured = ! empty(config('maintenance.db_password'));

        return view('db-maintenance', [
            'isConfigured' => $isConfigured,
        ]);
    }

    /**
     * Execute php artisan migrate to apply new pending migrations without data loss.
     */
    public function migrate(DatabaseMaintenanceRequest $request): RedirectResponse
    {
        if (! $this->authorizePassword((string) $request->validated('password'))) {
            return back()
                ->withInput()
                ->with('error', 'Authentication failed: Incorrect maintenance password or secret not configured on server!');
        }

        try {
            $exitCode = Artisan::call('migrate', [
                '--force' => true,
            ]);

            $output = $this->formatOutput(Artisan::output(), 'No pending migrations to run. All database tables are already up to date.');

            if ($exitCode === 0) {
                return back()->with([
                    'success' => 'Command [php artisan migrate --force] executed successfully!',
                    'output' => $output,
                    'command' => 'php artisan migrate --force',
                ]);
            }

            return back()->with([
                'error' => 'Command [migrate] exited with error code: ' . $exitCode,
                'output' => $output,
                'command' => 'php artisan migrate --force',
            ]);
        } catch (Throwable $e) {
            return back()->with([
                'error' => 'Migration Exception: ' . $e->getMessage(),
                'output' => $this->formatOutput($e->getMessage() . "\n\n" . $e->getTraceAsString()),
            ]);
        }
    }

    /**
     * Execute php artisan migrate:fresh with optional seeding.
     * Note: migrate:fresh drops all tables and automatically re-runs all migrations from scratch.
     */
    public function fresh(DatabaseMaintenanceRequest $request): RedirectResponse
    {
        if (! $this->authorizePassword((string) $request->validated('password'))) {
            return back()
                ->withInput()
                ->with('error', 'Authentication failed: Incorrect maintenance password or secret not configured on server!');
        }

        try {
            $params = [
                '--force' => true,
            ];

            if ($request->boolean('seed')) {
                $params['--seed'] = true;
            }

            $exitCode = Artisan::call('migrate:fresh', $params);
            $output = $this->formatOutput(Artisan::output(), 'Database refreshed successfully.');

            if ($exitCode === 0) {
                return back()->with([
                    'success' => 'Database successfully reset and re-migrated (migrate:fresh)!',
                    'output' => $output,
                    'command' => 'php artisan migrate:fresh' . ($request->boolean('seed') ? ' --seed' : '') . ' --force',
                ]);
            }

            return back()->with([
                'error' => 'Command [migrate:fresh] exited with error code: ' . $exitCode,
                'output' => $output,
                'command' => 'php artisan migrate:fresh',
            ]);
        } catch (Throwable $e) {
            return back()->with([
                'error' => 'Migration Exception: ' . $e->getMessage(),
                'output' => $this->formatOutput($e->getMessage() . "\n\n" . $e->getTraceAsString()),
            ]);
        }
    }

    /**
     * Execute php artisan migrate:rollback with custom step count.
     */
    public function rollback(DatabaseMaintenanceRequest $request): RedirectResponse
    {
        if (! $this->authorizePassword((string) $request->validated('password'))) {
            return back()
                ->withInput()
                ->with('error', 'Authentication failed: Incorrect maintenance password or secret not configured on server!');
        }

        try {
            $step = (int) ($request->validated('step') ?? 1);

            $exitCode = Artisan::call('migrate:rollback', [
                '--force' => true,
                '--step' => $step,
            ]);

            $output = $this->formatOutput(Artisan::output(), 'Rollback completed.');

            if ($exitCode === 0) {
                return back()->with([
                    'success' => 'Command [migrate:rollback] executed successfully!',
                    'output' => $output,
                    'command' => 'php artisan migrate:rollback --step=' . $step . ' --force',
                ]);
            }

            return back()->with([
                'error' => 'Command [migrate:rollback] exited with error code: ' . $exitCode,
                'output' => $output,
                'command' => 'php artisan migrate:rollback',
            ]);
        } catch (Throwable $e) {
            return back()->with([
                'error' => 'Migration Exception: ' . $e->getMessage(),
                'output' => $this->formatOutput($e->getMessage() . "\n\n" . $e->getTraceAsString()),
            ]);
        }
    }

    /**
     * Format and trim output to prevent oversized session payloads.
     */
    private function formatOutput(string $output, ?string $fallback = null): string
    {
        $trimmed = trim($output);

        if ($trimmed === '' && $fallback !== null) {
            return $fallback;
        }

        return mb_substr($trimmed, 0, 6000);
    }

    /**
     * Validate the provided password against configured maintenance secret.
     */
    private function authorizePassword(string $inputPassword): bool
    {
        $configuredPassword = (string) config('maintenance.db_password');

        if (trim($configuredPassword) === '') {
            return false;
        }

        return hash_equals($configuredPassword, $inputPassword);
    }
}
