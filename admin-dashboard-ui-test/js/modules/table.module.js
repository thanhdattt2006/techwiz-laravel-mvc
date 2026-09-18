import { MOCK_USERS } from '../data/mock-users.js';
import { renderUserRow } from '../components/user-row.component.js';
import { AlertModule } from './alert.module.js';
import { eventBus } from '../services/event-bus.js';
import { ApiService } from '../services/api.service.js';

/**
 * Module: TableModule
 * Tuân thủ Single Responsibility: Quản lý bảng dữ liệu, lọc tabs, tìm kiếm, phân trang, bulk actions
 */
export class TableModule {
    constructor() {
        this.users = [...MOCK_USERS];
        this.filteredUsers = [...MOCK_USERS];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.currentPage = 1;
        this.pageSize = 5;
        this.selectedIds = new Set();

        // DOM elements
        this.tbody = document.getElementById('users-table-body');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.searchInput = document.getElementById('table-search-input');
        this.selectAllCheckbox = document.getElementById('select-all-checkbox');
        this.floatingBar = document.getElementById('floating-bulk-bar');
        this.selectedCountText = document.getElementById('selected-count-text');
        this.paginationInfo = document.getElementById('pagination-info');
        this.prevPageBtn = document.getElementById('prev-page-btn');
        this.nextPageBtn = document.getElementById('next-page-btn');
        this.emptyState = document.getElementById('table-empty-state');
    }

    init() {
        this.renderTable();
        this.initFilterTabs();
        this.initSearch();
        this.initCheckboxes();
        this.initBulkActions();
        this.initPagination();
        this.initRowActionListeners();

        // Lắng nghe sự kiện thêm mới hoặc cập nhật từ Modal
        eventBus.on('user:created', (newUser) => {
            this.users.unshift(newUser);
            this.applyFilters();
            AlertModule.showToast('success', `Đã thêm thành công: ${newUser.name}`);
        });
    }

    applyFilters() {
        let result = [...this.users];

        // 1. Lọc theo Tab trạng thái
        if (this.currentFilter !== 'all') {
            result = result.filter(u => u.status === this.currentFilter);
        }

        // 2. Lọc theo ô tìm kiếm
        if (this.searchQuery.trim() !== '') {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(u =>
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query) ||
                u.role.toLowerCase().includes(query)
            );
        }

        this.filteredUsers = result;
        this.currentPage = 1;
        this.selectedIds.clear();
        this.updateBulkBar();
        this.renderTable();
    }

    renderTable() {
        if (!this.tbody) return;

        // Xử lý Empty State
        if (this.filteredUsers.length === 0) {
            this.tbody.innerHTML = '';
            if (this.emptyState) this.emptyState.classList.remove('hidden');
            this.updatePaginationUI();
            return;
        }

        if (this.emptyState) this.emptyState.classList.add('hidden');

        // Phân trang
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageItems = this.filteredUsers.slice(startIndex, endIndex);

        this.tbody.innerHTML = pageItems.map(user => renderUserRow(user)).join('');

        // Cập nhật trạng thái checkbox
        const rowCheckboxes = this.tbody.querySelectorAll('.row-checkbox');
        rowCheckboxes.forEach(cb => {
            const id = parseInt(cb.value);
            cb.checked = this.selectedIds.has(id);
        });

        this.updateSelectAllCheckboxState();
        this.updatePaginationUI();
    }

    initFilterTabs() {
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.currentFilter = tab.getAttribute('data-filter');

                // Active tab style
                this.filterTabs.forEach(t => {
                    t.classList.remove('bg-indigo-50', 'text-indigo-600', 'dark:bg-indigo-950/60', 'dark:text-indigo-400', 'border-indigo-500');
                    t.classList.add('text-slate-500', 'hover:text-slate-700', 'dark:text-slate-400', 'border-transparent');
                });
                tab.classList.add('bg-indigo-50', 'text-indigo-600', 'dark:bg-indigo-950/60', 'dark:text-indigo-400', 'border-indigo-500');
                tab.classList.remove('text-slate-500', 'hover:text-slate-700', 'dark:text-slate-400', 'border-transparent');

                this.applyFilters();
            });
        });
    }

    initSearch() {
        if (!this.searchInput) return;

        let debounceTimer;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.searchQuery = e.target.value;
                this.applyFilters();
            }, 250);
        });
    }

    initCheckboxes() {
        // Master checkbox
        if (this.selectAllCheckbox) {
            this.selectAllCheckbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                const startIndex = (this.currentPage - 1) * this.pageSize;
                const endIndex = startIndex + this.pageSize;
                const pageItems = this.filteredUsers.slice(startIndex, endIndex);

                pageItems.forEach(user => {
                    if (isChecked) {
                        this.selectedIds.add(user.id);
                    } else {
                        this.selectedIds.delete(user.id);
                    }
                });

                this.renderTable();
                this.updateBulkBar();
            });
        }

        // Row checkbox event delegation
        if (this.tbody) {
            this.tbody.addEventListener('change', (e) => {
                if (e.target.classList.contains('row-checkbox')) {
                    const id = parseInt(e.target.value);
                    if (e.target.checked) {
                        this.selectedIds.add(id);
                    } else {
                        this.selectedIds.delete(id);
                    }
                    this.updateSelectAllCheckboxState();
                    this.updateBulkBar();
                }
            });
        }
    }

    updateSelectAllCheckboxState() {
        if (!this.selectAllCheckbox) return;
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageItems = this.filteredUsers.slice(startIndex, endIndex);

        if (pageItems.length === 0) {
            this.selectAllCheckbox.checked = false;
            return;
        }

        const allChecked = pageItems.every(u => this.selectedIds.has(u.id));
        this.selectAllCheckbox.checked = allChecked;
    }

    updateBulkBar() {
        if (!this.floatingBar) return;
        const count = this.selectedIds.size;

        if (count > 0) {
            this.floatingBar.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
            this.floatingBar.classList.add('translate-y-0', 'opacity-100');
            if (this.selectedCountText) {
                this.selectedCountText.innerText = `Đã chọn ${count} bản ghi`;
            }
        } else {
            this.floatingBar.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
            this.floatingBar.classList.remove('translate-y-0', 'opacity-100');
        }
    }

    initBulkActions() {
        const cancelBulkBtn = document.getElementById('cancel-bulk-btn');
        if (cancelBulkBtn) {
            cancelBulkBtn.addEventListener('click', () => {
                this.selectedIds.clear();
                this.renderTable();
                this.updateBulkBar();
            });
        }

        const deleteBulkBtn = document.getElementById('delete-bulk-btn');
        if (deleteBulkBtn) {
            deleteBulkBtn.addEventListener('click', async () => {
                const count = this.selectedIds.size;
                const confirmed = await AlertModule.confirmAction({
                    title: `Xoá ${count} bản ghi đã chọn?`,
                    text: 'Hành động này sẽ xoá vĩnh viễn các mục đã chọn khỏi hệ thống!',
                    confirmText: 'Xoá tất cả'
                });

                if (confirmed) {
                    await ApiService.simulateRequest(() => {
                        this.users = this.users.filter(u => !this.selectedIds.has(u.id));
                        this.selectedIds.clear();
                        this.applyFilters();
                    }, 350);

                    AlertModule.showToast('success', `Đã xoá ${count} bản ghi thành công!`);
                }
            });
        }
    }

    initRowActionListeners() {
        if (!this.tbody) return;

        this.tbody.addEventListener('click', async (e) => {
            // Xem chi tiết
            const viewBtn = e.target.closest('.view-user-btn');
            if (viewBtn) {
                const id = parseInt(viewBtn.getAttribute('data-id'));
                const user = this.users.find(u => u.id === id);
                if (user) eventBus.emit('user:view', user);
                return;
            }

            // Chỉnh sửa
            const editBtn = e.target.closest('.edit-user-btn');
            if (editBtn) {
                const id = parseInt(editBtn.getAttribute('data-id'));
                const user = this.users.find(u => u.id === id);
                if (user) eventBus.emit('user:edit', user);
                return;
            }

            // Xoá bản ghi
            const deleteBtn = e.target.closest('.delete-user-btn');
            if (deleteBtn) {
                const id = parseInt(deleteBtn.getAttribute('data-id'));
                const name = deleteBtn.getAttribute('data-name') || 'người dùng';

                const confirmed = await AlertModule.confirmAction({
                    title: `Xoá "${name}"?`,
                    text: 'Dữ liệu của người dùng này sẽ bị gỡ bỏ vĩnh viễn!',
                    confirmText: 'Xác nhận xoá'
                });

                if (confirmed) {
                    await ApiService.simulateRequest(() => {
                        this.users = this.users.filter(u => u.id !== id);
                        this.applyFilters();
                    }, 300);

                    AlertModule.showToast('success', `Đã xoá người dùng "${name}" thành công!`);
                }
            }
        });
    }

    initPagination() {
        if (this.prevPageBtn) {
            this.prevPageBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderTable();
                }
            });
        }

        if (this.nextPageBtn) {
            this.nextPageBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderTable();
                }
            });
        }
    }

    updatePaginationUI() {
        const totalItems = this.filteredUsers.length;
        const totalPages = Math.ceil(totalItems / this.pageSize) || 1;
        const start = totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, totalItems);

        if (this.paginationInfo) {
            this.paginationInfo.innerText = `Hiển thị ${start} - ${end} trong tổng số ${totalItems} bản ghi`;
        }

        if (this.prevPageBtn) {
            this.prevPageBtn.disabled = this.currentPage <= 1;
            this.prevPageBtn.classList.toggle('opacity-50', this.currentPage <= 1);
            this.prevPageBtn.classList.toggle('cursor-not-allowed', this.currentPage <= 1);
        }

        if (this.nextPageBtn) {
            this.nextPageBtn.disabled = this.currentPage >= totalPages;
            this.nextPageBtn.classList.toggle('opacity-50', this.currentPage >= totalPages);
            this.nextPageBtn.classList.toggle('cursor-not-allowed', this.currentPage >= totalPages);
        }
    }
}
