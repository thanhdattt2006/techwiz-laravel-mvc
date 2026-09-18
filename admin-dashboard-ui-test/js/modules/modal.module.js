import { renderStatusBadge } from '../components/status-badge.component.js';
import { eventBus } from '../services/event-bus.js';
import { ApiService } from '../services/api.service.js';

/**
 * Module: ModalModule
 * Tuân thủ Single Responsibility: Quản lý Modal thêm/sửa và Slide-over Drawer xem chi tiết
 */
export class ModalModule {
    constructor() {
        // Modal thêm mới
        this.addModal = document.getElementById('add-user-modal');
        this.openAddBtn = document.getElementById('open-add-modal-btn');
        this.closeAddBtn = document.getElementById('close-add-modal-btn');
        this.cancelAddBtn = document.getElementById('cancel-add-modal-btn');
        this.addUserForm = document.getElementById('add-user-form');
        this.submitBtn = document.getElementById('submit-user-btn');

        // Slide-over xem chi tiết
        this.detailDrawer = document.getElementById('detail-slideover');
        this.drawerBackdrop = document.getElementById('drawer-backdrop');
        this.closeDrawerBtn = document.getElementById('close-drawer-btn');
        this.drawerContent = document.getElementById('drawer-content');
    }

    init() {
        // Mở modal thêm mới
        if (this.openAddBtn) {
            this.openAddBtn.addEventListener('click', () => this.openAddModal());
        }

        // Đóng modal thêm mới
        if (this.closeAddBtn) this.closeAddBtn.addEventListener('click', () => this.closeAddModal());
        if (this.cancelAddBtn) this.cancelAddBtn.addEventListener('click', () => this.closeAddModal());

        // Submit form thêm mới
        if (this.addUserForm) {
            this.addUserForm.addEventListener('submit', (e) => this.handleAddFormSubmit(e));
        }

        // Đóng Slide-over chi tiết
        if (this.closeDrawerBtn) this.closeDrawerBtn.addEventListener('click', () => this.closeDetailDrawer());
        if (this.drawerBackdrop) this.drawerBackdrop.addEventListener('click', () => this.closeDetailDrawer());

        // Lắng nghe xem chi tiết từ TableModule
        eventBus.on('user:view', (user) => this.openDetailDrawer(user));
    }

    openAddModal() {
        if (!this.addModal) return;
        this.addModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        const firstInput = this.addUserForm?.querySelector('input[name="name"]');
        if (firstInput) setTimeout(() => firstInput.focus(), 50);
    }

    closeAddModal() {
        if (!this.addModal) return;
        this.addModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        if (this.addUserForm) this.addUserForm.reset();
    }

    async handleAddFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.addUserForm);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const role = formData.get('role') || 'Khách Hàng';
        const status = formData.get('status') || 'active';

        if (!name || !email) return;

        // Bật loading spinner trên nút
        if (this.submitBtn) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang lưu...
            `;
        }

        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`,
            role: role,
            roleBadge: role === 'Quản Trị Viên'
                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400'
                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
            status: status,
            createdAt: 'Vừa xong',
            phone: '0900 000 000',
            ordersCount: 0
        };

        await ApiService.simulateRequest(() => {
            eventBus.emit('user:created', newUser);
            this.closeAddModal();
        }, 500);

        if (this.submitBtn) {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = 'Lưu bản ghi';
        }
    }

    openDetailDrawer(user) {
        if (!this.detailDrawer || !this.drawerContent) return;

        this.drawerContent.innerHTML = `
            <div class="space-y-6">
                <!-- Avatar + Tên lớn -->
                <div class="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <img src="${user.avatar}" alt="${user.name}" class="w-16 h-16 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800">
                    <div>
                        <h4 class="text-xl font-bold text-slate-900 dark:text-white">${user.name}</h4>
                        <p class="text-sm text-slate-400">${user.email}</p>
                        <div class="mt-2 flex items-center gap-2">
                            ${renderStatusBadge(user.status)}
                            <span class="text-xs px-2 py-0.5 rounded font-medium ${user.roleBadge}">${user.role}</span>
                        </div>
                    </div>
                </div>

                <!-- Thông tin liên hệ -->
                <div>
                    <h5 class="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">Thông tin chi tiết</h5>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                            <span class="text-xs text-slate-400 block">Số điện thoại</span>
                            <span class="text-sm font-semibold text-slate-800 dark:text-slate-200">${user.phone}</span>
                        </div>
                        <div class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                            <span class="text-xs text-slate-400 block">Tổng đơn hàng</span>
                            <span class="text-sm font-semibold text-slate-800 dark:text-slate-200">${user.ordersCount} đơn</span>
                        </div>
                        <div class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl col-span-2">
                            <span class="text-xs text-slate-400 block">Ngày tham gia hệ thống</span>
                            <span class="text-sm font-semibold text-slate-800 dark:text-slate-200">${user.createdAt}</span>
                        </div>
                    </div>
                </div>

                <!-- Timeline hoạt động gần đây của User -->
                <div>
                    <h5 class="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">Lịch sử tương tác</h5>
                    <div class="space-y-3">
                        <div class="flex items-start gap-3 text-sm">
                            <span class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                            <div>
                                <p class="text-slate-700 dark:text-slate-300">Đăng nhập thành công từ Chrome / Windows</p>
                                <span class="text-xs text-slate-400">10 phút trước</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-3 text-sm">
                            <span class="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                            <div>
                                <p class="text-slate-700 dark:text-slate-300">Tạo đơn hàng #1084</p>
                                <span class="text-xs text-slate-400">Hôm qua 15:30</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.detailDrawer.classList.remove('translate-x-full');
        this.detailDrawer.classList.add('translate-x-0');
        if (this.drawerBackdrop) this.drawerBackdrop.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    closeDetailDrawer() {
        if (!this.detailDrawer) return;
        this.detailDrawer.classList.add('translate-x-full');
        this.detailDrawer.classList.remove('translate-x-0');
        if (this.drawerBackdrop) this.drawerBackdrop.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    closeAll() {
        this.closeAddModal();
        this.closeDetailDrawer();
    }
}
