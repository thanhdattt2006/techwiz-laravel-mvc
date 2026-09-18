/**
 * Mock Data: Danh sách đơn hàng (Order Store)
 */
export const MOCK_ORDERS = [
    {
        id: 'ORD-2026-1084',
        customer: {
            name: 'Hoàng Minh Quân',
            email: 'quan.hoang@example.com',
            phone: '0903 111 222',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            address: 'Tầng 12, Keangnam Landmark 72, Cầu Giấy, Hà Nội'
        },
        items: [
            { name: 'Tai Nghe Không Dây Sony WH-1000XM5', qty: 1, price: '8,490,000 đ' },
            { name: 'Bàn Phím Cơ Keychron K3 Pro Wireless', qty: 1, price: '2,450,000 đ' }
        ],
        totalAmount: '10,940,000 đ',
        paymentMethod: 'VNPAY QR',
        paymentStatus: 'paid', // paid, pending
        orderStatus: 'delivering', // pending, delivering, completed, cancelled
        createdAt: '17/09/2026 14:20'
    },
    {
        id: 'ORD-2026-1083',
        customer: {
            name: 'Ngô Thuỳ Linh',
            email: 'linh.ngo@example.com',
            phone: '0912 333 444',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
            address: '158 Nguyễn Đình Chiểu, Phường 6, Quận 3, TP. Hồ Chí Minh'
        },
        items: [
            { name: 'Đồng Hồ Thông Minh Apple Watch Ultra 2', qty: 1, price: '21,990,000 đ' }
        ],
        totalAmount: '21,990,000 đ',
        paymentMethod: 'Chuyển Khoản',
        paymentStatus: 'paid',
        orderStatus: 'completed',
        createdAt: '17/09/2026 10:15'
    },
    {
        id: 'ORD-2026-1082',
        customer: {
            name: 'Đỗ Văn Thành',
            email: 'thanh.do@example.com',
            phone: '0988 555 666',
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
            address: '42 Trần Phú, Hải Châu, Đà Nẵng'
        },
        items: [
            { name: 'Giày Chạy Bộ Nike Air Zoom Pegasus 40', qty: 2, price: '7,180,000 đ' }
        ],
        totalAmount: '7,180,000 đ',
        paymentMethod: 'COD (Tiền mặt)',
        paymentStatus: 'pending',
        orderStatus: 'pending',
        createdAt: '17/09/2026 08:45'
    },
    {
        id: 'ORD-2026-1081',
        customer: {
            name: 'Vũ Hải Yến',
            email: 'yen.vu@example.com',
            phone: '0977 888 999',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
            address: '28 Lê Lợi, TP. Huế, Thừa Thiên Huế'
        },
        items: [
            { name: 'Máy Pha Cà Phê DeLonghi Dedica EC685', qty: 1, price: '6,290,000 đ' }
        ],
        totalAmount: '6,290,000 đ',
        paymentMethod: 'COD (Tiền mặt)',
        paymentStatus: 'pending',
        orderStatus: 'cancelled',
        createdAt: '16/09/2026 16:30'
    }
];
