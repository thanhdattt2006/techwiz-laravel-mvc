# NHẬT KÝ TIẾN ĐỘ (PROGRESS TRACKER)

# DỰ ÁN: MARKETLINK - FARM FRESH JUST A CLICK AWAY (THEME: EGREEN BASKET - TECHWIZ 7)

# KIẾN TRÚC: LARAVEL REST WEB API + REACT JS (VITE)

File này dùng để theo dõi sát sao tiến độ thực tế so với ROADMAP cho dự án Web End-to-End.
Cập nhật mỗi ngày / mỗi ca làm việc để toàn team và AI luôn đồng bộ.

## TỔNG QUAN TIẾN ĐỘ

- **Đề tài**: Sàn kết nối Chợ Nông Sản & Nông Dân Địa Phương (Dự án **MarketLink** - Theme **eGreen Basket**)
- **Mô hình**: Backend Laravel 13 API (Render) + Frontend React 19 Vite (Vercel) + Database Aiven MySQL
- **Bảng CSDL cốt lõi**: `users`, `markets`, `products`, `orders`, `order_items`, `reviews`, `reports`, `contact_messages`
- **Giao diện**: Fresh Botanical & Harvest Gold Design System (Tông màu xanh lá nông sản `#16A34A`, cam mật ong `#F59E0B`, nền kem sáng `#F8FAF6`)
- **Ràng buộc nghiệp vụ cốt lõi (SRS)**:
  - KHÔNG sử dụng cổng thanh toán trực tuyến (Zero Payment Gateway) — Tiền mặt / thẻ quẹt trực tiếp tại sạp khi nhận hàng.
  - Không giao hàng tận nhà (No Courier/Delivery) — 100% nhận tại sạp chợ cuối tuần.
  - Nông dân công bố số lượng bán ra, khách pre-order giữ chỗ, nông dân xác nhận đóng giỏ hàng.
- **Thời hạn**: Day 0 (Chuẩn bị hạ tầng & khung sườn) + 5 Ngày (Day 1 -> Day 5)
- **Trạng thái chung**: `[x]` Hoàn thành 100% Day 0 (Phase 0.1 -> Phase 0.17: Quét sạch rác Ambulance, hoàn thiện 3 Portals Admin/Farmer/Customer, Reusable Components, Build 0 errors)

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
- [x] Tiếp nhận đề bài chính thức MarketLink (eGreen Basket - TechWiz 7), quy hoạch các bảng CSDL cốt lõi và Fresh Botanical Theme
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
- [x] Phase 0.16: Phân hệ quản trị Admin Management Portal (Markets Manager CRUD & Modal Form, Farmer Approvals, User Accounts Governance, Review Moderation, Inquiries Inbox, Reports & Analytics, Mobile Drawer Navigation)
- [x] Phase 0.17: Chuẩn hóa Reusable Components & Clean Code Production-Ready (ProductCard, MarketCard, StatusBadge, FilterSidebar, RatingStars, barrel export index.js; build Vite 0 errors)
- [x] Quét dọn 100% tàn dư Ambulance cũ: Xóa bỏ 5 file thừa (`AmbulancesPage`, `AmbulanceDetailPage`, `LiveTrackingPage`, `ambulances.json`, `MedicalProfilePage`), làm sạch toàn bộ trang Auth (`LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `UnauthorizedPage`, `AuthContext`).
- [x] Hoàn thiện Responsive Mobile Navigation cho Admin & Operator Layouts, sửa dứt điểm lỗi Modal Form và sai luồng liên kết public.
- [x] Hoàn thiện Phân hệ Account Settings & Change Password cho cả Khách hàng (Shopper Profile & Security) và Nông dân (Stall Master Settings & Operations), đồng bộ dữ liệu vào AuthContext và localStorage.
- Tình trạng: **100% HOÀN TẤT TOÀN BỘ DAY 0 SETUP & REFACTOR ROADMAP (Phase 0.1 -> 0.17)**! Sẵn sàng 100% cho Day 1 (ERD & Backend Migrations).

### Day 1: Phân Tích Đề Bài SRS, Thiết Kế ERD (18 Bảng) & Kiến Trúc 3 Roles

- [x] Đọc kỹ và đối chiếu toàn bộ yêu cầu SRS MarketLink (`topic/MarketLink End-to-End Web Solutions_SRS(main).pdf`) và phân biệt rõ với CampusCoin.
- [x] Thiết kế sơ đồ CSDL quan hệ chuẩn 18 bảng (ERD Mermaid & Data Dictionary chi tiết) tại `ai/DATABASE_ERD.md`: `users`, `personal_access_tokens`, `markets`, `market_schedules`, `farmers`, `farmer_markets`, `categories`, `products`, `weekly_stock_templates`, `carts`, `cart_items`, `orders`, `order_items`, `favorites`, `reviews`, `notifications`, `announcements`, `contact_messages`.
- [x] Đặc tả toàn bộ quy trình nghiệp vụ hệ thống, cỗ máy trạng thái đơn hàng (Order State Machine), logic Time Slot & Cutoff Time, mẫu kho định kỳ tuần (Weekly Stock Rollover) tại `ai/WORKFLOW.md`.
- [x] Quy hoạch chi tiết Hợp đồng API RESTful (API Contract Specification 11 nhóm Endpoints) tại `ROADMAP/Day1_Analysis_Database_Design.md`.
- [x] Thiết lập phân quyền RBAC và phân công nhiệm vụ 4 thành viên chuẩn bị cho Day 2.
- Tình trạng: **100% HOÀN TẤT DAY 1**!

### Day 2: Migrations, Models, Relationships & Seeders

- [x] Tạo đủ 18 file Migrations theo đúng thứ tự an toàn (`000001` đến `000018`) với đầy đủ Foreign Keys, Constraints (`CHECK`, `UNIQUE`, `JSON`, `FULLTEXT`), Indexes và `SoftDeletes`.
- [x] Cấu hình 17 Eloquent Models tuân thủ nghiêm ngặt `declare(strict_types=1);`, Mass Assignment protection (`$fillable`), `$casts`, Constants và Helper methods.
- [x] Thiết lập Eloquent Relationships (1-1, 1-N, N-N qua `farmer_markets`, Polymorphic `morphMany` cho `favorites`).
- [x] Viết `DatabaseSeeder.php` hoàn chỉnh: 3 tài khoản demo cố định (`admin@marketlink.com`, `farmer@marketlink.com`, `customer@marketlink.com`), 6 chợ Chicago kèm lịch họp và toạ độ thực tế, 5 ngành hàng, sản phẩm, weekly stock templates, đơn mẫu, review, thông báo và contact messages.
- [x] Kiểm tra cú pháp PHP (Linting) 100% các file migrations, models và seeder: **0 syntax errors**!
- Tình trạng: **100% HOÀN TẤT DAY 2 CODEBASE**! Sẵn sàng cho Day 3 xây dựng RESTful API Controllers.

### Day 3: Laravel RESTful Controllers & Core Business Logic

- `[ ]` API Auth: Register, Login (trả Sanctum Token & User Role), Logout, Get Current User (`/api/v1/auth/me`)
- `[ ]` API Catalog & Filter: Tìm kiếm nông sản theo chợ, danh mục, khoảng giá, mùa vụ
- `[ ]` API Pre-Orders: Tạo đơn pre-order giữ chỗ nông sản (không thanh toán), cập nhật trạng thái đơn (Placed -> Packed -> Ready -> Completed)
- `[ ]` Form Requests validation an toàn, JsonResources chuẩn hoá dữ liệu trả về
- `[ ]` Xử lý chống N+1 query (`with(...)`), phân quyền qua Controller & Policy
- Tình trạng: Chờ thực hiện sau Day 2

### Day 4: Tích Hợp Frontend React Với Backend API

- `[ ]` Kết nối React Frontend với Laravel REST API thông qua `axiosClient.js`
- `[ ]` Màn hình Customer: Danh mục sản phẩm, đặt trước nông sản (Pre-Order Modal), xem lịch sử đơn và đánh giá 1-5 sao
- `[ ]` Màn hình Farmer: Quản lý hàng chờ pre-order của khách, bấm duyệt đóng gói và báo hàng đã sẵn sàng tại sạp, quản lý kho tuần
- `[ ]` Màn hình Admin: Quản lý danh mục chợ, phê duyệt nông dân mở sạp, kiểm duyệt đánh giá xấu
- `[ ]` Xử lý Loading states, Toast Notifications, Error Handlers
- Tình trạng: Chờ thực hiện sau Day 3

### Day 5: End-to-End Testing, Polish, Deploy Vercel + Render & Chuẩn Bị Demo

- `[ ]` Code Freeze: Dừng thêm tính năng mới
- `[ ]` Kiểm thử End-to-End: Luồng Khách duyệt nông sản -> Chọn ngày họp chợ & Pre-order -> Nông dân duyệt & đóng gói -> Khách nhận hàng tại sạp -> Đánh giá sao
- `[ ]` Kiểm tra CORS và kết nối giữa Frontend trên Vercel và Backend trên Render
- `[ ]` Dọn dẹp dữ liệu rác, chạy lại Seeder tạo bộ dữ liệu mẫu chuẩn chỉ
- `[ ]` Viết kịch bản demo trình diễn trước Ban Giám Khảo TechWiz 7
- Tình trạng: Chờ thực hiện sau Day 4
