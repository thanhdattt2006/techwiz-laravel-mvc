/**
 * Mock Data: Dữ liệu 4 thẻ thống kê KPI (Stat Cards)
 */
export const MOCK_STATS = [
    {
        id: 'revenue',
        title: 'Tổng Doanh Thu',
        value: '128,450,000 đ',
        change: '+12.5%',
        isPositive: true,
        iconBg: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
        icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        sparklineData: [45, 52, 58, 65, 62, 70, 78],
        sparklineColor: '#6366f1'
    },
    {
        id: 'users',
        title: 'Khách Hàng Mới',
        value: '2,420',
        change: '+8.2%',
        isPositive: true,
        iconBg: 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400',
        icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
        sparklineData: [20, 24, 28, 26, 32, 35, 40],
        sparklineColor: '#0ea5e9'
    },
    {
        id: 'orders',
        title: 'Đơn Hàng Chờ Duyệt',
        value: '38',
        change: '5 đơn mới',
        isPositive: false,
        iconBg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
        icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>',
        sparklineData: [12, 18, 15, 22, 28, 32, 38],
        sparklineColor: '#f59e0b'
    },
    {
        id: 'conversion',
        title: 'Tỷ Lệ Hoàn Tất',
        value: '94.2%',
        change: '+2.4%',
        isPositive: true,
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
        icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        sparklineData: [88, 89, 91, 90, 92, 93, 94.2],
        sparklineColor: '#10b981'
    }
];
