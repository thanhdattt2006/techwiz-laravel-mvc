# NHẬT KÝ TIẾN ĐỘ (PROGRESS TRACKER)

# DỰ ÁN: LIFELINK - ONLINE EAMBULANCE PORTAL (SRS TECHWIZ 7)

# KIẾN TRÚC: LARAVEL REST WEB API + REACT JS (VITE)

File này dùng để theo dõi sát sao tiến độ thực tế so với ROADMAP cho dự án Web End-to-End.
Cập nhật mỗi ngày / mỗi ca làm việc để toàn team và AI luôn đồng bộ.

## TỔNG QUAN TIẾN ĐỘ

- **Đề tài**: eAmbulance Service Portal (Dự án **LifeLink**)
- **Mô hình**: Backend Laravel 13 API (Render) + Frontend React 19 Vite (Vercel) + Database Aiven MySQL
- **Bảng CSDL cốt lõi**: `users`, `ambulances`, `emergency_requests`, `feedbacks`, `contact_messages`, `notifications`
- **Giao diện**: Light Medical Design System (bảng màu y tế cố định, KHÔNG DÙNG DARK/LIGHT THEME)
- **Thời hạn**: Day 0 (Chuẩn bị hạ tầng & khung sườn) + 5 Ngày (Day 1 -> Day 5)
- **Trạng thái chung**: `[x]` Hoàn thành 100% Day 0 (Bao gồm Phase 0.6 Khung phân quyền ProtectedRoute & Layouts 3 Roles)

---

## CHI TIẾT CÁC NGÀY

### Day 0: Setup Backend API, React Vite Frontend & Hạ Tầng Deploy

- [x] Khởi tạo Laravel & Cấu hình môi trường PHP 8.4
- [x] Kết nối DB (Local & Aiven Cloud) & Cấu hình Deploy Render (IaC `render.yaml`)
- [x] Cài đặt Laravel Sanctum, cấu hình CORS (`config/cors.php`) cho phép Frontend Vercel
- [x] Khởi tạo khung dự án Frontend: React.js (JavaScript) + Vite + TailwindCSS + Core packages
- [x] Xây dựng `axiosClient.js` (Bearer token interceptor, BaseURL) & `AuthContext.jsx`
- [x] Thiết kế chuẩn bảng `users` (fullname, username, email/gmail, phone, role, status) & Seed 3 demo roles
- [x] Cấu hình Deploy Vercel (`frontend/vercel.json`, rewrite SPA routing, test build passed)
- [x] Chuẩn hóa 100% tiếng Anh trong codebase (không còn chữ tiếng Việt nào trong mã nguồn & giao diện)
- [x] Tiếp nhận đề bài chính thức MarketLink (eGreen Basket - TechWiz 7), quy hoạch 6 bảng CSDL cốt lõi và Fresh Botanical Theme
- [x] Xây dựng `ProtectedRoute.jsx` hỗ trợ 3 roles: `admin`, `farmer`, `customer`
- [x] Dựng khung Layout cho 3 roles và khung các trang Public (Home, About, Gallery, Feedback, Contact, Sitemap)
- [x] Thay thế SweetAlert2 bằng Custom React Modal System (Fresh Botanical Theme, chuẩn React Portal)
- [x] Hoàn thiện bộ UI xác thực (RegisterPage, Nút Google Social Login, ForgotPasswordPage 2 bước)
- [x] Phase 0.10: Bản đồ định vị Ban Quản Lý Chợ Chicago (Contact Page) & Khung Pre-order giữ chỗ không cần cổng thanh toán
- [x] Phase 0.11: Tái cấu trúc thương hiệu & Hệ màu mới Fresh Botanical Theme (MarketLink Logo eGreen Basket, Hotline (312) 555-FARM, PublicNavbar, PublicFooter, HomePage, AboutPage, GalleryPage, index.html, index.css)
- [x] Phase 0.12: Xây dựng bộ dữ liệu Nông sản & Trang Catalog sản phẩm (ProductsPage & ProductDetailPage với bộ lọc đa tiêu chí và Pre-order Form)
- [x] Phase 0.13: Danh bạ chợ địa phương & Theo dõi đơn nhận hàng tại sạp (MarketsPage & OrderPickupTrackerPage)
- [x] Phase 0.14: Phân hệ khách mua hàng Customer Portal (CustomerDashboard, CustomerProfilePage, CustomerOrdersPage)
- [x] Phase 0.15: Phân hệ chủ sạp Farmer / Vendor Portal (FarmerDashboard, Weekly Stall Stock, Incoming Pre-orders)
- [ ] Phase 0.16: Phân hệ quản trị Admin Management Portal (Markets Manager, Farmer Approvals, Review Moderation)
- [ ] Phase 0.17: Chuẩn hóa Reusable Components & Clean Code Production-Ready
- Tình trạng: Đã hoàn tất Phase 0.15 (Farmer / Vendor Portal: Dashboard, Stall Stock, Pre-orders Queue), sẵn sàng bước sang Phase 0.16!

### Day 1: Phân Tích Đề Bài, Thiết Kế ERD & Kiến Trúc 3 Roles

- `[x]` Đọc kỹ SRS LifeLink: catalog xe, lọc khu vực/giá/loại xe, feedback sau chuyến đi, contact vãng lai, không cần thanh toán
- `[ ]` Thiết kế sơ đồ CSDL (ERD) chi tiết cho 6 bảng cốt lõi: `users`, `ambulances`, `emergency_requests`, `feedbacks`, `contact_messages`, `notifications`
- `[ ]` Quy hoạch danh sách Endpoint REST API (`/api/v1/...`) chuẩn Envelope
- `[ ]` Xây dựng cấu trúc phân quyền RBAC (Role Middleware, Sanctum Abilities)
- Tình trạng: Đã có sẵn SRS chi tiết, sẵn sàng thực thi khi hoàn tất Day 0

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
