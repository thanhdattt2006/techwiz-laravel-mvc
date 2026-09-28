<?php

declare(strict_types=1);

namespace App\Services;

use App\Http\Resources\FarmerResource;
use App\Models\ContactMessage;
use App\Models\Farmer;
use App\Models\Market;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;

/**
 * AdminAnalyticsService
 * Encapsulates admin dashboard statistics computation.
 * Extracted from AdminController to comply with Single Responsibility Principle (SRP).
 */
class AdminAnalyticsService
{
    /**
     * Compute all platform overview statistics for the Admin dashboard.
     */
    public function getOverviewStats(): array
    {
        $grossRevenue = (float) Order::where('status', Order::STATUS_COMPLETED)->sum('total_amount');
        $totalOrders = Order::count();

        $ordersByStatus = [
            'placed' => Order::where('status', Order::STATUS_PLACED)->count(),
            'accepted' => Order::where('status', Order::STATUS_ACCEPTED)->count(),
            'ready_for_pickup' => Order::where('status', Order::STATUS_READY)->count(),
            'completed' => Order::where('status', Order::STATUS_COMPLETED)->count(),
            'cancelled' => Order::where('status', Order::STATUS_CANCELLED)->count(),
            'declined' => Order::where('status', Order::STATUS_DECLINED)->count(),
        ];

        $usersStats = [
            'total' => User::count(),
            'customers' => User::where('role', User::ROLE_CUSTOMER)->count(),
            'farmers' => User::where('role', User::ROLE_FARMER)->count(),
            'pending_farmers' => User::where('role', User::ROLE_FARMER)->where('status', User::STATUS_PENDING)->count(),
            'active_farmers' => User::where('role', User::ROLE_FARMER)->where('status', User::STATUS_ACTIVE)->count(),
            'banned' => User::where('status', User::STATUS_BANNED)->count(),
        ];

        $marketsStats = [
            'total' => Market::count(),
            'active' => Market::where('status', Market::STATUS_ACTIVE)->count(),
        ];

        $productsStats = [
            'total' => Product::count(),
            'available' => Product::where('is_hidden', false)->where('availability', Product::AVAILABILITY_AVAILABLE)->count(),
            'sold_out' => Product::where('availability', Product::AVAILABILITY_SOLD_OUT)->count(),
        ];

        $reviewsCount = Review::where('is_hidden', false)->count();
        $avgPlatformRating = $reviewsCount > 0
            ? round((float) Review::where('is_hidden', false)->avg('rating'), 2)
            : 0.00;

        $topFarmers = Farmer::with('user')
            ->orderByDesc('avg_rating')
            ->orderByDesc('review_count')
            ->limit(5)
            ->get();

        $inquiriesStats = [
            'total' => ContactMessage::count(),
            'unread' => ContactMessage::where('is_read', false)->count(),
        ];

        return [
            'revenue' => [
                'gross_completed' => round($grossRevenue, 2),
                'currency' => 'USD',
            ],
            'orders' => [
                'total' => $totalOrders,
                'by_status' => $ordersByStatus,
            ],
            'users' => $usersStats,
            'markets' => $marketsStats,
            'products' => $productsStats,
            'reviews' => [
                'total_visible' => $reviewsCount,
                'platform_average' => $avgPlatformRating,
            ],
            'inquiries' => $inquiriesStats,
            'top_farmers' => FarmerResource::collection($topFarmers),
        ];
    }
}
