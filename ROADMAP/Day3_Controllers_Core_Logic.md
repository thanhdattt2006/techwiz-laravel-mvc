# DAY 3: RESTFUL API CONTROLLERS, SANCTUM AUTH & CORE BUSINESS LOGIC

# DỰ ÁN: MARKETLINK - EGREEN BASKET (SRS TECHWIZ 7)

**Mục tiêu**: Hiện thực hóa toàn bộ logic nghiệp vụ Backend cho hệ thống 18 bảng CSDL qua RESTful Web API chuẩn hóa. Để đảm bảo tốc độ và tránh quá tải khi thực thi nhiều Controller cùng lúc, Day 3 được chia nhỏ thành **10 nhóm tính năng chuyên biệt (Phase 3.1 -> Phase 3.11)** kèm bộ kiểm thử API (Phase 3.12). Mỗi nhóm đóng gói đầy đủ: Routes, Controller, Form Requests, JsonResources và Core Services tương ứng.

> **Lưu ý**: Sơ đồ cây phân nhóm Route tổng thể (`/api/v1/...`) đã được lưu trữ tập trung tại [`Document.txt`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/Document.txt) và [`README.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/README.md).

> [!IMPORTANT]
>
> ### ⚠️ NGUYÊN TẮC BẮT BUỘC TRƯỚC KHI CODE DAY 3:
>
> Trước khi viết bất kỳ Controller, Form Request, JsonResource, Service hay Test nào, Developer và AI **BẮT BUỘC** phải đọc kỹ và tuân thủ tuyệt đối các tài liệu nền tảng:
>
> 1. **[`RULE.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/RULE.md)**: Luật làm việc, quy tắc commit tiếng Anh chuẩn Conventional Commits, kiểm tra `git status`/`git diff`, tuyệt đối cấm để lại rác debug (`dd()`, `dump()`, `console.log()`).
> 2. **[`ai/CONVENTION.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/CONVENTION.md)**:
>    - Bắt buộc khai báo `declare(strict_types=1);` ở dòng đầu tiên của **100% các file PHP** (`app/...`).
>    - Khai báo đầy đủ Type Hints cho toàn bộ parameters và return types (không có return type -> `void`).
>    - Bắt buộc trả về JSON envelope chuẩn: `{ "success": bool, "message": string, "data": any, "errors": any }` qua Trait `ApiResponse`.
>    - Chống triệt để lỗi N+1 Query bằng Eager Loading `with()` khi truy vấn quan hệ Eloquent.
>    - Validate 100% dữ liệu đầu vào bằng Form Request classes (trả HTTP 422 JSON khi lỗi validate).
>    - Bắt buộc transform dữ liệu qua `JsonResource`, tuyệt đối không return thô Eloquent Model.
> 3. **[`ai/DATABASE_ERD.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/DATABASE_ERD.md)**: Đối chiếu chính xác tên cột, kiểu dữ liệu, quan hệ khóa ngoại (Foreign Keys) và ràng buộc (`UNIQUE`, `CHECK`, `default`) của 18 bảng CSDL.
> 4. **[`ai/WORKFLOW.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/WORKFLOW.md)**: Tuân thủ chặt chẽ cỗ máy trạng thái đơn hàng (Order State Machine: `placed` -> `accepted` -> `ready_for_pickup` -> `completed` / `cancelled`), logic tính toán Cutoff Hours và sinh khung giờ Time Slot.
> 5. **[`ai/AGENTS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/AGENTS.md)**: Nắm vững 3 vai trò RBAC (`admin`, `farmer`, `customer`) và các ràng buộc cứng SRS (không cổng thanh toán online, không giao hàng tận nhà).
> 6. **[`ai/PROGRESS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/PROGRESS.md) & [`ai/BUGS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/BUGS.md)**: Đánh dấu tiến độ `[/]` khi bắt đầu, `[x]` khi hoàn thành và ghi chép bug phát sinh ngay lập tức để team tester theo dõi.

---

## Phase 3.1: Nền Tảng Middleware & Chuẩn Hóa Phản Hồi (API Base Foundation)

- `[x]` Tạo Trait `ApiResponse.php` (`app/Traits/ApiResponse.php`) chuẩn hóa envelope JSON:
  - `successResponse($data, string $message = '', int $statusCode = 200)`
  - `errorResponse(string $message, int $statusCode = 400, $errors = null)`
- `[x]` Tạo Middleware `RoleMiddleware.php` (`app/Http/Middleware/RoleMiddleware.php`):
  - Nhận tham số vai trò: `role:admin`, `role:farmer`, `role:customer` (hoặc kết hợp `role:admin,farmer`).
  - Trả HTTP `403 Forbidden` nếu người dùng không đủ quyền hạn.
- `[x]` Tạo Middleware `EnsureFarmerActive.php` (`app/Http/Middleware/EnsureFarmerActive.php`):
  - Kiểm tra `users.role === 'farmer'` và `users.status === 'active'`. Nếu đang `pending` hoặc `inactive` $\rightarrow$ chặn mở sạp và đăng bán nông sản (HTTP `403 Forbidden`).
- `[x]` Đăng ký alias Middleware vào `bootstrap/app.php`.
- `[x]` **Đưa danh sách API và data mẫu để test**:
  - Đã tạo Unit Test `tests/Unit/ApiResponseTraitTest.php` và Feature Test `tests/Feature/MiddlewareFoundationTest.php` (9 tests pass 100%).

---

## Phase 3.2: Nhóm 1 - Xác Thực & Quản Lý Tài Khoản (Auth & User Profile)

- `[x]` **Endpoints**:
  - `POST /api/v1/auth/register` (Public: Đăng ký khách hàng)
  - `POST /api/v1/auth/register-farmer` (Public: Đăng ký mở sạp nông dân, status=`pending`)
  - `POST /api/v1/auth/login` (Public: Đăng nhập cấp Sanctum token)
  - `GET  /api/v1/auth/me` (Protected: Thông tin tài khoản hiện tại + hồ sơ role)
  - `PUT  /api/v1/auth/profile` (Protected: Cập nhật thông tin cá nhân)
  - `PUT  /api/v1/auth/change-password` (Protected: Đổi mật khẩu)
  - `POST /api/v1/auth/logout` (Protected: Thu hồi token hiện tại)
- `[x]` **Controller**: `AuthController.php` (`app/Http/Controllers/Api/V1/AuthController.php`).
- `[x]` **Form Requests**:
  - `StoreRegisterRequest`: Validate `fullname`, `username` (unique), `email` (unique), `phone` (bắt buộc), `address` (bắt buộc), `password` (min: 8).
  - `StoreFarmerRegisterRequest`: Validate user info + `stall_name`, `contact_person`, `contact_phone`, `address`.
  - `LoginRequest`: Validate `login` (email/username), `password`.
  - `UpdateProfileRequest`: Validate `fullname`, `phone`, `address`.
  - `ChangePasswordRequest`: Validate `current_password`, `new_password` (min: 8, confirmed).
- `[x]` **JsonResource**: `UserResource.php` (Ẩn password, format datetime, kèm farmer profile nếu có).
- `[x]` **Nghiệp vụ cốt lõi**:
  - Bắt buộc kiểm tra `status === 'active'` khi đăng nhập (tài khoản `banned` hoặc `pending` sẽ bị từ chối).
  - Khách hàng đăng ký thành công tự động khởi tạo 1 bản ghi giỏ hàng rỗng (`carts`).
- `[x]` **Đưa danh sách API và data mẫu để test**:
  - Đã tạo Feature Test `tests/Feature/AuthApiTest.php` với 15 test cases bao phủ toàn diện (100% pass).

---

## Phase 3.3: Nhóm 2 - Danh Bạ Chợ & Lịch Họp Chợ (Markets & Schedules)

- `[x]` **Endpoints**:
  - `GET    /api/v1/markets` (Public: Danh sách chợ, hỗ trợ lọc theo `day_of_week`, tìm kiếm tên/địa chỉ)
  - `GET    /api/v1/markets/{id}` (Public: Chi tiết chợ, lịch họp từng ngày, danh sách sạp đang hoạt động)
  - `POST   /api/v1/admin/markets` (Admin: Tạo chợ mới kèm lịch họp)
  - `PUT    /api/v1/admin/markets/{id}` (Admin: Sửa chợ, toạ độ GPS, embed map)
  - `DELETE /api/v1/admin/markets/{id}` (Admin: Xoá mềm chợ)
- `[x]` **Controller**: `MarketController.php` (`app/Http/Controllers/Api/V1/MarketController.php`).
- `[x]` **Form Requests**:
  - `StoreMarketRequest`: Validate `name`, `address`, `latitude`, `longitude`, `map_provider`, `schedules` (array of `day_of_week`, `open_time`, `close_time`).
  - `UpdateMarketRequest`: Validate thông tin cập nhật chợ và lịch họp.
- `[x]` **JsonResources**:
  - `MarketResource.php`: Thông tin chợ, toạ độ, URL bản đồ, eager load `schedules` và đếm số lượng sạp.
  - `MarketScheduleResource.php`: Format thứ trong tuần (0 $\rightarrow$ Sunday.. 6 $\rightarrow$ Saturday) và giờ mở/đóng.
- `[x]` **Nghiệp vụ cốt lõi**:
  - Tối ưu Eager Loading chống N+1: `Market::with(['schedules', 'farmers'])->where('status', 'active')`.
- `[x]` **Đưa danh sách API và data mẫu để test**:
  - Đã xuất bản tài liệu kiểm thử chi tiết bằng tiếng Anh tại [`backend-api-test.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/backend-api-test.md#2-farmers-markets-directory--schedules-apis-phase-33).
  - Đã xây dựng bộ Feature Test toàn diện `tests/Feature/MarketApiTest.php` với 11 test cases pass 100%.

---

## Phase 3.4: Nhóm 3 - Hồ Sơ Nông Dân & Cấu Hình Sạp Chợ (Farmers & FarmerMarkets)

- `[x]` **Endpoints**:
  - `GET    /api/v1/farmers` (Public: Danh bạ sạp nông dân, tìm theo tên, sắp xếp theo `avg_rating`)
  - `GET    /api/v1/farmers/{id}` (Public: Chi tiết sạp, danh sách chợ bán, nông sản đang bán, review)
  - `GET    /api/v1/farmer/profile` (Farmer: Xem hồ sơ sạp cá nhân)
  - `PUT    /api/v1/farmer/profile` (Farmer: Sửa mô tả sạp, hotline, ảnh logo)
  - `GET    /api/v1/farmer/markets` (Farmer: Xem danh sách chợ sạp đang bán)
  - `POST   /api/v1/farmer/markets` (Farmer: Đăng ký bán tại chợ mới)
  - `PUT    /api/v1/farmer/markets/{marketId}` (Farmer: Cấu hình vị trí gian, ngày pickup, slot 30p, cutoff 12h)
  - `DELETE /api/v1/farmer/markets/{marketId}` (Farmer: Rút sạp khỏi chợ)
- `[x]` **Controller**: `FarmerController.php` (`app/Http/Controllers/Api/V1/FarmerController.php`).
- `[x]` **Form Requests**:
  - `UpdateStallRequest`: Validate `stall_name`, `contact_person`, `contact_phone`, `address`, `description`, `logo`.
  - `LinkMarketRequest`: Validate `market_id`, `stall_location`, `pickup_days` (array), `pickup_start_time`, `pickup_end_time`, `slot_minutes`, `cutoff_hours`.
  - `UpdateFarmerMarketRequest`: Validate cập nhật khung giờ và slot nhận hàng.
- `[x]` **JsonResources**:
  - `FarmerResource.php`: Thông tin sạp, điểm `avg_rating`, `review_count`, danh sách chợ tham gia.
  - `FarmerMarketResource.php`: Vị trí gian `stall_location`, mảng `pickup_days`, khung giờ, slot và cutoff hours.
- `[x]` **Đưa danh sách API và data mẫu để test**:
  - Đã xuất bản danh sách API và dữ liệu mẫu test tại [`BackEndApiTest.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/BackEndApiTest.md#3-farmers--market-stall-configuration-phase-34).
  - Đã tạo Feature Test `tests/Feature/FarmerApiTest.php` với 12 test cases bao phủ toàn diện (100% pass).

---

## Phase 3.5: Nhóm 4 - Ngành Hàng & Danh Mục Nông Sản (Categories & Products)

- `[x]` **Endpoints**:
  - `GET    /api/v1/categories` (Public: 5 ngành hàng nông sản sạch kèm số lượng sản phẩm)
  - `POST   /api/v1/admin/categories` (Admin: Thêm ngành hàng mới)
  - `PUT    /api/v1/admin/categories/{id}` (Admin: Sửa ngành hàng)
  - `DELETE /api/v1/admin/categories/{id}` (Admin: Xóa ngành hàng rỗng)
  - `GET    /api/v1/products` (Public: Catalog nông sản, lọc theo category, price, market, farmer, search)
  - `GET    /api/v1/products/{id}` (Public: Chi tiết nông sản, tồn kho, xuất xứ trang trại)
  - `GET    /api/v1/farmer/products` (Farmer: Quản lý nông sản của riêng sạp)
  - `POST   /api/v1/farmer/products` (Farmer: Đăng bán nông sản mới)
  - `PUT    /api/v1/farmer/products/{id}` (Farmer: Sửa giá, đơn vị, ảnh, tình trạng còn/hết hàng)
  - `DELETE /api/v1/farmer/products/{id}` (Farmer: Xoá mềm nông sản)
  - `PATCH  /api/v1/admin/products/{id}/toggle-hide` (Admin: Gỡ nông sản vi phạm quy định)
- `[x]` **Controllers**:
  - `CategoryController.php` (`app/Http/Controllers/Api/V1/CategoryController.php`)
  - `ProductController.php` (`app/Http/Controllers/Api/V1/ProductController.php`)
- `[x]` **Form Requests**:
  - `StoreCategoryRequest` & `UpdateCategoryRequest`: Validate `name` (unique), `description`.
  - `StoreProductRequest` & `UpdateProductRequest`: Validate `category_id`, `name`, `price` (>= 0), `unit`, `stock_quantity` (>= 0), `availability`, `image`.
- `[x]` **JsonResources**:
  - `CategoryResource.php`: ID, tên ngành hàng, slug, mô tả, đếm sản phẩm.
  - `ProductResource.php`: Chi tiết nông sản, sạp sở hữu, ngành hàng, tình trạng tồn kho, rating.
- `[x]` **Nghiệp vụ cốt lõi**:
  - Tự động loại bỏ các sản phẩm có `is_hidden = 1` hoặc `availability = 'unavailable'` khỏi catalog công khai.
  - Tìm kiếm fulltext MySQL: `WHERE MATCH(name, description) AGAINST(? IN BOOLEAN MODE)`.
- `[x]` **Đưa danh sách API và data mẫu để test**:
  - Đã xuất bản danh sách API và dữ liệu mẫu test tại [`BackEndApiTest.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/BackEndApiTest.md#4-categories--produce-catalog-phase-35).
  - Đã tạo Feature Test `tests/Feature/CategoryApiTest.php` (8 test cases) và `tests/Feature/ProductApiTest.php` (18 test cases) bao phủ toàn diện (100% pass, tổng 79/79 tests toàn dự án).

---

## Phase 3.6: Nhóm 5 - Mẫu Tồn Kho Mở Bán Định Kỳ Tuần (Weekly Stock Templates)

- `[x]` **Endpoints**:
  - `GET  /api/v1/farmer/products/{id}/template` (Farmer: Xem mẫu định mức kho theo thứ của sản phẩm)
  - `PUT  /api/v1/farmer/products/{id}/template` (Farmer: Cấu hình số lượng mở bán định kỳ T7/CN)
  - `POST /api/v1/farmer/apply-weekly-templates` (Farmer: 1-Click áp dụng mẫu kho cho phiên chợ tới)
- `[x]` **Controller**: `WeeklyStockController.php` (`app/Http/Controllers/Api/V1/WeeklyStockController.php`).
- `[x]` **Form Request**:
  - `UpdateWeeklyStockRequest`: Validate mảng `templates` gồm `day_of_week` (0-6) và `default_quantity` (>= 0).
- `[x]` **JsonResource**: `WeeklyStockTemplateResource.php`.
- `[x]` **Nghiệp vụ cốt lõi**:
  - **Nút 1-Click trên Farmer Dashboard**: Khi nông dân bấm "Áp Dụng Định Mức Kho Tuần", hệ thống tự động xác định thứ của phiên chợ sắp tới (hoặc theo ngày/thứ được truyền), lấy `default_quantity` và cập nhật vào `products.stock_quantity`, đồng thời chuyển `availability = 'available'`.
- `[x]` **Đưa danh sách API và data mẫu để test**:
  - Đã xuất bản danh sách API và dữ liệu mẫu test tại [`BackEndApiTest.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/BackEndApiTest.md#5-weekly-stock-templates-phase-36).
  - Đã tạo Feature Test `tests/Feature/WeeklyStockApiTest.php` với 9 test cases bao phủ toàn diện (100% pass, tổng 92/92 tests toàn dự án).

---

## Phase 3.7: Nhóm 6 - Giỏ Hàng Mua Sắm (Shopping Cart)

- `[x]` **Endpoints**:
  - `GET    /api/v1/cart` (Customer: Lấy giỏ hàng, tự động nhóm các món theo từng sạp và chợ)
  - `POST   /api/v1/cart/items` (Customer: Thêm món vào giỏ kèm số lượng)
  - `PUT    /api/v1/cart/items/{id}` (Customer: Cập nhật số lượng món trong giỏ)
  - `DELETE /api/v1/cart/items/{id}` (Customer: Xoá 1 món khỏi giỏ)
  - `DELETE /api/v1/cart/clear` (Customer: Dọn sạch toàn bộ giỏ hàng)
- `[x]` **Controller**: `CartController.php` (`app/Http/Controllers/Api/V1/CartController.php`).
- `[x]` **Form Requests**:
  - `AddCartItemRequest`: Validate `product_id` (tồn tại, không bị ẩn), `quantity` (> 0).
  - `UpdateCartItemRequest`: Validate `quantity` (> 0).
- `[x]` **JsonResources**:
  - `CartResource.php`: Danh sách món nhóm theo sạp nông dân, tính tạm tính tổng tiền.
  - `CartItemResource.php`: Thông tin món, đơn giá, số lượng, thành tiền, tồn kho hiện tại.
- `[x]` **Nghiệp vụ cốt lõi**:
  - Kiểm tra tồn kho trước khi cho thêm vào giỏ: `quantity <= stock_quantity`.
  - Tự động cộng dồn số lượng nếu sản phẩm đã có sẵn trong giỏ.
- `[x]` **Đưa danh sách API và data mẫu để test**:
  - Đã xuất bản danh sách API và dữ liệu mẫu test tại [`BackEndApiTest.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/BackEndApiTest.md#6-shopping-cart-phase-37).
  - Đã tạo Feature Test `tests/Feature/CartApiTest.php` với 12 test cases bao phủ toàn diện (100% pass, tổng 107/107 tests toàn dự án).

---

## Phase 3.8: Nhóm 7 - Đặt Hàng Pre-Order & Xử Lý Vòng Đời Đơn (Orders & OrderItems)

- `[x]` **Endpoints**:
  - `POST  /api/v1/orders/checkout` (Customer: Đặt trước Pre-Order, tự động tách đơn theo sạp)
  - `GET   /api/v1/orders/my-orders` (Customer: Xem lịch sử các đơn đặt trước)
  - `GET   /api/v1/orders/my-orders/{id}` (Customer: Chi tiết đơn hàng của khách)
  - `GET   /api/v1/orders/track/{orderCode}` (Public: Tra cứu đơn hàng nhận tại sạp qua mã code)
  - `PATCH /api/v1/orders/{id}/cancel` (Customer: Khách huỷ đơn trước giờ cutoff)
  - `GET   /api/v1/farmer/orders` (Farmer: Hàng chờ đơn đặt trước cần chuẩn bị)
  - `PATCH /api/v1/farmer/orders/{id}/accept` (Farmer: Duyệt đơn)
  - `PATCH /api/v1/farmer/orders/{id}/decline` (Farmer: Từ chối đơn + lý do & hoàn kho)
  - `PATCH /api/v1/farmer/orders/{id}/ready` (Farmer: Báo hàng đã chuẩn bị xong tại sạp)
  - `PATCH /api/v1/farmer/orders/{id}/complete` (Farmer: Khách đã nhận hàng & thanh toán tiền mặt)
  - `GET   /api/v1/orders/slots` (Public/Customer: Lấy danh sách khung giờ nhận hàng khả dụng)
- `[x]` **Controller**: `OrderController.php` (`app/Http/Controllers/Api/V1/OrderController.php`).
- `[x]` **Services**:
  - `PreOrderCheckoutService.php`: Thuật toán tách đơn đa sạp, kiểm tra giờ cutoff, khóa dòng `lockForUpdate()`, trừ kho và bọc trong `DB::transaction()`.
  - `TimeSlotGeneratorService.php`: Thuật toán sinh tự động khung giờ nhận hàng 30 phút trong ngày họp chợ.
- `[x]` **Form Requests**:
  - `CheckoutPreOrderRequest`: Validate `market_id`, `pickup_date`, `pickup_start_time`, `pickup_end_time`, `note`.
  - `DeclineOrderRequest` & `CancelOrderRequest`: Validate `cancel_reason`.
- `[x]` **JsonResources**:
  - `OrderResource.php`: Chi tiết đơn, snapshot mặt hàng, mốc thời gian tracking, cờ `can_be_cancelled`.
  - `OrderItemResource.php`: Snapshot tên, đơn vị, đơn giá lúc chốt đơn và thành tiền.
- `[x]` **Nghiệp vụ cốt lõi**:
  - **Tách đơn đa sạp**: Nếu giỏ hàng có hàng của 2 sạp khác nhau $\rightarrow$ sinh ra 2 bản ghi `orders` riêng biệt với mã `order_code` riêng.
  - **Khóa dòng & Trừ kho**: Giảm `stock_quantity`, nếu về 0 thì set `availability = 'sold_out'`.
  - **Hoàn kho tự động**: Khi đơn bị `declined` hoặc `cancelled`, hoàn lại đúng số lượng vào `stock_quantity` và bật lại `available`.
  - **Thông báo tự động**: Bắn in-app notification cho đối phương ở mỗi mốc đổi trạng thái (`order_placed`, `order_accepted`, `order_declined`, `order_ready`, `order_completed`, `order_cancelled`).
- `[x]` **Đưa danh sách API và data mẫu để test**:
  - Đã xuất bản danh sách API và dữ liệu mẫu test tại [`BackEndApiTest.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/BackEndApiTest.md#7-pre-orders--order-lifecycle-phase-38).
  - Đã tạo Feature Test `tests/Feature/OrderApiTest.php` với 17 test cases bao phủ toàn diện (100% pass, tổng 124/124 tests toàn dự án).

---

## Phase 3.9: Nhóm 8 - Đánh Giá & Mục Yêu Thích (Reviews & Favorites)

- `[x]` **Endpoints**:
  - `POST  /api/v1/reviews` (Customer: Đánh giá 1-5 sao sau khi đơn completed)
  - `POST  /api/v1/farmer/reviews/{id}/reply` (Farmer: Chủ sạp trả lời đánh giá sản phẩm)
  - `GET   /api/v1/reviews/product/{productId}` (Public: Xem review của sản phẩm)
  - `GET   /api/v1/reviews/farmer/{farmerId}` (Public: Xem review của sạp nông dân)
  - `PATCH /api/v1/admin/reviews/{id}/toggle-hide` (Admin: Ẩn/Hiện review vi phạm)
  - `GET   /api/v1/favorites` (Customer: Xem danh sách mục yêu thích)
  - `POST  /api/v1/favorites/toggle` (Customer: Thêm/Bỏ yêu thích nhanh đa hình)
- `[x]` **Controllers**:
  - `ReviewController.php` (`app/Http/Controllers/Api/V1/ReviewController.php`)
  - `FavoriteController.php` (`app/Http/Controllers/Api/V1/FavoriteController.php`)
- `[x]` **Service**:
  - `RatingCalculationService.php`: Thuật toán tự động tính lại `avg_rating` và `review_count` cho Product và Farmer.
- `[x]` **Form Requests**:
  - `StoreReviewRequest`: Validate `order_id` (phải completed, thuộc về user), `farmer_id`, `product_id`, `rating` (1-5), `comment`. Ràng buộc XOR chặn review cả 2 đối tượng cùng lúc.
  - `ReplyReviewRequest`: Validate `farmer_reply`.
  - `ToggleFavoriteRequest`: Validate `favoritable_type` (`farmer`, `product`, `market`), `favoritable_id`.
- `[x]` **JsonResources**: `ReviewResource.php`, `FavoriteResource.php`.
- `[x]` **Đưa danh sách API và data mẫu để test**:
  - Đã xuất bản danh sách API và dữ liệu mẫu test tại [`BackEndApiTest.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/BackEndApiTest.md#8-reviews--favorites-phase-39).
  - Đã tạo Feature Test `tests/Feature/ReviewAndFavoriteApiTest.php` với 17 test cases bao phủ toàn diện (100% pass, tổng 141/141 tests toàn dự án).

---

## Phase 3.10: Nhóm 9 - Thông Báo & Cảnh Báo Hệ Thống (Notifications & Announcements)

- `[x]` **Endpoints**:
  - `GET   /api/v1/notifications` (Protected: Danh sách thông báo in-app kèm unread count)
  - `PATCH /api/v1/notifications/{id}/read` (Protected: Đánh dấu đã đọc 1 thông báo)
  - `PATCH /api/v1/notifications/read-all` (Protected: Đánh dấu đã đọc toàn bộ)
  - `GET   /api/v1/announcements/active` (Public: Thông báo đang kích hoạt theo vai trò)
  - `GET   /api/v1/admin/announcements` (Admin: Quản lý thông báo toàn sàn)
  - `POST  /api/v1/admin/announcements` (Admin: Phát thông báo mới)
  - `PUT   /api/v1/admin/announcements/{id}` (Admin: Sửa thông báo)
  - `DELETE /api/v1/admin/announcements/{id}` (Admin: Xoá thông báo)
- `[x]` **Controllers**:
  - `NotificationController.php` (`app/Http/Controllers/Api/V1/NotificationController.php`)
  - `AnnouncementController.php` (`app/Http/Controllers/Api/V1/AnnouncementController.php`)
- `[x]` **Form Requests**:
  - `StoreAnnouncementRequest` & `UpdateAnnouncementRequest`: Validate `title`, `content`, `target_role` (`all`, `farmer`, `customer`), `is_active`.
- `[x]` **JsonResources**: `NotificationResource.php`, `AnnouncementResource.php`.
- `[x]` **Đưa danh sách API và data mẫu để test**:
  - Đã xuất bản danh sách API và dữ liệu mẫu test tại [`BackEndApiTest.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/BackEndApiTest.md#9-notifications--announcements-phase-310).
  - Đã tạo Feature Test `tests/Feature/NotificationAndAnnouncementApiTest.php` với 9 test cases bao phủ toàn diện (100% pass, tổng 150/150 tests toàn dự án).

---

## Phase 3.11: Nhóm 10 - Quản Trị Hệ Thống & Hộp Thư Liên Hệ (Admin Stats & Contact Messages)

- `[x]` **Endpoints**:
  - `GET   /api/v1/admin/stats/overview` (Admin: Thống kê tổng hợp: Doanh thu hoàn tất, Phân bổ đơn hàng, Thống kê User, Chợ, Nông sản, Đánh giá, Hộp thư, Top 5 nông dân uy tín)
  - `GET   /api/v1/admin/users` (Admin: Quản lý người dùng toàn sàn kèm bộ lọc vai trò, trạng thái và tìm kiếm fulltext)
  - `PATCH /api/v1/admin/users/{id}/status` (Admin: Khóa/Mở khóa/Cập nhật trạng thái tài khoản; chặn admin tự sửa chính mình)
  - `GET   /api/v1/admin/farmers/pending` (Admin: Hàng chờ sạp nông dân chờ phê duyệt)
  - `PATCH /api/v1/admin/farmers/{id}/approve` (Admin: Phê duyệt sạp nông dân mở bán + gửi notification in-app)
  - `PATCH /api/v1/admin/farmers/{id}/reject` (Admin: Từ chối hồ sơ nông dân kèm lý do bắt buộc + gửi notification in-app)
  - `POST  /api/v1/contact` (Public: Khách/Người dùng gửi phản ánh / thư liên hệ)
  - `GET   /api/v1/admin/inquiries` (Admin: Hộp thư tiếp nhận phản ánh Admin Inbox kèm lọc trạng thái đọc và tìm kiếm)
  - `PATCH /api/v1/admin/inquiries/{id}/read` (Admin: Đánh dấu đã đọc/xử lý phản ánh)
- `[x]` **Controllers**:
  - `AdminController.php` (`app/Http/Controllers/Api/V1/AdminController.php`)
  - `ContactController.php` (`app/Http/Controllers/Api/V1/ContactController.php`)
- `[x]` **Form Requests**:
  - `StoreContactRequest`: Validate `name`, `email`, `subject`, `message`.
  - `UpdateUserStatusRequest`: Validate `status` (`active`, `inactive`, `banned`, `pending`).
  - `RejectFarmerRequest`: Validate `reason` bắt buộc tối thiểu 5 ký tự.
- `[x]` **JsonResource**: `ContactMessageResource.php`.
- `[x]` **Đưa danh sách API và data mẫu để test**:
  - Đã xuất bản danh sách API và dữ liệu mẫu test tại [`BackEndApiTest.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/BackEndApiTest.md#10-admin-governance--contact-inquiries-phase-311).
  - Đã tạo Feature Test `tests/Feature/AdminAndContactApiTest.php` với 14 test cases bao phủ toàn diện (100% pass, tổng 164/164 tests toàn dự án).

---

## Phase 3.12: Kiểm Thử Tích Hợp API (API Testing Suite & Zero N+1)

- `[ ]` Viết Feature Tests (`tests/Feature/`):
  - `AuthApiTest.php`: Kiểm tra đăng ký Customer, đăng ký Farmer, đăng nhập sai/đúng, lấy profile `/me`.
  - `ProductCatalogApiTest.php`: Kiểm tra lọc nông sản theo category, giá, chợ và search fulltext.
  - `PreOrderCheckoutTest.php`: Kiểm tra luồng checkout tách đơn, trừ kho, chặn khi hết hàng và chặn khi quá giờ cutoff.
  - `OrderStatusTransitionTest.php`: Kiểm tra luồng Farmer duyệt đơn, báo sẵn sàng, giao hàng và hoàn kho khi huỷ.
  - `ReviewModerationTest.php`: Kiểm tra ràng buộc review đơn completed, phản hồi của chủ sạp và admin ẩn review.
- `[ ]` Kiểm tra HTTP Status Codes đồng nhất: `200`, `201`, `400`, `401`, `403`, `404`, `422`.
- `[ ]` Đảm bảo CORS header phản hồi chính xác cho Frontend React Vite trên local và production Vercel.

---

## Tổng Kết Day 3

- `[ ]` 10 nhóm tính năng được chia nhỏ và hoàn thành độc lập, không bị chồng chéo code.
- `[ ]` Toàn bộ 11 Controllers, 18 Form Requests và 15 JsonResources hoạt động mượt mà.
- `[ ]` Sẵn sàng bàn giao bộ API chuẩn hóa cho Day 4 kết nối Frontend React Vite.
