import { MOCK_STATS } from './data/mock-stats.js';
import { MOCK_ACTIVITIES } from './data/mock-activities.js';
import { renderStatCard } from './components/stat-card.component.js';
import { renderActivityItem } from './components/activity-item.component.js';
import { ThemeModule } from './modules/theme.module.js';
import { SidebarModule } from './modules/sidebar.module.js';
import { ChartModule } from './modules/chart.module.js';
import { TableModule } from './modules/table.module.js';
import { ModalModule } from './modules/modal.module.js';
import { ShortcutModule } from './modules/shortcut.module.js';
import { AlertModule } from './modules/alert.module.js';

/**
 * Ứng dụng chính (Application Orchestrator)
 * Tuân thủ Dependency Inversion: Kết nối và khởi động các module một cách độc lập
 */
class AdminApp {
    constructor() {
        this.themeModule = new ThemeModule();
        this.sidebarModule = new SidebarModule();
        this.chartModule = new ChartModule();
        this.tableModule = new TableModule();
        this.modalModule = new ModalModule();
        this.shortcutModule = new ShortcutModule(this.modalModule);
    }

    init() {
        console.log('[AdminApp] Khởi động hệ thống Admin Dashboard...');

        // 1. Render các thành phần tĩnh ban đầu
        this.renderStats();
        this.renderActivities();

        // 2. Khởi tạo các module nghiệp vụ
        this.themeModule.init();
        this.sidebarModule.init();
        this.chartModule.init();
        this.tableModule.init();
        this.modalModule.init();
        this.shortcutModule.init();

        // 3. Khởi tạo các tương tác toàn cục
        this.initGlobalListeners();

        // Chào mừng admin
        setTimeout(() => {
            AlertModule.showToast('success', 'Chào mừng Admin quay trở lại!');
        }, 600);
    }

    renderStats() {
        const statsContainer = document.getElementById('stats-container');
        if (statsContainer) {
            statsContainer.innerHTML = MOCK_STATS.map(stat => renderStatCard(stat)).join('');
        }
    }

    renderActivities() {
        const activitiesContainer = document.getElementById('activities-container');
        if (activitiesContainer) {
            activitiesContainer.innerHTML = MOCK_ACTIVITIES.map(act => renderActivityItem(act)).join('');
        }
    }

    initGlobalListeners() {
        // Nút Đăng xuất có xác nhận SweetAlert2
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const confirmed = await AlertModule.confirmAction({
                    title: 'Đăng xuất khỏi hệ thống?',
                    text: 'Bạn sẽ cần phải đăng nhập lại để tiếp tục quản trị.',
                    confirmText: 'Đăng xuất ngay'
                });

                if (confirmed) {
                    AlertModule.showToast('info', 'Đã đăng xuất an toàn.');
                }
            });
        }
    }
}

// Khởi chạy khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    const app = new AdminApp();
    app.init();
});
