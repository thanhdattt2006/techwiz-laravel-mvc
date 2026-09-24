# DAY 4: XÂY DỰNG GIAO DIỆN REACT JS (VITE) CHO 3 VAI TRÒ & TÍCH HỢP API

**Mục tiêu**: Xây dựng toàn bộ giao diện Single Page Application (SPA) bằng **React.js + JavaScript + Vite** kết nối trực tiếp với Laravel REST Web API qua Axios. Thiết kế hiện đại 100% bằng **TailwindCSS**, chia tách module rõ ràng (DRY, SOLID) và tích hợp các tính năng đặc thù cho 3 vai trò (`admin`, `operator`, `user`).

> [!IMPORTANT]
> ### ⚠️ NGUYÊN TẮC BẮT BUỘC TRƯỚC KHI CODE DAY 4:
> Developer và AI **BẮT BUỘC** phải đọc và tuân thủ tuyệt đối:
> 1. [`RULE.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/RULE.md): Luật làm việc, bảng màu chuẩn Fresh Botanical & Harvest Gold, cấm Dark Theme, cấm để lại `console.log()`.
> 2. [`ai/CONVENTION.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/CONVENTION.md): 100% Functional Components + React Hooks, TailwindCSS, Axios Interceptors, cấu trúc `src/` chuẩn, ModalContext React Portal.
> 3. [`ai/WORKFLOW.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/WORKFLOW.md): Order State Machine 4 bước, luồng Pre-Order thanh toán tiền mặt tại sạp, không có giao hàng tận nhà.
> 4. [`ai/PROGRESS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/PROGRESS.md) & [`ai/BUGS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/BUGS.md): Cập nhật tiến độ và ghi chép lỗi phát sinh.

---

## Phase 4.1: Xây Dựng Authentication & Protected Routing
- `[ ]` **Trang Login / Register**:
  - Giao diện đăng nhập hiện đại với email & password.
  - Cho phép chọn đăng nhập nhanh với 3 tài khoản demo (`Admin`, `Operator`, `User`) chỉ bằng 1 click để tiện trình diễn trước BGK.
  - Sau khi đăng nhập thành công: Lưu token vào `localStorage`, cập nhật `AuthContext` và tự động redirect theo vai trò:
    - `admin` -> `/admin/dashboard`
    - `operator` -> `/operator/dispatch-room`
    - `user` -> `/user/sos`
- `[ ]` **Route Guards (`ProtectedRoute.jsx`)**:
  - Chặn người dùng chưa đăng nhập hoặc truy cập trái role, hiển thị toast cảnh báo thân thiện.

## Phase 4.2: Giao Diện Người Dân / Bệnh Nhân (User / Patient Portal)
- `[ ]` **Trang Kích Hoạt SOS Khẩn Cấp (`UserSosPage.jsx`)**:
  - Nút bấm SOS 1-chạm kích thước lớn, hiệu ứng pulse animation phát sáng màu đỏ khẩn cấp.
  - Tự động kích hoạt HTML5 Geolocation (`navigator.geolocation.getCurrentPosition`) để lấy toạ độ GPS chính xác của nạn nhân.
  - Form xác nhận nhanh: Tên người gọi, số điện thoại, mức độ khẩn cấp (Critical / Moderate), ghi chú tình trạng (khó thở, tai nạn, đau tim...).
  - Gửi request `POST /api/v1/emergency-requests` kèm toạ độ GPS.
- `[ ]` **Trang Theo Dõi Xe Cứu Thương Trực Tiếp (`LiveTrackingPage.jsx`)**:
  - Bản đồ hoặc visual distance tracker hiển thị khoảng cách xe cứu thương đang di chuyển đến.
  - Thẻ thông tin tài xế: Tên tài xế, số điện thoại bấm gọi ngay, biển số xe, thời gian dự kiến đến (ETA).
  - Tự động poll API mỗi 3 giây để cập nhật vị trí và trạng thái xe mà không cần tải lại trang.
- `[ ]` **Trang Hồ Sơ Y Tế Cá Nhân (`MedicalProfilePage.jsx`)**:
  - Xem & cập nhật nhóm máu, tiền sử bệnh, dị ứng thuốc và số điện thoại người thân.

## Phase 4.3: Giao Diện Phòng Điều Phối Khẩn Cấp (Operator Dispatch Room)
- `[ ]` **Hàng Đợi Yêu Cầu Cấp Cứu Thời Gian Thực (Live SOS Queue)**:
  - Danh sách các ca `pending` với thẻ cảnh báo đỏ nhấp nháy, âm thanh thông báo khi có ca mới.
  - Hiển thị đầy đủ thông tin: Tên nạn nhân, toạ độ, địa chỉ, mức độ nguy kịch, hồ sơ bệnh lý (nếu có).
- `[ ]` **Bản Đồ / Bảng Quản Lý Xe Cứu Thương Trực Tuyến**:
  - Danh sách các xe đang rảnh (`available` - màu xanh), đang làm nhiệm vụ (`dispatched` - màu vàng), và bảo trì (`maintenance` - màu xám).
- `[ ]` **Modal Phân Công Xe Cứu Thương (Dispatch Assignment Modal)**:
  - Bấm chọn ca cấp cứu -> Bật modal gợi ý các xe cứu thương gần nhất hoặc phù hợp trang thiết bị (ICU / Advanced).
  - Bấm "Gán xe ngay" -> Gọi API `POST /api/v1/dispatches/assign`.
- `[ ]` **Thanh Tiến Độ Cuộc Cứu Hộ (Rescue Status Stepper)**:
  - Operator có thể cập nhật trạng thái nhanh: `En Route` -> `Arrived` -> `Transporting to Hospital` -> `Completed`.

## Phase 4.4: Giao Diện Quản Trị Hệ Thống (Admin Control Panel)
- `[ ]` **Dashboard Tổng Quan (`AdminDashboard.jsx`)**:
  - Các chỉ số KPI chính: Tổng số xe, số ca cấp cứu hôm nay, thời gian phản hồi trung bình (Response Time), tỷ lệ cứu hộ thành công.
  - Biểu đồ thống kê (sử dụng Chart.js hoặc CanvasJS): Số lượng ca cấp cứu theo ngày trong tuần, cơ cấu loại bệnh khẩn cấp.
- `[ ]` **Quản Lý Đội Xe & Tài Xế (`AmbulanceManagement.jsx`)**:
  - Bảng danh sách xe cứu thương có tìm kiếm, lọc theo trạng thái (`available`, `dispatched`, `maintenance`).
  - Modal Thêm mới / Chỉnh sửa thông tin xe, biển số, cấp độ thiết bị, thông tin tài xế.
  - Xóa xe an toàn với SweetAlert2 Confirm.
- `[ ]` **Quản Lý Tài Khoản & Phân Quyền (`UserManagement.jsx`)**:
  - Quản lý danh sách người dùng, thay đổi vai trò (`admin`, `operator`, `user`), khóa tài khoản vi phạm.

## Phase 4.5: Tối Ưu UX/UI & Responsive
- `[ ]` 100% chuẩn giao diện TailwindCSS trên cả Mobile (dành cho người dân gọi SOS) và Desktop (dành cho màn hình điều phối Operator).
- `[ ]` Toàn bộ hành động gọi API đều có loading state (Spinner) và toast thông báo thành công/thất bại.

---

## Tổng Kết Day 4
- `[ ]` Hoàn tất toàn bộ giao diện và luồng kết nối API cho cả 3 vai trò.
- `[ ]` Sẵn sàng cho Day 5 bước vào giai đoạn kiểm thử toàn diện (QA & Demo Polish).
