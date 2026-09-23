# DAY 0: SETUP NỀN TẢNG API, REACT VITE FRONTEND & HẠ TẦNG DEPLOY
# DỰ ÁN CHÍNH THỨC: MARKETLINK - EGREEN BASKET (SRS TECHWIZ 7)

**Mục tiêu**: Chuẩn bị 100% nền tảng công nghệ trước khi bước vào cuộc thi. Hoàn tất cấu hình Backend Laravel Web API (Sanctum, CORS, Render CI/CD) và bộ khung dự án Frontend React JS + Vite (TailwindCSS, Axios Interceptors, AuthContext, ProtectedRoute cho 3 roles), sẵn sàng kết nối và deploy tức thì khi có đề bài.

---

## 📌 Khung Đề Bài SRS Chính Thức: MarketLink (eGreen Basket)
- **Theme**: **eGreen Basket** (Nền tảng thương mại nông sản xanh & Chợ nông dân địa phương)
- **Slogan**: *Farm Fresh Just a Click Away*
- **Tên dự án**: **MarketLink**
- **Category**: Website Design and Development / Web Innovation Unleashed
- **Phạm vi tính năng chính (SRS Functional Requirements)**:
  1. **Landing / Home Page**: Hero banner nhận diện thương hiệu "Farm Fresh Just a Click Away", Giới thiệu mô hình chợ nông sản, Chợ nổi bật (Featured Markets), Nông sản tươi theo mùa (Seasonal Fresh Harvest), Quy trình 3 bước Đặt trước giữ chỗ (How Pre-Order Works), Đánh giá từ khách hàng (Customer Testimonials).
  2. **Local Markets Directory & Interactive Map**: Danh bạ các chợ nông dân địa phương kèm bản đồ định vị tương tác (OpenStreetMap / Google Maps Embed), hiển thị lịch họp chợ (VD: Thứ 7 & Chủ Nhật 08:00 - 14:00), địa chỉ và nút chỉ đường trực tiếp.
  3. **Product Catalog with Multi-Filter**: Danh mục nông sản tươi sống đa dạng:
     - Phân loại ngành hàng: *Fresh Vegetables, Orchard Fruits, Farm Dairy & Eggs, Artisan Bakery, Pantry & Honey*.
     - Bộ lọc nâng cao: Theo Chợ / Sạp nông dân, Khoảng giá ($2 - $40), Chứng nhận hữu cơ (Organic Certified), Tình trạng còn hàng (In Stock).
     - Sắp xếp: Giá tăng dần/giảm dần, Mới thu hoạch nhất, Đánh giá cao nhất.
  4. **Product Detail & Pre-Order for Pickup**: Trang chi tiết nông sản với hình ảnh chất lượng cao, thông tin xuất xứ trang trại (Farm Origin), ngày thu hoạch, chứng nhận tiêu chuẩn, đơn giá theo đơn vị ($/lb, $/bundle, $/jar).
     - **Form Đặt Trước Giữ Chỗ (Pre-Order Request Form)**: Chọn ngày nhận hàng tại chợ (Market Date), chọn khung giờ đến lấy (Pickup Window: 08:00-10:00, 10:00-12:00, 12:00-14:00), nhập số lượng và thông tin liên hệ.
  5. **Order Pickup Tracker**: Trang theo dõi trạng thái đơn hàng thời gian thực qua mã đơn (Order Tracking Code):
     - Quy trình 4 bước trực quan: `Order Placed` ➔ `Farmer Confirmed` ➔ `Harvested & Packed` ➔ `Ready for Pickup at Stall` ➔ `Completed`.
     - Bản đồ vị trí sạp tại chợ và hướng dẫn nhận hàng.
  6. **Customer Portal**: Quản lý lịch sử các đơn đặt trước, danh sách sạp/chợ yêu thích, quản lý hồ sơ cá nhân (thông tin liên hệ, chợ thân quen gần nhà, sở thích ăn uống thực phẩm sạch).
  7. **Farmer / Vendor Portal**: Phân hệ dành riêng cho nông dân / chủ sạp:
     - Hàng chờ đơn đặt trước (Incoming Pre-orders Queue) để duyệt/chuẩn bị đơn.
     - Quản lý danh mục hàng hóa & số lượng mở bán theo tuần (Weekly Stock Inventory).
     - Cập nhật thông tin sạp hàng tại các chợ địa phương.
  8. **Admin Portal**: Quản trị toàn bộ sàn:
     - Quản lý danh bạ chợ địa phương (Thêm/sửa địa điểm, lịch họp, tọa độ).
     - Phê duyệt / Quản lý tài khoản nông dân đăng ký mở sạp.
     - Kiểm duyệt đánh giá & xử lý phản ánh (Review Moderation & Reports).
     - Báo cáo thống kê sản lượng pre-order và số lượng sạp hoạt động.
  9. **Feedback & Review System**: Đánh giá 1-5 sao kèm bình luận thực tế của khách hàng sau khi nhận hàng tại sạp.
  10. **About Us, Image Gallery, Contact Us, Sitemap & 404 Page**: Giới thiệu sứ mệnh kết nối nông nghiệp bền vững, bộ sưu tập ảnh nông trại, form liên hệ ban quản trị chợ, sơ đồ điều hướng website và trang 404 mang phong cách eGreen Basket.

- **Ràng buộc cứng bắt buộc (SRS Constraints)**:
  - *TUYỆT ĐỐI KHÔNG TÍCH HỢP CỔNG THANH TOÁN ONLINE (No payment gateways required - payment at stall upon pickup).* Khách hàng thanh toán tiền mặt hoặc trực tiếp tại sạp khi kiểm tra nông sản.
  - *Không hỗ trợ dịch vụ giao hàng shipper (Home delivery is out of scope).* Toàn bộ giao dịch diễn ra theo cơ chế Pre-order và tự đến chợ nhận hàng (Local Pickup).
  - Thiết kế 1 theme sáng tươi mát (Fresh Botanical Light Theme), **tuyệt đối không tốn thời gian làm dark/light theme switch**.

---

## 🗄️ Thiết Kế Các Bảng Cơ Sở Dữ Liệu Cốt Lõi (Core Tables Theo SRS Section 1.8)
Hệ thống 6 bảng CSDL chuẩn hóa theo đặc tả SRS để phát triển từ Day 0 -> Day 3:

1. **`users`** (Đã khởi tạo & seed):
   - `id`, `fullname`, `username`, `email`, `phone`, `role` (`admin`, `farmer`, `customer`), `status` (`active`, `pending`, `banned`), `avatar_url`, `password`, `timestamps`, `softDeletes`.
2. **`markets`** (Danh bạ các chợ nông dân địa phương):
   - `id`, `name`, `slug`, `address`, `city`, `latitude`, `longitude`, `operating_days` (JSON/string: "Wed, Sat, Sun"), `opening_hours` ("08:00 AM - 02:00 PM"), `image_url`, `description`, `status` (`active`, `upcoming`, `closed`), `timestamps`, `softDeletes`.
3. **`products`** (Quản lý nông sản tươi sạch):
   - `id`, `farmer_id` (foreign key -> users), `market_id` (foreign key -> markets), `name`, `slug`, `category` (`vegetables`, `fruits`, `dairy_eggs`, `bakery`, `pantry`), `origin_farm`, `harvest_date`, `is_organic` (boolean), `price`, `unit` (`lb`, `bundle`, `box`, `jar`, `dozen`), `stock_quantity`, `image_url`, `description`, `status` (`available`, `out_of_stock`, `seasonal_ended`), `timestamps`, `softDeletes`.
4. **`orders`** (Đơn đặt trước giữ chỗ - Pre-orders for Pickup):
   - `id`, `order_code` (VD: `MLB-2026-8819`), `customer_id` (foreign key -> users), `farmer_id` (foreign key -> users), `market_id` (foreign key -> markets), `product_id` (foreign key -> products), `quantity`, `unit_price`, `total_estimated_amount`, `pickup_date`, `pickup_time_slot` ("08:00 AM - 10:00 AM"), `customer_name`, `customer_phone`, `pickup_notes`, `status` (`placed`, `accepted`, `ready_for_pickup`, `completed`, `cancelled`), `timestamps`, `softDeletes`.
5. **`reviews`** (Đánh giá chất lượng nông sản & sạp hàng):
   - `id`, `customer_id` (foreign key -> users), `product_id` (foreign key -> products), `farmer_id` (foreign key -> users), `order_id` (foreign key -> orders), `rating` (integer 1-5 sao), `comment` (text), `is_approved` (boolean default true), `timestamps`.
6. **`reports`** (Báo cáo vi phạm / Khiếu nại chất lượng):
   - `id`, `reporter_id` (foreign key -> users), `reported_type` (`farmer`, `product`, `market`), `reported_id`, `reason` (text), `status` (`pending`, `resolved`, `dismissed`), `admin_notes` (text), `timestamps`.
7. **`contact_messages`** (Hòm thư liên hệ Ban quản lý chợ):
   - `id`, `name`, `email`, `subject`, `message`, `is_read` (boolean default false), `timestamps`.

---

## 🎨 Bảng Màu Chuẩn Thiết Kế (Fresh Botanical & Harvest Gold - Light Theme)
Toàn bộ dự án tuân thủ bộ màu chuẩn thực phẩm tươi sạch & nông nghiệp sinh thái:
- **Primary Brand (Xanh lá thực vật tươi mát)**: `#16A34A` / `#198754` - Nút bấm chính, huy hiệu nông sản tươi, navbar active, logo, thanh tiến trình.
- **Primary Dark / Hover (Xanh rừng nguyên sinh)**: `#15803D` / `#146C43` - Trạng thái hover, thanh topbar, chân trang (footer).
- **Accent / Warm Highlight (Vàng cam mùa gặt & Đánh giá)**: `#F59E0B` - Đánh giá sao 1-5 sao, huy hiệu sạp nông dân tiêu biểu, mật ong / nông sản đặc sản.
- **Produce Badge / Discount (Đỏ cà chua chín / Ưu đãi vụ thu hoạch)**: `#DC2626` - Thẻ giảm giá, báo sắp hết hàng tại sạp ("Only 3 left"), nhãn hữu cơ nổi bật.
- **Background (Eco Mint-White sáng sạch)**: `#F8FAF6` - Nền chính toàn bộ trang web (tươi sáng, sạch sẽ, không gây cảm giác lạnh lẽo như màu xanh bệnh viện).
- **Card**: `#FFFFFF` - Nền thẻ nông sản, card thông tin sạp, form đặt hàng, modal popup.
- **Chữ chính (Dark Charcoal)**: `#0F172A` / `#1E293B` - Tiêu đề, tên nông sản, số liệu giá cả.
- **Chữ phụ (Natural Slate)**: `#475569` / `#64748B` - Mô tả xuất xứ trang trại, nhãn phụ, placeholder.
- **Viền (Border ô liu mềm)**: `#E2E8DF` - Viền ô input, viền card, đường kẻ phân cách nhẹ nhàng.
- **Artisan Earth Accent (Nâu đất / Thủ công hữu cơ)**: `#78350F` - Thẻ danh mục đồ khô thủ công, bơ sữa truyền thống.

---

## Phase 0.1: Cấu Hình Backend Laravel Web API
- `[x]` Cài đặt PHP 8.4 và Composer.
- `[x]` Khởi tạo project Laravel & cấu hình `.env`.
- `[x]` Cài đặt & cấu hình **Laravel Sanctum** (`HasApiTokens`, cấp bearer token đăng nhập).
- `[x]` Cấu hình CORS (`config/cors.php`): Cho phép headers, methods `*`, paths `api/*`.
- `[x]` Tạo Controller kiểm tra sức khỏe API: `GET /api/v1/health` trả về `{ "success": true, "status": "ok", "timestamp": "..." }`.

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
  - `npm install react-router-dom axios lucide-react`
  - `npm install -D tailwindcss @tailwindcss/vite`
- `[x]` Cấu hình biến môi trường Frontend `.env`:
  ```env
  VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
  ```

## Phase 0.5: Xây Dựng Kiến Trúc Axios & Auth Context
- `[x]` Tạo `src/api/axiosClient.js`:
  - Cấu hình `baseURL: import.meta.env.VITE_API_BASE_URL`.
  - Request Interceptor: Tự động đính `Authorization: Bearer <token>` từ `localStorage`.
  - Response Interceptor: Bắt lỗi toàn cục, tự động redirect về `/login` nếu gặp HTTP `401 Unauthorized`.
- `[x]` Tạo `src/context/AuthContext.jsx`:
  - Quản lý state: `user`, `token`, `role` (`admin`, `farmer`, `customer`), `isAuthenticated`, `isLoading`.
  - Hàm `login(credentials)`: Cho phép đăng nhập bằng cả Gmail hoặc Username.
  - Hàm `quickDemoLogin(role)`: Đăng nhập nhanh 1-chạm cho 3 roles (Admin, Farmer, Customer).
  - Hàm `logout()`: Xóa token, gọi API revoke token, reset state.
- `[x]` Tạo giao diện Demo Day 0 chuẩn hóa 100% tiếng Anh trong `App.jsx`.

## Phase 0.6: Xây Dựng Khung Phân Quyền Router (3 Roles) & Layouts
- `[x]` Tạo `src/routes/ProtectedRoute.jsx`:
  - Nhận prop `allowedRoles={['admin', 'farmer', 'customer']}`.
  - Nếu chưa đăng nhập -> Chuyển hướng tới `/login`.
  - Nếu đã đăng nhập nhưng role không khớp -> Chuyển hướng tới `/unauthorized`.
- `[x]` Tạo layout khung cho 3 vai trò:
  - `AdminLayout.jsx`: Sidebar quản trị chợ, Header thống kê, content container.
  - `FarmerLayout.jsx` (thay thế Operator): Giao diện quản lý sạp nông sản, thanh thông báo đơn đặt trước mới.
  - `CustomerLayout.jsx` (thay thế User): Navbar khách mua hàng, giỏ đặt trước, liên kết sạp yêu thích.
- `[x]` Khởi tạo các trang Public theo SRS: `HomePage.jsx`, `AboutPage.jsx`, `GalleryPage.jsx`, `FeedbackPage.jsx`, `ContactPage.jsx`, `SitemapPage.jsx`.

## Phase 0.7: Chuẩn Bị Cấu Hình Deploy Frontend Lên Vercel
- `[x]` Tạo file `vercel.json` trong thư mục frontend để xử lý Single Page Application (SPA) routing.
- `[x]` Kiểm tra và cấu hình Root Directory `frontend` cho Vercel.
- `[x]` Test build thử nghiệm `npm run build` thành công.

## Phase 0.8: Hệ Thống Custom React Modal Chuẩn Mực
- `[x]` Gỡ bỏ hoàn toàn `sweetalert2`, tối ưu bundle size và DOM rendering.
- `[x]` Xây dựng hệ thống Modal nội bộ chuẩn React 19 (`createPortal`):
  - `src/components/common/Modal.jsx`: Backdrop mờ, bo góc sạch sẽ, hỗ trợ Esc & backdrop click.
  - `src/context/ModalContext.jsx`: Cung cấp hook `useModal()` (`showAlert`, `showConfirm`, `showCustomModal`).
- `[x]` Áp dụng Modal vào xác nhận đặt hàng pre-order, thông báo auth và thao tác quản trị.

## Phase 0.9: Hoàn Thiện Bộ UI Xác Thực (Đăng Ký, Google Social Login & Quên Mật Khẩu)
- `[x]` Xây dựng Trang Đăng Ký Tài Khoản (`src/pages/auth/RegisterPage.jsx`):
  - Form đăng ký: Họ và tên, Username, Email, Số điện thoại, Lựa chọn vai trò (Customer hoặc Local Farmer Vendor), Mật khẩu.
  - Tích hợp 1-Click Demo Fill cho ban giám khảo.
- `[x]` Nút Đăng Nhập Nhanh Qua Google ("Sign in with Google"):
  - Thiết kế chuẩn Google Identity Brand Guidelines.
  - 1-chạm đăng nhập tài khoản Google mẫu (`customer.demo@gmail.com`, role `customer`).
- `[x]` Trang Quên & Đặt Lại Mật Khẩu (`src/pages/auth/ForgotPasswordPage.jsx`):
  - Quy trình 2 bước: Nhập Email nhận OTP (60s cooldown) -> Nhập OTP (`123456`) & đặt mật khẩu mới.

## Phase 0.10: Bản Đồ Chợ Nông Sản (Contact Page) & Cơ Chế Pre-Order Chi Tiết
- `[x]` Bản đồ tương tác định vị Ban Quản Lý Chợ Nông Sản Chicago (`src/pages/public/ContactPage.jsx`):
  - Tọa độ trung tâm chợ nông sản Chicago (`41.8827, -87.6233` - Khu vực Green Loop Market).
  - Tích hợp OpenStreetMap / Google Maps Embed bảo mật, không cần API key.
  - Nút "Get Directions" mở ứng dụng bản đồ chỉ đường đến chợ.
- `[x]` Khung form đặt trước giữ chỗ (Pre-order Request Form) không yêu cầu thanh toán online.

---

## 🚀 KẾ HOẠCH REFACTOR GIAO DIỆN SANG MARKETLINK (PHASES 0.11 -> 0.17)

### Phase 0.11: Tái Cấu Trúc Thương Hiệu & Hệ Màu Mới (MarketLink Brand Identity & Fresh Botanical Theme)
- `[x]` Cập nhật `src/index.css` với Tailwind theme tokens chuẩn **Fresh Botanical & Harvest Gold**:
  - Đổi các biến màu từ `--color-medical-*` sang hệ `--color-market-primary` (`#16A34A`), `--color-market-primary-dark` (`#15803D`), `--color-market-accent` (`#F59E0B`), `--color-market-bg` (`#F8FAF6`), `--color-market-border` (`#E2E8DF`), `--color-market-text` (`#0F172A`).
- `[x]` Refactor `src/components/layout/PublicNavbar.jsx`:
  - Đổi logo và tên thương hiệu: **MarketLink** (Badge: *eGreen Basket*).
  - Topbar: *🌿 Local Farmers Markets • Fresh Organic Harvest • Community Supported Agriculture*.
  - Hotline hỗ trợ: `(312) 555-FARM` / `support@marketlink.org`.
  - Menu điều hướng: *Markets Directory (`/markets`), Fresh Produce (`/products`), How It Works, About Us, Community Feedback (`/feedback`), Contact Us (`/contact`)*.
- `[x]` Refactor `src/components/layout/PublicFooter.jsx`:
  - Thông tin thương hiệu MarketLink, tuyên ngôn phát triển nông nghiệp xanh bền vững, giảm thiểu phát thải chuỗi cung ứng thực phẩm (Zero Food Miles).
  - Liên kết danh mục: Rau xanh củ quả vụ mới, Sạp chợ theo quận, Hướng dẫn đặt trước nhận tại sạp, Điều khoản nông dân.
- `[x]` Refactor `src/pages/public/HomePage.jsx`:
  - **Hero Section**: Banner ấn tượng "Farm Fresh Just a Click Away", tìm kiếm nhanh nông sản theo từ khóa và chợ địa phương.
  - **Featured Local Markets**: Grid hiển thị 3 chợ nông sản nổi bật (Lincoln Park Farmers Market, Logan Square Market, Green City Market).
  - **Seasonal Harvest Highlights**: Danh sách nông sản tươi ngon nhất tuần (Cà chua gia truyền Heirloom, Dâu tây hữu cơ, Mật ong hoa rừng, Phô mai dê thủ công).
  - **How Pre-Order Works**: Quy trình 3 bước: 1. Khám phá chợ gần bạn ➔ 2. Đặt trước nông sản chọn ngày nhận ➔ 3. Nhận hàng tại sạp & thanh toán tiền mặt.
  - **Farmer Spotlight & Testimonials**: Trích dẫn câu chuyện người nông dân địa phương và đánh giá của khách hàng.
- `[x]` Cập nhật `AboutPage.jsx` và `GalleryPage.jsx` theo chủ đề nông nghiệp sinh thái & ngày hội chợ nông sản.

### Phase 0.12: Xây Dựng Bộ Dữ Liệu Nông Sản & Trang Catalog Sản Phẩm (Products Catalog & Pre-Order Detail View)
- `[ ]` Tạo bộ dữ liệu Mock Data chuẩn SRS:
  - `src/data/markets.json`: Danh sách 6 chợ nông sản tại Chicago (Tên chợ, địa chỉ, lịch họp chợ, giờ mở cửa, tọa độ GPS, số lượng sạp).
  - `src/data/products.json`: Danh mục 12+ nông sản tươi sạch đa dạng các nhóm ngành (*Vegetables, Fruits, Dairy & Eggs, Bakery, Pantry*), có thông tin xuất xứ trang trại (*Green Valley Organics, Sunny Ridge Orchards...*), ngày thu hoạch, chứng nhận hữu cơ, giá/đơn vị, số lượng tồn sạp.
- `[ ]` Chuyển đổi `AmbulancesPage.jsx` ➔ `src/pages/public/ProductsPage.jsx` (Route `/products`):
  - Bộ lọc đa tiêu chí bên thanh Sidebar:
    - Danh mục: All, Vegetables, Fruits, Dairy & Eggs, Bakery, Pantry.
    - Địa điểm chợ: Lincoln Park, Green City, Logan Square, Loop Market.
    - Thanh trượt khoảng giá ($2 - $40).
    - Bộ lọc nhanh: Chỉ hiển thị hàng Organic Certified, Chỉ hàng có sẵn lấy tuần này.
    - Sắp xếp: Giá thấp -> cao, Giá cao -> thấp, Đánh giá sao, Mới thu hoạch.
  - Thanh tìm kiếm thông minh theo tên rau củ, tên nông trại hoặc từ khóa.
  - Grid thẻ sản phẩm đẹp mắt, hiển thị ảnh tươi ngon, tag Organic, sạp nông dân, đơn vị tính, nút *"Pre-Order for Pickup"* dẫn tới trang chi tiết.
- `[ ]` Chuyển đổi `AmbulanceDetailPage.jsx` ➔ `src/pages/public/ProductDetailPage.jsx` (Route `/products/:id`):
  - Ảnh HD nông sản, câu chuyện trang trại xuất xứ, chứng nhận chất lượng (USDA Organic, Non-GMO).
  - Thông số thu hoạch: Ngày thu hái, cách bảo quản, hạn dùng tươi ngon.
  - **Biểu mẫu Đặt Trước Nhận Hàng (Pre-Order for Pickup Form)**:
    - Chọn ngày họp chợ nhận hàng (Market Day selector).
    - Chọn khung giờ ra sạp nhận (Pickup Window: 08:00 - 10:00, 10:00 - 12:00, 12:00 - 14:00).
    - Chọn số lượng mua (kèm bộ đếm tăng giảm).
    - Tự động tính tổng tiền ước tính (Estimated Total - trả tiền mặt tại sạp).
    - Nhập thông tin người nhận (Họ tên, SĐT, ghi chú đặc biệt cho chủ sạp).
    - Nút bấm *"Confirm Pre-Order (Pay at Stall)"* kết nối `useModal` xác nhận thành công và chuyển hướng đến trang theo dõi mã đơn.

### Phase 0.13: Danh Bạ Chợ Địa Phương & Theo Dõi Đơn Nhận Hàng Tại Sạp (Markets Directory & Order Pickup Tracker)
- `[ ]` Xây dựng Trang Danh Bạ Chợ Nông Dân (`src/pages/public/MarketsPage.jsx` - Route `/markets`):
  - Grid danh sách các chợ nông dân địa phương kèm lịch họp định kỳ (thứ 7 / chủ nhật).
  - Bản đồ Google Maps / OpenStreetMap ghim các vị trí chợ tại thành phố.
  - Thẻ thông tin chi tiết từng chợ: Giờ mở cửa, danh sách các sạp nông dân đang bán, nút "View Stalls & Produce" và nút "Get Directions".
- `[ ]` Chuyển đổi `LiveTrackingPage.jsx` ➔ `src/pages/public/OrderPickupTrackerPage.jsx` (Route `/orders/track/:id`):
  - Nhập mã đơn hoặc truy cập trực tiếp từ link xác nhận pre-order.
  - Tiến trình trạng thái 4 bước: `1. Order Placed` ➔ `2. Farmer Accepted` ➔ `3. Harvesting & Packed` ➔ `4. Ready for Pickup at Stall #08`.
  - Thông tin sạp nhận hàng: Tên nông dân/chủ sạp, số điện thoại liên hệ trực tiếp, số thứ tự sạp tại chợ, khung giờ hẹn nhận.
  - Bản đồ chỉ đường dẫn đến vị trí sạp trong khuôn viên chợ.
  - Nút "Save Order Pass" hoặc "Need Support / Change Pickup Window".
- `[ ]` Chuẩn hóa `NotFoundPage.jsx` & `SitemapPage.jsx` theo phong cách MarketLink.

### Phase 0.14: Phân Hệ Khách Mua Hàng (Customer Portal)
- `[ ]` Chuyển đổi `UserDashboard.jsx` ➔ `src/pages/customer/CustomerDashboard.jsx` (Route `/customer/dashboard`):
  - Lời chào cá nhân hóa, widget tóm tắt: Đơn pre-order đang chờ nhận tuần này, Sạp nông sản đã lưu, Tổng số kg rau quả sạch đã mua ủng hộ nông dân.
  - Danh sách đơn hàng sắp đến giờ lấy (Upcoming Pickups) với đồng hồ đếm ngược và chỉ đường.
  - Đề xuất nông sản vụ mới từ các sạp đã mua quen thuộc.
- `[ ]` Thay thế hoàn toàn `MedicalProfilePage.jsx` ➔ `src/pages/customer/CustomerProfilePage.jsx` (Route `/customer/profile`):
  - Bỏ triệt để các thông tin y tế (nhóm máu, bệnh nền, thuốc men).
  - Thay bằng hồ sơ mua sắm nông sản sạch: Chợ nông dân gần nhà nhất (Preferred Local Market), Thói quen ăn uống (Ăn chay Vegan, Hữu cơ 100%, Không Gluten), Tùy chọn nhắc lịch đi chợ cuối tuần qua SMS/Email.
- `[ ]` Chuyển đổi `UserHistoryPage.jsx` ➔ `src/pages/customer/CustomerOrdersPage.jsx` (Route `/customer/orders`):
  - Bảng danh sách toàn bộ các đơn đặt trước (Đang chuẩn bị, Sẵn sàng lấy, Đã hoàn tất, Đã hủy).
  - Xem chi tiết biên lai đặt trước, đơn giá, địa điểm sạp nhận hàng.
  - Nút *"Leave Feedback & Rating"* mở form đánh giá 1-5 sao cho người nông dân.
- `[ ]` Tích hợp `FeedbackPage.jsx` để gửi đánh giá chất lượng nông sản thực tế.

### Phase 0.15: Phân Hệ Chủ Sạp / Nông Dân (Farmer / Vendor Portal)
- `[ ]` Chuyển đổi `OperatorDashboard.jsx` ➔ `src/pages/farmer/FarmerDashboard.jsx` (Route `/farmer/dashboard`):
  - Quản lý Hàng chờ đơn đặt trước (Incoming Pre-orders Queue):
    - Khách hàng đặt trước rau củ cho phiên chợ cuối tuần.
    - Nông dân xem số lượng cần hái tại vườn, bấm "Accept & Prepare", bấm "Mark as Ready at Stall", hoặc "Completed Pickup".
  - Quản lý Số lượng tồn sạp mở bán (Weekly Stall Stock Manager):
    - Điều chỉnh số kg rau củ / hộp quả mang ra chợ cuối tuần này.
    - Bật/tắt trạng thái hết hàng tạm thời.
  - Thống kê doanh thu tiền mặt ước tính tại sạp và số lượt khách đến lấy hàng.

### Phase 0.16: Phân Hệ Quản Trị Hệ Thống Sàn Chợ (Admin Management Portal)
- `[ ]` Chuẩn hóa `src/pages/admin/AdminDashboard.jsx` (Route `/admin/dashboard`):
  - Quản lý danh mục Chợ Nông Dân địa phương (Thêm chợ mới, cập nhật lịch họp chợ, giờ mở cửa, tọa độ bản đồ).
  - Phê duyệt hồ sơ Nông dân mở sạp (Vendor Applications: kiểm tra chứng nhận trang trại, duyệt quyền bán hàng trên sàn).
  - Quản lý & kiểm duyệt Đánh giá khách hàng (Review Moderation: ẩn đánh giá xấu không phù hợp, làm nổi bật phản hồi tốt).
  - Hộp thư liên hệ (Contact Messages inbox) và Báo cáo tổng quan hoạt động chợ nông sản.

### Phase 0.17: Chuẩn Hóa Component Tái Sử Dụng & Hoàn Thiện Bản Chuẩn Production-Ready
- `[ ]` Bóc tách các Reusable Components dùng chung tại `src/components/common/`:
  - `ProductCard.jsx`: Card nông sản dùng chung cho Home, Catalog, Dashboard.
  - `MarketCard.jsx`: Card chợ địa phương hiển thị lịch họp và vị trí.
  - `StatusBadge.jsx`: Huy hiệu trạng thái đơn pre-order (`Placed`, `Accepted`, `Ready`, `Completed`).
  - `FilterSidebar.jsx`: Thanh lọc danh mục và khoảng giá tái sử dụng.
  - `RatingStars.jsx`: Hiển thị số sao 1-5 sao chuẩn mực.
- `[ ]` Rà soát loại bỏ toàn bộ các UI rác, text thừa thãi, các banner Autofill demo cồng kềnh, chuyển các tiện ích demo thành các nút bấm tinh tế chuyên nghiệp.
- `[ ]` Kiểm tra toàn bộ mã nguồn: 100% tiếng Anh cho UI, không có `console.log`, không có lỗi lint, build `npm run build` thành công tuyệt đối.

---

## 📋 Bảng So Sánh Các Thành Phần Được Giữ Lại, Tối Ưu và Thay Thế

| Thành phần | Trạng thái | Hành động cụ thể |
| :--- | :--- | :--- |
| **Backend Laravel & Sanctum** | **Giữ nguyên 100%** | Giữ trọn vẹn hạ tầng API, CORS, Render deploy, sẵn sàng cho migrations Day 1 |
| **Bộ Auth (Login, Register, Forgot OTP, Google)** | **Giữ & Tối ưu** | Bổ sung lựa chọn vai trò Customer / Farmer khi đăng ký, đổi giao diện sang màu xanh |
| **Hệ thống Modal React Portal** | **Giữ nguyên 100%** | Dùng chung cho xác nhận Pre-order, thông báo sàn, duyệt sạp nông dân |
| **Bản đồ Geolocation (Contact Page)** | **Giữ & Tối ưu** | Đổi tọa độ sang Ban quản lý Chợ nông sản Chicago, tích hợp chỉ đường |
| **Feedback 1-5 sao & Contact Form** | **Giữ & Tối ưu** | Đổi ngữ cảnh sang đánh giá chất lượng nông sản & liên hệ ban quản lý chợ |
| **AmbulancesPage (Danh mục xe)** | **Refactor toàn diện** | Chuyển thành `ProductsPage` (Catalog nông sản với đa bộ lọc rau củ quả) |
| **AmbulanceDetailPage (Chi tiết xe)** | **Refactor toàn diện** | Chuyển thành `ProductDetailPage` (Chi tiết nông sản, xuất xứ nông trại, form Pre-order) |
| **LiveTrackingPage (Theo dõi xe cấp cứu)** | **Refactor toàn diện** | Chuyển thành `OrderPickupTrackerPage` (Theo dõi 4 bước nhận hàng tại sạp chợ) |
| **MedicalProfilePage (Hồ sơ y tế)** | **THAY THẾ HOÀN TOÀN** | Thay bằng `CustomerProfilePage` (Chợ thân quen, thói quen ăn uống thực phẩm sạch) |
| **OperatorDashboard (Trực ca cứu thương)** | **Refactor toàn diện** | Chuyển thành `FarmerDashboard` (Quản lý hàng chờ pre-order & kho sạp nông sản) |
| **AdminDashboard** | **Refactor toàn diện** | Chuyển thành Quản lý chợ địa phương, duyệt nông dân mở sạp, kiểm duyệt review |

---

## 🏆 Tiêu Chuẩn Nghiệm Thu Day 0 Sau Refactor
1. **Brand & Identity**: 100% thương hiệu **MarketLink (eGreen Basket)**, slogan *"Farm Fresh Just a Click Away"*.
2. **Color Palette**: Tông màu Xanh lá nông sản tươi mát (`#16A34A` / `#198754`), Vàng cam mùa gặt (`#F59E0B`), Nền sáng nhẹ (`#F8FAF6`).
3. **Core Workflow**: Khách hàng tìm chợ/nông sản ➔ Chọn ngày họp chợ & khung giờ nhận ➔ Gửi Pre-order (thanh toán tiền mặt tại sạp) ➔ Theo dõi mã đơn ➔ Nông dân nhận đơn chuẩn bị hàng ➔ Đánh giá 1-5 sao sau khi nhận hàng.
4. **Clean Code**: Không `console.log`, không `dd()`, build Vite chạy mượt mà không lỗi.
