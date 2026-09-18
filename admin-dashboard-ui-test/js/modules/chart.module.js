import { CHART_CONFIG } from '../config/chart.config.js';
import { MOCK_CHART_DATA } from '../data/mock-charts.js';
import { MOCK_STATS } from '../data/mock-stats.js';
import { ApiService } from '../services/api.service.js';
import { AlertModule } from './alert.module.js';
import { eventBus } from '../services/event-bus.js';

/**
 * Module: ChartModule
 * Tuân thủ Single Responsibility: Khởi tạo và điều khiển toàn bộ biểu đồ Chart.js & Canvas
 */
export class ChartModule {
    constructor() {
        this.revenueChartInstance = null;
        this.donutChartInstance = null;
        this.sparklineInstances = [];
        this.currentTimeframe = '7d';
    }

    init() {
        if (!window.Chart) {
            console.warn('[ChartModule] Thư viện Chart.js chưa được tải!');
            return;
        }

        // Cấu hình font mặc định toàn cục
        window.Chart.defaults.font.family = CHART_CONFIG.FONT_FAMILY;

        this.initRevenueChart();
        this.initDonutChart();
        this.initSparklines();
        this.initTimeframeButtons();
        this.initExportButton();

        // Lắng nghe đổi theme để update grid màu tương ứng
        eventBus.on('theme:changed', () => this.handleThemeChange());
    }

    initRevenueChart() {
        const canvas = document.getElementById('revenueChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const gradientRevenue = ctx.createLinearGradient(0, 0, 0, 320);
        gradientRevenue.addColorStop(0, CHART_CONFIG.PALETTE.REVENUE.GRADIENT_START);
        gradientRevenue.addColorStop(1, CHART_CONFIG.PALETTE.REVENUE.GRADIENT_END);

        const data = MOCK_CHART_DATA.revenue[this.currentTimeframe];

        this.revenueChartInstance = new window.Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Doanh thu (triệu đ)',
                        data: data.revenue,
                        borderColor: CHART_CONFIG.PALETTE.REVENUE.BORDER,
                        backgroundColor: gradientRevenue,
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: CHART_CONFIG.PALETTE.REVENUE.BORDER,
                        pointHoverBorderColor: '#ffffff',
                        pointHoverBorderWidth: 2,
                    },
                    {
                        label: 'Đơn hàng',
                        data: data.orders,
                        borderColor: CHART_CONFIG.PALETTE.ORDERS.BORDER,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: CHART_CONFIG.PALETTE.ORDERS.BORDER,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'end',
                        labels: {
                            boxWidth: 12,
                            boxHeight: 12,
                            usePointStyle: true,
                            color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b',
                        }
                    },
                    tooltip: {
                        backgroundColor: CHART_CONFIG.TOOLTIP.BACKGROUND,
                        padding: CHART_CONFIG.TOOLTIP.PADDING,
                        cornerRadius: CHART_CONFIG.TOOLTIP.CORNER_RADIUS,
                        titleColor: CHART_CONFIG.TOOLTIP.TITLE_COLOR,
                        bodyColor: CHART_CONFIG.TOOLTIP.BODY_COLOR,
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: document.documentElement.classList.contains('dark') ? '#64748b' : '#94a3b8'
                        }
                    },
                    y: {
                        border: { dash: [4, 4] },
                        grid: {
                            color: document.documentElement.classList.contains('dark')
                                ? CHART_CONFIG.PALETTE.GRID_DARK
                                : CHART_CONFIG.PALETTE.GRID_LIGHT
                        },
                        ticks: {
                            color: document.documentElement.classList.contains('dark') ? '#64748b' : '#94a3b8'
                        }
                    }
                }
            }
        });
    }

    initDonutChart() {
        const canvas = document.getElementById('donutChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = MOCK_CHART_DATA.categoryDistribution;

        this.donutChartInstance = new window.Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: CHART_CONFIG.PALETTE.DONUT,
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: CHART_CONFIG.TOOLTIP.BACKGROUND,
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => ` ${context.label}: ${context.raw}%`
                        }
                    }
                }
            }
        });
    }

    initSparklines() {
        MOCK_STATS.forEach(stat => {
            const canvas = document.getElementById(`sparkline-${stat.id}`);
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const sparkline = new window.Chart(ctx, {
                type: 'line',
                data: {
                    labels: stat.sparklineData.map((_, i) => i),
                    datasets: [{
                        data: stat.sparklineData,
                        borderColor: stat.sparklineColor,
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.4,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    }
                }
            });

            this.sparklineInstances.push(sparkline);
        });
    }

    initTimeframeButtons() {
        const buttons = document.querySelectorAll('.timeframe-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const timeframe = btn.getAttribute('data-range');
                if (timeframe === this.currentTimeframe) return;

                // Active button UI state
                buttons.forEach(b => {
                    b.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
                    b.classList.add('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
                });
                btn.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
                btn.classList.remove('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');

                this.currentTimeframe = timeframe;

                // Mô phỏng gọi AJAX bất đồng bộ nạp data mới
                await ApiService.simulateRequest(() => {
                    const newData = MOCK_CHART_DATA.revenue[timeframe];
                    if (this.revenueChartInstance && newData) {
                        this.revenueChartInstance.data.labels = newData.labels;
                        this.revenueChartInstance.data.datasets[0].data = newData.revenue;
                        this.revenueChartInstance.data.datasets[1].data = newData.orders;
                        this.revenueChartInstance.update('active');
                    }
                }, 300);

                AlertModule.showToast('info', `Đã cập nhật biểu đồ theo mốc ${timeframe.toUpperCase()}`);
            });
        });
    }

    initExportButton() {
        const exportBtn = document.getElementById('export-chart-btn');
        if (!exportBtn) return;

        exportBtn.addEventListener('click', () => {
            const canvas = document.getElementById('revenueChart');
            if (!canvas) return;

            const imageURI = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.download = `bieu-do-doanh-thu-${new Date().toISOString().split('T')[0]}.png`;
            link.href = imageURI;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            AlertModule.showToast('success', 'Đã tải ảnh biểu đồ Canvas thành công!');
        });
    }

    handleThemeChange() {
        const isDark = document.documentElement.classList.contains('dark');
        const gridColor = isDark ? CHART_CONFIG.PALETTE.GRID_DARK : CHART_CONFIG.PALETTE.GRID_LIGHT;
        const tickColor = isDark ? '#64748b' : '#94a3b8';

        if (this.revenueChartInstance) {
            this.revenueChartInstance.options.scales.y.grid.color = gridColor;
            this.revenueChartInstance.options.scales.x.ticks.color = tickColor;
            this.revenueChartInstance.options.scales.y.ticks.color = tickColor;
            if (this.revenueChartInstance.options.plugins.legend) {
                this.revenueChartInstance.options.plugins.legend.labels.color = isDark ? '#94a3b8' : '#64748b';
            }
            this.revenueChartInstance.update();
        }
    }
}
