import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Download, TrendingUp, PieChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const MOCK_CHART_TIMEFRAMES = {
  '7d': {
    labels: ['Mon (Prep)', 'Tue (Stock)', 'Wed (Orders)', 'Thu (Orders)', 'Fri (Harvest)', 'Sat (Market Day)', 'Sun (Wrap)'],
    preOrders: [38, 52, 94, 142, 260, 480, 160],
    revenue: [950, 1320, 2480, 3950, 7120, 14200, 4420],
  },
  '30d': {
    labels: ['Week 1 (Oct 1-7)', 'Week 2 (Oct 8-14)', 'Week 3 (Oct 15-21)', 'Week 4 (Oct 22-28)'],
    preOrders: [890, 1120, 1280, 1420],
    revenue: [22400, 29800, 34500, 38650],
  },
  '12m': {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    preOrders: [420, 510, 680, 950, 1180, 1340, 1410, 1490, 1530, 1420],
    revenue: [11200, 13800, 18500, 26400, 31900, 36200, 38100, 40200, 41500, 38650],
  },
};

const CATEGORY_DISTRIBUTION = {
  labels: ['Heirloom Vegetables & Greens', 'Tree-Ripened Fruits', 'Farmstead Raw Dairy & Cheeses', 'Wildflower Honey & Bakes'],
  data: [42, 28, 18, 12],
  colors: ['#16A34A', '#3B82F6', '#F59E0B', '#8B5CF6'],
};

export default function AdminAnalyticsCharts() {
  const [timeframe, setTimeframe] = useState('7d');
  const lineChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const lineInstanceRef = useRef(null);
  const donutInstanceRef = useRef(null);

  // 1. Line/Area Chart (Pre-orders & Estimated Cash Volume)
  useEffect(() => {
    if (!lineChartRef.current) return;
    const ctx = lineChartRef.current.getContext('2d');

    if (lineInstanceRef.current) {
      lineInstanceRef.current.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, 'rgba(22, 163, 74, 0.28)');
    gradient.addColorStop(1, 'rgba(22, 163, 74, 0.0)');

    const activeData = MOCK_CHART_TIMEFRAMES[timeframe];

    lineInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: activeData.labels,
        datasets: [
          {
            label: 'Estimated In-Person Cash ($)',
            data: activeData.revenue,
            borderColor: '#16A34A',
            backgroundColor: gradient,
            borderWidth: 2.5,
            fill: true,
            tension: 0.38,
            pointBackgroundColor: '#16A34A',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'yRevenue',
          },
          {
            label: 'Pre-Order Hold Slots',
            data: activeData.preOrders,
            borderColor: '#3B82F6',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.38,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 3.5,
            pointHoverRadius: 5.5,
            yAxisID: 'yOrders',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              font: {
                size: 11,
                weight: '600',
              },
              color: '#475569',
            },
          },
          tooltip: {
            backgroundColor: '#0F172A',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 11 },
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label(context) {
                const label = context.dataset.label || '';
                const val = context.parsed.y;
                if (label.includes('($)')) {
                  return ` ${label}: $${val.toLocaleString()}`;
                }
                return ` ${label}: ${val} orders`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(226, 232, 240, 0.6)',
            },
            ticks: {
              font: { size: 10 },
              color: '#475569',
            },
          },
          yRevenue: {
            type: 'linear',
            position: 'left',
            grid: {
              color: 'rgba(226, 232, 240, 0.6)',
            },
            ticks: {
              font: { size: 10 },
              color: '#16A34A',
              callback(value) {
                return `$${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`;
              },
            },
          },
          yOrders: {
            type: 'linear',
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              font: { size: 10 },
              color: '#3B82F6',
              callback(value) {
                return `${value} slots`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (lineInstanceRef.current) {
        lineInstanceRef.current.destroy();
      }
    };
  }, [timeframe]);

  // 2. Donut Chart (Category Distribution)
  useEffect(() => {
    if (!donutChartRef.current) return;
    const ctx = donutChartRef.current.getContext('2d');

    if (donutInstanceRef.current) {
      donutInstanceRef.current.destroy();
    }

    donutInstanceRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        labels: CATEGORY_DISTRIBUTION.labels,
        datasets: [
          {
            data: CATEGORY_DISTRIBUTION.data,
            backgroundColor: CATEGORY_DISTRIBUTION.colors,
            borderWidth: 2,
            borderColor: '#FFFFFF',
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#0F172A',
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label(context) {
                return ` ${context.label}: ${context.raw}% of pre-orders`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (donutInstanceRef.current) {
        donutInstanceRef.current.destroy();
      }
    };
  }, []);

  // Export Chart Image
  const handleExportChart = () => {
    if (!lineChartRef.current) return;
    const imageURL = lineChartRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = imageURL;
    a.download = `marketlink-growth-analytics-${timeframe}.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Chart Headers & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart: Pre-Orders & Estimated Volume */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8DF] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8DF]">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#16A34A]" />
                <h3 className="font-bold text-sm text-[#0F172A]">
                  Pre-Order Hold Volumes & Estimated Cash Settlements
                </h3>
              </div>
              <p className="text-[11px] text-[#475569]">
                Live timeline of reservation hold slots vs in-person cash settlement estimates
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 rounded-xl bg-[#F8FAF6] border border-[#E2E8DF] text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setTimeframe('7d')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    timeframe === '7d'
                      ? 'bg-[#16A34A] text-white shadow-2xs'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setTimeframe('30d')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    timeframe === '30d'
                      ? 'bg-[#16A34A] text-white shadow-2xs'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  30 Days
                </button>
                <button
                  type="button"
                  onClick={() => setTimeframe('12m')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    timeframe === '12m'
                      ? 'bg-[#16A34A] text-white shadow-2xs'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  12 Months
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportChart}
                className="p-1.5 rounded-xl border border-[#E2E8DF] hover:bg-slate-50 text-slate-500 hover:text-[#0F172A] transition cursor-pointer"
                title="Download Chart as PNG"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="h-64 sm:h-72 w-full relative">
            <canvas ref={lineChartRef} />
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-[#475569] pt-2 border-t border-[#E2E8DF]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#16A34A]" />
                Estimated In-Person Cash Settlement
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#3B82F6]" />
                Pre-Order Holds
              </span>
            </div>
            <span className="font-mono text-emerald-800 font-bold">
              ✓ Peak Harvest Surge: Saturday Mornings
            </span>
          </div>
        </div>

        {/* Donut Chart: Produce Category Distribution */}
        <div className="bg-white border border-[#E2E8DF] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-[#0F172A]">Produce Demand Split</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-[#16A34A] border border-emerald-200">
                Chicago Market
              </span>
            </div>
            <p className="text-[11px] text-[#475569] mt-1">
              Pre-order reservations by agricultural category
            </p>

            {/* Donut Canvas */}
            <div className="h-44 sm:h-48 relative my-3 flex items-center justify-center">
              <canvas ref={donutChartRef} />
              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-[#0F172A]">1,420</span>
                <span className="text-[10px] text-[#475569] font-medium">Holds / Mo</span>
              </div>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="space-y-1.5 pt-3 border-t border-[#E2E8DF] text-xs">
            {CATEGORY_DISTRIBUTION.labels.map((label, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_DISTRIBUTION.colors[idx] }}
                  />
                  <span className="text-[#475569] truncate max-w-[150px]">{label}</span>
                </div>
                <span className="font-mono font-bold text-[#0F172A]">
                  {CATEGORY_DISTRIBUTION.data[idx]}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
