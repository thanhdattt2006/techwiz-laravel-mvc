# DAY 0: SETUP NỀN TẢNG API, REACT VITE FRONTEND & HẠ TẦNG DEPLOY
# DỰ ÁN CHÍNH THỨC: LIFELINK - ONLINE EAMBULANCE PORTAL (SRS TECHWIZ 7)

**Mục tiêu**: Chuẩn bị 100% nền tảng công nghệ trước khi bước vào cuộc thi. Hoàn tất cấu hình Backend Laravel Web API (Sanctum, CORS, Render CI/CD) và bộ khung dự án Frontend React JS + Vite (TailwindCSS, Axios Interceptors, AuthContext, ProtectedRoute cho 3 roles), sẵn sàng kết nối và deploy tức thì khi có đề bài.

---

## 📌 Khung Đề Bài SRS Chính Thức: LifeLink (eAmbulance Portal)
- **Theme**: eAmbulance (Hệ thống điều phối & dịch vụ xe cứu thương điện tử)
- **Tên dự án**: **LifeLink**
- **Category**: Website Design and Development / Web Innovation Unleashed
- **Phạm vi tính năng chính (SRS Functional Requirements)**:
  1. **Landing / Home Page**: Catalog hiển thị danh sách xe cứu thương (eAmbulance listings) với thông tin chi tiết, hình ảnh, tình trạng sẵn sàng.
  2. **eAmbulance Types & Details**: Phân loại xe (A/C, Non-A/C, ICU, ICCU), kích cỡ, trang thiết bị y tế đi kèm, bảng giá cước (VD: $12 hoặc $20).
  3. **Search, Sort & Filter**: Tìm kiếm xe theo khu vực/thành phố (VD: "Chicago"), lọc và sắp xếp theo khoảng giá, loại xe, mức độ ưu tiên.
  4. **Emergency Booking / SOS**: Nút "Đặt xe ngay" khẩn cấp kèm toạ độ GPS, điều phối xe tới bệnh nhân.
  5. **About Us Page**: Giới thiệu công ty, quy mô số thành phố/khu vực phục vụ, danh sách đội xe hoạt động xuất sắc.
  6. **Image Gallery**: Bộ sưu tập hình ảnh thực tế các dòng xe cứu thương và trang thiết bị.
  7. **Feedback Form**: Biểu mẫu cho phép người dùng đánh giá chất lượng phục vụ sau khi hoàn thành chuyến đi.
  8. **Contact Us Form**: Thông tin liên hệ đội ngũ hỗ trợ (email: healthcare@icu.com, phone: 030-1111-1234) kèm form gửi tin nhắn cho khách vãng lai.
  9. **Sitemap**: Sơ đồ điều hướng trực quan luồng website đặt tại trang chủ / footer.
- **Ràng buộc quan trọng (SRS Constraints)**:
  - *Không yêu cầu triển khai thanh toán (Checkout / Payment functionality regarding eAmbulances are NOT required).*
  - Thiết kế 1 theme y tế sáng (Light Medical Theme), **tuyệt đối không tốn thời gian làm dark/light theme switch**.

---

## 🗄️ Thiết Kế Các Bảng Cơ Sở Dữ Liệu Cốt Lõi (Core Tables)
Các bảng CSDL chuẩn hóa để thực hành và phát triển từ Day 0 -> Day 3:

1. **`users`** (Đã khởi tạo & seed):
   - `id`, `fullname`, `username`, `email`, `phone`, `role` (`admin`, `operator`, `user`), `status` (`active`, `inactive`, `banned`), `password`, `timestamps`, `softDeletes`.
2. **`ambulances`** (Quản lý đội xe cứu thương):
   - `id`, `vehicle_number`, `model`, `type` (`AC`, `Non-AC`, `ICU`, `ICCU`), `size`, `equipment`, `price`, `region`, `image_url`, `status` (`available`, `busy`, `maintenance`), `timestamps`, `softDeletes`.
3. **`emergency_requests`** (Yêu cầu cấp cứu / Đặt xe):
   - `id`, `user_id`, `ambulance_id`, `patient_name`, `patient_phone`, `pickup_address`, `latitude`, `longitude`, `condition_summary`, `status` (`pending`, `assigned`, `arrived`, `completed`, `cancelled`), `timestamps`, `softDeletes`.
4. **`feedbacks`** (Đánh giá sau chuyến đi):
   - `id`, `user_id` (foreign key -> users), `request_id` (foreign key -> emergency_requests), `rating` (integer 1-5 sao), `comment` (text), `timestamps`.
5. **`contact_messages`** (Tin nhắn liên hệ Contact Us):
   - `id`, `name` (string), `email` (string), `message` (text), `is_read` (boolean default false), `timestamps`.
   - *Đặc điểm*: Khách vãng lai chưa đăng nhập tài khoản vẫn gửi được tin nhắn.
6. **`notifications`** (Thông báo hệ thống):
   - `id`, `user_id` (foreign key -> users), `title` (string), `body` (text), `is_read` (boolean default false), `timestamps`.
   - *Tận dụng cấu trúc notifications có sẵn của Laravel để bắn thông báo điều phối thời gian thực.*

---

## 🎨 Bảng Màu Chuẩn Thiết Kế (Light Medical Theme - Không Dùng Dark Mode)
Toàn bộ dự án tuân thủ bộ màu chuẩn y tế:
- **Primary (Xanh y tế)**: `#0B6EFD` - Nút chính, liên kết, navbar active, brand accent.
- **Primary tối**: `#084298` - Trạng thái hover, header bar, footer.
- **Emergency (Đỏ cấp cứu)**: `#DC3545` - Nút "Đặt xe ngay", badge SOS, cảnh báo nguy cấp.
- **Success (Xanh lá)**: `#198754` - Xe sẵn sàng (available), ca cấp cứu hoàn tất.
- **Warning (Vàng cam)**: `#FFB020` - Đang chờ duyệt (pending), xe đang di chuyển.
- **Nền sáng**: `#F5F8FC` - Background chính của toàn bộ trang web.
- **Card**: `#FFFFFF` - Nền thẻ nội dung, form nhập liệu, modal popup.
- **Chữ chính**: `#1F2A37` - Văn bản chính, tiêu đề, số liệu.
- **Chữ phụ**: `#6B7785` - Văn bản mô tả, placeholder, nhãn phụ.
- **Viền (Border)**: `#E2E8F0` - Viền ô input, viền card, đường kẻ phân cách.

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
  - `npm install react-router-dom axios lucide-react sweetalert2`
  - `npm install -D tailwindcss @tailwindcss/vite`
- `[x]` Cấu hình biến môi trường Frontend `.env`:
  ```env
  VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
  ```
  (Khi deploy Vercel cấu hình biến này trỏ về link live Render: `https://xxxx.onrender.com/api/v1`).

## Phase 0.5: Xây Dựng Kiến Trúc Axios & Auth Context
- `[x]` Tạo `src/api/axiosClient.js`:
  - Cấu hình `baseURL: import.meta.env.VITE_API_BASE_URL`.
  - Request Interceptor: Tự động đính `Authorization: Bearer <token>` từ `localStorage`.
  - Response Interceptor: Bắt lỗi toàn cục, tự động redirect về `/login` nếu gặp HTTP `401 Unauthorized`.
- `[x]` Tạo `src/context/AuthContext.jsx`:
  - Quản lý state: `user`, `token`, `role`, `isAuthenticated`, `isLoading`.
  - Hàm `login(credentials)`: Cho phép đăng nhập bằng cả Gmail hoặc Username.
  - Hàm `quickDemoLogin(role)`: Đăng nhập nhanh 1-chạm cho 3 roles (Admin, Operator, User).
  - Hàm `logout()`: Xóa token, gọi API revoke token, reset state.
- `[x]` Tạo giao diện Demo Day 0 chuẩn hóa 100% tiếng Anh trong `App.jsx`.

## Phase 0.6: Xây Dựng Khung Phân Quyền Router (3 Roles) & Layouts
- `[x]` Tạo `src/routes/ProtectedRoute.jsx`:
  - Nhận prop `allowedRoles={['admin', 'operator', 'user']}`.
  - Nếu chưa đăng nhập -> Chuyển hướng tới `/login`.
  - Nếu đã đăng nhập nhưng role không khớp -> Chuyển hướng tới trang thông báo `/unauthorized` hoặc dashboard tương ứng.
- `[x]` Tạo layout khung cho 3 vai trò (áp dụng bảng màu Light Medical Theme):
  - `AdminLayout.jsx`: Sidebar quản trị, Header, content container.
  - `OperatorLayout.jsx`: Giao diện tối ưu cho điều phối phòng trực (Control Room layout), thanh thông báo SOS khẩn cấp.
  - `UserLayout.jsx`: Navbar người dùng, nút khẩn cấp SOS nổi bật, mobile-first responsive.
- `[x]` Khởi tạo các trang Public theo SRS: `HomePage.jsx`, `AboutPage.jsx`, `GalleryPage.jsx`, `FeedbackPage.jsx`, `ContactPage.jsx`, `SitemapPage.jsx`.

## Phase 0.7: Chuẩn Bị Cấu Hình Deploy Frontend Lên Vercel
- `[x]` Tạo file `vercel.json` trong thư mục frontend để xử lý Single Page Application (SPA) routing:
  ```json
  {
    "framework": "vite",
    "outputDirectory": "dist",
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- `[x]` Kiểm tra và cấu hình Root Directory `frontend` cho Vercel.
- `[x]` Test build thử nghiệm `npm run build` thành công (biên dịch hoàn tất trong 826ms).

## Phase 0.8: Thay Thế SweetAlert2 Bằng Custom React Modal System (Light Medical Theme)
- `[x]` Gỡ bỏ thư viện `sweetalert2` (`npm uninstall sweetalert2`), tối ưu hóa bundle size và loại bỏ triệt để việc can thiệp trực tiếp vào DOM.
- `[x]` Xây dựng hệ thống Modal nội bộ chuẩn React 19:
  - `src/components/common/Modal.jsx`: Wrapper modal sử dụng React Portal (`createPortal`), backdrop kính mờ `backdrop-blur-xs`, bo góc `rounded-2xl`, hỗ trợ phím `Esc` và click backdrop để đóng.
  - `src/context/ModalContext.jsx`: Cung cấp hook toàn cục `useModal()` với các phương thức tiện ích:
    - `showAlert({ title, message, type: 'success' | 'danger' | 'warning' | 'info' })`: Thay thế thông báo popup dạng Alert.
    - `showConfirm({ title, message, confirmText, cancelText, type }): Promise<boolean>`: Thay thế hộp thoại xác nhận (Confirm).
    - `showCustomModal(content)`: Cho phép render trực tiếp Form React component (như form đăng ký xe cứu thương) thay vì raw HTML string.
- `[x]` Refactor toàn bộ các trang đang phụ thuộc SweetAlert2 sang `useModal`:
  - `LoginPage.jsx` (cảnh báo đăng nhập thất bại / chào mừng thành công).
  - `AdminDashboard.jsx` (modal thêm xe cứu thương mới dạng form React sạch với state thay vì `document.getElementById`).
  - `OperatorDashboard.jsx` (dialog chọn xe điều phối và xem GPS telemetry).
  - `UserDashboard.jsx` (hộp thoại xác nhận gửi tín hiệu SOS khẩn cấp).
  - `FeedbackPage.jsx` & `ContactPage.jsx` (thông báo hoàn tất gửi phản hồi / liên hệ).

## Phase 0.9: Hoàn Thiện Bộ UI Xác Thực (Đăng Ký, Google Social Login & Quên Mật Khẩu)
- `[x]` Xây dựng Trang Đăng Ký Tài Khoản (`src/pages/auth/RegisterPage.jsx` - Route `/register`):
  - Form đăng ký công dân / bệnh nhân: Họ và tên, Username, Email, Số điện thoại, Mật khẩu, Nhập lại mật khẩu.
  - Kiểm tra tính hợp lệ (Validation): So khớp mật khẩu, định dạng email, độ dài tối thiểu.
  - Tích hợp tính năng 1-Click Demo Fill (tự động điền dữ liệu mẫu nhanh cho ban giám khảo chấm thi).
  - Tự động tạo phiên làm việc hoặc điều hướng về `/login` với thông báo đăng ký thành công.
- `[x]` Nút Đăng Nhập Nhanh Qua Google ("Sign in with Google" / "Continue with Google"):
  - Thiết kế chuẩn Google Identity Brand Guidelines: Nền trắng, viền `#E2E8F0`, logo chữ "G" 4 màu chính hãng.
  - Tích hợp tại cả `LoginPage.jsx` và `RegisterPage.jsx`.
  - Cơ chế Client Demo: 1-chạm đăng nhập tức thì với tư cách tài khoản Google mẫu (`google.patient@gmail.com`, role `user`).
  - Sẵn sàng cấu hình kết nối OAuth2/Sanctum khi kích hoạt backend.
- `[x]` Trang Quên & Đặt Lại Mật Khẩu (`src/pages/auth/ForgotPasswordPage.jsx` - Route `/forgot-password`):
  - Quy trình 2 bước trực quan (Multi-step flow):
    - **Bước 1**: Nhập Email hoặc Username đã đăng ký để nhận mã xác minh OTP (kèm bộ đếm ngược 60 giây cooldown gửi lại mã).
    - **Bước 2**: Nhập mã OTP (mã demo `123456`) và thiết lập Mật khẩu mới + Xác nhận mật khẩu mới.
  - Đặt lại mật khẩu thành công -> Hiển thị Modal thông báo và chuyển hướng về trang `/login`.
- `[x]` Cập nhật liên kết điều hướng tại `LoginPage.jsx` và đăng ký Route tại `AppRoutes.jsx`:
  - Thêm các liên kết: `"Forgot password?"` và `"Don't have an account? Sign up now"`.
  - Đăng ký các routes: `/register`, `/forgot-password`.

## Phase 0.10: Bản Đồ Trực Tác Tác Chiến (Contact Page) & Trang Chi Tiết Điều Xe (Ambulance Detail View)
- `[x]` Tích hợp Bản Đồ Tương Tác Trung Tâm Điều Phối Cấp Cứu tại `src/pages/public/ContactPage.jsx`:
  - Bản đồ tọa độ chuẩn trung tâm y tế Chicago (`41.8827, -87.6233` - Khu vực Michigan Ave / Central Loop).
  - Tích hợp khung bản đồ tương tác responsive (OpenStreetMap / Google Maps Embed bảo mật, không cần API key phức tạp).
  - Ghim Marker vị trí Trụ sở Trực tổng đài LifeLink (LifeLink 24/7 Dispatch Operations HQ).
  - Thẻ định vị thông tin nhanh (Quick Info Card): Tọa độ GPS, bán kính phủ sóng, nút mở ứng dụng Google Maps chỉ đường ("Get Directions").
- `[x]` Xây dựng Trang Chi Tiết Xe Cứu Thương & Đặt Xe Trực Tiếp (`src/pages/public/AmbulanceDetailPage.jsx` - Route `/ambulances/:id`):
  - Nhận tham số URL động `:id` (ví dụ `/ambulances/AMB-CHI-101`).
  - Hiển thị đầy đủ thông tin chuyên sâu của xe: Ảnh HD, thông số khung gầm, danh mục trang thiết bị y tế cấp cứu chuyên sâu (Máy khử rung tim ALS, bình oxy y tế, cáng cứu thương chống sốc, máy thở ECMO).
  - Bảng giá niêm yết theo chuyến (`$25 / trip`) và khu vực trực chiến (Chicago Central, Downtown...).
  - Form Gửi Yêu Cầu Đặt Xe Trực Tiếp (Pre-dispatch Request Form):
    - Nhập thông tin bệnh nhân, số điện thoại khẩn cấp, địa chỉ đón kèm định vị, tóm tắt tình trạng cấp cứu, chọn bệnh viện tiếp nhận mong muốn.
    - Nút bấm xác nhận đặt xe (kết nối Modal xác nhận `useModal`, không cần thanh toán thẻ tín dụng theo đúng ràng buộc SRS).
  - Cập nhật nút `"Request Unit"` tại `HomePage.jsx` trỏ tới `/ambulances/${amb.id}` thay vì nhảy chung chung về dashboard.

## Phase 0.11: Danh Mục Xe Toàn Diện, Theo Dõi Cấp Cứu Trực Tuyến & Trang 404 Y Tế (AmbulancesPage, LiveTrackingPage, NotFoundPage)
- `[ ]` Trang Danh Mục Xe Cứu Thương Toàn Diện (`src/pages/public/AmbulancesPage.jsx` - Route `/ambulances`):
  - Bộ lọc đa tiêu chí: Loại xe (ICCU, ICU, A/C, Non-A/C), Vùng trực chiến (Chicago Central, Downtown, North, South, West Suburbs), Khoảng giá theo giờ ($10 - $35), Sắp xếp giá tăng/giảm.
  - Thanh tìm kiếm thông minh theo từ khóa (tên xe, biển số, trang thiết bị).
  - Grid danh sách xe với badge trạng thái, thẻ thông số chi tiết, nút "View Specification & Pre-dispatch" dẫn tới `/ambulances/:id`.
  - Cập nhật liên kết "Ambulances" trên `PublicNavbar.jsx` và `PublicFooter.jsx`.
- `[ ]` Trang Theo Dõi Ca Cấp Cứu Thời Gian Thực (`src/pages/public/LiveTrackingPage.jsx` - Route `/tracking/:id`):
  - Truy cập công khai bằng mã ca cấp cứu (Incident Tracking Code).
  - Bản đồ GPS lộ trình trực quan xe đang di chuyển đến vị trí bệnh nhân.
  - Card tài xế: Họ tên, số điện thoại bấm gọi trực tiếp, biển số xe, đơn vị trực ban.
  - Đồng hồ đếm ngược thời gian dự kiến tiếp cận (ETA Counter) và thanh trạng thái tiến trình cứu hộ (Pending -> Dispatched -> En Route -> Arrived -> Transporting -> Completed).
- `[ ]` Trang Báo Lỗi 404 Chuẩn Y Tế (`src/pages/public/NotFoundPage.jsx` - Catch-all Route `*`):
  - Thay thế redirect âm thầm hiện tại bằng trang 404 thương hiệu LifeLink chuyên nghiệp.
  - Minh họa trực quan cấp cứu, thông báo đường dẫn không tồn tại.
  - Nút "Back to Home", "Browse Ambulance Fleet", và nút gọi Hotline khẩn cấp `030-1111-1234`.

## Phase 0.12: Phân Hệ Người Dân & Bệnh Nhân (MedicalProfilePage, UserHistoryPage)
- `[ ]` Trang Hồ Sơ Y Tế Khẩn Cấp (`src/pages/user/MedicalProfilePage.jsx` - Route `/user/medical-profile`):
  - Quản lý hồ sơ y tế: Nhóm máu (A+, A-, B+, B-, AB+, AB-, O+, O-), tiền sử bệnh nền (tim mạch, hen suyễn, tiểu đường, huyết áp), tiền sử dị ứng thuốc (Penicillin, Aspirin...).
  - Người liên hệ khẩn cấp (In Case of Emergency - ICE): Họ tên, số điện thoại, mối quan hệ (Bố/Mẹ, Vợ/Chồng, Con cái).
  - Tự động gắn thẻ cảnh báo y tế khi người dùng kích hoạt tín hiệu SOS.
- `[ ]` Trang Lịch Sử Cứu Trợ Của Người Dân (`src/pages/user/UserHistoryPage.jsx` - Route `/user/history`):
  - Bảng danh sách các ca cấp cứu đã thực hiện của tài khoản.
  - Bộ lọc trạng thái (Hoàn thành, Đã hủy, Đang xử lý).
  - Chi tiết thời gian gọi, địa chỉ đón, bệnh viện tiếp nhận, loại xe phục vụ.
  - Nút "Submit Feedback" dẫn tới form đánh giá chất lượng dịch vụ.

## Phase 0.13: Trạm Chỉ Huy Tác Chiến & Lịch Sử Điều Phối Operator (LiveDispatchMapPage, DispatchHistoryPage)
- `[ ]` Bản Đồ Radar Điều Phối Tác Chiến Toàn Thành Phố (`src/pages/operator/LiveDispatchMapPage.jsx` - Route `/operator/live-map`):
  - Giao diện tác chiến trực quan toàn màn hình hiển thị toàn bộ xe tại Chicago.
  - Phân biệt màu sắc trực quan: Xanh (Available), Vàng (Dispatched/En Route), Đỏ (Incident SOS Alert), Xám (Maintenance).
  - Xem nhanh thông số xe khi click vào marker và nút bấm gán xe cấp tốc cho ca pending gần nhất.
- `[ ]` Nhật Ký & Lịch Sử Điều Phối (`src/pages/operator/DispatchHistoryPage.jsx` - Route `/operator/history`):
  - Bảng thống kê toàn bộ các ca điều phối trong ca trực của Operator.
  - Ghi nhận chi tiết thời gian phản hồi (Response Time), thời gian gán xe, thời gian đến hiện trường và kết quả ca trực.

## Phase 0.14: Bộ Quản Trị Hệ Thống Chuyên Sâu Admin (AdminAmbulancePage, AdminUserPage, AdminFeedbackPage, AdminContactPage, AdminReportsPage)
- `[ ]` Trang Quản Lý Đội Xe Chuyên Biệt (`src/pages/admin/AdminAmbulancePage.jsx` - Route `/admin/ambulances`):
  - Giải phóng menu "Fleet Inventory" trên Sidebar Admin.
  - Bảng quản lý đội xe đầy đủ tính năng CRUD (Thêm mới xe, sửa thông số, cấu hình trang bị, đổi trạng thái bảo trì/sẵn sàng, xóa xe).
- `[ ]` Trang Quản Lý Người Dùng & Phân Quyền (`src/pages/admin/AdminUserPage.jsx` - Route `/admin/users`):
  - Giải phóng menu "System Directory" (trước đây trỏ tạm sang `/sitemap`).
  - Quản lý danh sách người dùng, thay đổi vai trò giữa `admin`, `operator`, `user`, khóa/mở tài khoản (`active`/`banned`).
- `[ ]` Trang Quản Trị Đánh Giá Bệnh Nhân (`src/pages/admin/AdminFeedbackPage.jsx` - Route `/admin/feedbacks`):
  - Giải phóng menu "Patient Feedbacks" (trước đây trỏ sang trang submit công cộng).
  - Bảng kiểm duyệt feedback, lọc theo số sao (1-5 sao), tính điểm CSAT trung bình, duyệt/ẩn feedback hiển thị trang chủ.
- `[ ]` Trang Hộp Thư Tiếp Nhận Liên Hệ (`src/pages/admin/AdminContactPage.jsx` - Route `/admin/messages`):
  - Giải phóng menu "Contact Messages" (trước đây trỏ sang trang submit công cộng).
  - Hộp thư đến quản lý các tin nhắn từ khách gửi qua Contact Form, đánh dấu "Đã đọc / Đã xử lý / Lưu trữ".
- `[ ]` Trang Báo Cáo Phân Tích KPI & Thống Kê (`src/pages/admin/AdminReportsPage.jsx` - Route `/admin/reports`):
  - Báo cáo phân tích KPI thời gian phản hồi trung bình, tỷ lệ cứu hộ thành công, phân bố ca cấp cứu theo quận huyện Chicago.

## Phase 0.15: Quét & Trace Codebase, Tách Reusable Components & Chuẩn Hóa Cấu Trúc Thư Mục (Component Modularization & Folder Architecture)
> **LƯU Ý BẮT BUỘC**: Trước khi thực thi phase này, BẮT BUỘC phải research và trace codebase cẩn thận để tránh làm vỡ giao diện hiện tại hoặc gây trùng lặp mã nguồn.
- `[ ]` Quét toàn bộ codebase `frontend/src/` để bóc tách các component lặp lại thành các reusable components tại `src/components/common/` hoặc `src/components/features/`:
  - `AmbulanceCard.jsx`: Card hiển thị xe cứu thương dùng chung cho Home, Catalog, Fleet list.
  - `StatusBadge.jsx`: Huy hiệu trạng thái xe và ca cấp cứu (Available, Dispatched, Maintenance, Pending, Completed).
  - `FilterBar.jsx`: Thanh lọc theo loại xe, khu vực và khoảng giá.
  - `StatCard.jsx`: Widget chỉ số KPI dùng chung cho Admin và Operator.
  - `PageHeader.jsx`: Banner tiêu đề đồng bộ cho các trang con.
- `[ ]` Tái cấu trúc file/folder chuẩn mực, phân tách rõ ràng giữa `components/`, `pages/`, `hooks/`, `utils/`, đảm bảo nguyên tắc DRY và Single Responsibility.

## Phase 0.16: Dọn Dẹp Giao Diện Production-Ready & Loại Bỏ Mock UI Rác (Remove Mock Autofill & Visual Clutter)
> **LƯU Ý BẮT BUỘC**: Trước khi thực thi phase này, BẮT BUỘC phải research và trace codebase cẩn thận để đảm bảo loại bỏ đúng các phần tử UI giả lập mà không làm ảnh hưởng đến luồng hoạt động chuẩn của ứng dụng.
- `[ ]` Rà soát và loại bỏ toàn bộ các UI thừa thãi, các khối hướng dẫn autofill mẫu trên màn hình Login / Register (như các banner "Demo credentials", "1-Click Autofill banner" lộ liễu làm mất tính chân thực của dự án).
- `[ ]` Giữ lại tính năng demo một cách tinh tế (ví dụ nút demo nhỏ gọn, chuyên nghiệp) thay vì các khối text dài dòng nghiệp dư.
- `[ ]` Tinh chỉnh lại toàn bộ khoảng cách (spacing), typography, viền thẻ (borders) và responsive để ứng dụng đạt chuẩn Production-Ready, sẵn sàng gây ấn tượng mạnh với ban giám khảo.

---

## Tổng Kết Day 0
- `[x]` Backend Render API và Frontend Vercel React Vite đều hoạt động và ping thông nhau.
- `[x]` Đã tích hợp trọn vẹn yêu cầu SRS LifeLink, lược đồ 6 bảng CSDL cốt lõi và hệ màu Light Medical.
- `[x]` Hoàn thiện Phase 0.6 (ProtectedRoute & Layouts) và Phase 0.7 (Deploy Vercel).
- `[x]` Hoàn thành Phase 0.8 (Custom React Modal System) và Phase 0.9 (Auth UI Suite).
- `[x]` Hoàn thành Phase 0.10 (Contact Map & Ambulance Detail View).
- `[/]` Đang chuẩn bị thực thi mở rộng các phân hệ UI hoàn chỉnh (Phases 0.11 -> 0.16) trước khi chuyển sang Day 1.
