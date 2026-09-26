<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\StoreFarmerRegisterRequest;
use App\Http\Requests\Auth\StoreRegisterRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\Cart;
use App\Models\Farmer;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Register a new customer account.
     */
    public function register(StoreRegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated): User {
            $user = User::create([
                'fullname' => $validated['fullname'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'role' => User::ROLE_CUSTOMER,
                'status' => User::STATUS_ACTIVE,
                'password' => Hash::make($validated['password']),
            ]);

            // Automatically create empty cart for new customer
            Cart::create([
                'user_id' => $user->id,
            ]);

            return $user;
        });

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'token' => $token,
            'user' => new UserResource($user),
        ], 'Customer registered successfully.', 201);
    }

    /**
     * Register a new farmer stall application (status: pending).
     */
    public function registerFarmer(StoreFarmerRegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated): User {
            $user = User::create([
                'fullname' => $validated['fullname'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'role' => User::ROLE_FARMER,
                'status' => User::STATUS_PENDING,
                'password' => Hash::make($validated['password']),
            ]);

            Farmer::create([
                'user_id' => $user->id,
                'stall_name' => $validated['stall_name'],
                'contact_person' => $validated['contact_person'],
                'contact_phone' => $validated['contact_phone'],
                'address' => $validated['address'],
                'description' => $validated['description'] ?? null,
                'latitude' => $validated['latitude'] ?? null,
                'longitude' => $validated['longitude'] ?? null,
                'logo' => $validated['logo'] ?? null,
            ]);

            return $user;
        });

        return $this->successResponse([
            'user' => new UserResource($user->load('farmer')),
        ], 'Farmer registration submitted successfully. Your account is pending admin approval.', 201);
    }

    /**
     * Authenticate user with username or email and return Sanctum Bearer token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $loginInput = trim($validated['login']);
        $isEmail = filter_var($loginInput, FILTER_VALIDATE_EMAIL) !== false;

        $user = User::where($isEmail ? 'email' : 'username', $loginInput)->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return $this->errorResponse('Invalid username/email or password.', 422, [
                'login' => ['Invalid username/email or password.'],
            ]);
        }

        $blockedStatuses = [
            User::STATUS_PENDING => 'Your farmer account is currently pending approval by the admin.',
            User::STATUS_BANNED => 'Your account has been suspended or banned. Please contact support.',
            User::STATUS_INACTIVE => 'Your account is currently inactive. Please contact support.',
        ];

        foreach ($blockedStatuses as $status => $errorMessage) {
            if ($user->status === $status) {
                return $this->errorResponse($errorMessage, 403, [
                    'status' => $status,
                ]);
            }
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'token' => $token,
            'user' => new UserResource($user->loadMissing('farmer')),
        ], 'Login successful.');
    }

    /**
     * Get the authenticated user profile along with role-specific details.
     */
    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return $this->successResponse([
            'user' => new UserResource($user->loadMissing('farmer')),
        ], 'User profile retrieved successfully.');
    }

    /**
     * Update the authenticated user's profile details.
     */
    public function profile(UpdateProfileRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->update($request->validated());

        return $this->successResponse([
            'user' => new UserResource($user->fresh('farmer')),
        ], 'Profile updated successfully.');
    }

    /**
     * Change the authenticated user's password.
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->password = Hash::make($request->validated('new_password'));
        $user->save();

        return $this->successResponse(null, 'Password changed successfully.');
    }

    /**
     * Log out the authenticated user by revoking the current access token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return $this->successResponse(null, 'Logged out successfully.');
    }
}
