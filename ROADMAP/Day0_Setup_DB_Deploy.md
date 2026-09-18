# DAY 0: SETUP NỀN TẢNG API, REACT VITE FRONTEND & HẠ TẦNG DEPLOY

**Mục tiêu**: Chuẩn bị 100% nền tảng công nghệ trước khi bước vào cuộc thi. Hoàn tất cấu hình Backend Laravel Web API (Sanctum, CORS, Render CI/CD) và bộ khung dự án Frontend React JS + Vite (TailwindCSS, Axios Interceptors, AuthContext, ProtectedRoute cho 3 roles), sẵn sàng kết nối và deploy tức thì khi có đề bài.

---

## Phase 0.1: Cấu Hình Backend Laravel Web API
- `[x]` Cài đặt PHP 8.4 và Composer.
- `[x]` Khởi tạo project Laravel & cấu hình `.env`.
- `[ ]` Cài đặt & cấu hình **Laravel Sanctum** (`composer require laravel/sanctum`, `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`).
- `[ ]` Cấu hình CORS (`config/cors.php`): Cho phép headers, methods `*`, origins chấp nhận `localhost:5173`, `localhost:3000` và Vercel domains (`*.vercel.app`).
- `[ ]` Tạo Controller kiểm tra sức khỏe API: `GET /api/v1/health` trả về `{ "status": "ok", "timestamp": "...", "database": "connected" }`.

## Phase 0.2: Cấu hình Kết Nối Database (Local & Aiven MySQL)
- `[x]` Cấu hình kết nối MySQL trong `.env` (hỗ trợ cả Local DB và Aiven Cloud SSL).
- `[x]` Chạy `php artisan migrate` kiểm tra kết nối DB thành công.
- `[x]` Tạo `DatabaseMaintenanceController` cho phép migrate/fresh qua endpoint an toàn (kèm secret token).

## Phase 0.3: Chuẩn Bị Hạ Tầng Deploy Backend (Render)
- `[x]` Kết nối GitHub repository với Render.com.
- `[x]` Cấu hình file `render.yaml` (IaC - Web Service PHP, build command, start command Nginx/Apache).
- `[x]` Thiết lập biến môi trường trên Render (`APP_KEY`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `APP_ENV=production`, `APP_DEBUG=false`).
- `[x]` Test URL live backend trên Render (`https://xxxx.onrender.com/api/v1/health`).

---

## Phase 0.4: Khởi Tạo Dự Án Frontend React JS (Vite)
- `[x]` Khởi tạo dự án React Vite bằng JavaScript: `npm create vite@latest frontend -- --template react`.
- `[x]` Cài đặt các thư viện Frontend cốt lõi:
  - `npm install react-router-dom axios lucide-react sweetalert2`
  - `npm install -D tailwindcss @tailwindcss/vite` (hoặc PostCSS Tailwind v4)
- `[x]` Cấu hình biến môi trường Frontend `.env`:
  ```env
  VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
  ```
  (Khi deploy Vercel cấu hình biến này trỏ về link live Render: `https://xxxx.onrender.com/api/v1`).

## Phase 0.5: Xây Dựng Kiến Trúc Axios & Auth Context
- `[ ]` Tạo `src/api/axiosClient.js`:
  - Cấu hình `baseURL: import.meta.env.VITE_API_BASE_URL`.
  - Request Interceptor: Tự động đính `Authorization: Bearer <token>` từ `localStorage`.
  - Response Interceptor: Bắt lỗi toàn cục, tự động redirect về `/login` nếu gặp HTTP `401 Unauthorized`.
- `[ ]` Tạo `src/context/AuthContext.jsx`:
  - Quản lý state: `user`, `token`, `role`, `isAuthenticated`, `isLoading`.
  - Hàm `login(credentials)`: Gọi API, lưu token & user info vào `localStorage`, cập nhật state.
  - Hàm `logout()`: Xóa token, gọi API revoke token (nếu cần), reset state và chuyển hướng về trang đăng nhập.

## Phase 0.6: Xây Dựng Khung Phân Quyền Router (3 Roles)
- `[ ]` Tạo `src/routes/ProtectedRoute.jsx`:
  - Nhận prop `allowedRoles={['admin', 'operator', 'user']}`.
  - Nếu chưa đăng nhập -> Chuyển hướng tới `/login`.
  - Nếu đã đăng nhập nhưng role không khớp -> Chuyển hướng tới trang thông báo `/unauthorized` hoặc dashboard tương ứng.
- `[ ]` Tạo layout khung cho 3 vai trò:
  - `AdminLayout.jsx`: Sidebar quản trị, Header, content container.
  - `OperatorLayout.jsx`: Giao diện tối ưu cho điều phối phòng trực (Control Room layout), thanh thông báo SOS khẩn cấp.
  - `UserLayout.jsx`: Navbar người dùng, nút khẩn cấp SOS nổi bật, mobile-first responsive.

## Phase 0.7: Chuẩn Bị Cấu Hình Deploy Frontend Lên Vercel
- `[ ]` Tạo file `vercel.json` trong thư mục frontend để xử lý Single Page Application (SPA) routing:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- `[ ]` Kết nối repo với Vercel và test build thử nghiệm `npm run build`.

---

## Tổng Kết Day 0
- `[ ]` Backend Render API và Frontend Vercel React Vite đều hoạt động và ping thông nhau.
- `[ ]` Sẵn sàng 100% hạ tầng cho Day 1 khi có đề thi chính thức.
