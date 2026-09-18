/**
 * Service: Storage Service
 * Tuân thủ DRY & Single Responsibility: Đóng gói toàn bộ thao tác localStorage an toàn
 */
export class StorageService {
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`[StorageService] Lỗi khi đọc key "${key}":`, error);
            return defaultValue;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`[StorageService] Lỗi khi ghi key "${key}":`, error);
            return false;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`[StorageService] Lỗi khi xoá key "${key}":`, error);
            return false;
        }
    }
}
