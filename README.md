# TechWiz 7 Project: Web Solution

Dự án áp dụng mô hình phân tách hoàn toàn Client - Server:
- **Backend**: **Laravel 11/12 REST Web API** (PHP 8.4, Sanctum, Aiven MySQL, Deploy Render)
- **Frontend**: **React.js (JavaScript) + Vite + TailwindCSS** (Deploy Vercel)
- **Phân quyền 3 Roles**: `admin`, `operator` (dispatcher/staff), `user` (patient/customer)

---

## 📂 Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
Laravel_MVC/
├── backend/                  # Mã nguồn Laravel REST Web API
│   ├── app/                  # Controllers, Models, Resources, FormRequests, Middleware
│   ├── routes/api.php        # Danh sách API endpoints (/api/v1/...)
│   ├── database/             # Migrations, Seeders
│   └── Dockerfile            # Cấu hình container PHP 8.4 deploy Render
├── frontend/                 # Mã nguồn React JS (Vite) Single Page Application
│   ├── src/                  # Components, Pages (3 roles), Context, API clients
│   ├── package.json          # react-router-dom, axios, lucide-react, sweetalert2
│   └── vercel.json           # Cấu hình rewrite SPA routing trên Vercel
├── ai/                       # Tài liệu định hướng kiến trúc & conventions
│   ├── AGENTS.md             # Hướng dẫn AI và kiến trúc tổng quan
│   ├── CONVENTION.md         # Quy chuẩn code chuẩn mực (SOLID, DRY, Clean Code)
│   ├── PROGRESS.md           # Bảng theo dõi tiến độ thực tế
│   └── BUGS.md               # Sổ ghi chép và khắc phục lỗi
├── ROADMAP/                  # Lộ trình chuẩn hóa 5 ngày thi TechWiz
│   ├── Day0_Setup_DB_Deploy.md
│   ├── Day1_Analysis_Database_Design.md
│   ├── Day2_Models_Migrations.md
│   ├── Day3_Controllers_Core_Logic.md
│   ├── Day4_Views_Frontend.md
│   └── Day5_Testing_Polish.md
├── admin-dashboard-ui-test/  # Kho nguyên mẫu UI & Components tham khảo (HTML/JS/Tailwind)
├── render.yaml               # Cấu hình hạ tầng Render (IaC)
├── RULE.md                   # Luật làm việc, quy tắc Git & commit của team
└── README.md                 # Hướng dẫn cài đặt và khởi chạy dự án
```

---

## 🚀 Hướng Dẫn Khởi Chạy (Local Development)

### 1. Khởi chạy Backend (Laravel Web API)
Mở Terminal 1:
```bash
cd backend

# Cài đặt thư viện PHP
composer install

# Cấu hình môi trường
cp .env.example .env

# Tạo App Key
php artisan key:generate

# Chạy Migration & Seeder dữ liệu mẫu (3 tài khoản demo)
php artisan migrate:fresh --seed

# Khởi động server API (chạy tại http://127.0.0.1:8000)
php artisan serve
```

### 2. Khởi chạy Frontend (React JS Vite)
Mở Terminal 2:
```bash
cd frontend

# Cài đặt thư viện JavaScript
npm install

# Khởi động máy chủ phát triển Vite (chạy tại http://localhost:5173)
npm run dev
```

### 3. Kiểm Tra Kết Nối
- Backend Health Check: `http://127.0.0.1:8000/api/v1/health`
- Frontend App: `http://localhost:5173`

---

## 📝 Quy Tắc Làm Việc Của Team
- Đọc kỹ [RULE.md](RULE.md) trước khi code và commit.
- Luôn cập nhật tiến độ vào [ai/PROGRESS.md](ai/PROGRESS.md).
- Tuân thủ quy chuẩn viết code tại [ai/CONVENTION.md](ai/CONVENTION.md).
