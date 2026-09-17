# DAY 1: NHẬN ĐỀ, PHÂN TÍCH YÊU CẦU & THIẾT KẾ CSDL (ERD)

**Mục tiêu**: Sau khi nhận đề thi chính thức, phân tích toàn bộ yêu cầu, thống nhất kiến trúc thực thể, vẽ sơ đồ CSDL (ERD) và phân chia công việc rõ ràng cho 4 thành viên.

---

## Phase 1.1: Đọc & Phân Tích Yêu Cầu Đề Bài

- `[ ]` Đọc kỹ toàn bộ đề bài và gạch chân các yêu cầu bắt buộc (Core requirements).
- `[ ]` Liệt kê danh sách Actor (Vai trò người dùng: Khách vãng lai, Khách hàng, Admin, v.v.).
- `[ ]` Liệt kê danh sách các tính năng chính cần hoàn thành trong 5 ngày.
- `[ ]` Xác định các tính năng ưu tiên cao (Must-Have) và tính năng phụ (Nice-to-Have).

## Phase 1.2: Thiết Kế Sơ Đồ Cơ Sở Dữ Liệu (ERD)

- `[ ]` Xác định các bảng chính (Entities) cần lưu trữ dữ liệu.
- `[ ]` Xác định các mối quan hệ (1-N, N-N, 1-1) và các bảng trung gian (Pivot tables).
- `[ ]` Xác định chi tiết các trường dữ liệu, kiểu dữ liệu và ràng buộc (Foreign keys, Unique, Nullable).
- `[ ]` Vẽ sơ đồ CSDL trên draw.io hoặc dbdiagram.io.
- `[ ]` Cả team họp 15 phút rà soát và thống nhất chốt sơ đồ ERD.

## Phase 1.3: Cài Đặt Hệ Thống Xác Thực (Auth) & Phân Quyền Cơ Bản

- `[ ]` Xác định giải pháp Authentication phù hợp (Laravel Breeze hoặc Custom Auth đơn giản).
- `[ ]` Thiết lập bảng `users` với cột phân quyền (vd: `role` hoặc bảng roles nếu phức tạp).
- `[ ]` Kiểm tra luồng Đăng ký (Register), Đăng nhập (Login), Đăng xuất (Logout).

## Phase 1.4: Phân Công Nhiệm Vụ Cho Day 2

- `[ ]` Người 1: Phụ trách Nhóm Entity A (Model + Migration + Factory).
- `[ ]` Người 2: Phụ trách Nhóm Entity B (Model + Migration + Factory).
- `[ ]` Người 3: Phụ trách Nhóm Entity C (Model + Migration + Factory).
- `[ ]` Người 4: Phụ trách Database Seeder tổng thể và dữ liệu mẫu (Dummy data).

---

## Tổng Kết Day 1

- `[ ]` Sơ đồ ERD đã được chốt và lưu vào thư mục dự án.
- `[ ]` Hệ thống Auth cơ bản đã hoạt động ổn định.
- `[ ]` Cả 4 thành viên nắm rõ Entity mình sẽ phụ trách trong Day 2.
