import { THEME_CONFIG } from '../config/theme.config.js';
import { StorageService } from '../services/storage.service.js';
import { eventBus } from '../services/event-bus.js';

/**
 * Module: ThemeModule
 * Tuân thủ Single Responsibility: Chuyên trách chuyển đổi và ghi nhớ Dark/Light mode
 */
export class ThemeModule {
    constructor() {
        this.themeToggleBtn = document.getElementById('theme-toggle-btn');
        this.htmlElement = document.documentElement;
    }

    init() {
        const savedTheme = StorageService.get(THEME_CONFIG.STORAGE_KEY, THEME_CONFIG.THEMES.LIGHT);
        this.applyTheme(savedTheme);

        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const isDark = this.htmlElement.classList.contains(THEME_CONFIG.THEMES.DARK);
        const newTheme = isDark ? THEME_CONFIG.THEMES.LIGHT : THEME_CONFIG.THEMES.DARK;
        this.applyTheme(newTheme);
    }

    applyTheme(theme) {
        if (theme === THEME_CONFIG.THEMES.DARK) {
            this.htmlElement.classList.add(THEME_CONFIG.THEMES.DARK);
        } else {
            this.htmlElement.classList.remove(THEME_CONFIG.THEMES.DARK);
        }

        StorageService.set(THEME_CONFIG.STORAGE_KEY, theme);
        this.updateToggleIcon(theme === THEME_CONFIG.THEMES.DARK);
        eventBus.emit('theme:changed', theme);
    }

    updateToggleIcon(isDark) {
        if (!this.themeToggleBtn) return;
        const iconContainer = this.themeToggleBtn.querySelector('.theme-icon');
        if (!iconContainer) return;

        if (isDark) {
            // Hiển thị icon Mặt trời để bấm đổi sang Light
            iconContainer.innerHTML = `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`;
        } else {
            // Hiển thị icon Mặt trăng để bấm đổi sang Dark
            iconContainer.innerHTML = `<svg class="w-5 h-5 text-slate-500 hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;
        }
    }
}
