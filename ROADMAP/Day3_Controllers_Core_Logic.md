# DAY 3: ROUTING, CONTROLLERS, FORM REQUESTS & CORE LOGIC

**Mục tiêu**: Xây dựng bộ xương xử lý nghiệp vụ của hệ thống (Business Logic). Tiếp nhận request, xác thực dữ liệu an toàn, tương tác Database (chống N+1 query), trả dữ liệu về View/JSON.

---

## Phase 3.1: Quy Hoạch Hệ Thống Routes (`routes/web.php`)

- `[ ]` Khai báo các Named Routes rõ ràng (`->name('...')`).
- `[ ]` Nhóm các route yêu cầu đăng nhập vào Middleware Group Auth (`Route::middleware(['auth'])`).
- `[ ]` Nhóm các route Quản trị viên vào Middleware Group Admin.
- `[ ]` Sử dụng Resource Route (`Route::resource(...)`) cho các tính năng CRUD chuẩn.
- `[ ]` Kiểm tra danh sách routes: `php artisan route:list`.

## Phase 3.2: Khởi Tạo Controllers (Tuân Thủ CONVENTION.md)

- `[ ]` Tạo các Controller tương ứng cho từng tính năng (`PascalCase` kết thúc bằng `Controller`).
- `[ ]` Bắt buộc khai báo `declare(strict_types=1);` và Type Hinting cho toàn bộ tham số, return type.
- `[ ]` Áp dụng nguyên tắc Thin Controller: Giữ mỗi method dưới 50 dòng code.

## Phase 3.3: Form Request Validation (Bảo Mật Đầu Vào)

- `[ ]` Tạo Form Request riêng cho từng hành động Thêm/Sửa (`php artisan make:request Store...Request`).
- `[ ]` Định nghĩa luật validate chặt chẽ (required, string, numeric, exists, unique...).
- `[ ]` KHÔNG viết logic validate trực tiếp bừa bãi trong Controller.

## Phase 3.4: Xử Lý Nghiệp Vụ CRUD & Chống N+1 Query

- `[ ]` Phương thức `index`: Lấy danh sách kèm phân trang (`paginate(...)`). Bắt buộc dùng Eager Loading (`with(...)`) khi gọi quan hệ.
- `[ ]` Phương thức `show`: Tìm record an toàn (`findOrFail(...)`) và eager load chi tiết.
- `[ ]` Phương thức `store`: Xử lý lưu record mới từ dữ liệu đã validate (`$request->validated()`), xử lý upload file/ảnh nếu có.
- `[ ]` Phương thức `update`: Cập nhật record, xử lý thay thế file cũ nếu có upload mới.
- `[ ]` Phương thức `destroy`: Xoá record an toàn (ưu tiên SoftDeletes), ngăn chặn xoá bừa bãi.

## Phase 3.5: Phân Quyền & Kiểm Tra Bảo Mật (Authorization)

- `[ ]` Kiểm tra quyền sở hữu (User chỉ sửa/xoá được dữ liệu của chính mình, trừ Admin).
- `[ ]` Xử lý middleware kiểm tra vai trò (Role/Permission).
- `[ ]` Đảm bảo không có lỗ hổng IDOR khi truyền param trên URL.

---

## Tổng Kết Day 3

- `[ ]` Toàn bộ luồng CRUD và logic nghiệp vụ cốt lõi đã chạy chính xác.
- `[ ]` Xoá sạch mọi `dd()`, `dump()`, `print_r()`.
- `[ ]` Commit code và sẵn sàng chuyển giao dữ liệu để ghép vào giao diện ở Day 4.
