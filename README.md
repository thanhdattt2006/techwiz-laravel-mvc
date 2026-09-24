# MarketLink - eGreen Basket Marketplace Portal (TechWiz 7)

**Slogan**: *Farm Fresh Just a Click Away*  
**Theme**: **eGreen Basket** (Nền tảng thương mại nông sản tươi & Sạp chợ nông dân địa phương)  
Dự án áp dụng mô hình phân tách hoàn toàn Client - Server:
- **Backend**: **Laravel 13 RESTful Web API** (PHP 8.4, Laravel Sanctum, MySQL 8.0, IaC Deploy Render)
- **Frontend**: **React 19 (JavaScript) + Vite + TailwindCSS** (Deploy Vercel)
- **Phân quyền 3 Roles (RBAC)**: `admin` (Quản trị sàn), `farmer` (Chủ sạp nông dân), `customer` (Khách mua nông sản)

---

## ⚠️ QUY TẮC PHÁT TRIỂN & BỘ TÀI LIỆU BẮT BUỘC (MANDATORY GUIDELINES)

Trước khi tiến hành lập trình hoặc kiểm thử, Developer, Tester và AI **BẮT BUỘC** phải đọc và tuân thủ nghiêm ngặt các tài liệu sau:

1. **[`RULE.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/RULE.md)**: Luật làm việc, quy tắc nhận task, chuẩn commit Git tiếng Anh (Conventional Commits), kiểm tra `git status`/`git diff`, cấm để lại rác debug (`dd()`, `dump()`, `console.log()`).
2. **Bộ tài liệu thiết yếu trong thư mục [`ai/`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai)**:
   - **[`ai/CONVENTION.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/CONVENTION.md)**: Quy chuẩn lập trình Clean Code, SOLID, DRY, strict types `declare(strict_types=1);`, chuẩn phản hồi JSON envelope, Form Request validation, API Resource transformation, chống N+1 query.
   - **[`ai/DATABASE_ERD.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/DATABASE_ERD.md)**: Sơ đồ ERD quan hệ 18 bảng và Data Dictionary chi tiết (kiểu dữ liệu, constraints, foreign keys).
   - **[`ai/WORKFLOW.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/WORKFLOW.md)**: Quy trình nghiệp vụ 3 vai trò, Order State Machine 4 bước, logic tính khung giờ Time Slot & giờ chốt đơn Cutoff.
   - **[`ai/AGENTS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/AGENTS.md)**: Hướng dẫn kỹ thuật cho AI, ràng buộc cứng SRS TechWiz (không thanh toán online, không giao hàng tận nhà, 1 giao diện nền sáng tươi mát).
   - **[`ai/PROGRESS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/PROGRESS.md)**: Bảng theo dõi tiến độ chi tiết từng ngày thi.
   - **[`ai/BUGS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/BUGS.md)**: Sổ ghi nhận và xử lý lỗi hệ thống.
3. **Lộ trình thực hiện chi tiết trong [`ROADMAP/`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ROADMAP)**: Xem file tương ứng với ngày làm việc để nắm các phase cần hoàn thiện.

---

## 📂 Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
Laravel_MVC/
├── backend/                  # Mã nguồn Laravel Framework 13 RESTful API
│   ├── app/                  # Controllers, Models (17), FormRequests (18), Resources (15), Middleware
│   ├── routes/api.php        # Danh sách API endpoints (/api/v1/...)
│   ├── database/             # 18 Migrations (000001..000018), 10 Modular Seeders
│   └── Dockerfile            # Cấu hình container PHP 8.4 deploy Render
├── frontend/                 # Mã nguồn React JS (Vite) Single Page Application
│   ├── src/                  # Components, Pages (3 portals: Admin, Farmer, Customer), AuthContext
│   ├── package.json          # react-router-dom, axios, lucide-react, chart.js
│   └── vercel.json           # Cấu hình rewrite SPA routing trên Vercel
├── ai/                       # Tài liệu định hướng kiến trúc & conventions
│   ├── AGENTS.md             # Hướng dẫn AI và kiến trúc tổng quan
│   ├── CONVENTION.md         # Quy chuẩn code chuẩn mực (SOLID, DRY, Clean Code)
│   ├── PROGRESS.md           # Bảng theo dõi tiến độ thực tế 5 ngày
│   ├── BUGS.md               # Sổ ghi chép và khắc phục lỗi
│   ├── DATABASE_ERD.md       # Sơ đồ CSDL quan hệ 18 bảng & Data Dictionary
│   └── WORKFLOW.md           # Quy trình nghiệp vụ, Order State Machine & Cutoff logic
├── ROADMAP/                  # Lộ trình chuẩn hóa 5 ngày thi TechWiz
│   ├── Day0_Setup_DB_Deploy.md
│   ├── Day1_Analysis_Database_Design.md
│   ├── Day2_Models_Migrations.md
│   ├── Day3_Controllers_Core_Logic.md
│   ├── Day4_Views_Frontend.md
│   └── Day5_Testing_Polish.md
├── Document.txt              # Đặc tả chi tiết toàn bộ API Routes & Endpoints
├── render.yaml               # Cấu hình hạ tầng Render (IaC)
├── RULE.md                   # Luật làm việc, quy tắc Git & commit của team
└── README.md                 # Hướng dẫn cài đặt và khởi chạy dự án
```

---

## 🗺️ Sơ Đồ Cây Phân Nhóm Route API (`/api/v1/`)

```text
/api/v1/
├── [PUBLIC ROUTES] (Không cần Bearer Token)
│   ├── POST /auth/register                     -> Đăng ký tài khoản Khách hàng (bắt buộc phone, address)
│   ├── POST /auth/register-farmer              -> Đăng ký mở sạp Nông dân (status='pending')
│   ├── POST /auth/login                        -> Đăng nhập hệ thống, cấp Sanctum Token & User Role
│   ├── GET  /markets                           -> Danh bạ chợ (kèm bộ lọc ngày, toạ độ GPS)
│   ├── GET  /markets/{id}                      -> Chi tiết chợ, lịch họp, danh sách sạp đang bán
│   ├── GET  /farmers                           -> Danh sách sạp nông dân công khai
│   ├── GET  /farmers/{id}                      -> Chi tiết sạp, danh mục nông sản đang mở bán
│   ├── GET  /categories                        -> Danh mục 5 ngành hàng nông sản sạch
│   ├── GET  /products                          -> Catalog nông sản (lọc category, giá, chợ, sạp, search)
│   ├── GET  /products/{id}                     -> Chi tiết nông sản, xuất xứ, review
│   ├── GET  /reviews/product/{productId}       -> Đánh giá của sản phẩm kèm phản hồi chủ sạp
│   ├── GET  /reviews/farmer/{farmerId}         -> Đánh giá của sạp nông dân
│   ├── GET  /announcements/active              -> Thông báo hệ thống đang kích hoạt
│   ├── POST /contact                           -> Khách vãng lai gửi phản ánh / liên hệ (Contact Us)
│   └── GET  /orders/track/{orderCode}          -> Tra cứu tiến độ đơn hàng nhận tại sạp qua mã code
│
├── [SHARED PROTECTED] (Yêu cầu auth:sanctum)
│   ├── GET  /auth/me                           -> Lấy thông tin tài khoản hiện tại + hồ sơ Farmer
│   ├── PUT  /auth/profile                      -> Cập nhật thông tin cá nhân
│   ├── PUT  /auth/change-password              -> Đổi mật khẩu tài khoản
│   ├── POST /auth/logout                       -> Huỷ Bearer Token hiện tại
│   ├── GET  /notifications                     -> Danh sách thông báo in-app (kèm unread_count)
│   ├── PATCH /notifications/{id}/read          -> Đánh dấu đã đọc 1 thông báo
│   └── PATCH /notifications/read-all           -> Đánh dấu đã đọc tất cả thông báo
│
├── [CUSTOMER ROUTES] (auth:sanctum + role:customer)
│   ├── GET    /cart                            -> Lấy giỏ hàng hiện tại (nhóm theo sạp/chợ)
│   ├── POST   /cart/items                      -> Thêm món vào giỏ (product_id, quantity)
│   ├── PUT    /cart/items/{id}                 -> Cập nhật số lượng món trong giỏ
│   ├── DELETE /cart/items/{id}                 -> Xoá 1 món khỏi giỏ hàng
│   ├── DELETE /cart/clear                      -> Dọn sạch toàn bộ giỏ hàng
│   ├── POST   /orders/checkout                 -> Đặt trước Pre-Order (tự động tách đơn theo sạp)
│   ├── GET    /orders/my-orders                -> Lịch sử đặt trước của khách
│   ├── GET    /orders/my-orders/{id}           -> Chi tiết đơn pre-order của khách
│   ├── PATCH  /orders/{id}/cancel              -> Khách huỷ đơn trước giờ cutoff_at (hoàn kho)
│   ├── POST   /reviews                         -> Gửi đánh giá 1-5 sao sau khi đơn completed
│   ├── GET    /favorites                       -> Danh sách mục yêu thích (chợ, sạp, sản phẩm)
│   └── POST   /favorites/toggle                -> Thêm/Bỏ yêu thích nhanh (đa hình)
│
├── [FARMER ROUTES] (auth:sanctum + role:farmer + EnsureFarmerActive)
│   ├── GET    /farmer/dashboard-stats          -> Thống kê sạp: Tổng đơn, Đơn chờ, Doanh thu ước tính
│   ├── GET    /farmer/profile                  -> Xem chi tiết hồ sơ sạp hàng
│   ├── PUT    /farmer/profile                  -> Cập nhật mô tả sạp, hotline, ảnh đại diện
│   ├── GET    /farmer/markets                  -> Danh sách chợ sạp đang đăng ký bán
│   ├── POST   /farmer/markets                  -> Đăng ký bán tại chợ mới (farmer_markets)
│   ├── PUT    /farmer/markets/{marketId}       -> Cấu hình vị trí gian, ngày pickup, slot 30p, cutoff 12h
│   ├── DELETE /farmer/markets/{marketId}       -> Rút sạp khỏi chợ
│   ├── GET    /farmer/products                 -> Quản lý nông sản của riêng sạp
│   ├── POST   /farmer/products                 -> Đăng nông sản mới
│   ├── PUT    /farmer/products/{id}            -> Sửa nông sản (tên, giá, đơn vị, ảnh, availability)
│   ├── DELETE /farmer/products/{id}            -> Xoá mềm nông sản (Soft Delete)
│   ├── GET    /farmer/products/{id}/template   -> Xem mẫu kho định kỳ tuần của sản phẩm
│   ├── PUT    /farmer/products/{id}/template   -> Cấu hình số lượng mở bán T7/CN
│   ├── POST   /farmer/apply-weekly-templates   -> 1-Click áp dụng định mức kho tuần cho phiên chợ
│   ├── GET    /farmer/orders                   -> Hàng chờ đơn đặt trước (Incoming Pre-orders)
│   ├── PATCH  /farmer/orders/{id}/accept       -> Nông dân duyệt đơn đặt trước
│   ├── PATCH  /farmer/orders/{id}/decline      -> Nông dân từ chối đơn (+ lý do & hoàn kho)
│   ├── PATCH  /farmer/orders/{id}/ready        -> Báo nông sản đã chuẩn bị xong tại sạp
│   ├── PATCH  /farmer/orders/{id}/complete     -> Xác nhận khách đã nhận hàng & trả tiền mặt
│   └── POST   /farmer/reviews/{id}/reply       -> Nông dân trả lời đánh giá sản phẩm của sạp
│
└── [ADMIN ROUTES] (auth:sanctum + role:admin)
    ├── GET    /admin/stats/overview            -> Báo cáo sàn: Doanh thu, Đơn hàng, Top nông dân
    ├── GET    /admin/users                     -> Quản lý danh sách người dùng toàn sàn
    ├── PATCH  /admin/users/{id}/status         -> Khóa/Mở khóa tài khoản (active/inactive/banned)
    ├── GET    /admin/farmers/pending           -> Hàng chờ hồ sơ nông dân xin mở sạp
    ├── PATCH  /admin/farmers/{id}/approve      -> Phê duyệt nông dân mở sạp
    ├── PATCH  /admin/farmers/{id}/reject       -> Từ chối hồ sơ nông dân
    ├── POST   /admin/markets                   -> Thêm chợ nông sản mới
    ├── PUT    /admin/markets/{id}              -> Cập nhật thông tin chợ, toạ độ, bản đồ
    ├── DELETE /admin/markets/{id}              -> Xoá mềm chợ
    ├── POST   /admin/categories                -> Thêm ngành hàng nông sản
    ├── PUT    /admin/categories/{id}           -> Cập nhật ngành hàng
    ├── PATCH  /admin/products/{id}/toggle-hide -> Admin gỡ nông sản vi phạm (is_hidden)
    ├── PATCH  /admin/reviews/{id}/toggle-hide  -> Admin ẩn review khiếm nhã/sai sự thật
    ├── GET    /admin/announcements             -> Quản lý thông báo toàn sàn
    ├── POST   /admin/announcements             -> Phát thông báo mới (target: all, farmer, customer)
    ├── PUT    /admin/announcements/{id}        -> Sửa thông báo
    ├── DELETE /admin/announcements/{id}        -> Xoá thông báo
    ├── GET    /admin/inquiries                 -> Hộp thư tiếp nhận liên hệ / phản ánh
    └── PATCH  /admin/inquiries/{id}/read       -> Đánh dấu đã xử lý phản ánh
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

# Chạy 18 Migrations & 10 Modular Seeders
php artisan migrate:fresh --seed

# Khởi động server API (chạy tại http://127.0.0.1:8000)
php artisan serve
```

### 2. Tài Khoản Demo Mẫu Sẵn (Seeders)
| Vai trò | Email đăng nhập | Mật khẩu | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@marketlink.com` | `password123` | Quản trị sàn, duyệt sạp, thông báo, inbox |
| **Farmer** | `farmer@marketlink.com` | `password123` | Chủ sạp Green Valley Organics |
| **Customer** | `customer@marketlink.com` | `password123` | Khách mua hàng David Miller |

### 3. Khởi chạy Frontend (React JS Vite)
Mở Terminal 2:
```bash
cd frontend

# Cài đặt thư viện JavaScript
npm install

# Khởi động máy chủ phát triển Vite (chạy tại http://localhost:5173)
npm run dev
```

---

## 📝 Quy Tắc Làm Việc Của Team
- Đọc kỹ [RULE.md](RULE.md) trước khi code và commit.
- Luôn cập nhật tiến độ vào [ai/PROGRESS.md](ai/PROGRESS.md).
- Tuân thủ quy chuẩn viết code tại [ai/CONVENTION.md](ai/CONVENTION.md).
- Xem sơ đồ thực thể ERD tại [ai/DATABASE_ERD.md](ai/DATABASE_ERD.md).
