# QUY TẮC LẬP TRÌNH (CODING CONVENTIONS)
# KIẾN TRÚC: LARAVEL REST WEB API + REACT JS (VITE)

Dự án này áp dụng mô hình phân tách hoàn toàn Client - Server:
- **Backend**: Laravel 11/12 Web API (Deploy trên Render + Aiven MySQL)
- **Frontend**: React.js (JavaScript) + Vite + TailwindCSS (Deploy trên Vercel)
- **Thời gian thi**: 5 ngày (mỗi thành viên 4h/ngày). Toàn team tuân thủ nghiêm ngặt các quy chuẩn dưới đây để tránh conflict và đảm bảo tiến độ tối đa.

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
- Frontend: Tái sử dụng Component dùng chung (`Button`, `Modal`, `Badge`, `Card`, `InputField`, `Navbar`, `Sidebar`) đặt trong `src/components/common/`.

### 1.3. K.I.S.S (Keep It Simple, Stupid)
- Giữ code đơn giản, sáng sủa, dễ đọc. Không over-engineer. Tránh các thư viện cồng kềnh không cần thiết.

---

## 2. QUY CHUẨN BACKEND (LARAVEL REST WEB API)

### 2.1. Điều Kiện Ràng Buộc Cứng (Strict Constraints)
- **Strict Types**: BẮT BUỘC thêm `declare(strict_types=1);` ở đầu TẤT CẢ các file PHP (`app/...`).
- **Type Hinting**: BẮT BUỘC khai báo kiểu dữ liệu cho toàn bộ param và return type của hàm. Không có return type -> `void`.
- **Superglobals**: TUYỆT ĐỐI không dùng `$_GET`, `$_POST`, `$_REQUEST`. Dùng `$request` object của Laravel.
- **Environment**: CẤM gọi hàm `env()` ngoài thư mục `config/`. Trong source code chỉ dùng `config('services.xxx')`.
- **Magic Numbers/Strings**: CẤM hardcode số hay chuỗi vô nghĩa vào logic. BẮT BUỘC định nghĩa hằng số trong Model hoặc Enum (VD: `const STATUS_PENDING = 'pending';`).
- **Chống N+1 Query**: BẮT BUỘC dùng Eager Loading `with()` khi truy vấn quan hệ Eloquent.
- **Bảo Toàn Dữ Liệu**: Các bảng nghiệp vụ quan trọng (Users, Requests, Ambulances, Dispatches) bắt buộc dùng trait `SoftDeletes`.

### 2.2. Chuẩn Phản Hồi JSON (API Standard Response Envelope)
Mọi API trả về cho Frontend bắt buộc tuân theo format thống nhất:

```json
{
  "success": true,
  "message": "Chi tiết thông báo",
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

### 2.3. Quy Chuẩn Đặt Tên Backend
- **Controllers**: `PascalCase` + `Controller` (VD: `AuthController`, `EmergencyRequestController`, `AmbulanceController`, `FeedbackController`, `ContactMessageController`).
- **Models**: `PascalCase` số ít (VD: `User`, `Ambulance`, `EmergencyRequest`, `Feedback`, `ContactMessage`, `Notification`).
- **API Resources**: `PascalCase` + `Resource` (VD: `UserResource`, `EmergencyRequestResource`, `AmbulanceResource`, `FeedbackResource`).
- **Form Requests**: `Store{Model}Request`, `Update{Model}Request`.
- **Database Tables**: `snake_case` số nhiều (VD: `users`, `ambulances`, `emergency_requests`, `feedbacks`, `contact_messages`, `notifications`).
- **API Routes**: `kebab-case` hoặc `snake_case`, nhóm theo tiền tố `/api/v1/...`.

---

## 3. QUY CHUẨN FRONTEND (REACT JS + VITE)

### 3.1. Bảng Màu Thiết Kế Chuẩn (Light Medical Design System)
Dự án áp dụng bộ màu chuẩn y tế chuyên nghiệp:
- **Primary (Xanh y tế)**: `#0B6EFD` - Nút chính, link, navbar active, brand accent.
- **Primary tối**: `#084298` - Hover states, header bar, footer.
- **Emergency (Đỏ cấp cứu)**: `#DC3545` - Nút "Đặt xe ngay", badge SOS, cảnh báo nguy cấp.
- **Success (Xanh lá)**: `#198754` - Xe sẵn sàng (available), hoàn thành ca trực.
- **Warning (Vàng cam)**: `#FFB020` - Đang chờ (pending), xe đang di chuyển.
- **Nền sáng (Light BG)**: `#F5F8FC` - Background chính của toàn bộ trang web.
- **Card**: `#FFFFFF` - Nền thẻ card, form nhập liệu, modal popup.
- **Chữ chính (Main Text)**: `#1F2A37` - Văn bản chính, tiêu đề, số liệu.
- **Chữ phụ (Muted Text)**: `#6B7785` - Mô tả, placeholder, nhãn phụ.
- **Viền (Border)**: `#E2E8F0` - Border input, viền card, đường kẻ phân chia.

> **QUY TẮC BẮT BUỘC**: **KHÔNG CẦN DÙNG DARK/LIGHT THEME**. Toàn bộ website cố định 1 giao diện nền sáng y tế (`#F5F8FC`), tuyệt đối không viết component toggle dark mode làm phức tạp CSS và phân mảnh thời gian.

### 3.2. Cấu Trúc Thư Mục Frontend Chuẩn (`src/`)
```text
src/
├── api/
│   ├── axiosClient.js        # Axios instance, baseURL, request & response interceptors (Bearer Token)
│   ├── authApi.js            # API login, register, me, logout
│   ├── emergencyApi.js       # API SOS, emergency requests, status updates
│   ├── ambulanceApi.js       # API fleet catalog, search/filter, tracking
│   ├── feedbackApi.js        # API gửi và xem đánh giá feedback
│   └── contactApi.js         # API gửi tin nhắn liên hệ Contact Us
├── assets/                   # Hình ảnh xe cứu thương, icons, logo LifeLink
├── components/
│   ├── common/               # UI tái sử dụng (Button, Input, Modal, Badge, Spinner, Alert)
│   ├── layout/               # Header, Sidebar, Footer, Layout cho từng Role
│   └── maps/                 # Component bản đồ (Leaflet / Live Ambulance Tracker)
├── context/
│   └── AuthContext.jsx       # State quản lý user, token, role, hàm login, logout
├── hooks/                    # Custom hooks (useAuth, useGeolocation, usePolling)
├── pages/
│   ├── public/               # Các trang công khai theo SRS:
│   │   ├── HomePage.jsx      # Catalog danh sách xe eAmbulance, bộ lọc & tìm kiếm
│   │   ├── AboutPage.jsx     # Giới thiệu công ty, quy mô vùng phục vụ, đội xe tốt nhất
│   │   ├── GalleryPage.jsx   # Bộ sưu tập ảnh xe cứu thương
│   │   ├── FeedbackPage.jsx  # Form đánh giá chất lượng dịch vụ
│   │   ├── ContactPage.jsx   # Form Contact Us (cho cả khách vãng lai)
│   │   └── SitemapPage.jsx   # Sơ đồ điều hướng website
│   ├── auth/                 # Login, Register
│   ├── admin/                # Dashboard quản trị xe, tài xế, xem feedback/contact
│   ├── operator/             # Phòng điều phối Control Room, Live SOS Queue, Bản đồ xe
│   └── user/                 # Nút bấm SOS 1 chạm, Theo dõi xe tới, Hồ sơ y tế
├── routes/
│   ├── AppRoutes.jsx         # Cấu hình router toàn bộ ứng dụng
│   └── ProtectedRoute.jsx    # HOC chặn route dựa theo Role (admin, operator, user)
├── App.jsx
├── main.jsx
└── index.css                 # Import TailwindCSS & Theme tokens
```

### 3.3. Quy Tắc Lập Trình React JS
- **Functional Components**: 100% sử dụng Functional Components kèm React Hooks (`useState`, `useEffect`, `useContext`, `useCallback`, `useMemo`). Tuyệt đối không dùng Class Components.
- **Tên Component & File**: `PascalCase.jsx` (VD: `AdminDashboard.jsx`, `SosButton.jsx`, `AmbulanceCard.jsx`).
- **Tên Biến & Hàm**: `camelCase` (VD: `fetchAmbulances()`, `handleBookingAmbulance()`).
- **CSS**: 100% sử dụng **TailwindCSS**. Không viết CSS chay, không tạo file `.css` lẻ tẻ.
- **Xử lý Token**: Token nhận từ API Sanctum lưu tại `localStorage` hoặc `sessionStorage`, tự động inject vào header `Authorization: Bearer <token>` qua Axios Interceptor.
- **UI Feedback**: Mọi thao tác submit/xóa/cập nhật bắt buộc có loading indicator (Spinner/Skeleton) và thông báo Toast (SweetAlert2).

---

## 4. QUY CHUẨN PHÂN QUYỀN (ROLE-BASED ACCESS CONTROL - RBAC)

Hệ thống hỗ trợ 3 Roles chính:
1. **`admin`**: Quản trị viên tối cao (Quản lý users, fleet xe cứu thương, tài xế, trạm xá, báo cáo doanh thu/thống kê).
2. **`operator`**: Điều phối viên / Tổng đài viên (Tiếp nhận SOS, theo dõi bản đồ trực tiếp, gán xe cứu thương cho bệnh nhân, cập nhật trạng thái cứu hộ).
3. **`user`**: Người dân / Bệnh nhân (Gửi yêu cầu cấp cứu 1 chạm kèm GPS, theo dõi xe đến theo thời gian thực, quản lý hồ sơ y tế cá nhân).

- **Backend Enforcement**:
  - Middleware kiểm tra role: `auth:sanctum` + `role:admin`, `role:operator`, `role:user`.
  - Từ chối truy cập trái phép với HTTP `403 Forbidden`.
- **Frontend Enforcement**:
  - Component `<ProtectedRoute allowedRoles={['admin', 'operator']} />` tự động chuyển hướng nếu người dùng không đủ quyền hạn.

---

## 5. QUY TRÌNH GIT VÀ COMMITS

- **Commit Messages (BẮT BUỘC TIẾNG ANH)**: Chuẩn **Conventional Commits** (`type: message`).
  - Danh sách types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Nguyên tắc "TRẢM LIÊN TỤC"**: Cứ hoàn thành 1 component, 1 endpoint API hoặc 1 tính năng nhỏ là phải commit ngay lập tức.
- **Không vứt rác**: Xoá toàn bộ `dd()`, `dump()`, `console.log()` trước khi commit.
