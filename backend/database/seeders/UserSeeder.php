<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultPassword = Hash::make('password123');

        // 1. Admin
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'fullname' => 'MarketLink Administrator',
                'email' => 'admin@marketlink.com',
                'phone' => '(312) 555-0100',
                'address' => 'City Hall, 121 N LaSalle St, Chicago, IL 60602',
                'role' => User::ROLE_ADMIN,
                'status' => User::STATUS_ACTIVE,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ]
        );

        // 2. Farmer 1 (John Miller)
        $farmer1 = User::updateOrCreate(
            ['username' => 'farmer'],
            [
                'fullname' => 'John Miller (Green Valley Farm)',
                'email' => 'farmer@marketlink.com',
                'phone' => '(312) 555-0199',
                'address' => '1240 Farm Lane, Woodstock, IL 60098',
                'role' => User::ROLE_FARMER,
                'status' => User::STATUS_ACTIVE,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ]
        );

        // 3. Farmer 2 (Sarah Jenkins)
        $farmer2 = User::updateOrCreate(
            ['username' => 'sarah_farms'],
            [
                'fullname' => 'Sarah Jenkins (Sunny Meadow)',
                'email' => 'sarah.organic@marketlink.com',
                'phone' => '(312) 555-0188',
                'address' => '880 Heritage Rd, Naperville, IL 60540',
                'role' => User::ROLE_FARMER,
                'status' => User::STATUS_ACTIVE,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ]
        );

        // 4. Customer 1 (David Miller)
        $customer1 = User::updateOrCreate(
            ['username' => 'customer'],
            [
                'fullname' => 'David Miller',
                'email' => 'customer@marketlink.com',
                'phone' => '(312) 555-0144',
                'address' => '742 Evergreen Terrace, Chicago, IL 60614',
                'role' => User::ROLE_CUSTOMER,
                'status' => User::STATUS_ACTIVE,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ]
        );
        Cart::updateOrCreate(['user_id' => $customer1->id]);

        // 5. Customer 2 (Emily Shopper)
        $customer2 = User::updateOrCreate(
            ['username' => 'emily_s'],
            [
                'fullname' => 'Emily Shopper',
                'email' => 'emily.shopper@marketlink.com',
                'phone' => '(312) 555-0155',
                'address' => '1920 N Clark St, Chicago, IL 60614',
                'role' => User::ROLE_CUSTOMER,
                'status' => User::STATUS_ACTIVE,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ]
        );
        Cart::updateOrCreate(['user_id' => $customer2->id]);
    }
}
