# HƯỚNG DẪN DÀNH CHO AI (AGENTS)

File này chứa thông tin cấu hình và hướng dẫn bắt buộc dành cho mọi AI Assistant tham gia vào dự án này.

## 1. TECH STACK & DỰ ÁN (LIFELINK - EAMBULANCE PORTAL)
- **Tên dự án**: **LifeLink - Online eAmbulance Service Portal** (Khung đề bài SRS TechWiz 7).
- **Kiến trúc tổng thể**: **Decoupled Client-Server (RESTful Web API + Single Page Application)**.
- **Backend (Web API)**:
  - **Ngôn ngữ**: PHP 8.4 (Áp dụng property hooks, typed properties, declare strict_types=1).
  - **Framework**: Laravel 13 (Xây dựng RESTful API thuần túy, trả về chuẩn JSON).
  - **Authentication**: Laravel Sanctum (Token-based authentication cho API).
  - **Cơ sở dữ liệu**: Aiven (MySQL) - 6 bảng cốt lõi: `users`, `ambulances`, `emergency_requests`, `feedbacks`, `contact_messages`, `notifications`.
  - **Triển khai Backend**: Render - Sử dụng `render.yaml` (Infrastructure as Code).
- **Frontend (SPA Client)**:
  - **Framework/Tool**: **React.js (JavaScript) + Vite**.
  - **Styling**: **TailwindCSS** (100% sử dụng Tailwind, tuân thủ bảng màu chuẩn y tế).
  - **Bảng màu thiết kế chuẩn (Light Medical Theme)**:
    - Primary (xanh y tế): `#0B6EFD` (Nút chính, link, navbar active)
    - Primary tối: `#084298` (Hover, header, footer)
    - Emergency (đỏ): `#DC3545` (Nút "Đặt xe ngay", badge khẩn cấp, cảnh báo)
    - Success (xanh lá): `#198754` (Xe sẵn sàng, hoàn thành)
    - Warning (vàng cam): `#FFB020` (Đang chờ, sắp tới)
    - Nền sáng: `#F5F8FC` (Background trang)
    - Card: `#FFFFFF` (Card, form)
    - Chữ chính: `#1F2A37` (Body text)
    - Chữ phụ: `#6B7785` (Mô tả, placeholder)
    - Viền: `#E2E8F0` (Border input, card)
  - **Quy tắc Theme**: **KHÔNG CẦN DÙNG DARK/LIGHT THEME**, cố định duy nhất 1 nền sáng y tế hiện đại.
  - **Bản đồ & Định vị**: Leaflet / OpenStreetMap để hiển thị toạ độ và vị trí xe cứu thương di chuyển.
  - **Realtime Dispatching**: WebSockets (Pusher / Laravel Reverb) hoặc Polling để cập nhật trạng thái SOS và định vị xe tức thì.
  - **Triển khai Frontend**: **Vercel** (kết nối trực tiếp tới GitHub repo).

## 2. PHÂN QUYỀN HỆ THỐNG & CÁC BẢNG CƠ SỞ DỮ LIỆU CỐT LÕI
### 2.1. 3 Vai Trò Cốt Lõi:
1. **Admin**: Quản trị hệ thống, quản lý đội xe cứu thương (Ambulance Fleet), quản lý danh mục phân loại xe (A/C, Non-A/C, ICU, ICCU), quản lý người dùng, xem tin nhắn liên hệ và đánh giá feedback, thống kê KPI.
2. **Operator / Dispatcher**: Điều phối viên trực tổng đài, theo dõi bản đồ trực quan, tiếp nhận ca cấp cứu SOS từ người dân, chỉ định xe cứu thương gần nhất, giám sát lộ trình cứu hộ.
3. **User / Patient**: Bệnh nhân / Người dân, duyệt catalog xe cứu thương, tìm kiếm xe theo khu vực (ví dụ Chicago), lọc theo giá và loại xe, gửi yêu cầu cấp cứu khẩn cấp (Emergency SOS) 1 chạm kèm vị trí GPS, theo dõi xe cứu thương đang đến, gửi đánh giá feedback sau khi hoàn tất.

### 2.2. Các Bảng CSDL Cốt Lõi Thực Hành:
- `users`: id, fullname, username, email, phone, role (admin, operator, user), status, password.
- `ambulances`: id, vehicle_number, model, type (AC, Non-AC, ICU, ICCU), size, equipment, price, region, image_url, status.
- `emergency_requests`: id, user_id, ambulance_id, patient_name, patient_phone, pickup_address, latitude, longitude, condition_summary, status.
- `feedbacks`: id, user_id, request_id, rating, comment (Đánh giá sau khi hoàn thành ca trực).
- `contact_messages`: id, name, email, message, is_read (Form Contact Us, khách chưa đăng nhập cũng gửi được).
- `notifications`: id, user_id, title, body, is_read (Laravel có sẵn bảng notifications, dùng luôn).

## 3. QUY TẮC CỐT LÕI (CORE RULES)
- **Tuân thủ kiến trúc Web API + React Vite**: Backend CHỈ trả về dữ liệu JSON qua RESTful API, KHÔNG render Blade view cho ứng dụng chính. Frontend React Vite đảm nhiệm 100% hiển thị và tương tác.
- **Ràng buộc SRS**: **Không yêu cầu triển khai thanh toán (Checkout / Payment functionality is not required)**.
- **Không dùng Dark Mode**: Cố định giao diện sáng y tế (`#F5F8FC`), không tạo nút đổi giao diện tối.
- **Bảo mật & CORS**: Luôn cấu hình CORS (`config/cors.php`) chuẩn xác cho domain Vercel của Frontend. Không hardcode credentials. Sử dụng Laravel Sanctum bảo vệ các private routes.
- **Tốc độ & Hiệu quả**: Ưu tiên code chạy được, luồng End-to-End trơn tru trước (từ Khách xem xe -> Gọi SOS -> Operator gán xe -> Hoàn tất -> Đánh giá Feedback).
- **Tiêu chuẩn Git Commit**: BẮT BUỘC bằng TIẾNG ANH, sử dụng chuẩn Conventional Commits (`feat:`, `fix:`, `docs:`, v.v.).

## 4. CÁCH VIẾT CODE DÀNH CHO AI
- **Strict Typing & Modern PHP**: Bắt buộc `declare(strict_types=1);` ở đầu mọi file PHP. Khai báo kiểu dữ liệu cho toàn bộ params và return type.
- **API Resources & JSON Formatting**: BẮT BUỘC sử dụng Laravel API Resources (`JsonResource`) để format dữ liệu trả về frontend, không return thô Eloquent Model.
- **Chống N+1 Query**: Luôn dùng Eager Loading (`with()`) khi gọi dữ liệu có relationship.
- **Form Request Validation**: Validate 100% input đầu vào bằng Form Request classes, trả về lỗi 422 JSON chuẩn.
- **React Conventions**: Component dạng hàm (Functional Components), sử dụng React Hooks (`useState`, `useEffect`, `useContext`), cấu trúc thư mục rõ ràng theo từng feature.

## 5. XỬ LÝ LỖI (ERROR HANDLING)
- Toàn bộ API trả về format JSON lỗi đồng nhất: `{ "success": false, "message": "...", "errors": [...] }`.
- Ghi nhận lỗi phát sinh cụ thể vào `ai/BUGS.md`.
- **Chống Ảo Giác (Anti-Hallucination)**: Nếu sửa bug quá 5 phút không tìm ra nguyên nhân, dừng lại và báo cáo nguyên trạng cho User.

## 6. QUY TRÌNH LÀM VIỆC BẮT BUỘC
1. Đọc kỹ `RULE.md`, `ai/CONVENTION.md`, `ai/PROGRESS.md` và `ROADMAP/DayX_....md`.
2. Kiểm tra `git status` trước và sau khi làm việc.
3. Không tự ý sửa code ngoài phạm vi kế hoạch đã thống nhất.
