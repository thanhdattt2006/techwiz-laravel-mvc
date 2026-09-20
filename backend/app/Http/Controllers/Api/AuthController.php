<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle user login with either username or email (Gmail).
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $loginInput = trim($validated['login']);
        $loginType = filter_var($loginInput, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $user = User::where($loginType, $loginInput)->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid username/email or password.',
                'data' => null,
                'errors' => [
                    'login' => ['The provided credentials are incorrect.'],
                ],
            ], 422);
        }

        if (! $user->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been deactivated or banned.',
                'data' => null,
                'errors' => null,
            ], 403);
        }

        // Generate Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful!',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'fullname' => $user->fullname,
                    'username' => $user->username,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'status' => $user->status,
                ],
            ],
        ], 200);
    }

    /**
     * Get the authenticated user details.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'User profile retrieved successfully.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'fullname' => $user->fullname,
                    'username' => $user->username,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'status' => $user->status,
                ],
            ],
        ], 200);
    }

    /**
     * Handle user logout and revoke token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful!',
            'data' => null,
        ], 200);
    }
}
