/**
 * Service: ApiService
 * Tuân thủ Single Responsibility: Mô phỏng gọi AJAX bất đồng bộ và kích hoạt NProgress loading bar
 */
export class ApiService {
    /**
     * Giả lập một request API bất đồng bộ có loading bar
     * @param {Function} mockDataFetcher - Hàm trả về dữ liệu mẫu
     * @param {number} delayMs - Độ trễ mạng giả lập (ms)
     */
    static async simulateRequest(mockDataFetcher, delayMs = 400) {
        if (window.NProgress) {
            window.NProgress.start();
        }

        try {
            await new Promise(resolve => setTimeout(resolve, delayMs));
            return mockDataFetcher();
        } finally {
            if (window.NProgress) {
                window.NProgress.done();
            }
        }
    }
}
