/**
 * Mock Data: Dữ liệu Biểu đồ Doanh thu & Cơ cấu Danh mục (Chart Data)
 */
export const MOCK_CHART_DATA = {
    revenue: {
        '7d': {
            labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
            revenue: [12, 19, 15, 25, 22, 30, 28],
            orders: [4, 7, 5, 9, 8, 12, 10]
        },
        '30d': {
            labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
            revenue: [85, 110, 135, 128],
            orders: [35, 48, 56, 52]
        },
        '1y': {
            labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
            revenue: [320, 380, 450, 420, 510, 580, 620, 590, 680, 750, 820, 950],
            orders: [120, 145, 170, 160, 195, 210, 230, 215, 250, 280, 310, 360]
        }
    },
    categoryDistribution: {
        labels: ['Thiết Bị Điện Tử', 'Thời Trang', 'Gia Dụng', 'Sách & Phụ Kiện'],
        values: [45, 25, 20, 10],
        totalCount: '1,420 Đơn'
    }
};
