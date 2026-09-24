# DAY 5: END-TO-END TESTING, QA POLISH, DEPLOYMENT & CHUẨN BỊ DEMO

**Mục tiêu**: Đóng băng code tính năng mới (Code Freeze). Toàn lực kiểm thử luồng nghiệp vụ End-to-End giữa Frontend (React trên Vercel) và Backend (Laravel API trên Render), sửa sạch mọi lỗi phát sinh, thiết lập dữ liệu mẫu chuẩn chỉ và sẵn sàng kịch bản thuyết trình chinh phục Ban Giám Khảo (BGK).

> [!IMPORTANT]
> ### ⚠️ NGUYÊN TẮC BẮT BUỘC TRƯỚC KHI TEST & POLISH DAY 5:
> Team Tester và Developer **BẮT BUỘC** phải đọc và tuân thủ tuyệt đối:
> 1. [`RULE.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/RULE.md): Quy trình commit, kiểm thử chéo và phối hợp ghi nhận bug.
> 2. [`ai/WORKFLOW.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/WORKFLOW.md): Kiểm thử toàn bộ các kịch bản chuyển đổi trạng thái của Order State Machine, Time Slot và Cutoff logic.
> 3. [`ai/BUGS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/BUGS.md): Ghi chép chi tiết mọi lỗi phát sinh (mã lỗi HTTP, network request, console log) để developer xử lý dứt điểm.
> 4. [`ai/PROGRESS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/PROGRESS.md): Nghiệm thu từng hạng mục kiểm thử và cập nhật kết quả.

---

## Phase 5.1: Đóng Băng Code & Kiểm Thử Nghiệp Vụ End-to-End (E2E)
- `[ ]` Thống nhất toàn team KHÔNG thêm bất kỳ tính năng mới nào.
- `[ ]` **Kiểm thử Luồng Cứu Hộ Hoàn Chỉnh (Golden Happy Path)**:
  1. Mở trình duyệt ẩn danh 1: Đăng nhập tài khoản `user@rapidrescue.com`.
  2. Bấm nút SOS Khẩn Cấp -> Cho phép GPS -> Nhập triệu chứng "Đau ngực dữ dội" -> Gửi yêu cầu.
  3. Mở trình duyệt ẩn danh 2: Đăng nhập tài khoản `operator@rapidrescue.com`.
  4. Kiểm tra ca cấp cứu mới lập tức xuất hiện trên Hàng Đợi (Queue) của Operator mà không cần F5.
  5. Operator bấm gán xe cứu thương gần nhất (`AMB-01`) cho ca bệnh.
  6. Kiểm tra phía màn hình User lập tức cập nhật: Hiển thị xe `AMB-01` đang trên đường tới cùng số điện thoại tài xế và ETA.
  7. Operator bấm cập nhật: "Xe đã tới hiện trường" -> "Đã đưa bệnh nhân đến Bệnh viện Chợ Rẫy" -> "Hoàn thành".
  8. Kiểm tra phía màn hình Admin: Dashboard thống kê ghi nhận tăng thêm 1 ca hoàn thành thành công.
- `[ ]` Kiểm thử các tình huống biên:
  - Tắt quyền truy cập vị trí GPS -> App hiển thị ô nhập địa chỉ thay thế.
  - Cố tình gán một xe đang bận (`dispatched`) -> Hệ thống báo lỗi và chặn hành động.
  - Token hết hạn hoặc sai vai trò -> Chặn truy cập và đá về trang đăng nhập với thông báo rõ ràng.

## Phase 5.2: Khắc Phục Lỗi (Bug Fixing & Error Handling)
- `[ ]` Kiểm tra F12 Console trên Frontend: Tuyệt đối không còn lỗi đỏ, cảnh báo key React hay rò rỉ bộ nhớ từ `setInterval` / timers.
- `[ ]` Kiểm tra Network Tab: Xử lý triệt để các lỗi `CORS error`, `401 Unauthorized`, `500 Internal Server Error`.
- `[ ]` Dọn dẹp mã nguồn: Xoá sạch toàn bộ `console.log()` ở Frontend và `dd()`, `dump()` ở Backend.

## Phase 5.3: Tối Ưu Môi Trường Production (Vercel & Render)
- `[ ]` **Backend (Render.com)**:
  - Cấu hình `APP_ENV=production` và `APP_DEBUG=false`.
  - Kiểm tra kết nối Aiven MySQL qua SSL hoạt động mượt mà.
  - Cấu hình whitelist đúng domain Vercel trong `config/cors.php`.
- `[ ]` **Frontend (Vercel.com)**:
  - Kiểm tra biến môi trường `VITE_API_BASE_URL` trên Vercel Dashboard trỏ chính xác về Render API.
  - Kiểm tra file `vercel.json` định tuyến SPA hoạt động (F5 lại bất kỳ trang nào không bị lỗi 404).

## Phase 5.4: Dọn Dữ Liệu Mẫu & Chuẩn Bị Kịch Bản Thuyết Trình
- `[ ]` Chạy `php artisan migrate:fresh --seed` để làm sạch toàn bộ dữ liệu thử nghiệm, đưa DB về trạng thái mẫu đẹp nhất.
- `[ ]` Ghi rõ 3 tài khoản demo ở đầu file `README.md` để BGK dễ dàng chấm bài:
  | Vai trò | Email | Mật khẩu | Chức năng chính |
  | :--- | :--- | :--- | :--- |
  | **Admin** | `admin@rapidrescue.com` | `password123` | Quản lý đội xe, tài xế, tài khoản, biểu đồ thống kê |
  | **Operator** | `operator@rapidrescue.com` | `password123` | Phòng điều phối trực tiếp, tiếp nhận SOS, gán xe cứu thương |
  | **User** | `user@rapidrescue.com` | `password123` | Nút bấm SOS 1-chạm kèm GPS, theo dõi xe thời gian thực, hồ sơ y tế |
- `[ ]` Soạn kịch bản thuyết trình phân chia thời gian (Tối đa 10 - 15 phút):
  - **Phút 1-2**: Giới thiệu bài toán và kiến trúc hệ thống (Decoupled Client-Server: React Vite trên Vercel + Laravel API trên Render).
  - **Phút 3-5**: Demo vai trò Người Dân gọi cấp cứu khẩn cấp 1 chạm lấy toạ độ GPS.
  - **Phút 6-9**: Demo vai trò Điều Phối Viên (Operator) nhận tín hiệu và điều động xe cứu thương trên bản đồ thời gian thực.
  - **Phút 10-12**: Demo vai trò Quản Trị Viên (Admin) xem báo cáo và điều hành hệ thống.
  - **Phút 13-15**: Trả lời câu hỏi kỹ thuật của BGK (về chống N+1 query, bảo mật Sanctum, CORS, kiến trúc phân quyền).

---

## Tổng Kết Day 5
- `[ ]` Hoàn thành xuất sắc dự án TechWiz với sản phẩm mượt mà, sẵn sàng đạt điểm số tối đa!
