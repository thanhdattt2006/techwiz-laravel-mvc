# DAY 3: RESTFUL API CONTROLLERS, SANCTUM AUTH & CORE BUSINESS LOGIC

**Mục tiêu**: Xây dựng toàn bộ hệ thống xử lý nghiệp vụ phía Backend qua RESTful API. Cài đặt bảo mật xác thực với Laravel Sanctum, phân quyền qua Middleware theo 3 vai trò (`admin`, `operator`, `user`), xác thực dữ liệu đầu vào qua Form Requests và chuẩn hóa dữ liệu trả về qua JsonResources (chống N+1 query tuyệt đối).

---

## Phase 3.1: Cấu Hình API Routing & Middleware Phân Quyền (`routes/api.php`)
- `[ ]` Nhóm toàn bộ route theo prefix `v1/`:
  - Nhóm Public Routes: `POST /auth/login`, `POST /auth/register`.
  - Nhóm Protected Routes (`auth:sanctum`):
    - `GET /auth/me`, `POST /auth/logout`.
  - Nhóm User Routes (`auth:sanctum`, `role:user`):
    - `POST /emergency-requests` (Tạo SOS kèm GPS).
    - `GET /emergency-requests/my` (Lịch sử cứu hộ của user).
    - `GET /emergency-requests/{id}/track` (Theo dõi xe đang đến).
    - `GET /profile/medical`, `PUT /profile/medical` (Quản lý hồ sơ y tế).
  - Nhóm Operator Routes (`auth:sanctum`, `role:operator,admin`):
    - `GET /operator/queue` (Danh sách các ca chờ điều phối `pending`).
    - `POST /dispatches/assign` (Gán xe cứu thương cho ca cấp cứu).
    - `PATCH /dispatches/{id}/status` (Cập nhật trạng thái chuyến đi).
    - `GET /ambulances/live` (Vị trí & trạng thái toàn bộ xe trên bản đồ).
  - Nhóm Admin Routes (`auth:sanctum`, `role:admin`):
    - CRUD `/admin/users` (Quản lý tài khoản, phân vai trò).
    - CRUD `/admin/ambulances` (Thêm/Sửa/Xoá xe cứu thương & tài xế).
    - `GET /admin/stats/overview` (Báo cáo số liệu phân tích hệ thống).
- `[ ]` Tạo Middleware `CheckRole.php`:
  - Kiểm tra xem `$request->user()->role` có nằm trong danh sách roles được phép hay không.
  - Nếu không thoả mãn -> Trả về JSON `{ "success": false, "message": "Access denied. Insufficient permissions." }` với HTTP `403 Forbidden`.

## Phase 3.2: Auth API & Sanctum Token Management
- `[ ]` Tạo `AuthController.php`:
  - `login()`: Kiểm tra email/password -> Tạo Bearer Token qua `$user->createToken('auth_token')->plainTextToken` -> Trả về token kèm role của user.
  - `register()`: Tạo tài khoản mới (mặc định role: `user`) -> Trả về token đăng nhập ngay.
  - `me()`: Trả về thông tin user hiện tại kèm `medicalProfile`.
  - `logout()`: Xoá current access token qua `$request->user()->currentAccessToken()->delete()`.

## Phase 3.3: Form Requests & JsonResources (Validate & Chuẩn Hóa Data)
- `[ ]` Tạo các Form Requests:
  - `StoreEmergencyRequest`: Validate `caller_name`, `caller_phone`, `pickup_lat`, `pickup_lng`, `severity_level`.
  - `AssignAmbulanceRequest`: Validate `emergency_request_id` (exists in DB), `ambulance_id` (exists and `current_status == 'available'`).
  - `UpdateLocationRequest`: Validate `lat`, `lng`.
- `[ ]` Tạo các JsonResources:
  - `UserResource.php`, `EmergencyRequestResource.php`, `AmbulanceResource.php`, `DispatchResource.php`.
  - Đảm bảo cấu trúc response đồng nhất:
    ```json
    {
      "success": true,
      "message": "Thao tác thành công",
      "data": { ... }
    }
    ```

## Phase 3.4: Xử Lý Logic Nghiệp Vụ Cốt Lõi (Business Logic & DB Transactions)
- `[ ]` **Logic Điều Phối Cứu Thương (Dispatch Assignment)**:
  - Sử dụng `DB::transaction(...)` để đảm bảo tính toàn vẹn dữ liệu:
    1. Kiểm tra xe cứu thương có đang ở trạng thái `available` hay không. Nếu đang bận -> ném lỗi `400 Bad Request`.
    2. Cập nhật trạng thái của `Ambulance` sang `dispatched`.
    3. Cập nhật trạng thái của `EmergencyRequest` sang `assigned`.
    4. Tạo bản ghi mới trong bảng `dispatches` (ghi nhận thời gian `dispatched_at` và `operator_id`).
- `[ ]` **Logic Chống N+1 Query**:
  - Luôn Eager Load: `EmergencyRequest::with(['user.medicalProfile', 'dispatch.ambulance'])->get()`.
- `[ ]` **Logic Cập Nhật Vị Trí Xe (GPS Tracking)**:
  - Endpoint `PATCH /api/v1/ambulances/{id}/location`: Cập nhật toạ độ GPS mới của xe để phục vụ theo dõi thời gian thực.

## Phase 3.5: Kiểm Thử API Bằng Postman / Thunder Client
- `[ ]` Test toàn bộ 15+ endpoints.
- `[ ]` Kiểm tra kỹ các mã HTTP: `200`, `201`, `401`, `403`, `422`.
- `[ ]` Đảm bảo CORS header phản hồi chính xác `Access-Control-Allow-Origin`.

---

## Tổng Kết Day 3
- `[ ]` Backend Web API đã hoàn thành 100% các tính năng nghiệp vụ.
- `[ ]` Sẵn sàng bàn giao toàn bộ Endpoint cho Day 4 ghép giao diện React JS Vite.
