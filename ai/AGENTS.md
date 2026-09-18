# HƯỚNG DẪN DÀNH CHO AI (AGENTS)

File này chứa thông tin cấu hình và hướng dẫn bắt buộc dành cho mọi AI Assistant tham gia vào dự án này.

## 1. TECH STACK (Công nghệ sử dụng)
- **Kiến trúc tổng thể**: **Decoupled Client-Server (RESTful Web API + Single Page Application)**.
- **Backend (Web API)**:
  - **Ngôn ngữ**: PHP 8.4 (Áp dụng property hooks, typed properties, declare strict_types=1).
  - **Framework**: Laravel (Xây dựng RESTful API thuần túy, trả về chuẩn JSON).
  - **Authentication**: Laravel Sanctum (Token-based authentication cho API).
  - **Cơ sở dữ liệu**: Aiven (MySQL) - Kết nối qua biến môi trường `.env`.
  - **Triển khai Backend**: Render - Sử dụng `render.yaml` (Infrastructure as Code).
- **Frontend (SPA Client)**:
  - **Framework/Tool**: **React.js (JavaScript) + Vite**.
  - **Styling**: **TailwindCSS** (100% sử dụng Tailwind, thiết kế hiện đại, responsive).
  - **Bản đồ & Định vị**: Leaflet / OpenStreetMap (hoặc Mapbox) để hiển thị toạ độ và vị trí xe cứu thương di chuyển.
  - **Realtime Dispatching**: WebSockets (Pusher / Laravel Reverb) hoặc Server-Sent Events (SSE) / Polling để cập nhật trạng thái SOS và định vị xe tức thì.
  - **Triển khai Frontend**: **Vercel** (kết nối trực tiếp tới GitHub repo).

## 2. PHÂN QUYỀN HỆ THỐNG (3 ROLES CỐT LÕI)
Hệ thống cấp cứu & điều phối xe cứu thương (tham khảo nghiệp vụ Rapid Rescue) gồm 3 vai trò chính:
1. **Admin**: Quản trị hệ thống, quản lý đội xe cứu thương (Ambulance Fleet), quản lý danh sách tài xế/y tá, quản lý danh sách bệnh viện/trung tâm y tế, xem dashboard thống kê KPI.
2. **Operator / Dispatcher**: Điều phối viên trực tổng đài, theo dõi bản đồ trực quan, tiếp nhận ca cấp cứu SOS từ người dân, chỉ định xe cứu thương gần nhất, giám sát lộ trình cứu hộ.
3. **User / Patient**: Bệnh nhân / Người dân, tạo yêu cầu cấp cứu khẩn cấp (Emergency SOS) 1 chạm kèm vị trí GPS, theo dõi xe cứu thương đang đến theo thời gian thực, lưu hồ sơ y tế khẩn cấp.

## 3. QUY TẮC CỐT LÕI (CORE RULES)
- **Tuân thủ kiến trúc Web API + React Vite**: Backend CHỈ trả về dữ liệu JSON qua RESTful API, KHÔNG render Blade view cho ứng dụng chính (chỉ giữ Blade nếu dùng cho console bảo trì DB). Frontend React Vite đảm nhiệm 100% hiển thị và tương tác.
- **Bảo mật & CORS**: Luôn cấu hình CORS (`config/cors.php`) chuẩn xác cho domain Vercel của Frontend. Không hardcode credentials. Sử dụng Laravel Sanctum bảo vệ các private routes.
- **Tốc độ & Hiệu quả**: Dự án TechWiz 7 có thời hạn 5 ngày. Ưu tiên code chạy được, luồng End-to-End trơn tru trước (từ User gọi SOS -> Operator tiếp nhận & gán xe -> Xe di chuyển trên bản đồ).
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
