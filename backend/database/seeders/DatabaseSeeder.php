<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $defaultPassword = Hash::make('password123');

        // 1. Admin Account
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'fullname' => 'System Administrator',
                'email' => 'admin@gmail.com',
                'phone' => '0901234567',
                'role' => User::ROLE_ADMIN,
                'status' => User::STATUS_ACTIVE,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ]
        );

        // 2. Operator / Dispatcher Account
        User::updateOrCreate(
            ['username' => 'operator'],
            [
                'fullname' => 'Senior Dispatcher',
                'email' => 'operator@gmail.com',
                'phone' => '0902345678',
                'role' => User::ROLE_OPERATOR,
                'status' => User::STATUS_ACTIVE,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ]
        );

        // 3. Standard User / Patient Account
        User::updateOrCreate(
            ['username' => 'user'],
            [
                'fullname' => 'John Doe (Patient)',
                'email' => 'user@gmail.com',
                'phone' => '0903456789',
                'role' => User::ROLE_USER,
                'status' => User::STATUS_ACTIVE,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ]
        );
    }
}
