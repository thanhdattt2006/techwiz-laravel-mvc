<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-950 text-slate-100">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Maintenance Console</title>
    <script src="https://cdn.tailwindcss.com"></script>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-full flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="max-w-5xl mx-auto w-full">
        <!-- Top Bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-xl shadow">
                    ⚡
                </div>
                <div>
                    <h1 class="text-xl font-bold tracking-tight text-white">Database Maintenance Console</h1>
                    <p class="text-xs text-slate-400">Database migration operations for cloud deployment (Render)</p>
                </div>
            </div>
            <div>
                @if($isConfigured)
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Password Configured
                    </span>
                @else
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <span class="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                        Password Missing in .env
                    </span>
                @endif
            </div>
        </div>

        <!-- Flash Messages -->
        @if(session('success'))
            <div class="mt-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 text-sm flex items-start gap-3">
                <span>✓</span>
                <div class="font-medium">{{ session('success') }}</div>
            </div>
        @endif

        @if(session('error') || $errors->any())
            <div class="mt-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-sm flex items-start gap-3">
                <span>⚠</span>
                <div class="font-medium">{{ session('error') ?? $errors->first() }}</div>
            </div>
        @endif

        <!-- Action Cards Grid -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Card 1: Run Migrations -->
            <div class="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition shadow-lg">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-sm font-bold text-white">Run Migrations</h2>
                        <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            Safe
                        </span>
                    </div>
                    <p class="text-xs text-slate-400 leading-relaxed mb-5">
                        Execute new pending migration files without altering existing data.
                    </p>

                    <form action="{{ route('db.maintenance.migrate') }}" method="POST">
                        @csrf
                        <div class="space-y-3">
                            <div>
                                <label for="password_migrate" class="block text-xs font-medium text-slate-300 mb-1">
                                    Admin Password
                                </label>
                                <input type="password" name="password" id="password_migrate" required placeholder="Enter maintenance password"
                                    class="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition">
                            </div>

                            <div class="pt-2">
                                <button type="submit"
                                    class="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow transition duration-150">
                                    Run Migrations
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Card 2: Migrate Fresh (Reset) -->
            <div class="bg-slate-900/60 border border-rose-950/60 hover:border-rose-900/80 rounded-xl p-5 flex flex-col justify-between transition shadow-lg">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-sm font-bold text-white">Reset Database (migrate:fresh)</h2>
                        <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Destructive
                        </span>
                    </div>
                    <p class="text-xs text-slate-400 leading-relaxed mb-5">
                        Drop all tables and re-run all migrations from scratch.
                    </p>

                    <form action="{{ route('db.maintenance.fresh') }}" method="POST" onsubmit="return confirm('WARNING: This will drop ALL tables and wipe the database completely. Are you sure you want to proceed?');">
                        @csrf
                        <div class="space-y-3">
                            <div>
                                <label for="password_fresh" class="block text-xs font-medium text-slate-300 mb-1">
                                    Admin Password
                                </label>
                                <input type="password" name="password" id="password_fresh" required placeholder="Enter maintenance password"
                                    class="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition">
                            </div>

                            <div class="flex items-center gap-2 pt-1">
                                <input type="checkbox" name="seed" id="seed_checkbox" value="1" checked
                                    class="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-rose-600 focus:ring-rose-500">
                                <label for="seed_checkbox" class="text-xs text-slate-300 select-none cursor-pointer">
                                    Seed test data (<code class="text-rose-400 text-[11px]">--seed</code>)
                                </label>
                            </div>

                            <button type="submit"
                                class="w-full py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg shadow transition duration-150">
                                Reset Database (Fresh)
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Card 3: Rollback -->
            <div class="bg-slate-900/60 border border-amber-950/60 hover:border-amber-900/80 rounded-xl p-5 flex flex-col justify-between transition shadow-lg">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-sm font-bold text-white">Rollback Migrations</h2>
                        <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Reversible
                        </span>
                    </div>
                    <p class="text-xs text-slate-400 leading-relaxed mb-5">
                        Roll back the latest database migration batch by step count.
                    </p>

                    <form action="{{ route('db.maintenance.rollback') }}" method="POST" onsubmit="return confirm('Are you sure you want to rollback the latest migrations?');">
                        @csrf
                        <div class="space-y-3">
                            <div>
                                <label for="password_rollback" class="block text-xs font-medium text-slate-300 mb-1">
                                    Admin Password
                                </label>
                                <input type="password" name="password" id="password_rollback" required placeholder="Enter maintenance password"
                                    class="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition">
                            </div>

                            <div>
                                <label for="step_input" class="block text-xs font-medium text-slate-300 mb-1">
                                    Step Count (<code class="text-amber-400 text-[11px]">--step</code>)
                                </label>
                                <input type="number" name="step" id="step_input" min="1" max="50" value="1"
                                    class="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition">
                            </div>

                            <button type="submit"
                                class="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg shadow transition duration-150">
                                Rollback Migrations
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Terminal Console -->
        <div class="mt-8 rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
            <div class="bg-slate-900/90 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                <div class="flex items-center gap-2">
                    <div class="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <span class="ml-2 text-xs font-mono text-slate-400">artisan@render:~$ {{ session('command') ?? 'idle' }}</span>
                </div>
                <span class="text-[11px] text-slate-500 font-mono">Console Output</span>
            </div>

            <div class="p-4 font-mono text-xs overflow-x-auto min-h-[120px] max-h-[300px] bg-slate-950 leading-relaxed">
                @if(session('output'))
                    <pre class="text-emerald-400 whitespace-pre-wrap">{{ session('output') }}</pre>
                @else
                    <p class="text-slate-600">// No command executed yet.</p>
                    <p class="text-slate-600">// Choose an action above, enter the password, and click the button to view the Artisan output here.</p>
                @endif
            </div>
        </div>

        <!-- Security Note -->
        <div class="mt-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>🛡️ Protected by <code>DATABASE_REFRESH_MIGRATE_PASSWORD</code></span>
            <span class="hidden sm:inline">•</span>
            <span>⏱️ Rate limit: Max 5 attempts / minute</span>
        </div>
    </div>
</body>
</html>
