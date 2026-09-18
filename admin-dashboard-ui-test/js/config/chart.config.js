/**
 * Cấu hình Biểu đồ Chart.js (Chart Configuration)
 * Tuân thủ Single Responsibility: Chuyên quản lý options, palette màu và style của biểu đồ.
 */
export const CHART_CONFIG = {
    FONT_FAMILY: "'Instrument Sans', 'Inter', -apple-system, sans-serif",
    PALETTE: {
        REVENUE: {
            BORDER: '#6366f1',
            GRADIENT_START: 'rgba(99, 102, 241, 0.25)',
            GRADIENT_END: 'rgba(99, 102, 241, 0.0)',
        },
        ORDERS: {
            BORDER: '#10b981',
            GRADIENT_START: 'rgba(16, 185, 129, 0.2)',
            GRADIENT_END: 'rgba(16, 185, 129, 0.0)',
        },
        DONUT: ['#6366f1', '#0ea5e9', '#f59e0b', '#10b981'],
        GRID_LIGHT: 'rgba(226, 232, 240, 0.7)',
        GRID_DARK: 'rgba(51, 65, 85, 0.4)',
    },
    TOOLTIP: {
        BACKGROUND: '#0f172a',
        PADDING: 12,
        CORNER_RADIUS: 8,
        TITLE_COLOR: '#ffffff',
        BODY_COLOR: '#cbd5e1',
    }
};
