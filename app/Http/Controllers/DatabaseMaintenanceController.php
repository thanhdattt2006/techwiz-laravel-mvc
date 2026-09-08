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
                ->with('error', 'Mật khẩu xác thực không chính xác hoặc chưa được cấu hình trên server!');
        }

        try {
            $exitCode = Artisan::call('migrate', [
                '--force' => true,
            ]);

            $output = Artisan::output();

            if ($exitCode === 0) {
                return back()->with([
                    'success' => 'Thực thi php artisan migrate thành công!',
                    'output' => $output,
                    'command' => 'php artisan migrate --force',
                ]);
            }

            return back()->with([
                'error' => 'Lệnh migrate kết thúc với mã lỗi: ' . $exitCode,
                'output' => $output,
                'command' => 'php artisan migrate --force',
            ]);
        } catch (Throwable $e) {
            return back()->with([
                'error' => 'Đã xảy ra ngoại lệ: ' . $e->getMessage(),
                'output' => $e->getTraceAsString(),
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
                ->with('error', 'Mật khẩu xác thực không chính xác hoặc chưa được cấu hình trên server!');
        }

        try {
            $params = [
                '--force' => true,
            ];

            if ($request->boolean('seed')) {
                $params['--seed'] = true;
            }

            $exitCode = Artisan::call('migrate:fresh', $params);
            $output = Artisan::output();

            if ($exitCode === 0) {
                return back()->with([
                    'success' => 'Thực thi migrate:fresh thành công (Đã xóa trắng và chạy lại toàn bộ migrations)!',
                    'output' => $output,
                    'command' => 'php artisan migrate:fresh' . ($request->boolean('seed') ? ' --seed' : '') . ' --force',
                ]);
            }

            return back()->with([
                'error' => 'Lệnh migrate:fresh kết thúc với mã lỗi: ' . $exitCode,
                'output' => $output,
                'command' => 'php artisan migrate:fresh',
            ]);
        } catch (Throwable $e) {
            return back()->with([
                'error' => 'Đã xảy ra ngoại lệ: ' . $e->getMessage(),
                'output' => $e->getTraceAsString(),
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
                ->with('error', 'Mật khẩu xác thực không chính xác hoặc chưa được cấu hình trên server!');
        }

        try {
            $step = (int) ($request->validated('step') ?? 1);

            $exitCode = Artisan::call('migrate:rollback', [
                '--force' => true,
                '--step' => $step,
            ]);

            $output = Artisan::output();

            if ($exitCode === 0) {
                return back()->with([
                    'success' => 'Thực thi migrate:rollback thành công!',
                    'output' => $output,
                    'command' => 'php artisan migrate:rollback --step=' . $step . ' --force',
                ]);
            }

            return back()->with([
                'error' => 'Lệnh migrate:rollback kết thúc với mã lỗi: ' . $exitCode,
                'output' => $output,
                'command' => 'php artisan migrate:rollback',
            ]);
        } catch (Throwable $e) {
            return back()->with([
                'error' => 'Đã xảy ra ngoại lệ: ' . $e->getMessage(),
                'output' => $e->getTraceAsString(),
            ]);
        }
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
