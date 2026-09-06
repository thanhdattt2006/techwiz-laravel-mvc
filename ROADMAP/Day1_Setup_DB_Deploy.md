# DAY 1: KHỞI TẠO DỰ ÁN, KẾT NỐI DATABASE VÀ ĐƯA LÊN RENDER

**Mục tiêu**: Hoàn thành toàn bộ setup để các ngày sau team chỉ việc vào code logic. Nếu xong sớm Day 1 thì nhảy luôn sang Day 2.

## Phase 1.1: Khởi tạo Project Laravel

- `[x]` Cài đặt PHP 8.4 (nếu chưa có).
- `[x]` Cài đặt Composer.
- `[x]` Mở Terminal tại thư mục gốc.
- `[x]` Chạy lệnh: `composer create-project laravel/laravel .` (Cài thẳng vào thư mục hiện tại).
- `[x]` Xóa các file rác không cần thiết nếu có.
- `[x]` Kiểm tra file `.env` đã được sinh ra chưa.
- `[x]` Chạy `php artisan serve` để xem màn hình welcome của Laravel.
- `[x]` Stop server.

<!-- 
TẠM ẨN: Đã được User tự hoàn thành
## Phase 1.2: Thiết lập Git & GitHub
- `[ ]` Đăng nhập GitHub, tạo 1 repository mới (Private hoặc Public tùy ý).
- `[ ]` Chạy `git init` trong thư mục project.
- `[ ]` Mở `.gitignore`, đảm bảo đã có `.env` và `/vendor`.
- `[ ]` Chạy `git add .`
- `[ ]` Chạy `git commit -m "Init Laravel project"`
- `[ ]` Chạy `git branch -M main`
- `[ ]` Add remote origin: `git remote add origin <link-repo>`
- `[ ]` Push code lên main: `git push -u origin main`

## Phase 1.3: Khởi tạo Database Aiven
- `[ ]` Đăng nhập Aiven Console.
- `[ ]` Tạo 1 service mới (MySQL hoặc PostgreSQL, ưu tiên MySQL cho dễ dùng).
- `[ ]` Chọn gói Free/Hobby nếu có thể.
- `[ ]` Chờ Aiven cấp phát Service (Rebuilding...).
- `[ ]` Lấy thông tin kết nối: Host, Port, User, Password, Database Name.
- `[ ]` Add IP của bạn (và team) vào Allowed IPs (IP Whitelist) trên Aiven để truy cập từ máy cá nhân.
-->

## Phase 1.4: Cấu hình Kết Nối DB Local

- [x] Mở file `.env` ở máy tính.
- [x] Sửa `DB_CONNECTION=mysql`
- [x] Sửa `DB_HOST=<Aiven Host>` (Tạm thời dùng Localhost theo yêu cầu của bạn)
- [x] Sửa `DB_PORT=<Aiven Port>`
- [x] Sửa `DB_DATABASE=<Tên DB>`
- [x] Sửa `DB_USERNAME=<User>`
- [x] Sửa `DB_PASSWORD=<Password>`
- [x] Chạy `php artisan migrate` để test kết nối. Nếu thành công sẽ sinh ra bảng users.

## Phase 1.5: Chuẩn bị Deploy Render

- `[ ]` Đăng nhập Render.com bằng GitHub.
- `[ ]` Click "New" -> "Web Service".
- `[ ]` Chọn "Build and deploy from a Git repository".
- `[ ]` Kết nối GitHub repo vừa tạo ở Phase 1.2.
- `[ ]` Đặt tên Service (vd: `techwiz-team-xxx`).
- `[ ]` Root Directory để trống.
- `[ ]` Environment chọn `PHP`.
- `[ ]` Kéo xuống phần `Environment Variables`, click "Add Environment Variable".
- `[ ]` Thêm biến `APP_KEY` (Lấy giá trị từ file .env ở local).
- `[ ]` Thêm các biến DB: `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (Giá trị y hệt file `.env`).
- `[ ]` Thêm `APP_ENV=production` và `APP_DEBUG=false`.
- `[ ]` Click Create Web Service.

## Phase 1.6: Kiểm tra Deploy (CI/CD)

- `[ ]` Theo dõi tab Logs trên Render xem quá trình `composer install` có lỗi không.
- `[ ]` Chờ Render báo "Deploy Live".
- `[ ]` Click vào đường link `xxxx.onrender.com`.
- `[ ]` Kiểm tra xem có ra màn hình welcome của Laravel không.
- `[ ]` Nếu màn hình báo lỗi 500, xem lại log trên Render (thường do quên cấu hình `.env` trên Render hoặc chưa chạy key:generate).
- [x] Cập nhật file `render.yaml` (đã cung cấp) sửa lại các value cho đúng.
- `[ ]` Push file `render.yaml` lên Github để áp dụng Infrastructure as Code.

<!-- 
TẠM ẨN: Cài đặt Authentication (Breeze) do chưa chắc đã dùng
## Phase 1.7: Cài đặt Hệ thống Authentication (Auth)
- `[ ]` Quyết định dùng thư viện Auth nào: Laravel Breeze (đơn giản, dễ dùng) hay Laravel Jetstream (nhiều tính năng). Khuyên dùng **Breeze** cho 5 ngày.
- `[ ]` Chạy lệnh: `composer require laravel/breeze --dev`
- `[ ]` Chạy lệnh: `php artisan breeze:install blade` (Dùng Blade template mặc định, không cần React/Vue cho nhanh).
- `[ ]` Chạy lệnh: `npm install`
- `[ ]` Chạy lệnh: `npm run build`
- `[ ]` Chạy lệnh: `php artisan migrate`

## Phase 1.8: Kiểm tra chức năng Đăng Nhập/Đăng Ký Local
- `[ ]` Bật lại `php artisan serve`.
- `[ ]` Truy cập `http://localhost:8000/register`.
- `[ ]` Điền form tạo tài khoản.
- `[ ]` Nhấn đăng ký, xem có vào được trang Dashboard không.
- `[ ]` Nhấn Logout.
- `[ ]` Truy cập `/login`, thử đăng nhập lại.
- `[ ]` Nếu mọi thứ trơn tru -> Xong Phase này.

## Phase 1.9: Push Auth Code lên GitHub
- `[ ]` Dùng git status để kiểm tra các file đã thay đổi.
- `[ ]` `git add .`
- `[ ]` `git commit -m "Install Laravel Breeze and Auth system"`
- `[ ]` `git push`
- `[ ]` Lên Render check tab Events xem nó có tự động trigger deploy không.
- `[ ]` Chờ deploy xong, vào link Render test chức năng Register/Login trên môi trường Production (Aiven Database).
- `[ ]` Nếu lỗi kết nối DB, kiểm tra lại IP whitelist trên Aiven, Render có dải IP tĩnh hay không (Nếu Render Free, Aiven phải set Allow All IP `0.0.0.0/0` hoặc tìm cách config VPC).
-->

## Phase 1.7: Tạo Demo Code (M-V-C) để test flow
- [x] Chạy lệnh tạo Controller: `php artisan make:controller DemoController`
- [x] Chạy lệnh tạo Model kèm Migration: `php artisan make:model Demo -m`
- [x] Trong `DemoController`, viết hàm `index()` trả về view `demo`.
- [x] Tạo file view: `resources/views/demo.blade.php`.
- [x] Trong `demo.blade.php`, test thử class Tailwind: `<div class="p-4 bg-blue-500 text-white font-bold text-center rounded-lg shadow-md">Hello TechWiz - Demo MVC</div>`.
- [x] Khai báo route trong `routes/web.php`: `Route::get('/demo', [App\Http\Controllers\DemoController::class, 'index'])->name('demo');`
- [x] Khởi động server (`php artisan serve`) và truy cập `http://localhost:8000/demo` để xem kết quả Controller truyền xuống View có hoạt động không.

## Phase 1.10: Tổng kết Day 1

- `[ ]` Phân công task Day 2.
- `[ ]` Họp nhanh 15 phút chốt schema database (sẽ thiết kế ở Day 2).
- `[ ]` Đảm bảo cả 4 thành viên đều pull được code và chạy được ở local.
