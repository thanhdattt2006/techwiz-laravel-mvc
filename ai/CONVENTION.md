# QUY TẮC LẬP TRÌNH (CODING CONVENTIONS)
# DỰ ÁN: MARKETLINK (THEME: EGREEN BASKET - TECHWIZ 7)
# KIẾN TRÚC: LARAVEL REST WEB API + REACT JS (VITE)

Dự án này áp dụng mô hình phân tách hoàn toàn Client - Server:
- **Backend**: Laravel 12/13 Web API (Deploy trên Render + Aiven MySQL)
- **Frontend**: React.js (JavaScript) + Vite + TailwindCSS (Deploy trên Vercel)
- **Thời gian thi**: 5 ngày. Toàn team và AI tuân thủ nghiêm ngặt các quy chuẩn dưới đây để tránh conflict và đảm bảo tiến độ tối đa.

---

## 1. NGUYÊN TẮC THIẾT KẾ (DESIGN PRINCIPLES)

### 1.1. S.O.L.I.D Principles
- **S - Single Responsibility**: Mỗi Class / Function / Component chỉ làm DUY NHẤT MỘT việc.
  - Backend: Controller chỉ điều hướng request/response, validation dùng FormRequest, transform dữ liệu dùng JsonResource, nghiệp vụ nặng đưa vào Service.
  - Frontend: Mỗi Component chỉ render một phần UI hoặc đảm nhiệm 1 tác vụ cụ thể. Tách biệt UI Component và Data-fetching logic (Custom Hooks).
- **O - Open/Closed**: Code có thể mở rộng nhưng hạn chế sửa đổi code cũ đã ổn định.
- **L - Liskov Substitution**: Các thành phần kế thừa/thay thế không làm thay đổi tính đúng đắn của ứng dụng.
- **I - Interface Segregation**: Không bắt ép một class/module phụ thuộc vào những gì nó không cần dùng.
- **D - Dependency Inversion**: Phụ thuộc vào abstraction (DI container trong Laravel, Props & Context trong React).

### 1.2. D.R.Y (Don't Repeat Yourself)
- TUYỆT ĐỐI không copy-paste logic hoặc UI lặp đi lặp lại.
- Backend: Trích xuất logic dùng chung vào Helpers, Traits, Services.
- Frontend: Tái sử dụng Component dùng chung (`ProductCard`, `MarketCard`, `StatusBadge`, `FilterSidebar`, `RatingStars`, `Modal`, `ScrollToTop`) đặt trong `src/components/common/`.

### 1.3. K.I.S.S (Keep It Simple, Stupid)
- Giữ code đơn giản, sáng sủa, dễ đọc. Không over-engineer.
- Tuân thủ đúng ràng buộc SRS: **Không tích hợp cổng thanh toán trực tuyến** (Pre-order thanh toán tiền mặt/thẻ khi nhận tại sạp), **Không làm module giao hàng tận nhà** (chỉ nhận hàng tại sạp chợ).

---

## 2. QUY CHUẨN BACKEND (LARAVEL REST WEB API)

### 2.1. Điều Kiện Ràng Buộc Cứng (Strict Constraints)
- **Strict Types**: BẮT BUỘC thêm `declare(strict_types=1);` ở đầu TẤT CẢ các file PHP (`app/...`).
- **Type Hinting**: BẮT BUỘC khai báo kiểu dữ liệu cho toàn bộ param và return type của hàm. Không có return type -> `void`.
- **Superglobals**: TUYỆT ĐỐI không dùng `$_GET`, `$_POST`, `$_REQUEST`. Dùng `$request` object của Laravel.
- **Environment**: CẤM gọi hàm `env()` ngoài thư mục `config/`. Trong source code chỉ dùng `config('services.xxx')`.
- **Magic Numbers/Strings**: CẤM hardcode số hay chuỗi vô nghĩa vào logic. BẮT BUỘC định nghĩa hằng số trong Model hoặc Enum (VD: `const STATUS_PLACED = 'placed'; const STATUS_READY = 'ready';`).
- **Chống N+1 Query**: BẮT BUỘC dùng Eager Loading `with()` khi truy vấn quan hệ Eloquent (VD: `Product::with(['market', 'farmer'])`).
- **Bảo Toàn Dữ Liệu**: Các bảng nghiệp vụ quan trọng (`users`, `markets`, `products`, `orders`) bắt buộc dùng trait `SoftDeletes`.

### 2.2. Chuẩn Phản Hồi JSON (API Standard Response Envelope)
Mọi API trả về cho Frontend bắt buộc tuân theo format thống nhất:

```json
{
  "success": true,
  "message": "Detail message",
  "data": { ... },
  "errors": null
}
```

- **Mã HTTP Status Codes bắt buộc**:
  - `200 OK`: Thành công (GET, PUT/PATCH, DELETE khi trả kèm data).
  - `201 Created`: Tạo mới thành công (POST).
  - `400 Bad Request`: Lỗi thao tác từ phía client.
  - `401 Unauthorized`: Chưa đăng nhập hoặc Token Sanctum hết hạn / không hợp lệ.
  - `403 Forbidden`: Không có quyền truy cập (Sai role / permission).
  - `404 Not Found`: Không tìm thấy bản ghi.
  - `422 Unprocessable Content`: Lỗi validate dữ liệu từ FormRequest.
  - `500 Internal Server Error`: Lỗi logic server (luôn bắt qua `try-catch` và log lại).

### 2.3. Quy Chuẩn Đặt Tên Backend (MarketLink)
- **Controllers**: `PascalCase` + `Controller` (VD: `AuthController`, `MarketController`, `ProductController`, `PreOrderController`, `ReviewController`, `ContactController`, `AdminController`).
- **Models**: `PascalCase` số ít (VD: `User`, `Market`, `Product`, `Order`, `OrderItem`, `Review`, `Report`, `ContactMessage`).
- **API Resources**: `PascalCase` + `Resource` (VD: `UserResource`, `ProductResource`, `MarketResource`, `OrderResource`, `ReviewResource`).
- **Form Requests**: `Store{Model}Request`, `Update{Model}Request` (VD: `StorePreOrderRequest`, `StoreProductRequest`).
- **Database Tables**: `snake_case` số nhiều (VD: `users`, `markets`, `products`, `orders`, `order_items`, `reviews`, `reports`, `contact_messages`).
- **API Routes**: `kebab-case`, nhóm theo tiền tố `/api/v1/...`.

---

## 3. QUY CHUẨN FRONTEND (REACT JS + VITE)

### 3.1. Bảng Màu Thiết Kế Chuẩn (Fresh Botanical & Harvest Gold)
Dự án áp dụng bộ màu nông sản hữu cơ tươi sáng:
- **Primary (Xanh nông sản)**: `#16A34A` / `#15803D` - Nút Pre-Order, active link, badge hữu cơ.
- **Accent (Vàng cam mùa gặt)**: `#F59E0B` / `#D97706` - Star rating, badge mùa vụ, điểm nhấn harvest.
- **Warning / Alert**: `#F59E0B` (Chờ hái & đóng gói), `#DC2626` (Hết hàng / Hủy đơn).
- **Success**: `#16A34A` - Sẵn sàng nhận tại sạp (Ready for pickup).
- **Nền sáng (Light BG)**: `#F8FAF6` - Nền chính toàn bộ website (Fresh cream background).
- **Card**: `#FFFFFF` - Nền thẻ card sản phẩm, sạp chợ, form pre-order.
- **Chữ chính (Main Text)**: `#0F172A` - Tiêu đề nông sản, giá tiền, số lượng.
- **Chữ phụ (Muted Text)**: `#475569` - Mô tả mùa vụ, xuất xứ trang trại.
- **Viền (Border)**: `#E2E8DF` - Viền nhẹ nhàng hài hòa với màu xanh lá.

> **QUY TẮC BẮT BUỘC**: **KHÔNG DÙNG DARK THEME**. Toàn bộ website cố định 1 giao diện nền sáng tươi mát (`#F8FAF6`).

### 3.2. Cấu Trúc Thư Mục Frontend Chuẩn (`src/`)
```text
src/
├── api/
│   ├── axiosClient.js        # Axios instance, baseURL, request & response interceptors (Bearer Token)
│   ├── authApi.js            # API login, register, me, logout
│   ├── marketApi.js          # API danh bạ chợ, lịch họp, tọa độ bản đồ
│   ├── productApi.js         # API catalog nông sản, bộ lọc, chi tiết sản phẩm
│   ├── orderApi.js           # API pre-order giữ chỗ, cập nhật tiến độ 4 bước
│   ├── reviewApi.js          # API gửi và xem đánh giá 1-5 sao
│   └── contactApi.js         # API gửi tin nhắn liên hệ Ban Quản Lý Chợ
├── assets/                   # Icons, logo MarketLink (eGreen Basket)
├── components/
│   ├── common/               # UI tái sử dụng (ProductCard, MarketCard, StatusBadge, FilterSidebar, RatingStars, Modal)
│   │   └── index.js          # Barrel export
│   └── layout/               # Header, Sidebar, Footer, Layout cho từng Role (Public, Admin, Farmer, Customer)
├── context/
│   ├── AuthContext.jsx       # State quản lý user, token, role, hàm login, logout
│   └── ModalContext.jsx      # Hệ thống Custom React Portal Modal thay thế SweetAlert2
├── data/
│   ├── markets.json          # Danh bạ 6 chợ nông sản Chicago
│   └── products.json         # Danh mục nông sản theo mùa
├── hooks/                    # Custom hooks
├── pages/
│   ├── public/               # HomePage, MarketsPage, ProductsPage, ProductDetailPage, AboutPage, GalleryPage, FeedbackPage, ContactPage, SitemapPage, NotFoundPage
│   ├── auth/                 # LoginPage, RegisterPage, ForgotPasswordPage, UnauthorizedPage
│   ├── admin/                # AdminDashboard (Markets Registry, Vendor Applications, Review Moderation, Inquiries)
│   ├── farmer/               # FarmerDashboard (Pre-Order Queue, Weekly Stall Stock, Sales Summary)
│   └── customer/             # CustomerDashboard, CustomerProfilePage, CustomerOrdersPage (Tote Slip)
├── routes/
│   ├── AppRoutes.jsx         # Cấu hình router toàn bộ ứng dụng
│   └── ProtectedRoute.jsx    # HOC phân quyền dựa theo Role (admin, farmer, customer)
├── App.jsx
├── main.jsx
└── index.css                 # TailwindCSS & Theme tokens
```

### 3.3. Quy Tắc Lập Trình React JS
- **Functional Components**: 100% Functional Components kèm React Hooks (`useState`, `useEffect`, `useContext`, `useCallback`, `useMemo`).
- **Tên Component & File**: `PascalCase.jsx` (VD: `ProductCard.jsx`, `MarketCard.jsx`, `FarmerDashboard.jsx`).
- **Tên Biến & Hàm**: `camelCase` (VD: `fetchProducts()`, `handlePreOrder()`).
- **CSS**: 100% sử dụng **TailwindCSS**.
- **Xử lý Token**: Token nhận từ API Sanctum lưu tại `localStorage`, tự động inject vào header `Authorization: Bearer <token>` qua Axios Interceptor.
- **UI Modal & Alerts**: Sử dụng `useModal()` (`showAlert`, `showConfirm`) từ `ModalContext.jsx` chuẩn React Portal.

---

## 4. QUY CHUẨN PHÂN QUYỀN (ROLE-BASED ACCESS CONTROL - RBAC)

Hệ thống hỗ trợ 3 Roles chính:
1. **`admin`**: Quản trị viên sàn chợ (Quản lý chợ địa phương, duyệt nông dân mở sạp, kiểm duyệt đánh giá xấu, báo cáo sàn).
2. **`farmer` (hoặc `operator`)**: Nông dân & Chủ sạp chợ (Quản lý hàng tồn sạp cuối tuần, tiếp nhận hàng chờ pre-order, duyệt đóng gói, báo hàng đã sẵn sàng).
3. **`customer` (hoặc `user`)**: Khách hàng mua sắm (Tìm chợ và nông sản sạch, đặt trước giữ chỗ, theo dõi mã nhận hàng, thanh toán tiền mặt tại sạp, đánh giá 1-5 sao).

---

## 5. QUY TRÌNH GIT VÀ COMMITS

- **Commit Messages (BẮT BUỘC TIẾNG ANH)**: Chuẩn **Conventional Commits** (`type: message` hoặc `type(scope): message`).
  - Danh sách types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Nguyên tắc**: Commit sau mỗi phase/tính năng hoàn chỉnh.
- **Không vứt rác**: Xoá toàn bộ `dd()`, `dump()`, `console.log()` trước khi commit.
