# NHẬT KÝ TIẾN ĐỘ (PROGRESS TRACKER)

File này dùng để theo dõi sát sao tiến độ thực tế so với ROADMAP.
Cập nhật mỗi ngày/mỗi ca làm việc để toàn team và AI nắm được tình hình.

## TỔNG QUAN TIẾN ĐỘ
- **Thời hạn**: Day 0 (Chuẩn bị) + 5 Ngày (Day 1 -> Day 5)
- **Trạng thái chung**: `[/]` Đang hoàn thiện Day 0 (Setup & Khung sườn Frontend)

## CHI TIẾT CÁC NGÀY

### Day 0: Setup, Database, Deploy & Khung Sườn Frontend
- [x] Khởi tạo Laravel & Cấu hình môi trường
- [x] Kết nối DB (Local & Aiven) & Deploy Render (IaC)
- [x] Demo MVC & Database Maintenance Console
- `[/]` Khung sườn giao diện: Master Layout, Header, Footer
- `[/]` Tích hợp SweetAlert2 (Alert, Toast, Confirm) & Axios AJAX
- Tình trạng: Đang dựng các Phase Frontend cho Day 0

### Day 1: Phân Tích Đề, Thiết Kế ERD & Auth
- `[ ]` Đọc & Phân tích yêu cầu đề bài
- `[ ]` Thiết kế sơ đồ CSDL (ERD)
- `[ ]` Cài đặt Auth & Phân quyền cơ bản
- Tình trạng: Đang chờ đề thi chính thức

### Day 2: Migrations, Models & Seeders
- `[ ]` Migrations & Pivot tables
- `[ ]` Eloquent Models & Relationships
- `[ ]` Factories & Seeders (Dữ liệu mẫu)
- Tình trạng: Chờ thực hiện sau Day 1

### Day 3: Routes, Controllers & Core Logic
- `[ ]` Resource Routes & Form Requests
- `[ ]` CRUD Logic & Eager Loading (chống N+1)
- `[ ]` Phân quyền Controller & Authorization
- Tình trạng: Chờ thực hiện sau Day 2

### Day 4: Hoàn Thiện Views & Ghép Giao Diện
- `[ ]` Trang Chủ (Hero, Card grid)
- `[ ]` Trang Danh Sách (Filter, Search, Pagination)
- `[ ]` Trang Chi Tiết & Form Thêm/Sửa
- `[ ]` Dashboard Quản Trị
- Tình trạng: Chờ thực hiện sau Day 3

### Day 5: QA, Bug Fix & Chuẩn Bị Demo
- `[ ]` Code Freeze & QA Testing
- `[ ]` Sửa lỗi toàn diện
- `[ ]` Dọn dữ liệu mẫu & Thuyết trình
- Tình trạng: Chờ thực hiện sau Day 4
