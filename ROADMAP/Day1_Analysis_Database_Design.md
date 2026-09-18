# DAY 1: PHÂN TÍCH YÊU CẦU, THIẾT KẾ CSDL (ERD) & API CONTRACT

**Mục tiêu**: Phân tích đề bài, chốt mô hình phân quyền 3 roles (`admin`, `operator`, `user`), thiết kế sơ đồ CSDL quan hệ (ERD), định nghĩa hợp đồng API (API Contract Specification) giữa Backend và Frontend, và phân chia công việc cho team 4 người.

---

## Phase 1.1: Phân Tích Yêu Cầu Đề Bài & Mô Hình 3 Roles
- `[ ]` Đọc kỹ đề bài (Sử dụng mẫu tham khảo "Rapid Rescue" trong TechWiz 7 SRS hoặc đề thi thực tế).
- `[ ]` Xác định 3 Actors chính và ma trận quyền hạn:
  1. **`admin` (Quản trị viên)**:
     - Toàn quyền quản lý người dùng, tài khoản operator, danh mục xe cứu thương / trang thiết bị, tài xế, bệnh viện liên kết.
     - Xem báo cáo tổng quan, số lượng cuốc cấp cứu, thời gian phản hồi trung bình, tỷ lệ thành công.
  2. **`operator` (Điều phối viên / Tổng đài viên)**:
     - Nhận danh sách yêu cầu cấp cứu SOS thời gian thực từ người dân.
     - Xem bản đồ vị trí các xe đang rảnh (Available) và vị trí của nạn nhân.
     - Phân công (Assign) xe cứu thương gần nhất cho ca cấp cứu.
     - Cập nhật tiến độ: Đã điều phối -> Xe đang tới -> Đã tới hiện trường -> Đang chở về viện -> Hoàn thành.
  3. **`user` (Người dân / Bệnh nhân)**:
     - Kích hoạt yêu cầu khẩn cấp 1-chạm (gửi kèm toạ độ GPS tự động lấy từ trình duyệt).
     - Theo dõi xe cứu thương đang di chuyển tới vị trí của mình trên bản đồ theo thời gian thực.
     - Quản lý hồ sơ y tế khẩn cấp cá nhân (nhóm máu, dị ứng, tiền sử bệnh, số điện thoại người thân).
     - Xem lịch sử các lần gọi cứu trợ.

## Phase 1.2: Thiết Kế Sơ Đồ Cơ Sở Dữ Liệu (ERD)
- `[ ]` **Bảng `users`**:
  - `id`, `name`, `email`, `password`, `phone`, `role` (`enum('admin', 'operator', 'user')`), `avatar_url`, `status` (`active`, `suspended`), `created_at`, `updated_at`, `deleted_at`.
- `[ ]` **Bảng `medical_profiles`** (1-1 với `users`):
  - `id`, `user_id` (FK), `blood_type` (A, B, AB, O, Rh+/-), `allergies`, `chronic_conditions`, `emergency_contact_name`, `emergency_contact_phone`, `timestamps`.
- `[ ]` **Bảng `ambulances`**:
  - `id`, `vehicle_number` (Biển số xe), `model`, `equipment_level` (`basic`, `advanced`, `icu`), `current_status` (`available`, `dispatched`, `maintenance`, `offline`), `current_lat`, `current_lng`, `driver_name`, `driver_phone`, `timestamps`, `deleted_at`.
- `[ ]` **Bảng `emergency_requests`**:
  - `id`, `user_id` (FK nullable nếu hỗ trợ gọi vãng lai), `caller_name`, `caller_phone`, `pickup_address`, `pickup_lat`, `pickup_lng`, `severity_level` (`critical`, `moderate`, `low`), `notes`, `status` (`pending`, `assigned`, `en_route`, `arrived`, `transporting`, `completed`, `cancelled`), `timestamps`, `deleted_at`.
- `[ ]` **Bảng `dispatches`**:
  - `id`, `emergency_request_id` (FK), `ambulance_id` (FK), `operator_id` (FK to users), `dispatched_at`, `arrived_at`, `completed_at`, `hospital_destination`, `notes`, `timestamps`.

## Phase 1.3: Quy Hoạch API Contract (Endpoints Giữa Backend & Frontend)
- `[ ]` **Nhóm Auth (`/api/v1/auth`)**:
  - `POST /register`: Đăng ký tài khoản người dùng
  - `POST /login`: Đăng nhập, trả về `{ token, user: { id, name, email, role } }`
  - `GET /me`: Lấy thông tin tài khoản hiện tại (kèm role)
  - `POST /logout`: Hủy token Sanctum
- `[ ]` **Nhóm Emergency Request (`/api/v1/emergency-requests`)**:
  - `POST /`: Tạo yêu cầu SOS khẩn cấp (User)
  - `GET /`: Danh sách yêu cầu (Operator xem các ca `pending`, User xem lịch sử của mình)
  - `GET /{id}`: Chi tiết ca cấp cứu kèm trạng thái và thông tin xe được điều phối
  - `PATCH /{id}/cancel`: Hủy yêu cầu
- `[ ]` **Nhóm Dispatch & Fleet (`/api/v1/dispatches`)**:
  - `POST /assign`: Operator gán xe cứu thương cho ca cấp cứu
  - `PATCH /{id}/status`: Cập nhật trạng thái chuyến đi (`en_route`, `arrived`, `completed`)
  - `GET /active`: Danh sách các chuyến đang chạy thời gian thực
- `[ ]` **Nhóm Ambulances (`/api/v1/ambulances`)**:
  - `GET /`: Danh sách xe và trạng thái (Available / Dispatched / v.v.)
  - `POST /` / `PUT /{id}` / `DELETE /{id}`: Admin quản lý đội xe
  - `PATCH /{id}/location`: Cập nhật toạ độ GPS xe thời gian thực (giả lập hoặc từ GPS thiết bị)
- `[ ]` **Nhóm Admin Analytics (`/api/v1/admin/stats`)**:
  - `GET /overview`: Tổng số xe, số ca cấp cứu hôm nay, tỷ lệ phản hồi nhanh, biểu đồ theo tuần.

## Phase 1.4: Phân Công Nhiệm Vụ 4 Thành Viên
- `[ ]` **Thành viên 1 (Lead Backend)**: Thiết kế Migrations, Models, Relationships & Sanctum Auth.
- `[ ]` **Thành viên 2 (Backend Logic)**: Xây dựng REST API Controllers, Form Requests, JsonResources cho Emergency Requests & Dispatching.
- `[ ]` **Thành viên 3 (Lead Frontend)**: Xây dựng Frontend khung: React Router, Axios Client, AuthContext, ProtectedRoute, Login/Register UI, User SOS Page.
- `[ ]` **Thành viên 4 (Frontend Features)**: Xây dựng Operator Dispatch Dashboard (Live Queue & Map Tracking) & Admin Management Panel.

---

## Tổng Kết Day 1
- `[ ]` Toàn team thống nhất 100% ERD và API Contract trước khi gõ dòng code nào.
- `[ ]` Không có sự mập mờ giữa Frontend và Backend.
