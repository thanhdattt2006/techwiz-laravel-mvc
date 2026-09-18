/**
 * Service: EventBus
 * Tuân thủ Loose Coupling (SOLID - Dependency Inversion): Giúp các module giao tiếp mà không phụ thuộc trực tiếp vào nhau
 */
class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);

        // Trả về hàm unsubscribe
        return () => {
            const list = this.listeners.get(event) || [];
            this.listeners.set(event, list.filter(cb => cb !== callback));
        };
    }

    emit(event, data = null) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (err) {
                    console.error(`[EventBus] Lỗi trong listener của event "${event}":`, err);
                }
            });
        }
    }
}

export const eventBus = new EventBus();
