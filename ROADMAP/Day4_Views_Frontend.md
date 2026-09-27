# DAY 4: XÂY DỰNG GIAO DIỆN REACT JS (VITE) CHO 3 VAI TRÒ & TÍCH HỢP RESTFUL API

# DỰ ÁN: MARKETLINK - EGREEN BASKET (SRS TECHWIZ 7)

**Mục tiêu**: Xây dựng toàn bộ giao diện Single Page Application (SPA) bằng **React 19 + JavaScript + Vite** kết nối trực tiếp với Laravel REST Web API qua Axios Client. Thiết kế hiện đại 100% bằng **TailwindCSS**, chia tách module rõ ràng (DRY, SOLID), chuẩn hóa theo bảng màu nông sản (Fresh Botanical & Harvest Gold), gỡ bỏ triệt để các UI thừa/mock rác và tích hợp trọn vẹn các tính năng nghiệp vụ đặc thù cho 3 vai trò (`admin`, `farmer`, `customer`).

> [!IMPORTANT]
> ### ⚠️ NGUYÊN TẮC BẮT BUỘC TRƯỚC KHI CODE DAY 4:
> Developer và AI **BẮT BUỘC** phải đọc và tuân thủ tuyệt đối:
> 1. [`RULE.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/RULE.md):
>    - **100% Tiếng Anh cho source code** (tên file, component, props, hooks, biến, hàm, inline comments).
>    - **Tiếng Việt cho kế hoạch và tài liệu Markdown**.
>    - Bảng màu chuẩn nông sản Fresh Botanical & Harvest Gold: Xanh lá `#16A34A`, Xanh rừng `#15803D`, Vàng gặt `#F59E0B`, Nền sáng sinh thái `#F8FAF6`.
>    - **CỐ ĐỊNH 1 GIAO DIỆN NỀN SÁNG, TUYỆT ĐỐI KHÔNG TỐN THỜI GIAN LÀM DARK MODE**.
>    - **Tuyệt đối không để lại `console.log()`** trong mã nguồn trước khi commit.
> 2. [`ai/CONVENTION.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/CONVENTION.md): 100% Functional Components + React Hooks, TailwindCSS, Axios Interceptors, cấu trúc `src/` chuẩn, ModalContext React Portal.
> 3. [`ai/WORKFLOW.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/WORKFLOW.md):
>    - Order State Machine 4 bước: `placed` -> `accepted` -> `ready_for_pickup` -> `completed` / `cancelled`.
>    - **RÀNG BUỘC CỨNG SRS**: Không tích hợp cổng thanh toán online (thanh toán tiền mặt tại sạp khi nhận hàng); Không làm giao hàng tận nhà (khách tự đến sạp nhận pre-order theo slot).
> 4. [`BackEndApiTest.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/BackEndApiTest.md): Đối chiếu chính xác 10 nhóm Endpoint, cấu trúc JSON Request Payload và Response Envelope `{ success, message, data, errors }`.
> 5. [`ai/PROGRESS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/PROGRESS.md) & [`ai/BUGS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/BUGS.md): Đánh dấu tiến độ `[/]` khi bắt đầu, `[x]` khi hoàn thành và ghi chép lỗi phát sinh ngay lập tức.

---

## 1. Kết Quả Rà Soát Chuyên Sâu Codebase & Ma Trận Khoảng Trống (Gap Analysis)

Qua trace chuyên sâu giữa toàn bộ Frontend React (`frontend/src/`) và Backend Laravel API (`backend/`):

| Phân Hệ / Chức Năng | Hiện Trạng Frontend Hiện Tại | Backend API Đã Sẵn Sàng (Day 3) | Đánh Giá Tương Thích & Hướng Xử Lý |
| :--- | :--- | :--- | :--- |
| **Authentication & Demo Login** | `AuthContext.jsx` để `USE_BACKEND_API = false`. Dùng `@gmail.com`, pass `password123`. Vai trò `operator`, `user`. | `POST /api/v1/auth/login`. Tài khoản Seeder: `admin@marketlink.com`, `farmer@marketlink.com`, `customer@marketlink.com` / `password`. Role: `admin`, `farmer`, `customer`. | ❌ **Lệch hoàn toàn**: Bật `USE_BACKEND_API = true`, chuẩn hóa 3 role `admin`, `farmer`, `customer`, cập nhật credentials seeder. |
| **Social Sign-In (Google)** | Component `GoogleSignInButton.jsx` fake login thành `elena.shopper@gmail.com`. | **Không hỗ trợ** (SRS TechWiz không có Social OAuth). | ⚠️ **UI THỪA**: Gỡ bỏ hoàn toàn `GoogleSignInButton.jsx` khỏi Login & Register. |
| **Quên Mật Khẩu (Forgot Password)** | `ForgotPasswordPage.jsx` giả lập gửi OTP mã `123456`. | **Không có endpoint OTP**. Chỉ có `PUT /api/v1/auth/change-password` khi đã đăng nhập. | ⚠️ **UI THỪA**: Gỡ bỏ flow OTP giả lập. Thay bằng hướng dẫn liên hệ Admin qua email/form contact. |
| **Đăng Ký Mở Sạp Nông Dân** | `RegisterPage.jsx` chỉ có form đăng ký Customer. | `POST /api/v1/auth/register-farmer` (chờ Admin duyệt). | ❌ **THIẾU NGHIỆP VỤ**: Bổ sung Tab đăng ký Mở Sạp cho Nông dân (Farmer Stall Application). |
| **Catalog & Danh Bạ Chợ** | `HomePage`, `MarketsPage`, `ProductsPage` đang import file JSON tĩnh `markets.json`, `products.json`. | `GET /api/v1/markets`, `GET /api/v1/products`, `GET /api/v1/categories`. | ❌ **Dữ liệu tĩnh**: Thay bằng gọi API thật qua `axiosClient`, map chính xác các trường dữ liệu API. |
| **Giỏ Hàng (Shopping Cart)** | **Chưa có giỏ hàng**: Không có `CartContext`, không có `CartDrawer`. | `GET/POST/PUT/DELETE /api/v1/cart/*` (Gom nhóm item theo từng sạp nông dân `CartResource`). | ❌ **THIẾU CỐT LÕI**: Xây dựng `CartContext.jsx`, `CartDrawer.jsx` và icon giỏ hàng trên Navbar. |
| **Đặt Hàng Pre-Order & Khung Giờ** | `ProductDetailPage.jsx` có form pre-order giả lập với nút Autofill, sinh mã `MLB-2026-XXXX` ngẫu nhiên. | `GET /api/v1/orders/slots`, `POST /api/v1/orders/checkout`. Tự động tính slot theo cutoff hours và tách đơn theo sạp. | ❌ **Sai luồng & UI thừa**: Gỡ bỏ form autofill trên trang chi tiết; Thay bằng quy trình Pre-Order Checkout chuẩn qua Giỏ hàng. |
| **Hàng Đợi Nông Dân (Farmer Queue)** | `FarmerDashboard.jsx` dùng mảng mock `INITIAL_QUEUE`. | `GET /api/v1/farmer/orders` + 4 transition endpoints (`accept`, `ready`, `complete`, `decline`). | ❌ **Dữ liệu mock**: Kết nối API quản lý đơn thật, modal bắt buộc nhập lý do khi từ chối đơn. |
| **Mẫu Kho Tuần (Weekly Rollover)** | **Chưa có UI**: Nông dân không thể cấu hình định mức bán theo thứ trong tuần. | `GET/PUT /api/v1/farmer/products/{id}/template`, `POST /api/v1/farmer/apply-weekly-templates`. | ❌ **THIẾU TÍNH NĂNG CỐT LÕI**: Tạo Tab Quản lý Mẫu Kho Tuần 7 ngày cho Nông dân. |
| **Cấu Hình Sạp Tại Chợ** | **Chưa có UI**: Không có chỗ cho Nông dân đăng ký sạp vào các chợ phiên. | `GET/POST/PUT/DELETE /api/v1/farmer/markets/*`. | ❌ **THIẾU UI**: Tạo Tab Cấu hình Sạp tại Chợ cho Nông dân (giờ mở, giờ đóng, slot, cutoff). |
| **Phê Duyệt Sạp (Admin Approval)** | `AdminDashboard.jsx` dùng mảng mock `INITIAL_VENDOR_APPLICATIONS`. | `GET /api/v1/admin/farmers/pending`, `PATCH approve`, `PATCH reject` (kèm reason). | ❌ **Dữ liệu mock**: Kết nối API phê duyệt thực tế, modal bắt buộc nhập lý do từ chối. |
| **Quản Trị Người Dùng & Thống Kê** | `AdminDashboard.jsx` dùng mảng mock users và số liệu giả lập. | `GET /api/v1/admin/stats/overview`, `GET /api/v1/admin/users`, `PATCH /users/{id}/status`. | ❌ **Dữ liệu mock**: Kết nối API thống kê thời gian thực và quản trị tài khoản (active/banned). |
| **Thông Báo Toàn Sàn (Announcements)** | `AdminDashboard.jsx` chưa có tab quản lý announcements. | `GET /api/v1/announcements/active`, CRUD `/api/v1/admin/announcements`. | ❌ **THIẾU UI**: Cần banner thông báo trang chủ và tab quản trị announcement trong Admin. |
| **Hộp Thư Liên Hệ (Inquiries)** | `AdminDashboard.jsx` dùng mảng mock `INITIAL_INQUIRIES`. | `POST /api/v1/contact`, `GET /api/v1/admin/inquiries`, `PATCH /{id}/read`. | ❌ **Dữ liệu mock**: Kết nối Contact form công khai và hộp thư quản trị Admin. |
| **Thông Báo In-App (Notifications)** | **Chưa có UI**: Không có chuông thông báo trên Navbar/Dashboard. | `GET /api/v1/notifications`, `PATCH /{id}/read`, `PATCH /read-all`. | ❌ **THIẾU UI**: Thêm Dropdown chuông thông báo kèm badge đếm tin chưa đọc. |
| **Đánh Giá & Phản Hồi (Reviews)** | Dùng dữ liệu mock in-memory, không kiểm tra trạng thái đơn hàng. | `POST /api/v1/reviews` (chỉ đơn `completed`), `POST /api/v1/farmer/reviews/{id}/reply`. | ❌ **Dữ liệu mock**: Tích hợp Modal đánh giá cho đơn hoàn tất và form phản hồi cho nông dân. |

---

## 2. Chi Tiết Các UI Thừa / Mock Rác Cần Gỡ Bỏ (Detailed Cleanup Checklist)

Qua nghiên cứu mã nguồn, các thành phần sau **không được Backend hỗ trợ** hoặc **sai lệch nghiệp vụ SRS**, cần loại bỏ sạch sẽ:

### 2.1. Gỡ Bỏ Đăng Nhập Mạng Xã Hội Google (`GoogleSignInButton.jsx`)
- **Vị trí**:
  - `frontend/src/components/common/GoogleSignInButton.jsx`
  - `frontend/src/pages/auth/LoginPage.jsx` (dòng 5, 269-279)
  - `frontend/src/pages/auth/RegisterPage.jsx` (dòng 5, 344-354)
- **Lý do**: Backend Laravel không có Socialite hoặc API endpoint `/api/v1/auth/google`. Nút này hiện tại chỉ gọi `loginWithGoogle()` fake tài khoản `elena.shopper@gmail.com`.
- **Hành động**: Xóa bỏ component `GoogleSignInButton.jsx`, gỡ khối "Or sign in with Google" khỏi cả 2 trang `LoginPage.jsx` và `RegisterPage.jsx`.

### 2.2. Gỡ Bỏ Quy Trình Quên Mật Khẩu Bằng OTP Giả Lập (`ForgotPasswordPage.jsx`)
- **Vị trí**:
  - `frontend/src/pages/auth/ForgotPasswordPage.jsx`
  - Link "Forgot password?" trên `frontend/src/pages/auth/LoginPage.jsx` (dòng 237-242)
- **Lý do**: Backend không tích hợp SMTP Email hay SMS Provider để gửi OTP. Mã OTP `123456` là logic mock cục bộ. Backend chỉ có API `PUT /api/v1/auth/change-password` khi người dùng đã đăng nhập.
- **Hành động**:
  - Chuyển `ForgotPasswordPage.jsx` thành trang hướng dẫn hoặc thay link "Forgot password?" thành modal thông báo: *"Để đặt lại mật khẩu, vui lòng liên hệ Ban quản trị qua trang Liên Hệ hoặc email support@marketlink.com"*.
  - Gỡ bỏ hàm `resetPassword` mock khỏi `AuthContext.jsx`.

### 2.3. Gỡ Bỏ Form Pre-Order Trực Tiếp Kèm Autofill Trên Trang Chi Tiết Nông Sản (`ProductDetailPage.jsx`)
- **Vị trí**:
  - `frontend/src/pages/public/ProductDetailPage.jsx` (dòng 31-39, 61-92, form đặt hàng bên phải)
- **Lý do**:
  - Nút `handleDemoFill` tự điền tên "Eleanor Vance", phone, slot mock `08:00 AM - 10:00 AM`.
  - Hàm `handlePreOrderSubmit` tự sinh mã đơn `MLB-2026-XXXX` bằng `Math.random()`, hoàn toàn không gọi API `/orders/checkout`, không trừ tồn kho, không lưu vào cơ sở dữ liệu.
  - Sai luồng nghiệp vụ: Khách hàng mua nông sản phải đưa vào Giỏ hàng hoặc bấm "Đặt Trước Ngay" để mở luồng chọn Chợ phiên $\rightarrow$ chọn Ngày họp chợ $\rightarrow$ gọi API lấy Slots pickup khả dụng $\rightarrow$ gọi API Checkout chuẩn.
- **Hành động**:
  - Gỡ bỏ toàn bộ form đặt hàng autofill này khỏi `ProductDetailPage.jsx`.
  - Thay bằng: **Bộ chọn số lượng (Quantity Selector)** + nút **"Thêm Vào Giỏ Hàng" (Add to Cart)** + nút **"Đặt Trước Nhanh" (Pre-Order Now)** mở modal checkout chuẩn.

### 2.4. Gỡ Bỏ Tab Preferences Rác Không Có Trong Database (`CustomerProfilePage.jsx`)
- **Vị trí**:
  - `frontend/src/pages/customer/CustomerProfilePage.jsx` (dòng 27-38, 70-78, 188-225, tab PREFERENCES)
- **Lý do**:
  - Tab `PREFERENCES` chứa các trường: `consumptionFrequency`, `dietaryPreferences` (7 checkbox), `customNotes`, `phoneForStallMaster`, `neighborhood`, `notifySms2HoursBefore`, `notifyFridayHarvestBulletin`, `notifySpecialStallDiscounts`.
  - Nút `handleDemoFill` tự populate các trường này vào `localStorage` (`marketlink_shopper_profile`).
  - Trong Backend: Bảng `users` chỉ có `fullname`, `phone`, `address`, `username`, `email`, `role`, `status`. API `PUT /api/v1/auth/profile` chỉ nhận `fullname`, `phone`, `address`. Các trường preferences trên không hề được lưu trữ trên server.
- **Hành động**:
  - Gỡ bỏ tab `PREFERENCES` và nút `1-Click Demo Fill` rác.
  - Thu gọn `CustomerProfilePage.jsx` thành 2 phần rõ ràng:
    1. **Thông tin cá nhân (Profile Details)**: Họ tên (`fullname`), Số điện thoại (`phone`), Địa chỉ (`address`), Email (readonly), Tên đăng nhập (readonly), Vai trò & Trạng thái tài khoản $\rightarrow$ Kết nối API `PUT /api/v1/auth/profile`.
    2. **Bảo mật & Đổi mật khẩu (Security & Change Password)**: Mật khẩu hiện tại (`current_password`), Mật khẩu mới (`new_password`), Xác nhận mật khẩu (`new_password_confirmation`) $\rightarrow$ Kết nối API `PUT /api/v1/auth/change-password`.

### 2.5. Gỡ Bỏ Các Trường/Form Không Tồn Tại Trong Backend ERD
- **Thanh toán trực tuyến (Online Payment Gateway)**: Tuyệt đối không để sót form nhập thẻ Visa, MoMo, VNPay hay trường chọn cổng thanh toán. Cố định hiển thị: *"Thanh toán tiền mặt tại sạp khi nhận hàng (Cash on Pickup at Stall)"* (Tuân thủ ràng buộc SRS).
- **Giao hàng tận nhà (Home Delivery / Shipping Address / Shipping Fee)**: Khách hàng chỉ nhận hàng trực tiếp tại sạp nông dân theo khung giờ đã đặt trước. Mọi trường nhập phí vận chuyển, đơn vị giao hàng đều là thừa và không được xuất hiện.

---

## 3. Kế Hoạch Triển Khai Chia Nhỏ Theo Chức Năng (17 Phases Chuẩn Hóa)

Nhằm đảm bảo **tính độc lập, rõ ràng, tránh quá tải ngữ cảnh và loại bỏ triệt để nguy cơ AI ảo giác**, kế hoạch Day 4 được chia nhỏ thành **17 Phases chuyên biệt**. Mỗi Phase chỉ tập trung vào một nhóm chức năng vừa đủ, có thể kiểm thử và nghiệm thu ngay trước khi chuyển sang Phase kế tiếp:

```
[Phase 4.1] Tầng API Client (13 modules)
     │
[Phase 4.2] Chuẩn hóa Auth & 1-Click Demo (Gỡ Google Login)
     │
[Phase 4.3] Đăng ký Customer & Mở Sạp Nông Dân
     │
[Phase 4.4] Trang Chủ & Trang Liên Hệ
     │
[Phase 4.5] Danh Bạ Chợ & Bản Đồ Chợ Phiên
     │
[Phase 4.6] Catalog Nông Sản & Bộ Lọc Đa Tiêu Chí
     │
[Phase 4.7] Chi Tiết Nông Sản & Đánh Giá (Gỡ Autofill Pre-order)
     │
[Phase 4.8] Hệ Thống Giỏ Hàng (CartContext & CartDrawer)
     │
[Phase 4.9] Luồng Đặt Hàng Pre-Order & Khung Giờ (Slots & Cutoff)
     │
[Phase 4.10] Cổng Khách Hàng: Lịch Sử Đơn & Tra Cứu Đơn 4 Bước
     │
[Phase 4.11] Cổng Khách Hàng: Đánh Giá 5 Sao, Hồ Sơ & Yêu Thích (Gỡ Preferences)
     │
[Phase 4.12] Cổng Nông Dân: Hàng Đợi Pre-Order (State Machine 4 Bước)
     │
[Phase 4.13] Cổng Nông Dân: Quản Lý Kho & Mẫu Kho Tuần 7 Ngày
     │
[Phase 4.14] Cổng Nông Dân: Cấu Hình Sạp Chợ & Phản Hồi Đánh Giá
     │
[Phase 4.15] Cổng Admin: Thống Kê KPIs, Phê Duyệt Sạp & Quản Trị Users
     │
[Phase 4.16] Cổng Admin: Quản Lý Chợ, Danh Mục, Ẩn/Hiện, Thông Báo & Hộp Thư
     │
[Phase 4.17] Thông Báo In-App, Đánh Bóng UX/UI & Kiểm Thử Tích Hợp
```

---

### Phase 4.1: Xây Dựng Tầng Dịch Vụ API Client Độc Lập (API Layer Foundation)

- **Mục tiêu**: Xây dựng đủ 13 modules API Service trong `frontend/src/api/` ánh xạ 1-1 với toàn bộ REST Endpoints của Backend Laravel.
- **Files tác động**:
  - Tạo mới / cập nhật: `frontend/src/api/authApi.js`, `marketApi.js`, `farmerApi.js`, `productApi.js`, `categoryApi.js`, `weeklyStockApi.js`, `cartApi.js`, `orderApi.js`, `reviewApi.js`, `favoriteApi.js`, `notificationApi.js`, `adminApi.js`, `contactApi.js`.
- **Checklist công việc**:
  - `[ ]` `authApi.js`: `login`, `register`, `registerFarmer`, `getMe`, `updateProfile`, `changePassword`, `logout`.
  - `[ ]` `marketApi.js`: `getMarkets(params)`, `getMarket(id)`, `createMarket(data)`, `updateMarket(id, data)`, `deleteMarket(id)`.
  - `[ ]` `farmerApi.js`: `getFarmers(params)`, `getFarmer(id)`, `getFarmerProfile()`, `updateFarmerProfile(data)`, `getFarmerMarkets()`, `linkMarket(data)`, `updateFarmerMarket(marketId, data)`, `unlinkMarket(marketId)`.
  - `[ ]` `productApi.js`: `getProducts(params)`, `getProduct(id)`, `getFarmerProducts(params)`, `createProduct(data)`, `updateProduct(id, data)`, `deleteProduct(id)`, `toggleHide(id)`.
  - `[ ]` `categoryApi.js`: `getCategories()`, `createCategory(data)`, `updateCategory(id, data)`, `deleteCategory(id)`.
  - `[ ]` `weeklyStockApi.js`: `getTemplates(productId)`, `updateTemplates(productId, templates)`, `applyWeeklyTemplates(data)`.
  - `[ ]` `cartApi.js`: `getCart()`, `addItem(productId, quantity)`, `updateItem(id, quantity)`, `removeItem(id)`, `clearCart()`.
  - `[ ]` `orderApi.js`: `getPickupSlots(params)`, `trackOrder(orderCode)`, `checkout(data)`, `getMyOrders(params)`, `getMyOrder(id)`, `cancelOrder(id, reason)`, `getFarmerOrders(params)`, `acceptOrder(id)`, `declineOrder(id, reason)`, `markOrderReady(id)`, `completeOrder(id)`.
  - `[ ]` `reviewApi.js`: `getProductReviews(productId)`, `getFarmerReviews(farmerId)`, `submitReview(data)`, `replyReview(id, reply)`, `toggleHideReview(id)`.
  - `[ ]` `favoriteApi.js`: `getFavorites(params)`, `toggleFavorite(targetType, targetId)`.
  - `[ ]` `notificationApi.js`: `getNotifications(params)`, `markRead(id)`, `markAllRead()`, `getActiveAnnouncements(params)`, `getAdminAnnouncements()`, `createAnnouncement(data)`, `updateAnnouncement(id, data)`, `deleteAnnouncement(id)`.
  - `[ ]` `adminApi.js`: `getOverviewStats()`, `getUsers(params)`, `updateUserStatus(id, status)`, `getPendingFarmers()`, `approveFarmer(id)`, `rejectFarmer(id, reason)`, `getInquiries(params)`, `markInquiryRead(id)`.
  - `[ ]` `contactApi.js`: `submitContact(data)`.
- **Tiêu chí hoàn thành**: Toàn bộ 13 file được export chuẩn, không lỗi import, sẵn sàng cho các component gọi trực tiếp.

---

### Phase 4.2: Chuẩn Hóa Xác Thực, 1-Click Demo Login & Gỡ Bỏ UI Thừa (Auth Sync & Cleanup)

- **Mục tiêu**: Bật kết nối Backend API thật cho hệ thống Authentication, cập nhật tài khoản Seeder chuẩn, gỡ bỏ Social Login Google giả lập và sửa hướng dẫn quên mật khẩu.
- **Files tác động**:
  - `frontend/src/context/AuthContext.jsx`
  - `frontend/src/pages/auth/LoginPage.jsx`
  - `frontend/src/components/common/GoogleSignInButton.jsx` (Xóa bỏ)
  - `frontend/src/routes/ProtectedRoute.jsx`
- **Checklist công việc**:
  - `[ ]` `AuthContext.jsx`:
    - Đặt `USE_BACKEND_API = true`.
    - Chuẩn hóa 3 vai trò: `admin`, `farmer`, `customer`. Hỗ trợ alias tự động cho `operator` $\rightarrow$ `farmer` và `user` $\rightarrow$ `customer`.
    - Cập nhật thông tin 1-Click Demo Login:
      - Admin: `admin@marketlink.com` / `password`
      - Farmer: `farmer@marketlink.com` / `password`
      - Customer: `customer@marketlink.com` / `password`
    - Gỡ bỏ `loginWithGoogle` và `resetPassword` mock OTP.
  - `[ ]` `LoginPage.jsx`:
    - Gỡ bỏ component `GoogleSignInButton.jsx` và khối "Or sign in with Google".
    - Cập nhật 3 nút 1-Click Demo Login hiển thị đúng email `@marketlink.com` và password mặc định `password`.
    - Thay link "Forgot password?" thành modal hướng dẫn liên hệ Admin hỗ trợ.
  - `[ ]` `ProtectedRoute.jsx`: Đồng bộ kiểm tra đúng 3 role `admin`, `farmer`, `customer`.
- **Tiêu chí hoàn thành**: Đăng nhập thành công bằng cả 3 tài khoản Demo Seeder qua API `/api/v1/auth/login`, nhận Bearer token và lưu vào `localStorage`.

---

### Phase 4.3: Nâng Cấp Trang Đăng Ký Tài Khoản & Mở Sạp Nông Dân (Registration Flow)

- **Mục tiêu**: Hỗ trợ 2 chế độ đăng ký riêng biệt: Khách mua hàng (`Customer`) và Nông dân nộp hồ sơ mở sạp (`Farmer Stall Application`).
- **Files tác động**:
  - `frontend/src/pages/auth/RegisterPage.jsx`
- **Checklist công việc**:
  - `[ ]` Gỡ bỏ `GoogleSignInButton.jsx` và nút "1-Click Demo Fill" rác khỏi `RegisterPage.jsx`.
  - `[ ]` Thêm Tab Switcher: **"Tài Khoản Khách Hàng (Shopper)"** $\leftrightarrow$ **"Đăng Ký Mở Sạp (Farmer Stall)"**.
  - `[ ]` **Tab Khách Hàng**:
    - Các trường: `fullname`, `username`, `email`, `phone`, `address`, `password`, `confirmPassword`.
    - Gửi request `POST /api/v1/auth/register` $\rightarrow$ Tự động đăng nhập và có giỏ hàng rỗng.
  - `[ ]` **Tab Nông Dân Mở Sạp**:
    - Thêm các trường: `stall_name`, `contact_person`, `contact_phone`, `address`, `description`, `latitude`, `longitude`.
    - Gửi request `POST /api/v1/auth/register-farmer` $\rightarrow$ Tạo tài khoản với trạng thái `pending`, thông báo hồ sơ đang chờ Admin phê duyệt.
- **Tiêu chí hoàn thành**: Đăng ký Customer thành công vào được Dashboard; Đăng ký Farmer thành công tạo tài khoản `pending` trong cơ sở dữ liệu.

---

### Phase 4.4: Tích Hợp Trang Chủ & Trang Liên Hệ (HomePage & ContactPage)

- **Mục tiêu**: Thay thế mock JSON trên Trang Chủ và kết nối Form Liên Hệ với Backend API.
- **Files tác động**:
  - `frontend/src/pages/public/HomePage.jsx`
  - `frontend/src/pages/public/ContactPage.jsx`
  - Tạo mới: `frontend/src/components/common/AnnouncementBanner.jsx`
- **Checklist công việc**:
  - `[ ]` Tạo component `AnnouncementBanner.jsx`: Gọi `GET /api/v1/announcements/active` hiển thị banner thông báo nổi bật trên đầu trang khi có tin mới.
  - `[ ]` `HomePage.jsx`:
    - Thay thế `markets.json` bằng `marketApi.getMarkets({ limit: 4 })`.
    - Thay thế `products.json` bằng `productApi.getProducts({ limit: 8, in_stock: 1 })`.
    - Nhúng `AnnouncementBanner.jsx` vào đầu trang.
  - `[ ]` `ContactPage.jsx`:
    - Kết nối form liên hệ với `contactApi.submitContact({ name, email, subject, message })`.
    - Validate dữ liệu, hiển thị modal thông báo thành công và reset form.
- **Tiêu chí hoàn thành**: Trang chủ hiển thị chợ và nông sản thật từ API; Form liên hệ lưu thành công bản ghi vào bảng `contact_messages`.

---

### Phase 4.5: Danh Bạ Chợ & Lịch Họp Chợ Phiên (Markets Directory Page)

- **Mục tiêu**: Kết nối Trang Danh Bạ Chợ với API Backend, lọc theo thứ trong tuần chuẩn hóa và hiển thị danh sách sạp đang hoạt động tại chợ.
- **Files tác động**:
  - `frontend/src/pages/public/MarketsPage.jsx`
  - `frontend/src/components/common/MarketCard.jsx`
- **Checklist công việc**:
  - `[ ]` `MarketsPage.jsx`:
    - Thay thế `markets.json` bằng `marketApi.getMarkets()`.
    - Bộ lọc tìm kiếm theo từ khóa (tên chợ, địa chỉ).
    - Bộ lọc theo thứ họp chợ trong tuần (`day_of_week`: 0 = Chủ Nhật, ..., 6 = Thứ Bảy) chuẩn hóa theo helper bảng thứ.
    - Hiển thị danh sách các sạp nông dân đang hoạt động tại chợ và lịch họp cụ thể từ API.
  - `[ ]` Tích hợp nút Thả tim yêu thích chợ kết nối `favoriteApi.toggleFavorite('market', market.id)`.
  - `[ ]` Giữ nguyên bản đồ định vị GPS OpenStreetMap chất lượng cao.
- **Tiêu chí hoàn thành**: Tìm kiếm và lọc chợ hoạt động mượt mà với dữ liệu API thật.

---

### Phase 4.6: Catalog Nông Sản & Bộ Lọc Đa Tiêu Chí (Produce Catalog Page)

- **Mục tiêu**: Kết nối Trang Danh Mục Nông Sản với Backend Filter Pipeline, load danh mục thật và tích hợp nút yêu thích/thêm giỏ hàng.
- **Files tác động**:
  - `frontend/src/pages/public/ProductsPage.jsx`
  - `frontend/src/components/common/ProductCard.jsx`
  - `frontend/src/components/common/FilterSidebar.jsx`
- **Checklist công việc**:
  - `[ ]` `ProductsPage.jsx`:
    - Thay thế `products.json` bằng `productApi.getProducts(filterParams)`.
    - Load danh mục thực tế từ `categoryApi.getCategories()`.
    - Load danh sách chợ từ `marketApi.getMarkets()` vào bộ lọc.
    - Đồng bộ bộ lọc với query params Backend: `category_id`, `market_id`, `farmer_id`, `min_price`, `max_price`, `in_stock`, `sort_by` (`price_asc`, `price_desc`, `rating_desc`, `name_asc`).
  - `[ ]` `ProductCard.jsx`:
    - Map đúng các trường từ `ProductResource`: `stall_name`, `price`, `unit`, `avg_rating`, `reviews_count`, `stock_quantity`.
    - Thêm nút Thả tim yêu thích gọi `favoriteApi.toggleFavorite('product', product.id)`.
- **Tiêu chí hoàn thành**: Lọc nông sản theo danh mục, chợ, khoảng giá và sắp xếp hoạt động chính xác với Backend.

---

### Phase 4.7: Chi Tiết Nông Sản & Gỡ Bỏ Form Pre-Order Autofill (Product Detail Page)

- **Mục tiêu**: Kết nối trang Chi Tiết Nông Sản với API, hiển thị đánh giá thực tế của khách và gỡ bỏ hoàn toàn form pre-order autofill mock Eleanor Vance.
- **Files tác động**:
  - `frontend/src/pages/public/ProductDetailPage.jsx`
- **Checklist công việc**:
  - `[ ]` Gọi `productApi.getProduct(id)` để load dữ liệu nông sản thật.
  - `[ ]` Gọi `reviewApi.getProductReviews(id)` để hiển thị danh sách đánh giá của khách kèm phản hồi của chủ sạp.
  - `[ ]` **Gỡ bỏ triệt để**:
    - Nút `handleDemoFill` autofill Eleanor Vance.
    - Hàm `handlePreOrderSubmit` tự sinh mã `MLB-2026-XXXX`.
    - Form đặt hàng trực tiếp giả lập ở cột phải.
  - `[ ]` **Thay thế bằng**:
    - Bộ chọn số lượng (Quantity Picker) có giới hạn tối đa bằng tồn kho `stock_quantity`.
    - Nút **"Thêm Vào Giỏ Hàng" (Add to Cart)**.
    - Nút **"Đặt Trước Ngay" (Pre-Order Now)** tự động thêm món và mở luồng đặt hàng.
- **Tiêu chí hoàn thành**: Hiển thị đầy đủ thông tin nông sản, xuất xứ sạp, rating thực tế; Không còn bất kỳ mã mock autofill nào.

---

### Phase 4.8: Xây Dựng Hệ Thống Giỏ Hàng Toàn Cục (Cart Context & Cart Drawer)

- **Mục tiêu**: Xây dựng `CartContext.jsx` đồng bộ với Backend API và Drawer Giỏ Hàng hiển thị các món gom nhóm theo từng sạp nông dân.
- **Files tác động**:
  - Tạo mới: `frontend/src/context/CartContext.jsx`
  - Tạo mới: `frontend/src/components/common/CartDrawer.jsx`
  - `frontend/src/components/layout/PublicNavbar.jsx`
- **Checklist công việc**:
  - `[ ]` `CartContext.jsx`:
    - Tự động gọi `cartApi.getCart()` khi user là `customer`.
    - Các hàm: `addToCart(productId, quantity)`, `updateQuantity(itemId, quantity)`, `removeItem(itemId)`, `clearCart()`.
    - State `cartCount` (tổng số lượng món).
  - `[ ]` `CartDrawer.jsx`:
    - Giao diện trượt từ mép phải sang, gom nhóm các món theo từng Sạp Nông Dân (`CartResource`).
    - Hiển thị danh sách các chợ chung mà các sạp tham gia.
    - Tăng/giảm số lượng món, xoá từng món, nút dọn sạch giỏ hàng.
    - Hiển thị tạm tính từng sạp và tổng tiền toàn giỏ hàng.
    - Nút "Tiến Hành Đặt Trước (Pre-Order)" kích hoạt checkout.
  - `[ ]` `PublicNavbar.jsx`: Thêm icon Giỏ Hàng kèm Badge số lượng món (`cartCount`) mở `CartDrawer`.
- **Tiêu chí hoàn thành**: Thêm nông sản vào giỏ từ nhiều sạp khác nhau, giỏ hàng tự động nhóm theo sạp và tính tổng tiền chính xác.

---

### Phase 4.9: Quy Trình Đặt Hàng Pre-Order & Chọn Khung Giờ (Checkout Flow)

- **Mục tiêu**: Xây dựng modal Checkout Pre-Order cho phép chọn Chợ phiên, chọn Ngày họp chợ, gọi API lấy Pickup Slots hợp lệ (kiểm tra cutoff hours) và gửi đơn đặt hàng.
- **Files tác động**:
  - Tạo mới: `frontend/src/components/common/PreOrderCheckoutModal.jsx`
  - Tích hợp vào `CartDrawer.jsx` và `ProductDetailPage.jsx`.
- **Checklist công việc**:
  - `[ ]` `PreOrderCheckoutModal.jsx`:
    - **Bước 1**: Chọn Chợ phiên nhận hàng từ danh sách chợ sạp tham gia.
    - **Bước 2**: Chọn Ngày họp chợ nhận hàng (tự động lọc các ngày sạp có mở bán).
    - **Bước 3**: Gọi API `GET /api/v1/orders/slots?market_id=...&pickup_date=...` để tải danh sách khung giờ nhận hàng khả dụng (tự động loại trừ các slot đã quá giờ chốt đơn `cutoff_hours`).
    - **Bước 4**: Khách chọn khung giờ (ví dụ: `08:30 - 09:00`), nhập ghi chú dặn dò nông dân.
    - **Bước 5**: Hiển thị cam kết thanh toán tiền mặt tại sạp khi nhận hàng (0 online fees).
    - **Bước 6**: Bấm "Xác Nhận Đặt Trước" $\rightarrow$ Gọi `orderApi.checkout(data)`.
  - `[ ]` Xử lý tách đơn tự động theo sạp, trừ tồn kho trong DB transaction, hiển thị danh sách các mã đơn hàng được tạo và chuyển hướng đến trang Theo Dõi Đơn Hàng.
- **Tiêu chí hoàn thành**: Đặt hàng thành công qua API `/api/v1/orders/checkout`, giỏ hàng được làm sạch, đơn hàng được tạo trong database.

---

### Phase 4.10: Cổng Khách Hàng - Lịch Sử Đơn Hàng & Tra Cứu Tiến Độ (Customer Orders & Tracking)

- **Mục tiêu**: Kết nối trang Lịch Sử Đơn Hàng và Trang Tra Cứu Tiến Độ Đơn Hàng theo đúng State Machine 4 bước.
- **Files tác động**:
  - `frontend/src/pages/customer/CustomerOrdersPage.jsx`
  - `frontend/src/pages/public/OrderPickupTrackerPage.jsx`
- **Checklist công việc**:
  - `[ ]` `CustomerOrdersPage.jsx`:
    - Thay thế `MOCK_ORDERS` bằng `orderApi.getMyOrders()`.
    - Bộ lọc trạng thái theo đúng Enum Backend: `placed`, `accepted`, `ready_for_pickup`, `completed`, `cancelled`, `declined`.
    - Nút **Huỷ Đơn Hàng**: Gọi `orderApi.cancelOrder(id, reason)` (chỉ hiển thị khi đơn chưa vượt quá cutoff).
    - Nút In phiếu đơn hàng dạng thẻ hoá đơn tiện xem.
  - `[ ]` `OrderPickupTrackerPage.jsx`:
    - Thay thế dữ liệu mock và timer đếm lùi giả lập bằng `orderApi.trackOrder(orderCode)`.
    - Hiển thị đúng 4 bước theo State Machine:
      1. Đã tiếp nhận đơn đặt trước (`placed`)
      2. Nông dân xác nhận thu hoạch (`accepted`)
      3. Nông sản đã đóng gói sẵn sàng tại sạp (`ready_for_pickup`)
      4. Khách đã đến sạp nhận hàng và thanh toán tiền mặt (`completed`)
    - Hiển thị banner cảnh báo nếu đơn bị huỷ (`cancelled`) hoặc từ chối (`declined`) kèm lý do.
- **Tiêu chí hoàn thành**: Khách hàng xem được đơn thật, huỷ được đơn hợp lệ và tra cứu mã đơn hiển thị đúng tiến độ real-time.

---

### Phase 4.11: Cổng Khách Hàng - Đánh Giá, Hồ Sơ & Mục Yêu Thích (Reviews, Profile & Favorites)

- **Mục tiêu**: Tích hợp Modal Đánh giá 5 sao cho đơn completed, gỡ bỏ tab Preferences rác trong Profile và quản lý mục Yêu thích.
- **Files tác động**:
  - Tạo mới: `frontend/src/components/common/ReviewModal.jsx`
  - `frontend/src/pages/customer/CustomerProfilePage.jsx`
  - `frontend/src/pages/customer/CustomerDashboard.jsx`
- **Checklist công việc**:
  - `[ ]` `ReviewModal.jsx`: Cho phép chọn 1-5 sao, viết nhận xét cảm nhận $\rightarrow$ Gọi `reviewApi.submitReview(data)` (chỉ cho phép khi đơn `completed`).
  - `[ ]` `CustomerProfilePage.jsx`:
    - **Gỡ bỏ hoàn toàn**: Tab `PREFERENCES` lưu `localStorage` và nút "1-Click Demo Fill".
    - Kết nối form thông tin cá nhân với `authApi.updateProfile({ fullname, phone, address })`.
    - Kết nối form đổi mật khẩu với `authApi.changePassword({ current_password, new_password, new_password_confirmation })`.
  - `[ ]` `CustomerDashboard.jsx`: Thêm Tab Mục Yêu Thích gọi `favoriteApi.getFavorites()` hiển thị danh sách nông sản và chợ đã thả tim.
- **Tiêu chí hoàn thành**: Viết đánh giá thành công sau khi hoàn tất đơn; Cập nhật hồ sơ và đổi mật khẩu hoạt động với Backend API.

---

### Phase 4.12: Cổng Nông Dân - Hàng Đợi Duyệt Đơn Pre-Order (Farmer Orders Queue)

- **Mục tiêu**: Kết nối Hàng Đợi Đơn Hàng trong `FarmerDashboard.jsx` với Backend API, hỗ trợ chuyển trạng thái 4 bước và từ chối đơn kèm lý do.
- **Files tác động**:
  - `frontend/src/pages/farmer/FarmerDashboard.jsx` (Tab Queue)
- **Checklist công việc**:
  - `[ ]` Thay thế `INITIAL_QUEUE` bằng `orderApi.getFarmerOrders(params)`.
  - `[ ]` Bộ lọc đơn theo ngày nhận, chợ và trạng thái đơn.
  - `[ ]` Các thao tác chuyển trạng thái đơn hàng theo đúng State Machine:
    - Nút **Duyệt Đơn** $\rightarrow$ Gọi `orderApi.acceptOrder(id)`.
    - Nút **Báo Sẵn Sàng Tại Sạp** $\rightarrow$ Gọi `orderApi.markOrderReady(id)`.
    - Nút **Hoàn Tất Nhận Hàng** $\rightarrow$ Gọi `orderApi.completeOrder(id)` (sau khi khách thanh toán tiền mặt tại sạp).
    - Nút **Từ Chối Đơn** $\rightarrow$ Bật modal bắt buộc nhập lý do từ chối $\rightarrow$ Gọi `orderApi.declineOrder(id, reason)` (hoàn tồn kho tự động trong DB transaction).
- **Tiêu chí hoàn thành**: Nông dân chuyển trạng thái đơn hàng mượt mà, khách hàng thấy trạng thái cập nhật ngay lập tức.

---

### Phase 4.13: Cổng Nông Dân - Quản Lý Kho & Mẫu Kho Tuần 7 Ngày (Inventory & Weekly Stock)

- **Mục tiêu**: Kết nối CRUD Kho Nông Sản và xây dựng Tab Mẫu Kho Bán Theo Tuần 7 ngày (Weekly Stock Rollover).
- **Files tác động**:
  - `frontend/src/pages/farmer/FarmerDashboard.jsx` (Tab Stock & Tab Weekly Stock)
- **Checklist công việc**:
  - `[ ]` **Tab Quản Lý Kho Nông Sản (Produce Inventory)**:
    - Thay thế `INITIAL_STALL_STOCK` bằng `productApi.getFarmerProducts()`.
    - Modal Thêm mới / Chỉnh sửa nông sản: Tên, mô tả, giá bán, đơn vị tính (`kg`, `bundle`, `box`...), tồn kho ban đầu, ảnh, danh mục $\rightarrow$ Gọi `productApi.createProduct` / `updateProduct`.
    - Nút Xoá nông sản an toàn $\rightarrow$ Gọi `productApi.deleteProduct(id)`.
  - `[ ]` **Tab Mẫu Kho Bán Theo Tuần (Weekly Stock Rollover)**:
    - Xem và cấu hình định mức tồn kho cho từng thứ trong tuần (Chủ Nhật đến Thứ Bảy) qua `weeklyStockApi.getTemplates(productId)` và `updateTemplates(productId, templates)`.
    - Nút 1-Click **"Áp Dụng Định Mức Kho Tuần Tới"** gọi `weeklyStockApi.applyWeeklyTemplates(data)` để cập nhật tồn kho mở bán cho phiên chợ sắp tới.
- **Tiêu chí hoàn thành**: Thêm/sửa/xoá nông sản thành công; Cấu hình mẫu kho và áp dụng kho tuần cập nhật tồn kho mở bán tức thì.

---

### Phase 4.14: Cổng Nông Dân - Cấu Hình Sạp Chợ & Phản Hồi Đánh Giá (Stall Config & Reviews)

- **Mục tiêu**: Xây dựng Tab Quản Lý Sạp Tại Chợ và Tab Phản Hồi Đánh Giá Của Khách Hàng.
- **Files tác động**:
  - `frontend/src/pages/farmer/FarmerDashboard.jsx` (Tab Markets & Tab Reviews)
- **Checklist công việc**:
  - `[ ]` **Tab Cấu Hình Sạp & Chợ Tham Gia (Market Stalls Configuration)**:
    - Danh sách chợ sạp đã đăng ký từ `farmerApi.getFarmerMarkets()`.
    - Modal **Đăng Ký Chợ Mới** (`farmerApi.linkMarket`): Chọn chợ, số sạp (`Stall #...`), ngày họp mở bán, khung giờ mở/đóng, độ dài slot nhận hàng (15/30/45/60 phút), giờ chốt đơn trước phiên họp (`cutoff_hours`: 1-72h).
    - Cập nhật cấu hình hoặc Rút sạp khỏi chợ (`farmerApi.unlinkMarket(marketId)`).
  - `[ ]` **Tab Phản Hồi Đánh Giá (Customer Reviews & Replies)**:
    - Xem các đánh giá của khách về nông sản của sạp từ `reviewApi.getFarmerReviews(farmerId)`.
    - Form viết phản hồi cảm ơn hoặc giải đáp thắc mắc của khách $\rightarrow$ Gọi `reviewApi.replyReview(id, reply)`.
- **Tiêu chí hoàn thành**: Nông dân đăng ký được sạp vào chợ mới và trả lời đánh giá của khách hàng thành công.

---

### Phase 4.15: Cổng Admin - Thống Kê KPIs, Phê Duyệt Nông Dân & Quản Trị Users (Admin Governance 1)

- **Mục tiêu**: Kết nối Overview KPIs thời gian thực, luồng Phê Duyệt Sạp Nông Dân và Quản Lý Người Dùng trong `AdminDashboard.jsx`.
- **Files tác động**:
  - `frontend/src/pages/admin/AdminDashboard.jsx` (Tab Overview, Tab Vendors, Tab Users)
  - `frontend/src/pages/admin/AdminAnalyticsCharts.jsx`
- **Checklist công việc**:
  - `[ ]` **Tab Tổng Quan (Overview & KPIs)**:
    - Thay thế số liệu mock bằng `adminApi.getOverviewStats()`: Doanh thu thực tế (`gross_completed`), cơ cấu đơn hàng, users, chợ, sản phẩm, inquiries chưa đọc, top 5 nông dân uy tín.
    - Vẽ biểu đồ doanh thu và phân bổ đơn hàng bằng Chart.js.
  - `[ ]` **Tab Phê Duyệt Nông Dân (Pending Farmer Applications)**:
    - Thay thế `INITIAL_VENDOR_APPLICATIONS` bằng `adminApi.getPendingFarmers()`.
    - Xem chi tiết hồ sơ sạp nông dân chờ duyệt.
    - Nút **Phê Duyệt** $\rightarrow$ Gọi `adminApi.approveFarmer(id)` (chuyển `active` và tự động gửi in-app notification cho nông dân).
    - Nút **Từ Chối** $\rightarrow$ Bật modal bắt buộc nhập lý do $\rightarrow$ Gọi `adminApi.rejectFarmer(id, reason)`.
  - `[ ]` **Tab Quản Lý Người Dùng (Users Governance)**:
    - Thay thế `INITIAL_USERS` bằng `adminApi.getUsers(params)`.
    - Nút Khoá / Mở khoá tài khoản vi phạm $\rightarrow$ Gọi `adminApi.updateUserStatus(id, status)` (`active` $\leftrightarrow$ `banned`).
- **Tiêu chí hoàn thành**: Số liệu thống kê khớp 100% với database; Phê duyệt sạp nông dân thành công và nông dân đăng nhập được ngay.

---

### Phase 4.16: Cổng Admin - Quản Lý Chợ, Danh Mục, Ẩn/Hiện, Thông Báo & Hộp Thư (Admin Governance 2)

- **Mục tiêu**: Hoàn thiện CRUD Chợ & Lịch họp, CRUD Danh mục, Ẩn/Hiện vi phạm, Quản trị Thông báo toàn sàn và Hộp thư liên hệ.
- **Files tác động**:
  - `frontend/src/pages/admin/AdminDashboard.jsx` (Tab Markets, Tab Reviews, Tab Messages, Tab Announcements)
- **Checklist công việc**:
  - `[ ]` **Tab Quản Lý Chợ & Danh Mục (Markets & Categories)**:
    - CRUD Chợ và Lịch họp định kỳ $\rightarrow$ Gọi `marketApi.createMarket`, `updateMarket`, `deleteMarket`.
    - CRUD Danh mục nông sản $\rightarrow$ Gọi `categoryApi.createCategory`, `updateCategory`, `deleteCategory`.
    - Nút Ẩn / Hiện nông sản vi phạm $\rightarrow$ Gọi `productApi.toggleHide(id)`.
    - Nút Ẩn / Hiện đánh giá spam $\rightarrow$ Gọi `reviewApi.toggleHideReview(id)`.
  - `[ ]` **Tab Quản Trị Thông Báo Toàn Sàn (Announcements)**:
    - Danh sách thông báo từ `notificationApi.getAdminAnnouncements()`.
    - Form phát thông báo mới theo vai trò mục tiêu (`all`, `farmer`, `customer`).
    - Bật/tắt trạng thái hiển thị (`is_active`), chỉnh sửa và xoá thông báo.
  - `[ ]` **Tab Hộp Thư Liên Hệ (Inquiries Inbox)**:
    - Thay thế `INITIAL_INQUIRIES` bằng `adminApi.getInquiries(params)`.
    - Lọc thư chưa đọc, xem nội dung chi tiết và bấm "Đánh Dấu Đã Xử Lý" $\rightarrow$ Gọi `adminApi.markInquiryRead(id)`.
- **Tiêu chí hoàn thành**: Admin thực hiện trọn vẹn quyền quản trị nền tảng qua REST API thật.

---

### Phase 4.17: Thông Báo In-App, Đánh Bóng UX/UI & Kiểm Thử Tích Hợp (Polish & Integration)

- **Mục tiêu**: Xây dựng Dropdown Thông Báo In-App, chuẩn hóa UX Loading/Empty states, kiểm thử toàn diện trên mọi kích thước màn hình và rà soát sạch 100% `console.log()`.
- **Files tác động**:
  - Tạo mới: `frontend/src/components/common/NotificationDropdown.jsx`
  - `frontend/src/components/layout/PublicNavbar.jsx`
  - `frontend/src/components/layout/AdminLayout.jsx`
  - `frontend/src/components/layout/OperatorLayout.jsx`
  - Toàn bộ codebase frontend.
- **Checklist công việc**:
  - `[ ]` `NotificationDropdown.jsx`:
    - Thêm icon Chuông trên Navbar và Header Dashboard khi user đã đăng nhập.
    - Hiển thị Badge chấm đỏ số lượng thông báo chưa đọc (`unread_count`).
    - Menu xổ xuống danh sách thông báo: Khi đơn hàng được duyệt, đơn sẵn sàng, sạp được phê duyệt.
    - Nút đánh dấu đã đọc (`notificationApi.markRead`) và "Đánh dấu tất cả đã đọc" (`notificationApi.markAllRead`).
  - `[ ]` Chuẩn hóa UX/UI:
    - Hiển thị Loading Skeleton / Spinners khi đang fetch API.
    - Xử lý Empty States thân thiện (khi chưa có đơn, chưa có nông sản, giỏ trống).
    - Tích hợp Toast Notifications phản hồi kết quả thao tác.
    - Kiểm tra hiển thị responsive 100% trên Mobile, Tablet, Desktop.
    - **Rà soát sạch sẽ: Tuyệt đối không để sót `console.log()` nào trong mã nguồn**.
- **Tiêu chí hoàn thành**: Toàn bộ hệ thống chạy mượt mà, 0 lỗi console, kết nối 100% API, sẵn sàng bàn giao cho Day 5.

---

## 4. Tiêu Chí Nghiệm Thu Day 4 (Acceptance Criteria)

1. **Khách hàng (Customer)**:
   - Đăng ký tài khoản mới $\rightarrow$ Tự động có giỏ hàng rỗng.
   - Duyệt catalog nông sản $\rightarrow$ Thêm 2-3 món từ các sạp khác nhau vào giỏ.
   - Mở Drawer giỏ hàng xem các món gom nhóm theo từng sạp nông dân.
   - Chọn chợ nhận hàng, chọn ngày họp chợ $\rightarrow$ Chọn khung giờ pickup khả dụng $\rightarrow$ Bấm Đặt Trước Pre-Order (thanh toán tiền mặt tại sạp).
   - Đơn hàng được tự động tách theo sạp, trừ kho chính xác trong cơ sở dữ liệu.
   - Tra cứu mã đơn hàng hiển thị đúng tiến độ thời gian thực 4 bước.
   - Sau khi hoàn tất lấy hàng $\rightarrow$ Viết đánh giá 5 sao cho nông sản.
2. **Nông dân (Farmer)**:
   - Đăng nhập 1-Click demo $\rightarrow$ Xem hàng đợi incoming orders thật từ database.
   - Bấm Duyệt đơn (`accepted`) $\rightarrow$ Báo đóng gói sẵn sàng (`ready_for_pickup`) $\rightarrow$ Báo hoàn tất khi giao hàng (`completed`).
   - Bấm Từ chối đơn $\rightarrow$ Nhập lý do $\rightarrow$ Đơn chuyển `declined` và hoàn kho tự động.
   - Quản lý kho: Thêm nông sản mới, cấu hình mẫu kho tuần, bấm 1-Click áp dụng kho tuần.
   - Cấu hình sạp tại các chợ họp định kỳ (giờ mở, giờ đóng, slot, cutoff).
   - Trả lời đánh giá của khách hàng.
3. **Quản trị viên (Admin)**:
   - Xem tổng quan Dashboard với số liệu doanh thu thực tế, biểu đồ phân bổ đơn hàng, top nông dân.
   - Xem danh sách sạp nông dân đang pending $\rightarrow$ Phê duyệt hoặc từ chối kèm lý do.
   - Quản lý người dùng, khoá tài khoản vi phạm.
   - CRUD danh mục chợ và lịch họp.
   - CRUD thông báo toàn sàn (Announcements).
   - Xử lý hộp thư liên hệ của khách hàng.
4. **Kỹ thuật & Code Quality**:
   - 100% kết nối API mượt mà, không dùng mock JSON tĩnh.
   - 0 lỗi console, không sót `console.log()`.
   - Đúng bảng màu nông sản chuẩn `#16A34A` / `#F8FAF6`.
   - Cố định nền sáng, không làm Dark Mode.
