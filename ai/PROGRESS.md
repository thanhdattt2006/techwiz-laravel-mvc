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
- [x] Thiết lập mô hình phân quyền RBAC (admin, farmer, customer) chuẩn bị cho Day 2.
- Tình trạng: **100% HOÀN TẤT DAY 1**!

### Day 2: Migrations, Models, Relationships & Seeders

- [x] Tạo đủ 18 file Migrations theo đúng thứ tự an toàn (`000001` đến `000018`) với đầy đủ Foreign Keys, Constraints (`CHECK`, `UNIQUE`, `JSON`, `FULLTEXT`), Indexes và `SoftDeletes`.
- [x] Cấu hình 17 Eloquent Models tuân thủ nghiêm ngặt `declare(strict_types=1);`, Mass Assignment protection (`$fillable`), `$casts`, Constants và Helper methods.
- [x] Thiết lập Eloquent Relationships (1-1, 1-N, N-N qua `farmer_markets`, Polymorphic `morphMany` cho `favorites`).
- [x] Viết `DatabaseSeeder.php` hoàn chỉnh: 3 tài khoản demo cố định (`admin@marketlink.com`, `farmer@marketlink.com`, `customer@marketlink.com`), 6 chợ Chicago kèm lịch họp và toạ độ thực tế, 5 ngành hàng, sản phẩm, weekly stock templates, đơn mẫu, review, thông báo và contact messages.
- [x] Kiểm tra cú pháp PHP (Linting) 100% các file migrations, models và seeder: **0 syntax errors**!
- Tình trạng: **100% HOÀN TẤT DAY 2 CODEBASE**! Sẵn sàng cho Day 3 xây dựng RESTful API Controllers.

### Day 3: Laravel RESTful Controllers & Core Business Logic

- [x] **Phase 3.1 Nền tảng Middleware & Response**: Hoàn thành `ApiResponse` trait, `RoleMiddleware`, `EnsureFarmerActive`, đăng ký aliases trong `bootstrap/app.php` và 9 unit/feature tests passed 100%.
- [x] **Phase 3.2 Nhóm 1 Auth & Profile**: Register (Customer kèm tự động tạo Cart rỗng, Farmer pending phê duyệt), Login (email hoặc username, kiểm tra status active/pending/banned, cấp Sanctum token), Logout, Get Current User (`/api/v1/auth/me`), Update Profile (`/api/v1/auth/profile`), Change Password (`/api/v1/auth/change-password`). Tạo 15 Feature Tests pass 100%.
- [x] **Phase 3.3 Nhóm 2 Danh Bạ Chợ & Lịch Họp Chợ (Markets & Schedules)**: Public list markets (lọc search, day_of_week), get single market details (schedules, active farmer stalls), Admin CRUD markets & operating schedules, soft-delete. 11 Feature Tests pass 100%.
- [x] **Phase 3.4 Nhóm 3 Hồ Sơ Nông Dân & Cấu Hình Sạp Chợ (Farmers & FarmerMarkets)**: Public list farmers (search, sort, filter by market), get single farmer details, Farmer xem/cập nhật hồ sơ sạp, xem chợ đã đăng ký, đăng ký bán tại chợ mới, cấu hình ngày/khung giờ/slot 15-60p/cutoff 1-72h, rút sạp khỏi chợ. 12 Feature Tests pass 100%.
- [x] **Phase 3.5 Nhóm 4 Ngành Hàng & Catalog Nông Sản (Categories & Products)**: Public list categories kèm đếm sản phẩm active, Admin CRUD categories, Public catalog sản phẩm với bộ lọc đa tiêu chí (danh mục, sạp nông dân, chợ, khoảng giá, fulltext search, availability, sort), ẩn sản phẩm vi phạm khỏi public, Farmer CRUD nông sản sạp riêng, kiểm soát quyền sở hữu đa sạp, Admin toggle hide. 26 Feature Tests mới (8 Category + 18 Product), tổng 79/79 Feature/Unit Tests passed 100%.
- [x] **Phase 3.6 Nhóm 5 Mẫu Tồn Kho Mở Bán Định Kỳ Tuần (Weekly Stock Templates)**: Nông dân cấu hình định mức kho theo từng thứ họp chợ (T7/CN), xem danh sách mẫu theo nông sản, 1-Click áp dụng mẫu kho cho phiên chợ tới (tự động nhận diện thứ hoặc theo ngày chỉ định) cập nhật `stock_quantity` và bật `available`. 9 Feature Tests mới, tổng 92/92 Feature/Unit Tests passed 100%.
- [x] **Phase 3.7 Nhóm 6 Giỏ Hàng Mua Sắm (Shopping Cart)**: Khách hàng quản lý giỏ hàng mua sắm, tự động nhóm các món theo từng sạp nông dân (kèm tính tạm tính theo sạp và danh sách chợ sạp tham gia), thêm món (tự động cộng dồn số lượng, kiểm tra tồn kho, chặn sản phẩm bị ẩn/hết hàng), cập nhật số lượng, xoá món và dọn sạch giỏ. 12 Feature Tests mới, tổng 107/107 Feature/Unit Tests passed 100%.
- [x] **Phase 3.8 Nhóm 7 Đặt Hàng Pre-Order & Xử Lý Vòng Đời Đơn (Orders & OrderItems)**: Tách đơn đa sạp, dịch vụ tính khung giờ pickup và cutoff time (`TimeSlotGeneratorService`), dịch vụ checkout (`PreOrderCheckoutService`) với khóa dòng kho `lockForUpdate()` và `DB::transaction()`, cỗ máy trạng thái (placed -> accepted -> ready_for_pickup -> completed / declined / cancelled), hoàn kho tự động và thông báo in-app. 17 Feature Tests mới, tổng 124/124 Feature/Unit Tests passed 100%.
- [x] **Phase 3.9 Nhóm 8 Đánh Giá & Mục Yêu Thích (Reviews & Favorites)**: Đánh giá 1-5 sao sau đơn hoàn thành, ràng buộc XOR sạp hoặc nông sản, nông dân trả lời review sản phẩm, kiểm duyệt review, tự động tính avg_rating & review_count (`RatingCalculationService`), danh sách và toggle đa hình yêu thích (`favorites`). 17 Feature Tests mới, tổng 141/141 Feature/Unit Tests passed 100%.
- [x] **Phase 3.11 Nhóm 10 Quản Trị Hệ Thống & Hộp Thư Liên Hệ (Admin Stats & Contact Messages)**: Thống kê tổng quan sàn (doanh thu hoàn tất, phân bổ đơn hàng, users, chợ, nông sản, review rating sàn, inquiries, top 5 nông dân uy tín), quản lý người dùng & khoá/mở tài khoản (chặn admin tự đổi status chính mình), phê duyệt/từ chối sạp nông dân pending (+ gửi notification in-app), form liên hệ public & Admin Inquiries inbox (lọc đọc/chưa đọc, tìm kiếm, đánh dấu đã đọc). 14 Feature Tests mới, tổng 164/164 Feature/Unit Tests passed 100%.
- [x] **Phase 3.12 Kiểm Thử Tích Hợp API (API Testing Suite & Zero N+1 Query)**: Kiểm thử CORS pre-flight, tính nhất quán HTTP status codes (`200`, `201`, `400`, `401`, `403`, `404`, `422`), xác thực Zero N+1 query (`ZeroNPlusOneIntegrationTest.php`), và kiểm thử tích hợp E2E toàn diện vòng đời đơn pre-order & review (`CustomerOrderLifecycleIntegrationTest.php`). 13 Feature Tests mới, tổng 177/177 Feature/Unit Tests passed 100%.
- Tình trạng: **100% HOÀN TẤT DAY 3!** Toàn bộ 12 Phases, 11 Controllers, 18 Form Requests, 15 JsonResources và 177 Feature/Unit Tests hoạt động hoàn hảo. Sẵn sàng cho Day 4 kết nối Frontend React Vite.

### Day 4: Tích Hợp Frontend React Vite Với Backend REST API (17 Phases Chuyên Biệt)

- `[x]` **Rà Soát Codebase & Ma Trận Khoảng Trống (Gap Analysis)**:
  - Đối chiếu 100% components Frontend với 10 nhóm Backend Endpoints.
  - Lập danh sách chi tiết các UI thừa/mock rác cần gỡ bỏ: `GoogleSignInButton.jsx` (không có Social OAuth), `ForgotPasswordPage.jsx` (OTP giả lập), các nút 1-Click Autofill/Demo Fill rác, tab `PREFERENCES` lưu localStorage không có trong DB schema, form Pre-Order mock trực tiếp trên `ProductDetailPage.jsx`.
  - Tái cấu trúc thành **17 Phases chuyên biệt** tại `ROADMAP/Day4_Views_Frontend.md`.
- `[ ]` **Phase 4.1**: Tầng Dịch Vụ API Client Độc Lập (13 API modules `src/api/*`).
- `[ ]` **Phase 4.2**: Chuẩn Hóa Xác Thực, 1-Click Demo Login & Gỡ Bỏ UI Thừa (Google Login).
- `[ ]` **Phase 4.3**: Nâng Cấp Trang Đăng Ký Tài Khoản & Mở Sạp Nông Dân (`RegisterPage.jsx`).
- `[ ]` **Phase 4.4**: Tích Hợp Trang Chủ & Trang Liên Hệ (`HomePage.jsx`, `ContactPage.jsx`, `AnnouncementBanner.jsx`).
- `[ ]` **Phase 4.5**: Danh Bạ Chợ & Lịch Họp Chợ Phiên (`MarketsPage.jsx`, helper day of week, GPS map).
- `[ ]` **Phase 4.6**: Catalog Nông Sản & Bộ Lọc Đa Tiêu Chí (`ProductsPage.jsx`, categories API, pipeline filters).
- `[ ]` **Phase 4.7**: Chi Tiết Nông Sản & Gỡ Bỏ Form Pre-Order Autofill (`ProductDetailPage.jsx`, reviews, quantity picker).
- `[ ]` **Phase 4.8**: Xây Dựng Hệ Thống Giỏ Hàng Toàn Cục (`CartContext.jsx`, `CartDrawer.jsx` gom nhóm theo sạp).
- `[ ]` **Phase 4.9**: Quy Trình Đặt Hàng Pre-Order & Chọn Khung Giờ (`PreOrderCheckoutModal.jsx`, slots, cutoff).
- `[ ]` **Phase 4.10**: Cổng Khách Hàng - Lịch Sử Đơn Hàng & Tra Cứu Tiến Độ (`CustomerOrdersPage.jsx`, `OrderPickupTrackerPage.jsx`).
- `[ ]` **Phase 4.11**: Cổng Khách Hàng - Đánh Giá 5 Sao, Hồ Sơ & Mục Yêu Thích (`ReviewModal.jsx`, `CustomerProfilePage.jsx` gỡ preferences rác).
- `[ ]` **Phase 4.12**: Cổng Nông Dân - Hàng Đợi Duyệt Đơn Pre-Order (`FarmerDashboard.jsx` Queue: accept, ready, complete, decline reason).
- `[ ]` **Phase 4.13**: Cổng Nông Dân - Quản Lý Kho & Mẫu Kho Tuần 7 Ngày (`FarmerDashboard.jsx` Inventory CRUD & Weekly Stock Rollover).
- `[ ]` **Phase 4.14**: Cổng Nông Dân - Cấu Hình Sạp Chợ & Phản Hồi Đánh Giá (`FarmerMarketsTab`, `FarmerReviewsTab`).
- `[ ]` **Phase 4.15**: Cổng Admin - Thống Kê KPIs, Phê Duyệt Nông Dân & Quản Trị Users (`AdminDashboard.jsx`: overview stats, pending farmers, users active/banned).
- `[ ]` **Phase 4.16**: Cổng Admin - Quản Lý Chợ, Danh Mục, Ẩn/Hiện, Thông Báo & Hộp Thư (`AdminDashboard.jsx`: markets, categories, toggle-hide, announcements, inquiries).
- `[ ]` **Phase 4.17**: Thông Báo In-App, Đánh Bóng UX/UI & Kiểm Thử Tích Hợp (`NotificationDropdown.jsx`, responsive, 0 console.log).
- Tình trạng: **Đã tái cấu trúc hoàn tất 17 Phases Day 4**. Sẵn sàng thực thi Phase 4.1.

### Day 5: End-to-End Testing, Polish, Deploy Vercel + Render & Chuẩn Bị Demo

- `[ ]` Code Freeze: Dừng thêm tính năng mới
- `[ ]` Kiểm thử End-to-End: Luồng Khách duyệt nông sản -> Chọn ngày họp chợ & Pre-order -> Nông dân duyệt & đóng gói -> Khách nhận hàng tại sạp -> Đánh giá sao
- `[ ]` Kiểm tra CORS và kết nối giữa Frontend trên Vercel và Backend trên Render
- `[ ]` Dọn dẹp dữ liệu rác, chạy lại Seeder tạo bộ dữ liệu mẫu chuẩn chỉ
- `[ ]` Viết kịch bản demo trình diễn trước Ban Giám Khảo TechWiz 7
- Tình trạng: Chờ thực hiện sau Day 4
