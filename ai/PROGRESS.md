# NHẬT KÝ TIẾN ĐỘ (PROGRESS TRACKER)
# KIẾN TRÚC: LARAVEL REST WEB API + REACT JS (VITE)

File này dùng để theo dõi sát sao tiến độ thực tế so với ROADMAP cho dự án Web End-to-End.
Cập nhật mỗi ngày / mỗi ca làm việc để toàn team và AI luôn đồng bộ.

## TỔNG QUAN TIẾN ĐỘ
- **Mô hình**: Backend Laravel API (Render) + Frontend React Vite (Vercel) + Database Aiven MySQL
- **Thời hạn**: Day 0 (Chuẩn bị hạ tầng & khung sườn) + 5 Ngày (Day 1 -> Day 5)
- **Trạng thái chung**: `[/]` Đang hoàn thiện Day 0 (Chuẩn bị kiến trúc, API Base & React Vite Template)

---

## CHI TIẾT CÁC NGÀY

### Day 0: Setup Backend API, React Vite Frontend & Hạ Tầng Deploy
- [x] Khởi tạo Laravel & Cấu hình môi trường PHP 8.4
- [x] Kết nối DB (Local & Aiven Cloud) & Cấu hình Deploy Render (IaC `render.yaml`)
- [x] Cài đặt Laravel Sanctum, cấu hình CORS (`config/cors.php`) cho phép Frontend Vercel
- [x] Khởi tạo khung dự án Frontend: React.js (JavaScript) + Vite + TailwindCSS
- `[/]` Xây dựng `axiosClient.js` (Bearer token interceptor, BaseURL) & `AuthContext.jsx`
- `[/]` Xây dựng `ProtectedRoute.jsx` hỗ trợ 3 roles: `admin`, `operator`, `user`
- `[/]` Tạo trang demo kết nối API <-> React Frontend thành công
- Tình trạng: Đang chuẩn bị khung sườn kết nối 2 repo/service cho Day 0

### Day 1: Phân Tích Đề Bài, Thiết Kế ERD & Kiến Trúc 3 Roles
- `[ ]` Đọc kỹ đề thi chính thức, xác định các Actors (Admin, Operator/Dispatcher, User/Patient)
- `[ ]` Thiết kế sơ đồ CSDL (ERD) cho luồng cứu thương / đặt xe / tác vụ thời gian thực
- `[ ]` Quy hoạch danh sách Endpoint REST API (`/api/v1/...`)
- `[ ]` Xây dựng cấu trúc phân quyền RBAC (Role Middleware, Sanctum Abilities)
- Tình trạng: Chờ thực hiện khi nhận đề chính thức (đã có khung sườn tham khảo từ đề TechWiz 7 Walkthrough)

### Day 2: Migrations, Models, Relationships & Seeders
- `[ ]` Tạo Migrations cho `users` (3 roles), `ambulances`, `emergency_requests`, `dispatches`, v.v.
- `[ ]` Cấu hình Eloquent Models (`declare(strict_types=1);`, fillable, SoftDeletes, Status constants)
- `[ ]` Thiết lập Eloquent Relationships (1-N, N-N)
- `[ ]` Tạo Seeders có sẵn 3 tài khoản demo cố định (`admin`, `operator`, `user`) kèm mật khẩu mẫu
- Tình trạng: Chờ thực hiện sau Day 1

### Day 3: Laravel RESTful Controllers & Core Business Logic
- `[ ]` API Auth: Register, Login (trả Sanctum Token & User Role), Logout, Get Current User (`/api/v1/auth/me`)
- `[ ]` API Emergency Requests: Tạo SOS khẩn cấp kèm toạ độ GPS, danh sách yêu cầu chờ xử lý
- `[ ]` API Dispatch & Tracking: Gán xe cứu thương cho bệnh nhân, cập nhật trạng thái chuyến đi
- `[ ]` Form Requests validation an toàn, JsonResources chuẩn hoá dữ liệu trả về
- `[ ]` Xử lý chống N+1 query (`with(...)`), phân quyền qua Controller & Policy
- Tình trạng: Chờ thực hiện sau Day 2

### Day 4: Xây Dựng Giao Diện React Vite (3 Roles Dashboards)
- `[ ]` Cấu hình React Router DOM & Protected Routes cho 3 vai trò
- `[ ]` Màn hình User/Patient: Nút bấm SOS 1-chạm (lấy toạ độ GPS từ Geolocation API), màn hình theo dõi xe cứu thương trực tiếp
- `[ ]` Màn hình Operator/Dispatcher: Bảng điều phối khẩn cấp (Live SOS Queue), xem vị trí xe và nạn nhân trên bản đồ, nút gán xe
- `[ ]` Màn hình Admin: Quản lý danh mục xe cứu thương, tài xế, quản lý người dùng, biểu đồ thống kê
- `[ ]` Tích hợp Real-time Polling / WebSockets để cập nhật trạng thái tự động không cần F5
- Tình trạng: Chờ thực hiện sau Day 3

### Day 5: End-to-End Testing, Polish, Deploy Vercel + Render & Chuẩn Bị Demo
- `[ ]` Code Freeze: Dừng thêm tính năng mới
- `[ ]` Kiểm thử End-to-End: Luồng User ấn SOS -> Operator nhận thông báo & gán xe -> Xe di chuyển -> Hoàn tất cứu hộ
- `[ ]` Kiểm tra CORS và kết nối giữa Frontend trên Vercel và Backend trên Render
- `[ ]` Dọn dẹp dữ liệu rác, chạy lại Seeder tạo bộ dữ liệu mẫu chuẩn chỉ
- `[ ]` Viết kịch bản demo trình diễn trước Ban Giám Khảo
- Tình trạng: Chờ thực hiện sau Day 4
