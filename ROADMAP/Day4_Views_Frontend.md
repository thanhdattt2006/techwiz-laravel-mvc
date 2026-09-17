# DAY 4: HOÀN THIỆN VIEWS, GHÉP GIAO DIỆN & TƯƠNG TÁC NGƯỜI DÙNG

**Mục tiêu**: Đắp toàn bộ giao diện người dùng hoàn chỉnh lên khung sườn Master Layout đã dựng từ Day 0. Đảm bảo giao diện đẹp mắt, chuẩn TailwindCSS v4, responsive 100% trên cả Mobile và Desktop.

---

## Phase 4.1: Ghép Layout & Trang Chủ (Home / Landing Page)

- `[ ]` Kế thừa Master Layout (`@extends('layouts.app')`).
- `[ ]` Xây dựng Banner/Hero Section thu hút với tiêu đề lớn và nút Call-to-Action.
- `[ ]` Hiển thị danh sách các mục nổi bật/mới nhất dạng Grid Card.
- `[ ]` Kiểm tra độ hiển thị responsive trên mobile.

## Phase 4.2: Giao Diện Danh Sách & Tìm Kiếm / Bộ Lọc (Index View)

- `[ ]` Xây dựng form tìm kiếm, lọc dữ liệu (GET form).
- `[ ]` Hiển thị dữ liệu dạng Table hoặc Grid Cards tùy tính chất dữ liệu.
- `[ ]` Xử lý trạng thái rỗng khi không có dữ liệu (`@forelse ... @empty`).
- `[ ]` Tích hợp thanh phân trang Laravel đẹp mắt với TailwindCSS.

## Phase 4.3: Giao Diện Chi Tiết (Show View)

- `[ ]` Bố cục chi tiết trực quan (ảnh, thông tin, trạng thái, ngày tạo, người tạo).
- `[ ]` Xử lý fallback ảnh mặc định nếu bản ghi không có ảnh.
- `[ ]` Các nút hành động: Quay lại, Thao tác nhanh.

## Phase 4.4: Giao Diện Form Thêm & Sửa (Create / Edit Views)

- `[ ]` Xây dựng các trường input, select, textarea chuẩn Tailwind.
- `[ ]` Luôn có `@csrf` và `@method('PUT')` cho form sửa.
- `[ ]` Hiển thị lỗi validation dưới từng ô input (`@error('fieldname')`).
- `[ ]` Giữ lại dữ liệu cũ khi submit lỗi (`old('fieldname', ...)`).
- `[ ]` Tích hợp nút submit có hiệu ứng loading spinner chống spam click.

## Phase 4.5: Khu Vực Quản Trị / Dashboard (Nếu Đề Bài Yêu Cầu)

- `[ ]` Bảng danh sách quản trị với đầy đủ cột thông tin và nhãn trạng thái (Badges).
- `[ ]` Nút Thao tác: Xem, Sửa, và Xóa.
- `[ ]` Nút Xóa sử dụng thuộc tính `data-confirm` kích hoạt SweetAlert2 Confirm trước khi gửi form xoá.

---

## Tổng Kết Day 4

- `[ ]` Toàn bộ màn hình giao diện đã được ghép nối hoàn tất và hoạt động trơn tru với Controller.
- `[ ]` F12 kiểm tra không có lỗi vỡ layout hoặc lỗi console JavaScript.
- `[ ]` Commit code và chuẩn bị bước vào ngày cuối cùng (Testing & Polish).
