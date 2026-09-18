# DAY 2: MIGRATIONS, ELOQUENT MODELS & DATABASE SEEDERS

**Mục tiêu**: Hiện thực hóa sơ đồ ERD thành mã nguồn Laravel chuẩn mực (Migrations, Models, Relationships) và tạo sẵn bộ dữ liệu mẫu (Seeders) với 3 tài khoản demo cố định cho 3 vai trò (`admin`, `operator`, `user`) cùng dữ liệu đội xe cứu thương để sẵn sàng kết nối API ở Day 3.

---

## Phase 2.1: Tạo Migrations Theo Thứ Tự Quan Hệ
- `[ ]` Cập nhật migration `create_users_table`:
  - Bổ sung `phone`, `role` (`admin`, `operator`, `user`), `avatar_url`, `status`, `softDeletes()`.
- `[ ]` Tạo migration `create_medical_profiles_table`:
  - Khóa ngoại `user_id` liên kết `users` (onDelete cascade).
- `[ ]` Tạo migration `create_ambulances_table`:
  - `vehicle_number`, `model`, `equipment_level`, `current_status`, `current_lat`, `current_lng`, `driver_name`, `driver_phone`, `softDeletes()`.
- `[ ]` Tạo migration `create_emergency_requests_table`:
  - `user_id` (nullable), `caller_name`, `caller_phone`, `pickup_address`, `pickup_lat`, `pickup_lng`, `severity_level`, `status`, `notes`, `softDeletes()`.
- `[ ]` Tạo migration `create_dispatches_table`:
  - `emergency_request_id`, `ambulance_id`, `operator_id`, `dispatched_at`, `arrived_at`, `completed_at`, `hospital_destination`, `notes`.
- `[ ]` Chạy kiểm tra: `php artisan migrate:fresh` và `php artisan migrate:rollback` đảm bảo không lỗi foreign key.

## Phase 2.2: Cấu Hình Eloquent Models (Chuẩn CONVENTION.md)
- `[ ]` Tạo các Model: `User`, `MedicalProfile`, `Ambulance`, `EmergencyRequest`, `Dispatch`.
- `[ ]` BẮT BUỘC thêm `declare(strict_types=1);` ở đầu tất cả các file Model.
- `[ ]` Cấu hình thuộc tính `$fillable` ngăn ngừa Mass Assignment vulnerabilities.
- `[ ]` Tích hợp trait `SoftDeletes` cho `User`, `Ambulance`, `EmergencyRequest`.
- `[ ]` Khai báo các hằng số trạng thái (Status Constants) và vai trò (Role Constants):
  - Model `User`:
    ```php
    public const ROLE_ADMIN = 'admin';
    public const ROLE_OPERATOR = 'operator';
    public const ROLE_USER = 'user';
    ```
  - Model `Ambulance`:
    ```php
    public const STATUS_AVAILABLE = 'available';
    public const STATUS_DISPATCHED = 'dispatched';
    public const STATUS_MAINTENANCE = 'maintenance';
    ```
  - Model `EmergencyRequest`:
    ```php
    public const STATUS_PENDING = 'pending';
    public const STATUS_ASSIGNED = 'assigned';
    public const STATUS_EN_ROUTE = 'en_route';
    public const STATUS_ARRIVED = 'arrived';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';
    ```

## Phase 2.3: Thiết Lập Eloquent Relationships Đầy Đủ Kiểu Dữ Liệu
- `[ ]` `User` `hasOne(MedicalProfile::class)` và `hasMany(EmergencyRequest::class)`.
- `[ ]` `EmergencyRequest` `belongsTo(User::class)` và `hasOne(Dispatch::class)`.
- `[ ]` `Ambulance` `hasMany(Dispatch::class)`.
- `[ ]` `Dispatch` `belongsTo(EmergencyRequest::class)`, `belongsTo(Ambulance::class)`, `belongsTo(User::class, 'operator_id')`.
- `[ ]` Khai báo Return Types rõ ràng cho mọi quan hệ (`public function user(): BelongsTo`).

## Phase 2.4: Tạo Seeders Với 3 Tài Khoản Mẫu Cho Demo
- `[ ]` Tạo `DatabaseSeeder.php` tự động tạo 3 tài khoản chuẩn:
  - **Admin**: `admin@rapidrescue.com` / Mật khẩu: `password123` / Role: `admin`.
  - **Operator**: `operator@rapidrescue.com` / Mật khẩu: `password123` / Role: `operator`.
  - **User**: `user@rapidrescue.com` / Mật khẩu: `password123` / Role: `user`.
- `[ ]` Seed sẵn 10 xe cứu thương tại các toạ độ GPS thực tế ở trung tâm thành phố (5 xe `available`, 3 xe `dispatched`, 2 xe `maintenance`).
- `[ ]` Seed sẵn 5 ca cấp cứu mẫu ở các trạng thái khác nhau (`pending`, `en_route`, `completed`) để kiểm thử UI ngay lập tức.
- `[ ]` Chạy `php artisan migrate:fresh --seed` và test kiểm tra bằng `php artisan tinker`.

---

## Tổng Kết Day 2
- `[ ]` Cơ sở dữ liệu đã hoàn thiện 100% kèm dữ liệu mẫu sinh động.
- `[ ]` Sẵn sàng cho Day 3 xây dựng các API Controllers và logic phân quyền.
