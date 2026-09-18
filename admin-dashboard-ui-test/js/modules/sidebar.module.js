/**
 * Module: SidebarModule
 * Tuân thủ Single Responsibility: Quản lý Sidebar Desktop (thu gọn/mở rộng), Mobile Drawer và Submenus
 */
export class SidebarModule {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarBackdrop = document.getElementById('sidebar-backdrop');
        this.toggleBtn = document.getElementById('sidebar-toggle-btn');
        this.mobileCloseBtn = document.getElementById('sidebar-close-btn');
        this.isOpen = false;
    }

    init() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleMobileDrawer());
        }

        if (this.mobileCloseBtn) {
            this.mobileCloseBtn.addEventListener('click', () => this.closeMobileDrawer());
        }

        if (this.sidebarBackdrop) {
            this.sidebarBackdrop.addEventListener('click', () => this.closeMobileDrawer());
        }

        // Accordion submenus
        const menuToggles = document.querySelectorAll('.submenu-toggle');
        menuToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const targetId = toggle.getAttribute('data-target');
                const targetSubmenu = document.getElementById(targetId);
                const arrowIcon = toggle.querySelector('.arrow-icon');

                if (targetSubmenu) {
                    targetSubmenu.classList.toggle('hidden');
                    if (arrowIcon) {
                        arrowIcon.classList.toggle('rotate-180');
                    }
                }
            });
        });
    }

    toggleMobileDrawer() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.openMobileDrawer();
        } else {
            this.closeMobileDrawer();
        }
    }

    openMobileDrawer() {
        this.isOpen = true;
        if (this.sidebar) {
            this.sidebar.classList.remove('-translate-x-full');
            this.sidebar.classList.add('translate-x-0');
        }
        if (this.sidebarBackdrop) {
            this.sidebarBackdrop.classList.remove('hidden');
        }
    }

    closeMobileDrawer() {
        this.isOpen = false;
        if (this.sidebar) {
            this.sidebar.classList.add('-translate-x-full');
            this.sidebar.classList.remove('translate-x-0');
        }
        if (this.sidebarBackdrop) {
            this.sidebarBackdrop.classList.add('hidden');
        }
    }
}
