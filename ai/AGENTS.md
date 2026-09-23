# HƯỚNG DẪN DÀNH CHO AI (AGENTS)

File này chứa thông tin cấu hình và hướng dẫn bắt buộc dành cho mọi AI Assistant tham gia vào dự án này.

## 1. TECH STACK & DỰ ÁN (MARKETLINK - EGREEN BASKET PORTAL)
- **Tên dự án**: **MarketLink - eGreen Basket Marketplace Portal** (Khung đề bài SRS TechWiz 7: `topic/MarketLink End-to-End Web Solutions_SRS.pdf`).
- **Slogan**: *Farm Fresh Just a Click Away*
- **Kiến trúc tổng thể**: **Decoupled Client-Server (RESTful Web API + Single Page Application)**.
- **Backend (Web API)**:
  - **Ngôn ngữ**: PHP 8.4 (Áp dụng property hooks, typed properties, declare strict_types=1).
  - **Framework**: Laravel 13 (Xây dựng RESTful API thuần túy, trả về chuẩn JSON).
  - **Authentication**: Laravel Sanctum (Token-based authentication cho API).
  - **Cơ sở dữ liệu**: Aiven (MySQL) - 6 bảng cốt lõi theo SRS Section 1.8: `users`, `markets`, `products`, `orders`, `reviews`, `reports` (kèm `contact_messages`).
  - **Triển khai Backend**: Render - Sử dụng `render.yaml` (Infrastructure as Code).
- **Frontend (SPA Client)**:
  - **Framework/Tool**: **React.js (JavaScript) + Vite**.
  - **Styling**: **TailwindCSS** (100% sử dụng Tailwind, tuân thủ bảng màu chuẩn thực phẩm sạch & nông nghiệp sinh thái).
  - **Bảng màu thiết kế chuẩn (Fresh Botanical & Harvest Gold Theme)**:
    - Primary Brand (xanh lá nông sản tươi): `#16A34A` / `#198754` (Nút chính, link, navbar active, logo)
    - Primary Dark (xanh rừng đậm): `#15803D` / `#146C43` (Hover, topbar, footer)
    - Accent / Warm Highlight (vàng cam mùa gặt & đánh giá): `#F59E0B` (Đánh giá sao, huy hiệu sạp nổi bật)
    - Produce Badge / Discount (đỏ cà chua chín): `#DC2626` (Ưu đãi, nhãn organic, báo sắp hết)
    - Background (eco mint-white sáng sạch): `#F8FAF6` (Background toàn bộ trang web)
    - Card: `#FFFFFF` (Card nông sản, form đặt hàng)
    - Chữ chính: `#0F172A` / `#1E293B` (Body text, tiêu đề)
    - Chữ phụ: `#475569` / `#64748B` (Mô tả xuất xứ, placeholder)
    - Viền: `#E2E8DF` (Border mềm ô liu)
    - Artisan Earth Accent: `#78350F` (Đồ khô thủ công, phô mai)
  - **Quy tắc Theme**: **KHÔNG CẦN DÙNG DARK/LIGHT THEME**, cố định duy nhất 1 nền sáng Fresh Botanical hiện đại.
  - **Bản đồ & Định vị**: OpenStreetMap / Google Maps Embed để hiển thị vị trí các chợ nông dân địa phương và vị trí sạp nhận hàng.
  - **Triển khai Frontend**: **Vercel** (kết nối trực tiếp tới GitHub repo).

## 2. PHÂN QUYỀN HỆ THỐNG & CÁC BẢNG CƠ SỞ DỮ LIỆU CỐT LÕI
### 2.1. 3 Vai Trò Cốt Lõi:
1. **Admin**: Quản trị toàn bộ sàn, quản lý danh bạ các chợ nông dân địa phương (Markets Directory), phê duyệt tài khoản nông dân đăng ký mở sạp (Farmer Approvals), kiểm duyệt đánh giá (Review Moderation), xem thống kê báo cáo sàn.
2. **Farmer (Vendor / Chủ sạp)**: Chủ sạp nông dân, quản lý hồ sơ sạp hàng tại chợ, quản lý danh mục rau củ quả tươi sống, kiểm soát số lượng tồn sạp mở bán hàng tuần (Weekly Stock Inventory), tiếp nhận và cập nhật trạng thái đơn Pre-order của khách hàng.
3. **Customer (Khách mua)**: Khách hàng mua nông sản, duyệt chợ gần nhà qua bản đồ, lọc nông sản theo danh mục/giá/hữu cơ, đặt trước giữ chỗ (Pre-order for pickup) chọn ngày và khung giờ nhận tại sạp, theo dõi mã đơn, thanh toán tiền mặt tại sạp, gửi đánh giá 1-5 sao sau khi nhận hàng.

### 2.2. Các Bảng CSDL Cốt Lõi Thực Hành (SRS Section 1.8):
- `users`: id, fullname, username, email, phone, role (`admin`, `farmer`, `customer`), status, avatar_url, password.
- `markets`: id, name, slug, address, city, latitude, longitude, operating_days, opening_hours, image_url, description, status.
- `products`: id, farmer_id, market_id, name, slug, category, origin_farm, harvest_date, is_organic, price, unit, stock_quantity, image_url, description, status.
- `orders`: id, order_code, customer_id, farmer_id, market_id, product_id, quantity, unit_price, total_estimated_amount, pickup_date, pickup_time_slot, customer_name, customer_phone, pickup_notes, status.
- `reviews`: id, customer_id, product_id, farmer_id, order_id, rating (1-5), comment, is_approved.
- `reports`: id, reporter_id, reported_type, reported_id, reason, status, admin_notes.
- `contact_messages`: id, name, email, subject, message, is_read.

## 3. QUY TẮC CỐT LÕI (CORE RULES)
- **Tuân thủ kiến trúc Web API + React Vite**: Backend CHỈ trả về dữ liệu JSON qua RESTful API, KHÔNG render Blade view cho ứng dụng chính. Frontend React Vite đảm nhiệm 100% hiển thị và tương tác.
- **Ràng buộc SRS MarketLink (Bắt buộc)**:
  - **TUYỆT ĐỐI KHÔNG TÍCH HỢP CỔNG THANH TOÁN (No payment gateways required)**: Khách trả tiền mặt trực tiếp khi đến nhận hàng tại sạp.
  - **Không làm giao hàng tận nhà (Home delivery is out of scope)**: Khách tự đến sạp tại chợ để nhận hàng (Pre-order for pickup).
- **Không dùng Dark Mode**: Cố định giao diện sáng tươi mát (`#F8FAF6`), không tạo nút đổi giao diện tối.
- **Bảo mật & CORS**: Luôn cấu hình CORS (`config/cors.php`) chuẩn xác cho domain Vercel của Frontend. Không hardcode credentials. Sử dụng Laravel Sanctum bảo vệ các private routes.
- **Tốc độ & Hiệu quả**: Ưu tiên code chạy được, luồng End-to-End trơn tru trước (từ Khách tìm nông sản -> Đặt trước chọn giờ -> Nông dân chuẩn bị -> Nhận tại sạp -> Đánh giá Feedback).
- **Tiêu chuẩn Git Commit**: BẮT BUỘC bằng TIẾNG ANH, sử dụng chuẩn Conventional Commits (`feat:`, `fix:`, `docs:`, v.v.). **LUÔN HỎI Ý KIẾN USER TRƯỚC KHI COMMIT**.

## 4. CÁCH VIẾT CODE DÀNH CHO AI
- **Strict Typing & Modern PHP**: Bắt buộc `declare(strict_types=1);` ở đầu mọi file PHP. Khai báo kiểu dữ liệu cho toàn bộ params và return type.
- **API Resources & JSON Formatting**: BẮT BUỘC sử dụng Laravel API Resources (`JsonResource`) để format dữ liệu trả về frontend, không return thô Eloquent Model.
- **Chống N+1 Query**: Luôn dùng Eager Loading (`with()`) khi gọi dữ liệu có relationship.
- **Form Request Validation**: Validate 100% input đầu vào bằng Form Request classes, trả về lỗi 422 JSON chuẩn.
- **React Conventions**: Component dạng hàm (Functional Components), sử dụng React Hooks (`useState`, `useEffect`, `useContext`), cấu trúc thư mục rõ ràng theo từng feature.
- **Clean Code**: Tuyệt đối KHÔNG để lại `console.log`, `dd()`, `dump()`, debug code trong mã nguồn.

## 5. XỬ LÝ LỖI (ERROR HANDLING)
- Toàn bộ API trả về format JSON lỗi đồng nhất: `{ "success": false, "message": "...", "errors": [...] }`.
- Ghi nhận lỗi phát sinh cụ thể vào `ai/BUGS.md`.
- **Chống Ảo Giác (Anti-Hallucination)**: Nếu sửa bug quá 5 phút không tìm ra nguyên nhân, dừng lại và báo cáo nguyên trạng cho User.

## 6. QUY TRÌNH LÀM VIỆC BẮT BUỘC
1. Đọc kỹ `RULE.md`, `ai/CONVENTION.md`, `ai/PROGRESS.md` và `ROADMAP/DayX_....md`.
2. Kiểm tra `git status` trước và sau khi làm việc.
3. Không tự ý sửa code ngoài phạm vi kế hoạch đã thống nhất.

