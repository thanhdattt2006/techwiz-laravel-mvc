/**
 * Cấu hình Theme & Bảng màu (Theme Configuration)
 * Tuân thủ Single Responsibility: Chỉ lưu trữ và cung cấp định nghĩa màu sắc, tokens.
 */
export const THEME_CONFIG = {
    STORAGE_KEY: 'admin_dashboard_theme',
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark',
    },
    COLORS: {
        PRIMARY: '#6366f1',      // Indigo 500
        PRIMARY_HOVER: '#4f46e5',// Indigo 600
        SUCCESS: '#10b981',      // Emerald 500
        WARNING: '#f59e0b',      // Amber 500
        DANGER: '#f43f5e',       // Rose 500
        INFO: '#0ea5e9',         // Sky 500
    }
};
