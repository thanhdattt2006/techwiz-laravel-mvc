import { MOCK_ORDERS } from '../data/mock-orders.js';
import { AlertModule } from './alert.module.js';
import { ApiService } from '../services/api.service.js';

/**
 * Module: OrdersModule
 * Quản lý danh sách đơn hàng, lọc trạng thái, xem chi tiết Stepper và cập nhật trạng thái
 */
export class OrdersModule {
    constructor() {
        this.orders = [...MOCK_ORDERS];
        this.filteredOrders = [...MOCK_ORDERS];
        this.currentStatus = 'all';
        this.searchQuery = '';

        this.tbody = document.getElementById('orders-tbody');
        this.statusTabs = document.querySelectorAll('.order-status-tab');
        this.searchInput = document.getElementById('order-search-input');
        this.drawer = document.getElementById('order-detail-drawer');
        this.drawerBackdrop = document.getElementById('order-drawer-backdrop');
        this.drawerContent = document.getElementById('order-drawer-content');
        this.closeDrawerBtn = document.getElementById('close-order-drawer-btn');
    }

    init() {
        this.renderTable();
        this.initEventListeners();
    }

    renderTable() {
        if (!this.tbody) return;

        if (this.filteredOrders.length === 0) {
            this.tbody.innerHTML = `<tr><td colspan="7" class="py-12 text-center text-slate-400">Không tìm thấy đơn hàng nào</td></tr>`;
            return;
        }

        this.tbody.innerHTML = this.filteredOrders.map(o => `
            <tr class="hover:bg-slate-50/75 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/80 transition-colors">
                <td class="pl-6 pr-3 py-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 cursor-pointer view-order-btn" data-id="${o.id}">
                    ${o.id}
                </td>
                <td class="px-3 py-4">
                    <div class="flex items-center gap-2.5">
                        <img src="${o.customer.avatar}" alt="${o.customer.name}" class="w-8 h-8 rounded-full object-cover">
                        <div>
                            <div class="font-semibold text-slate-900 dark:text-white text-xs">${o.customer.name}</div>
                            <div class="text-[11px] text-slate-400">${o.customer.phone}</div>
                        </div>
                    </div>
                </td>
                <td class="px-3 py-4 text-xs text-slate-500 dark:text-slate-400">
                    ${o.items.length} món (${o.items.map(i => i.name).join(', ').slice(0, 25)}...)
                </td>
                <td class="px-3 py-4 text-sm font-bold text-slate-900 dark:text-white">
                    ${o.totalAmount}
                </td>
                <td class="px-3 py-4 text-xs">
                    <span class="px-2 py-0.5 rounded-full font-medium ${o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'}">
                        ${o.paymentMethod} (${o.paymentStatus === 'paid' ? 'Đã thu' : 'Chờ thu'})
                    </span>
                </td>
                <td class="px-3 py-4">
                    ${this.renderOrderStatusBadge(o.orderStatus)}
                </td>
                <td class="pl-3 pr-6 py-4 text-right">
                    <button class="view-order-btn px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 rounded-lg transition-colors" data-id="${o.id}">
                        Chi Tiết
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderOrderStatusBadge(status) {
        switch (status) {
            case 'pending':
                return `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-400"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Chờ xử lý</span>`;
            case 'delivering':
                return `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 ring-1 ring-sky-600/20 dark:bg-sky-950/50 dark:text-sky-400"><span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>Đang giao</span>`;
            case 'completed':
                return `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Hoàn tất</span>`;
            case 'cancelled':
                return `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-400"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Đã huỷ</span>`;
            default:
                return status;
        }
    }

    applyFilters() {
        let res = [...this.orders];
        if (this.currentStatus !== 'all') {
            res = res.filter(o => o.orderStatus === this.currentStatus);
        }
        if (this.searchQuery.trim() !== '') {
            const q = this.searchQuery.toLowerCase();
            res = res.filter(o => o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.phone.includes(q));
        }
        this.filteredOrders = res;
        this.renderTable();
    }

    openOrderDetail(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order || !this.drawerContent) return;

        this.drawerContent.innerHTML = `
            <div class="space-y-6">
                <!-- Mã đơn + Ngày tạo -->
                <div class="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h4 class="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">${order.id}</h4>
                        <span class="text-xs text-slate-400">Đặt lúc: ${order.createdAt}</span>
                    </div>
                    ${this.renderOrderStatusBadge(order.orderStatus)}
                </div>

                <!-- Khách hàng & Địa chỉ giao hàng -->
                <div class="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-2 text-xs">
                    <div class="font-bold text-slate-800 dark:text-slate-200">Khách Nhận Hàng</div>
                    <div class="text-slate-700 dark:text-slate-300 font-medium">${order.customer.name} - ${order.customer.phone}</div>
                    <div class="text-slate-500 dark:text-slate-400">${order.customer.address}</div>
                </div>

                <!-- Danh sách mặt hàng -->
                <div>
                    <h5 class="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">Chi Tiết Mặt Hàng</h5>
                    <div class="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                        ${order.items.map(item => `
                            <div class="p-3 flex items-center justify-between text-xs">
                                <div>
                                    <div class="font-semibold text-slate-900 dark:text-white">${item.name}</div>
                                    <div class="text-slate-400">Số lượng: x${item.qty}</div>
                                </div>
                                <span class="font-bold text-slate-800 dark:text-slate-200">${item.price}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Tổng kết thanh toán -->
                <div class="bg-indigo-50/50 dark:bg-indigo-950/30 p-4 rounded-xl space-y-1.5 text-xs">
                    <div class="flex justify-between text-slate-500"><span>Phương thức:</span> <span class="font-semibold text-slate-700 dark:text-slate-300">${order.paymentMethod}</span></div>
                    <div class="flex justify-between text-slate-500"><span>Trạng thái tiền:</span> <span class="font-semibold text-emerald-600">${order.paymentStatus === 'paid' ? 'Đã Thanh Toán' : 'Chưa Thu Tiền'}</span></div>
                    <div class="pt-2 border-t border-indigo-100 dark:border-indigo-900 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                        <span>Tổng Thanh Toán:</span>
                        <span class="text-indigo-600 dark:text-indigo-400">${order.totalAmount}</span>
                    </div>
                </div>

                <!-- Nút thao tác chuyển trạng thái -->
                <div class="flex items-center gap-2 pt-2">
                    <button class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors update-status-btn" data-id="${order.id}" data-to="completed">
                        Duyệt Hoàn Tất
                    </button>
                    <button class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-colors update-status-btn" data-id="${order.id}" data-to="cancelled">
                        Huỷ Đơn Hàng
                    </button>
                </div>
            </div>
        `;

        this.drawer?.classList.remove('translate-x-full');
        this.drawer?.classList.add('translate-x-0');
        this.drawerBackdrop?.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    closeDrawer() {
        this.drawer?.classList.add('translate-x-full');
        this.drawer?.classList.remove('translate-x-0');
        this.drawerBackdrop?.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    initEventListeners() {
        // Status tabs
        this.statusTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.currentStatus = tab.getAttribute('data-status');
                this.statusTabs.forEach(t => {
                    t.classList.remove('bg-indigo-50', 'text-indigo-600', 'dark:bg-indigo-950/60', 'dark:text-indigo-400');
                    t.classList.add('text-slate-500');
                });
                tab.classList.add('bg-indigo-50', 'text-indigo-600', 'dark:bg-indigo-950/60', 'dark:text-indigo-400');
                tab.classList.remove('text-slate-500');
                this.applyFilters();
            });
        });

        // Search
        if (this.searchInput) {
            let timer;
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    this.searchQuery = e.target.value;
                    this.applyFilters();
                }, 250);
            });
        }

        // View detail click
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.view-order-btn');
            if (btn) {
                const id = btn.getAttribute('data-id');
                this.openOrderDetail(id);
            }
        });

        // Drawer close
        if (this.closeDrawerBtn) this.closeDrawerBtn.addEventListener('click', () => this.closeDrawer());
        if (this.drawerBackdrop) this.drawerBackdrop.addEventListener('click', () => this.closeDrawer());

        // Update status click
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.update-status-btn');
            if (btn) {
                const id = btn.getAttribute('data-id');
                const toStatus = btn.getAttribute('data-to');

                const actionTitle = toStatus === 'completed' ? 'Duyệt hoàn tất đơn hàng?' : 'Huỷ đơn hàng này?';
                const confirmed = await AlertModule.confirmAction({
                    title: actionTitle,
                    text: `Đơn hàng ${id} sẽ được cập nhật trạng thái mới!`,
                    confirmText: 'Đồng ý cập nhật'
                });

                if (confirmed) {
                    await ApiService.simulateRequest(() => {
                        const order = this.orders.find(o => o.id === id);
                        if (order) order.orderStatus = toStatus;
                        this.applyFilters();
                        this.closeDrawer();
                    }, 300);

                    AlertModule.showToast('success', `Đã cập nhật đơn hàng ${id}!`);
                }
            }
        });
    }
}
