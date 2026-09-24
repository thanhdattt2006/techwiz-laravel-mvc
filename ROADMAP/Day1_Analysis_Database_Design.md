# DAY 1: PHÂN TÍCH YÊU CẦU, THIẾT KẾ CSDL (ERD 17 BẢNG) & API CONTRACT
# DỰ ÁN: MARKETLINK - EGREEN BASKET (SRS TECHWIZ 7)

**Mục tiêu**: Phân tích toàn diện đề bài MarketLink, chốt mô hình phân quyền 3 roles (`admin`, `farmer`, `customer`), thiết kế sơ đồ CSDL quan hệ chuẩn 17 bảng (ERD & Data Dictionary) và định nghĩa hợp đồng API RESTful (API Contract Specification) chi tiết giữa Backend và Frontend.

> [!IMPORTANT]
> ### ⚠️ NGUYÊN TẮC BẮT BUỘC TRƯỚC KHI THỰC HIỆN DAY 1:
> Bắt buộc đọc và tuân thủ nghiêm ngặt các tài liệu:
> - [`RULE.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/RULE.md): Luật làm việc, quy chuẩn Git Conventional Commits, cấm rác debug.
> - [`ai/AGENTS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/AGENTS.md): Định hướng AI, Tech stack và ràng buộc cứng SRS MarketLink.
> - [`ai/CONVENTION.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/CONVENTION.md): Quy chuẩn lập trình Clean Code, strict types, envelope JSON.
> - [`ai/DATABASE_ERD.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/DATABASE_ERD.md): Sơ đồ CSDL chi tiết 18 bảng & Data Dictionary.
> - [`ai/WORKFLOW.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/WORKFLOW.md): Quy trình nghiệp vụ 3 roles và Order State Machine.

---

## Phase 1.1: Phân Tích Yêu Cầu Đề Bài & Mô Hình 3 Roles
- `[x]` Đọc kỹ SRS MarketLink (`topic/MarketLink End-to-End Web Solutions_SRS(main).pdf`).
- `[x]` Xác định 3 Actors chính và ma trận quyền hạn:
  1. **`admin` (Quản trị viên toàn sàn)**:
     - Phê duyệt / tạm khóa hồ sơ nông dân mở sạp (`farmers`, `users.status = 'pending'`).
     - Quản lý danh bạ chợ địa phương (`markets`), lịch họp chợ (`market_schedules`) và định vị OpenStreetMap.
     - Kiểm duyệt nội dung vi phạm: gỡ sản phẩm (`products.is_hidden = 1`), ẩn đánh giá (`reviews.is_hidden = 1`).
     - Phát thông báo / cảnh báo toàn sàn (`announcements`).
     - Xem báo cáo phân tích toàn hệ thống (tổng doanh thu ước tính, sản lượng pre-order, top sạp hoạt động).
  2. **`farmer` (Chủ sạp / Nông dân)**:
     - Quản lý hồ sơ sạp hàng cá nhân (`farmers`), liên kết chợ và cài đặt khung giờ nhận hàng (`farmer_markets`).
     - Quản lý sản phẩm (`products`), ngành hàng (`categories`), định mức mở bán hàng tuần (`weekly_stock_templates`).
     - Xử lý hàng chờ đơn đặt trước (Incoming Pre-Orders): duyệt đơn (`accepted`), từ chối (`declined`), báo hàng sẵn sàng (`ready_for_pickup`).
     - Xem lịch sử đơn, thống kê doanh số sạp, phản hồi review của khách hàng (`reviews.farmer_reply`).
  3. **`customer` (Khách hàng mua nông sản)**:
     - Bắt buộc đăng ký với đủ: `fullname`, `username`, `email`, `phone`, `address`.
     - Tìm kiếm, lọc nông sản theo chợ, danh mục, khoảng giá, xem vị trí chợ và sạp trên bản đồ.
     - Giỏ hàng (`carts`, `cart_items`) và Pre-Order giữ chỗ (tự động tách đơn theo từng sạp nông dân).
     - Chọn ngày họp chợ và khung giờ đến nhận hàng (`pickup_date`, `pickup_time_slot`).
     - Theo dõi tiến độ đơn hàng thời gian thực qua mã đơn (`order_code`).
     - Lưu mục yêu thích (`favorites`), gửi đánh giá 1-5 sao sau khi đơn `completed`.
     - **Ràng buộc SRS cốt lõi**: Thanh toán trực tiếp tại sạp (KHÔNG cổng thanh toán online), tự đến sạp lấy (KHÔNG giao hàng tận nhà).

---

## Phase 1.2: Thiết Kế Cơ Sở Dữ Liệu (ERD 17 Bảng)
- `[x]` Đã hoàn thành sơ đồ Mermaid ERD và Data Dictionary chi tiết tại [`ai/DATABASE_ERD.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/DATABASE_ERD.md):
  1. **`users`**: Tài khoản người dùng, phân quyền 3 roles (`admin`, `farmer`, `customer`), quản lý trạng thái, SoftDeletes.
  2. **`personal_access_tokens`**: Token Sanctum xác thực Web API.
  3. **`markets`**: Danh bạ chợ nông sản địa phương, tọa độ GPS (lat, lng), map embed.
  4. **`market_schedules`**: Lịch mở/đóng cửa từng ngày trong tuần của chợ (`day_of_week`, `open_time`, `close_time`).
  5. **`farmers`**: Hồ sơ chủ sạp (1-1 với `users`), tên sạp, hotline, đánh giá trung bình.
  6. **`farmer_markets`**: Sạp bán ở chợ nào, vị trí gian, ngày nhận hàng (`pickup_days`), khung giờ, `slot_minutes`, `cutoff_hours`.
  7. **`categories`**: Phân loại ngành hàng nông sản sạch.
  8. **`products`**: Sản phẩm niêm yết, đơn giá, đơn vị tính, tồn kho, cờ ẩn admin, fulltext search.
  9. **`weekly_stock_templates`**: Định mức tồn kho mở bán theo thứ trong tuần cho từng nông sản.
  10. **`carts`**: Giỏ hàng của người dùng (1-1 với `users`).
  11. **`cart_items`**: Chi tiết món và số lượng trong giỏ hàng.
  12. **`orders`**: Đơn Pre-Order, mã đơn duy nhất, ngày giờ pickup, `cutoff_at`, tracking các mốc trạng thái.
  13. **`order_items`**: Snapshot giá, tên và số lượng mặt hàng tại thời điểm đặt.
  14. **`favorites`**: Lưu yêu thích đa hình (Farmer, Product, Market).
  15. **`reviews`**: Đánh giá 1-5 sao, phân định hoặc Nông dân hoặc Sản phẩm, phản hồi của nông dân.
  16. **`notifications`**: Thông báo đẩy in-app cho người dùng theo trạng thái đơn hàng.
  17. **`announcements`**: Thông báo toàn sàn của Admin theo role mục tiêu.

---

## Phase 1.3: Quy Hoạch Hợp Đồng API RESTful (API Contract Specification)

Toàn bộ API tuân thủ envelope chuẩn JSON: `{ "success": boolean, "message": string, "data": any, "errors": any }`.

### 1. Nhóm Xác Thực & Tài Khoản (`/api/v1/auth`)
- `POST /register`: Đăng ký tài khoản khách hàng (yêu cầu bắt buộc: fullname, username, email, phone, address, password).
- `POST /register-farmer`: Đăng ký tài khoản nông dân (gửi kèm thông tin sạp, trạng thái ban đầu `pending`).
- `POST /login`: Đăng nhập hệ thống, trả về Token Sanctum, vai trò (`role`) và quyền truy cập.
- `GET /me`: Lấy thông tin tài khoản hiện tại (kèm hồ sơ Farmer nếu có).
- `PUT /profile`: Cập nhật thông tin cá nhân / sạp hàng.
- `PUT /change-password`: Đổi mật khẩu tài khoản.
- `POST /logout`: Hủy token Sanctum hiện tại.

### 2. Nhóm Chợ Nông Sản (`/api/v1/markets`)
- `GET /`: Danh sách chợ kèm lịch họp và tọa độ bản đồ (hỗ trợ lọc theo ngày trong tuần, khu vực).
- `GET /{id}`: Chi tiết chợ, lịch họp chi tiết, danh sách các sạp nông dân (`farmers`) đang hoạt động tại chợ.
- `POST /` / `PUT /{id}` / `DELETE /{id}`: Admin quản lý danh bạ chợ.

### 3. Nhóm Nông Dân & Sạp Hàng (`/api/v1/farmers`)
- `GET /`: Danh sách sạp nông dân công khai (tìm kiếm theo tên, chợ tham gia, điểm đánh giá).
- `GET /{id}`: Hồ sơ chi tiết sạp, danh sách chợ bán, danh mục sản phẩm đang mở bán, reviews nhận được.
- `PUT /stall-settings`: Nông dân cập nhật mô tả, hotline, vị trí sạp.
- `POST /markets`: Nông dân liên kết sạp vào chợ mới (`farmer_markets`).
- `PUT /markets/{marketId}`: Cập nhật vị trí gian, ngày pickup, khung giờ, `cutoff_hours`, `slot_minutes`.

### 4. Nhóm Sản Phẩm & Định Mức Kho (`/api/v1/products`)
- `GET /`: Danh mục nông sản công khai (hỗ trợ lọc đa tiêu chí: `category`, `market_id`, `farmer_id`, `min_price`, `max_price`, `search`).
- `GET /{id}`: Chi tiết sản phẩm, xuất xứ trang trại, tồn kho hiện tại, đánh giá của khách hàng.
- `POST /` / `PUT /{id}` / `DELETE /{id}`: Nông dân quản lý sản phẩm của sạp mình.
- `GET /{id}/stock-template`: Xem mẫu tồn kho hàng tuần của sản phẩm.
- `PUT /{id}/stock-template`: Cấu hình số lượng mở bán định kỳ cho từng ngày họp chợ.
- `POST /apply-stock-templates`: Nông dân áp dụng nhanh mẫu kho cho phiên chợ tới.

### 5. Nhóm Giỏ Hàng (`/api/v1/cart`)
- `GET /`: Lấy toàn bộ sản phẩm trong giỏ hàng hiện tại, nhóm theo từng nông dân/chợ.
- `POST /items`: Thêm sản phẩm vào giỏ hàng (`product_id`, `quantity`).
- `PUT /items/{id}`: Cập nhật số lượng món trong giỏ.
- `DELETE /items/{id}`: Xóa món khỏi giỏ hàng.
- `DELETE /clear`: Dọn sạch giỏ hàng.

### 6. Nhóm Pre-Order Giữ Chỗ (`/api/v1/orders`)
- `POST /checkout`: Đặt trước nông sản từ giỏ hàng (chọn `market_id`, `pickup_date`, `pickup_time_slot`, ghi chú). Tự động tách đơn theo sạp.
- `GET /customer`: Khách hàng xem danh sách đơn hàng của mình (lọc theo trạng thái `placed`, `accepted`, `ready_for_pickup`, `completed`, `cancelled`).
- `GET /farmer`: Nông dân xem hàng chờ đơn đặt trước cần chuẩn bị.
- `GET /{id}`: Xem chi tiết đơn hàng, snapshot mặt hàng, mã đơn, hướng dẫn nhận tại sạp.
- `PATCH /{id}/status`: Cập nhật trạng thái đơn:
  - Farmer: Chấp nhận (`accepted`), Từ chối (`declined` + `cancel_reason`), Báo sẵn sàng (`ready_for_pickup`), Xác nhận đã nhận tiền mặt & giao hàng (`completed`).
  - Customer: Hủy đơn (`cancelled` + `cancel_reason`) trước giờ `cutoff_at`.

### 7. Nhóm Đánh Giá & Phản Hồi (`/api/v1/reviews`)
- `POST /`: Khách gửi đánh giá 1-5 sao cho đơn hàng đã `completed` (hoặc đánh giá sạp hoặc đánh giá sản phẩm).
- `POST /{id}/reply`: Nông dân gửi phản hồi đối với review sản phẩm của sạp mình.
- `GET /product/{productId}`: Lấy danh sách review của sản phẩm kèm câu trả lời của nông dân.
- `GET /farmer/{farmerId}`: Lấy danh sách review của sạp nông dân.
- `PATCH /{id}/moderate`: Admin ẩn/hiện review vi phạm (`is_hidden`).

### 8. Nhóm Yêu Thích & Đa Hình (`/api/v1/favorites`)
- `GET /`: Danh sách yêu thích của khách hàng (phân loại: farmer, product, market).
- `POST /toggle`: Thêm / Xóa nhanh yêu thích (`favoritable_type`, `favoritable_id`).

### 9. Nhóm Thông Báo & Cảnh Báo (`/api/v1/notifications`)
- `GET /`: Danh sách thông báo in-app của người dùng, phân trang và đếm số lượng chưa đọc.
- `PATCH /{id}/read`: Đánh dấu thông báo đã đọc.
- `PATCH /read-all`: Đánh dấu đã đọc toàn bộ thông báo.

### 10. Nhóm Thông Báo Toàn Sàn (`/api/v1/announcements`)
- `GET /active`: Lấy các thông báo đang kích hoạt theo vai trò của người dùng hiện tại.
- `POST /` / `PUT /{id}` / `DELETE /{id}`: Admin quản trị danh sách thông báo toàn sàn.

### 11. Nhóm Quản Trị & Báo Cáo Thống Kê (`/api/v1/admin`)
- `GET /stats/overview`: Thống kê tổng hợp: Tổng nông dân, tổng khách hàng, tổng chợ, tổng số đơn pre-order, doanh thu ước tính.
- `GET /farmers/pending`: Danh sách sạp nông dân chờ phê duyệt.
- `PATCH /farmers/{id}/approve`: Duyệt hồ sơ nông dân mở sạp.
- `PATCH /users/{id}/status`: Khóa hoặc kích hoạt lại tài khoản người dùng vi phạm.
- `PATCH /products/{id}/toggle-hidden`: Admin ẩn sản phẩm vi phạm quy định.

---

## Tổng Kết Day 1
- `[x]` Đã đọc và đối chiếu toàn bộ yêu cầu SRS TechWiz 7.
- `[x]` Thống nhất 100% kiến trúc 17 bảng Cơ sở dữ liệu và Data Dictionary chi tiết.
- `[x]` Hoàn tất sơ đồ Mermaid ERD và tài liệu Quy trình nghiệp vụ [`ai/WORKFLOW.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/WORKFLOW.md).
- `[x]` Chốt trọn vẹn Hợp đồng API RESTful 11 nhóm Endpoints sẵn sàng cho Day 2 triển khai Migrations & Models.
