import { AlertModule } from './alert.module.js';
import { ApiService } from '../services/api.service.js';

/**
 * Module: SettingsModule
 * Quản lý các tab cấu hình hệ thống, hồ sơ admin và đổi mật khẩu
 */
export class SettingsModule {
    constructor() {
        this.tabs = document.querySelectorAll('.settings-tab-btn');
        this.sections = document.querySelectorAll('.settings-section');
        this.profileForm = document.getElementById('profile-settings-form');
        this.securityForm = document.getElementById('security-settings-form');
        this.systemForm = document.getElementById('system-settings-form');
    }

    init() {
        this.initTabs();
        this.initFormSubmits();
    }

    initTabs() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('data-target');

                // Active tab button style
                this.tabs.forEach(t => {
                    t.classList.remove('bg-indigo-50', 'text-indigo-600', 'dark:bg-indigo-950/60', 'dark:text-indigo-400', 'font-bold');
                    t.classList.add('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
                });
                tab.classList.add('bg-indigo-50', 'text-indigo-600', 'dark:bg-indigo-950/60', 'dark:text-indigo-400', 'font-bold');
                tab.classList.remove('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');

                // Show target section
                this.sections.forEach(sec => {
                    if (sec.id === targetId) {
                        sec.classList.remove('hidden');
                    } else {
                        sec.classList.add('hidden');
                    }
                });
            });
        });
    }

    initFormSubmits() {
        [this.profileForm, this.securityForm, this.systemForm].forEach(form => {
            if (!form) return;
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn ? submitBtn.innerText : 'Lưu';

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = 'Đang lưu...';
                }

                await ApiService.simulateRequest(() => {}, 400);

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalText;
                }

                AlertModule.showToast('success', 'Đã lưu thiết lập thành công!');
            });
        });
    }
}
