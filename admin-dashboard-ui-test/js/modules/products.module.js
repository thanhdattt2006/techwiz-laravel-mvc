import { MOCK_PRODUCTS } from '../data/mock-products.js';
import { AlertModule } from './alert.module.js';
import { ApiService } from '../services/api.service.js';

/**
 * Module: ProductsModule
 * Quản lý danh mục sản phẩm, bộ lọc, xem dạng Table / Grid, thêm và xoá
 */
export class ProductsModule {
    constructor() {
        this.products = [...MOCK_PRODUCTS];
        this.filteredProducts = [...MOCK_PRODUCTS];
        this.viewMode = 'table'; // 'table' | 'grid'
        this.currentCategory = 'all';
        this.searchQuery = '';

        // DOM elements
        this.tableContainer = document.getElementById('products-table-container');
        this.gridContainer = document.getElementById('products-grid-container');
        this.tbody = document.getElementById('products-tbody');
        this.searchInput = document.getElementById('product-search-input');
        this.categoryFilter = document.getElementById('product-category-filter');
        this.tableViewBtn = document.getElementById('table-view-btn');
        this.gridViewBtn = document.getElementById('grid-view-btn');
        this.openAddModalBtn = document.getElementById('open-add-product-btn');
        this.modal = document.getElementById('add-product-modal');
        this.closeModalBtn = document.getElementById('close-product-modal-btn');
        this.cancelModalBtn = document.getElementById('cancel-product-modal-btn');
        this.form = document.getElementById('add-product-form');
    }

    init() {
        this.render();
        this.initEventListeners();
    }

    render() {
        if (this.viewMode === 'table') {
            if (this.tableContainer) this.tableContainer.classList.remove('hidden');
            if (this.gridContainer) this.gridContainer.classList.add('hidden');
            this.renderTable();
        } else {
            if (this.tableContainer) this.tableContainer.classList.add('hidden');
            if (this.gridContainer) this.gridContainer.classList.remove('hidden');
            this.renderGrid();
        }
    }

    renderTable() {
        if (!this.tbody) return;

        if (this.filteredProducts.length === 0) {
            this.tbody.innerHTML = `<tr><td colspan="7" class="py-12 text-center text-slate-400">Không tìm thấy sản phẩm phù hợp</td></tr>`;
            return;
        }

        this.tbody.innerHTML = this.filteredProducts.map(p => `
            <tr class="hover:bg-slate-50/75 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/80 transition-colors">
                <td class="pl-6 pr-3 py-4 w-12">
                    <input type="checkbox" value="${p.id}" class="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500/20 w-4 h-4 cursor-pointer">
                </td>
                <td class="px-3 py-4">
                    <div class="flex items-center gap-3">
                        <img src="${p.image}" alt="${p.name}" class="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700">
                        <div>
                            <div class="font-semibold text-slate-900 dark:text-white text-sm hover:text-indigo-600 transition-colors">${p.name}</div>
                            <div class="text-xs text-slate-400">SKU: <span class="font-mono text-slate-500 dark:text-slate-400">${p.sku}</span></div>
                        </div>
                    </div>
                </td>
                <td class="px-3 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">${p.category}</span>
                </td>
                <td class="px-3 py-4 text-sm font-bold text-slate-900 dark:text-white">
                    ${p.price}
                </td>
                <td class="px-3 py-4 text-sm text-slate-600 dark:text-slate-300">
                    <span class="font-semibold">${p.stock}</span> cái
                </td>
                <td class="px-3 py-4">
                    ${this.renderStockBadge(p.status)}
                </td>
                <td class="pl-3 pr-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-1">
                        <button class="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50" title="Chỉnh sửa">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button class="delete-product-btn p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50" data-id="${p.id}" data-name="${p.name}" title="Xoá">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderGrid() {
        if (!this.gridContainer) return;

        if (this.filteredProducts.length === 0) {
            this.gridContainer.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400">Không tìm thấy sản phẩm phù hợp</div>`;
            return;
        }

        this.gridContainer.innerHTML = this.filteredProducts.map(p => `
            <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all group">
                <div class="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 aspect-video mb-3">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    <div class="absolute top-2.5 right-2.5">
                        ${this.renderStockBadge(p.status)}
                    </div>
                </div>
                <span class="text-xs font-medium text-indigo-600 dark:text-indigo-400">${p.category}</span>
                <h4 class="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 mt-0.5">${p.name}</h4>
                <div class="mt-2 flex items-center justify-between">
                    <span class="text-base font-bold text-slate-900 dark:text-white">${p.price}</span>
                    <span class="text-xs text-slate-400">Kho: ${p.stock}</span>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span class="text-slate-400">Đã bán: ${p.salesCount}</span>
                    <button class="delete-product-btn text-rose-500 hover:text-rose-600 font-semibold" data-id="${p.id}" data-name="${p.name}">Xoá</button>
                </div>
            </div>
        `).join('');
    }

    renderStockBadge(status) {
        if (status === 'in_stock') {
            return `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Còn hàng</span>`;
        }
        if (status === 'low_stock') {
            return `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-400"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Sắp hết</span>`;
        }
        return `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-400"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Hết hàng</span>`;
    }

    applyFilters() {
        let result = [...this.products];
        if (this.currentCategory !== 'all') {
            result = result.filter(p => p.category === this.currentCategory);
        }
        if (this.searchQuery.trim() !== '') {
            const q = this.searchQuery.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
        }
        this.filteredProducts = result;
        this.render();
    }

    initEventListeners() {
        // Toggle view
        if (this.tableViewBtn) {
            this.tableViewBtn.addEventListener('click', () => {
                this.viewMode = 'table';
                this.tableViewBtn.classList.add('bg-white', 'dark:bg-slate-700', 'shadow-xs');
                this.gridViewBtn.classList.remove('bg-white', 'dark:bg-slate-700', 'shadow-xs');
                this.render();
            });
        }
        if (this.gridViewBtn) {
            this.gridViewBtn.addEventListener('click', () => {
                this.viewMode = 'grid';
                this.gridViewBtn.classList.add('bg-white', 'dark:bg-slate-700', 'shadow-xs');
                this.tableViewBtn.classList.remove('bg-white', 'dark:bg-slate-700', 'shadow-xs');
                this.render();
            });
        }

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

        // Category
        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.applyFilters();
            });
        }

        // Delete product
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.delete-product-btn');
            if (btn) {
                const id = parseInt(btn.getAttribute('data-id'));
                const name = btn.getAttribute('data-name');
                const confirmed = await AlertModule.confirmAction({
                    title: `Xoá sản phẩm "${name}"?`,
                    text: 'Sản phẩm này sẽ bị gỡ khỏi danh mục và ngừng kinh doanh!',
                    confirmText: 'Xác nhận xoá'
                });

                if (confirmed) {
                    await ApiService.simulateRequest(() => {
                        this.products = this.products.filter(p => p.id !== id);
                        this.applyFilters();
                    }, 300);
                    AlertModule.showToast('success', `Đã xoá "${name}" thành công!`);
                }
            }
        });

        // Add Product Modal
        if (this.openAddModalBtn) this.openAddModalBtn.addEventListener('click', () => this.modal?.classList.remove('hidden'));
        if (this.closeModalBtn) this.closeModalBtn.addEventListener('click', () => this.modal?.classList.add('hidden'));
        if (this.cancelModalBtn) this.cancelModalBtn.addEventListener('click', () => this.modal?.classList.add('hidden'));

        if (this.form) {
            this.form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(this.form);
                const name = formData.get('name');
                const price = formData.get('price');
                const category = formData.get('category');
                const stock = parseInt(formData.get('stock') || '0');

                const newProd = {
                    id: Date.now(),
                    name: name,
                    sku: 'PROD-' + Math.floor(1000 + Math.random() * 9000),
                    category: category,
                    price: `${parseInt(price).toLocaleString('vi-VN')} đ`,
                    priceRaw: parseInt(price),
                    stock: stock,
                    status: stock > 5 ? 'in_stock' : (stock > 0 ? 'low_stock' : 'out_of_stock'),
                    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=150&auto=format&fit=crop&q=80',
                    rating: 5.0,
                    salesCount: 0
                };

                await ApiService.simulateRequest(() => {
                    this.products.unshift(newProd);
                    this.applyFilters();
                    this.modal?.classList.add('hidden');
                    this.form.reset();
                }, 400);

                AlertModule.showToast('success', `Đã thêm sản phẩm "${name}" thành công!`);
            });
        }
    }
}
