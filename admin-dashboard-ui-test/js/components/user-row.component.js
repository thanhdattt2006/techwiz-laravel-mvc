import { renderStatusBadge } from './status-badge.component.js';

/**
 * Component: UserRowComponent
 * Tuân thủ Single Responsibility & DRY: Render 1 dòng bảng dữ liệu Data Table
 */
export function renderUserRow(user) {
    return `
        <tr class="hover:bg-slate-50/75 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/80 group" data-user-id="${user.id}">
            <!-- Checkbox -->
            <td class="pl-6 pr-3 py-4 w-12">
                <input type="checkbox" value="${user.id}" class="row-checkbox rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500/20 w-4 h-4 cursor-pointer">
            </td>

            <!-- Người dùng: Avatar + Tên + Email -->
            <td class="px-3 py-4">
                <div class="flex items-center gap-3">
                    <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800">
                    <div>
                        <div class="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer view-user-btn" data-id="${user.id}">
                            ${user.name}
                        </div>
                        <div class="text-xs text-slate-400 dark:text-slate-500">${user.email}</div>
                    </div>
                </div>
            </td>

            <!-- Vai trò -->
            <td class="px-3 py-4 text-sm text-slate-600 dark:text-slate-300">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.roleBadge}">
                    ${user.role}
                </span>
            </td>

            <!-- Trạng thái -->
            <td class="px-3 py-4">
                ${renderStatusBadge(user.status)}
            </td>

            <!-- Ngày tạo -->
            <td class="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                ${user.createdAt}
            </td>

            <!-- Thao tác (Action Buttons) -->
            <td class="pl-3 pr-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                    <!-- Nút Xem chi tiết (Mở slide-over) -->
                    <button class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors view-user-btn" data-id="${user.id}" title="Xem chi tiết">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>

                    <!-- Nút Chỉnh sửa (Mở modal) -->
                    <button class="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors edit-user-btn" data-id="${user.id}" title="Chỉnh sửa">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>

                    <!-- Nút Xoá (Có confirm SweetAlert2) -->
                    <button class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors delete-user-btn" data-id="${user.id}" data-name="${user.name}" title="Xoá bản ghi">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `;
}
