<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\User;
use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFarmerActive
{
    use ApiResponse;

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $this->errorResponse('Unauthenticated: Please sign in to continue.', 401);
        }

        if ($user->role !== User::ROLE_FARMER) {
            return $this->errorResponse('Forbidden: Only Farmer accounts have access to this area.', 403);
        }

        if ($user->status === User::STATUS_PENDING) {
            return $this->errorResponse(
                'The farmer market stall account is waiting for the administrator to approve the profile before opening for sale.',
                403,
                ['status' => User::STATUS_PENDING]
            );
        }

        if ($user->status !== User::STATUS_ACTIVE) {
            return $this->errorResponse(
                'The farmer market stall account has been temporarily suspended or locked.',
                403,
                ['status' => $user->status]
            );
        }

        return $next($request);
    }
}
