<!DOCTYPE html>
<html lang="vi" class="h-full bg-slate-950 text-slate-100">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Maintenance Console - TechWiz</title>
    <script src="https://cdn.tailwindcss.com"></script>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-full flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto w-full">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-rose-500 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                    ⚡
                </div>
                <div>
                    <h1 class="text-2xl font-black tracking-tight text-white">Database Maintenance Console</h1>
                    <p class="text-xs text-slate-400">Công cụ quản trị & chạy migrate an toàn trên môi trường Cloud (Render Free)</p>
                </div>
            </div>
            <div>
                @if($isConfigured)
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Đã cấu hình mật khẩu bảo mật
                    </span>
                @else
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <span class="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                        Chưa cấu hình mật khẩu (.env)
                    </span>
                @endif
            </div>
        </div>

        <!-- Notification Alerts -->
        @if(session('success'))
            <div class="mt-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-200 flex items-start gap-3 shadow-lg">
                <span class="text-xl">✅</span>
                <div class="text-sm font-medium leading-relaxed">{{ session('success') }}</div>
            </div>
        @endif

        @if(session('error') || $errors->any())
            <div class="mt-6 p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-200 flex items-start gap-3 shadow-lg">
                <span class="text-xl">⚠️</span>
                <div class="text-sm font-medium leading-relaxed">
                    {{ session('error') ?? $errors->first() }}
                </div>
            </div>
        @endif

        <!-- Action Cards Grid (3 Columns on large screens) -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Card 1: Migrate Normal (Safe Update) -->
            <div class="bg-slate-900/80 border border-indigo-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur flex flex-col justify-between">
                <div class="absolute -right-8 -top-8 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                            An toàn
                        </span>
                        <h2 class="text-base font-bold text-white">Chạy Migrate mới</h2>
                    </div>
                    <p class="text-xs text-slate-400 leading-relaxed mb-6">
                        Chạy các file migration mới thêm mà <strong class="text-emerald-400">giữ nguyên toàn bộ dữ liệu</strong> hiện có.
                    </p>

                    <form action="{{ route('db.maintenance.migrate') }}" method="POST">
                        @csrf
                        <div class="space-y-4">
                            <div>
                                <label for="password_migrate" class="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Mật khẩu xác thực
                                </label>
                                <input type="password" name="password" id="password_migrate" required placeholder="Nhập admin secret"
                                    class="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                            </div>

                            <div class="pt-6">
                                <button type="submit"
                                    class="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm rounded-lg shadow-lg shadow-indigo-900/30 transition duration-150 flex items-center justify-center gap-2">
                                    <span>🚀</span> Chạy Migrate mới
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Card 2: Migrate Fresh (Reset & Re-run) -->
            <div class="bg-slate-900/80 border border-rose-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur flex flex-col justify-between">
                <div class="absolute -right-8 -top-8 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-wider">
                            Nguy hiểm
                        </span>
                        <h2 class="text-base font-bold text-white">Reset & Chạy lại</h2>
                    </div>
                    <p class="text-xs text-slate-400 leading-relaxed mb-6">
                        Xoá <strong class="text-rose-400">sạch toàn bộ bảng</strong> và tự động chạy lại migrations từ đầu.
                    </p>

                    <form action="{{ route('db.maintenance.fresh') }}" method="POST" onsubmit="return confirm('CẢNH BÁO NGUY HIỂM:\n\nToàn bộ bảng và dữ liệu trong Database sẽ bị DROP sạch sẽ và chạy lại từ đầu!\n\nBạn có chắc chắn 100% muốn thực hiện không?');">
                        @csrf
                        <div class="space-y-4">
                            <div>
                                <label for="password_fresh" class="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Mật khẩu xác thực
                                </label>
                                <input type="password" name="password" id="password_fresh" required placeholder="Nhập admin secret"
                                    class="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition">
                            </div>

                            <div class="flex items-center gap-2 pt-1">
                                <input type="checkbox" name="seed" id="seed_checkbox" value="1" checked
                                    class="w-4 h-4 rounded bg-slate-950 border-slate-700 text-rose-600 focus:ring-rose-500 focus:ring-offset-slate-900">
                                <label for="seed_checkbox" class="text-xs text-slate-300 font-medium select-none cursor-pointer">
                                    Nạp Seeder mẫu (<code class="text-rose-400">--seed</code>)
                                </label>
                            </div>

                            <button type="submit"
                                class="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm rounded-lg shadow-lg shadow-rose-900/30 transition duration-150 flex items-center justify-center gap-2">
                                <span>💣</span> Reset (migrate:fresh)
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Card 3: Migrate Rollback -->
            <div class="bg-slate-900/80 border border-amber-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur flex flex-col justify-between">
                <div class="absolute -right-8 -top-8 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                            Cảnh báo
                        </span>
                        <h2 class="text-base font-bold text-white">Hoàn tác (Rollback)</h2>
                    </div>
                    <p class="text-xs text-slate-400 leading-relaxed mb-6">
                        Hoàn tác lại batch migration gần nhất theo số bước chỉ định.
                    </p>

                    <form action="{{ route('db.maintenance.rollback') }}" method="POST" onsubmit="return confirm('Bạn có chắc chắn muốn rollback các migration gần nhất không?');">
                        @csrf
                        <div class="space-y-4">
                            <div>
                                <label for="password_rollback" class="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Mật khẩu xác thực
                                </label>
                                <input type="password" name="password" id="password_rollback" required placeholder="Nhập admin secret"
                                    class="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition">
                            </div>

                            <div>
                                <label for="step_input" class="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Số bước Rollback (<code class="text-amber-400">--step</code>)
                                </label>
                                <input type="number" name="step" id="step_input" min="1" max="50" value="1"
                                    class="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition">
                            </div>

                            <button type="submit"
                                class="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm rounded-lg shadow-lg shadow-amber-900/30 transition duration-150 flex items-center justify-center gap-2">
                                <span>↩️</span> Thực thi Rollback
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Terminal Output Viewer -->
        <div class="mt-8 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
            <!-- Terminal Header -->
            <div class="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span class="ml-2 text-xs font-mono text-slate-400">artisan@render:~$ {{ session('command') ?? 'chờ lệnh thực thi...' }}</span>
                </div>
                <span class="text-xs text-slate-500 font-mono">Terminal Console</span>
            </div>

            <!-- Terminal Body -->
            <div class="p-4 font-mono text-xs overflow-x-auto min-h-[140px] max-h-[350px] bg-slate-950/95 leading-relaxed">
                @if(session('output'))
                    <pre class="text-emerald-400 whitespace-pre-wrap">{{ session('output') }}</pre>
                @else
                    <p class="text-slate-600 italic">// Chưa có lệnh nào được thực thi trong phiên này.</p>
                    <p class="text-slate-600 italic">// Chọn 1 trong 3 thao tác phía trên, nhập mật khẩu và bấm nút để xem log chi tiết tại đây.</p>
                @endif
            </div>
        </div>

        <!-- Footer / Safety note -->
        <div class="mt-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>🛡️ Bảo vệ bằng mật khẩu <code>DATABASE_REFRESH_MIGRATE_PASSWORD</code></span>
            <span class="hidden sm:inline">•</span>
            <span>⏱️ Rate limit: Tối đa 5 lần thử / phút</span>
        </div>
    </div>
</body>
</html>
