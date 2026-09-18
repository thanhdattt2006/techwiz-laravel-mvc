/**
 * Component: ActivityItemComponent
 * Tuân thủ Single Responsibility: Render một item timeline hoạt động gần đây
 */
export function renderActivityItem(activity) {
    return `
        <div class="relative pl-6 pb-6 last:pb-0 group">
            <!-- Đường kẻ dọc -->
            <div class="absolute left-2.5 top-3 -bottom-3 w-px bg-slate-200 dark:bg-slate-800 group-last:hidden"></div>

            <!-- Chấm tròn -->
            <div class="absolute left-1 top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${activity.color}"></div>

            <div class="flex items-start justify-between gap-2">
                <div>
                    <span class="font-medium text-slate-800 dark:text-slate-200 text-sm">${activity.user}</span>
                    <span class="text-slate-500 dark:text-slate-400 text-sm"> ${activity.action}</span>
                </div>
                <span class="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">${activity.time}</span>
            </div>
        </div>
    `;
}
