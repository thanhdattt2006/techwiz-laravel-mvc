# DAY 0: KHỞI TẠO NỀN TẢNG, DATABASE, DEPLOY RENDER & KHUNG SƯỜN FRONTEND

**Mục tiêu**: Chuẩn bị 100% "vũ khí" và nền tảng hạ tầng trước khi bước vào cuộc thi. Hoàn tất setup server, database, deploy CI/CD Render và dựng sẵn toàn bộ khung sườn giao diện (Master Layout, Header, Footer, SweetAlert2, AJAX) để khi có đề bài chỉ việc bắt tay vào làm tính năng.

---

## Phase 0.1: Khởi tạo Project Laravel

- `[x]` Cài đặt PHP 8.4 và Composer.
- `[x]` Chạy lệnh `composer create-project laravel/laravel .` trong thư mục gốc.
- `[x]` Cấu hình `.env` ban đầu.
- `[x]` Chạy `php artisan serve` kiểm tra trang mặc định.

## Phase 0.2: Cấu hình Kết Nối Database (Local & Aiven)

- `[x]` Cấu hình thông tin DB trong `.env`.
- `[x]` Chạy `php artisan migrate` để test kết nối database.

## Phase 0.3: Chuẩn bị Deploy Render (IaC)

- `[x]` Đăng nhập Render.com và kết nối GitHub repo.
- `[x]` Cấu hình file `render.yaml` (Infrastructure as Code).
- `[x]` Thiết lập các biến môi trường trên Render (`APP_KEY`, DB, `APP_ENV=production`).

## Phase 0.4: Kiểm tra Deploy CI/CD

- `[x]` Theo dõi log build và deploy trên Render.
- `[x]` Kiểm tra link live `xxxx.onrender.com`.
- `[x]` Tinh chỉnh reverse proxy, HTTPS trust và Session driver trên Render.

## Phase 0.5: Tạo Demo Code MVC & Maintenance Controller

- `[x]` Tạo `DemoController` và view `demo.blade.php`.
- `[x]` Tạo `DatabaseMaintenanceController` cho phép migrate/fresh/rollback an toàn.
- `[x]` Tạo test case kiểm tra chức năng maintenance (`MaintenanceTest.php`).

---

## Phase 0.6: Cài Đặt Thư Viện Frontend Core

- `[ ]` Cài đặt SweetAlert2 qua npm: `npm install sweetalert2`
- `[ ]` Cài đặt Axios qua npm: `npm install axios`
- `[ ]` Cài đặt Alpine.js qua npm: `npm install alpinejs` (hỗ trợ dropdown, mobile menu nhẹ mượt)
- `[ ]` Cài đặt NProgress qua npm: `npm install nprogress` (thanh loading bar chạy trên đỉnh khi gọi AJAX)
- `[ ]` Kiểm tra `package.json` đảm bảo cài đặt thành công.

## Phase 0.7: Xây Dựng JavaScript Core & Modules

- `[ ]` Tạo `resources/js/bootstrap.js`: Cấu hình Axios (tự động gắn CSRF token, header AJAX, NProgress loading interceptor).
- `[ ]` Tạo `resources/js/modules/alerts.js`:
  - `window.Toast`: Toast notification SweetAlert2 góc màn hình (tự tắt sau 3s).
  - `window.confirmAction`: Popup confirm SweetAlert2.
  - Global Event Handler: Tự động bắt mọi form/button có `data-confirm="..."` để hỏi xác nhận trước khi submit.
- `[ ]` Cập nhật `resources/js/app.js`: Khởi tạo Alpine.js và liên kết toàn bộ module.

## Phase 0.8: Xây Dựng Master Layout & Partials

- `[ ]` Tạo `resources/views/layouts/app.blade.php`:
  - Khung HTML5, meta CSRF token, nhúng Vite bundle.
  * Cấu trúc flexbox giữ Footer luôn nằm ở đáy trang (`min-h-screen flex flex-col`).
  - `@yield('title')`, `@yield('content')`, `@stack('styles')`, `@stack('scripts')`.
- `[ ]` Tạo `resources/views/partials/header.blade.php`:
  - Thanh Navbar responsive chuẩn TailwindCSS v4.
  - Logo thương hiệu, menu điều hướng, nút hành động.
  - Hamburger toggle menu trên thiết bị di động (sử dụng Alpine.js).
- `[ ]` Tạo `resources/views/partials/footer.blade.php`:
  - Footer thông tin dự án, bản quyền, tech stack badges.
- `[ ]` Tạo `resources/views/partials/alerts.blade.php`:
  - Cầu nối tự động đọc `session('success')`, `session('error')`, `session('warning')`, `$errors->all()` và kích hoạt SweetAlert2 tương ứng.

## Phase 0.9: Xây Dựng Trang Demo Test Khung Sườn & AJAX

- `[ ]` Tạo `resources/views/home.blade.php` kế thừa `layouts/app.blade.php`.
- `[ ]` Thiết kế các nút bấm test:
  - Nút test SweetAlert2 Alert & Toast.
  - Nút test Confirm Dialog (thử nghiệm form xoá giả lập).
  - Nút test AJAX: Gửi request tới route backend và nhận JSON phản hồi + Toast thông báo.
- `[ ]` Khai báo route test trong `routes/web.php` (`/` trỏ tới `home`, `POST /api/demo-ajax` để test).

## Phase 0.10: Kiểm Tra Build & Nghiệm Thu Day 0

- `[ ]` Chạy `npm run build` kiểm tra Vite biên dịch không có lỗi.
- `[ ]` Mở trình duyệt kiểm tra:
  - Header & Footer hiển thị chuẩn, responsive tốt trên mobile.
  - SweetAlert2 bật mượt mà (Alert, Toast, Confirm).
  - AJAX gửi và nhận dữ liệu trơn tru kèm thanh loading NProgress.
- `[ ]` Kiểm tra `git status` và `git diff` sạch sẽ, chuẩn bị commit.

---

## Tổng Kết Day 0

- `[ ]` Cả team pull code mới nhất về máy cá nhân và chạy `npm install && npm run build`.
- `[ ]` Toàn bộ hạ tầng và khung sườn UI đã sẵn sàng cho Day 1.
