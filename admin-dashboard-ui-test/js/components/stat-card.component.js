/**
 * Component: StatCardComponent
 * Tuân thủ Single Responsibility: Render thẻ thống kê KPI kèm canvas sparkline
 */
export function renderStatCard(stat) {
    const changeBadgeClass = stat.isPositive
        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400'
        : 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-400';

    return `
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-slate-500 dark:text-slate-400">${stat.title}</span>
                <div class="w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}">
                    ${stat.icon}
                </div>
            </div>

            <div class="mt-4 flex items-baseline justify-between">
                <div>
                    <h3 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">${stat.value}</h3>
                    <div class="mt-1 flex items-center gap-1.5">
                        <span class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ${changeBadgeClass}">
                            ${stat.change}
                        </span>
                        <span class="text-xs text-slate-400 dark:text-slate-500">vs tuần trước</span>
                    </div>
                </div>

                <!-- Mini Sparkline Canvas -->
                <div class="w-20 h-10">
                    <canvas id="sparkline-${stat.id}" width="80" height="40"></canvas>
                </div>
            </div>
        </div>
    `;
}
