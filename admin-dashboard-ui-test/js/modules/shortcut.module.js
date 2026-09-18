import { AlertModule } from './alert.module.js';

/**
 * Module: ShortcutModule
 * Tuân thủ Single Responsibility: Bắt các phím tắt trợ năng (Ctrl+K, Esc, Shift+N)
 */
export class ShortcutModule {
    constructor(modalModule) {
        this.modalModule = modalModule;
        this.searchInput = document.getElementById('global-search-input');
        this.openAddBtn = document.getElementById('open-add-modal-btn');
    }

    init() {
        window.addEventListener('keydown', (e) => {
            // 1. Phím Esc: Đóng Modal & Drawer
            if (e.key === 'Escape') {
                if (this.modalModule) {
                    this.modalModule.closeAll();
                }
                return;
            }

            // 2. Phím Ctrl+K / Cmd+K: Nhảy vào ô tìm kiếm
            if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault();
                if (this.searchInput) {
                    this.searchInput.focus();
                    this.searchInput.select();
                }
                return;
            }

            // 3. Phím Shift+N: Mở modal thêm mới (khi không gõ trong input)
            if (e.shiftKey && (e.key === 'N' || e.key === 'n') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                e.preventDefault();
                if (this.modalModule) {
                    this.modalModule.openAddModal();
                }
                return;
            }

            // 4. Phím ?: Hiển thị hướng dẫn phím tắt
            if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                e.preventDefault();
                AlertModule.showToast('info', 'Phím tắt: Ctrl+K (Tìm kiếm), Shift+N (Thêm mới), Esc (Đóng)');
            }
        });
    }
}
