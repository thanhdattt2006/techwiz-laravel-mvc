<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\User;
use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccountActive
{
    use ApiResponse;

    /**
     * Handle incoming request and ensure authenticated account is not banned or inactive.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ($user->status === User::STATUS_BANNED || $user->status === User::STATUS_INACTIVE)) {
            $user->tokens()->delete();

            return $this->errorResponse(
                'Your account has been suspended or banned. Please contact support.',
                401,
                ['status' => $user->status]
            );
        }

        return $next($request);
    }
}
