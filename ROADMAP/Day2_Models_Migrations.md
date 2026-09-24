# DAY 2: MIGRATIONS, ELOQUENT MODELS, RELATIONSHIPS & SEEDERS
# DỰ ÁN: MARKETLINK - EGREEN BASKET (SRS TECHWIZ 7)

**Mục tiêu**: Hiện thực hóa 100% thiết kế sơ đồ CSDL 18 bảng thành mã nguồn Laravel Framework 13 chuẩn mực:
1. Viết 18 file Migrations với đầy đủ Foreign Keys, Constraints (`CHECK`, `UNIQUE`, `JSON`, `FULLTEXT`), Indexes và `SoftDeletes`.
2. Tạo 17 Eloquent Models tuân thủ tuyệt đối `declare(strict_types=1);`, Status/Role Constants, Mass Assignment protection (`$fillable`), Type-hinted relationships (`belongsTo`, `hasMany`, `hasOne`, `belongsToMany`, Polymorphic `morphMany`).
3. Xây dựng bộ Database Seeders hoàn chỉnh với dữ liệu thực tế (6 chợ Chicago, sạp nông dân, 5 ngành hàng, 20+ nông sản, weekly stock templates, đơn pre-order mẫu, review, thông báo và tin nhắn liên hệ).

---

## Phase 2.1: Tạo 18 Migrations Theo Thứ Tự Quan Hệ Phụ Thuộc (Dependency Order)

- `[x]` **Migration 1**: `2026_01_01_000001_create_users_table.php` (Cập nhật):
  - `id`, `fullname`, `username` (unique), `email` (unique), `phone` (nullable), `address` (nullable), `role` (`admin`, `farmer`, `customer` default `customer`), `status` (`pending`, `active`, `inactive`, `banned` default `active`), `password`, `rememberToken()`, `timestamps()`, `softDeletes()`.
  - Index: `(role, status)`.
- `[x]` **Migration 2**: `2026_01_01_000002_create_personal_access_tokens_table.php` (Giữ nguyên Sanctum).
- `[x]` **Migration 3**: `2026_01_01_000003_create_markets_table.php`:
  - `id`, `name`, `address`, `latitude`, `longitude`, `map_provider` default `osm`, `map_embed_url` (nullable), `description` (nullable), `image` (nullable), `status` (`active`, `inactive` default `active`), `timestamps()`, `softDeletes()`.
  - Index: `(status)`, `(latitude, longitude)`.
- `[x]` **Migration 4**: `2026_01_01_000004_create_market_schedules_table.php`:
  - `id`, `market_id` (FK `markets.id` cascade), `day_of_week` (tinyint 0-6), `open_time`, `close_time`.
  - Constraints: `UNIQUE (market_id, day_of_week)`, `CHECK (open_time < close_time)`.
- `[x]` **Migration 5**: `2026_01_01_000005_create_farmers_table.php`:
  - `id`, `user_id` (FK `users.id` cascade, unique), `stall_name`, `contact_person`, `contact_phone`, `address`, `latitude` (nullable), `longitude` (nullable), `description` (nullable), `logo` (nullable), `avg_rating` (decimal 3,2 default 0.00), `review_count` (int unsigned default 0), `timestamps()`, `softDeletes()`.
- `[x]` **Migration 6**: `2026_01_01_000006_create_farmer_markets_table.php`:
  - `id`, `farmer_id` (FK `farmers.id` cascade), `market_id` (FK `markets.id` cascade), `stall_location` (nullable), `pickup_days` (json), `pickup_start_time`, `pickup_end_time`, `slot_minutes` (default 30), `cutoff_hours` (default 12), `is_active` (default 1), `timestamps()`.
  - Constraints: `UNIQUE (farmer_id, market_id)`, `CHECK (pickup_start_time < pickup_end_time)`.
  - Index: `(market_id)`.
- `[x]` **Migration 7**: `2026_01_01_000007_create_categories_table.php`:
  - `id`, `name` (unique), `slug` (unique), `description` (nullable), `is_active` (default 1), `timestamps()`.
- `[x]` **Migration 8**: `2026_01_01_000008_create_products_table.php`:
  - `id`, `farmer_id` (FK `farmers.id` cascade), `category_id` (FK `categories.id` restrict), `name`, `description` (nullable), `price` (decimal 10,2), `unit`, `stock_quantity` (decimal 10,2 default 0), `availability` (`available`, `sold_out`, `unavailable` default `available`), `image` (nullable), `is_hidden` (default 0), `avg_rating` (decimal 3,2 default 0.00), `review_count` (int default 0), `timestamps()`, `softDeletes()`.
  - Constraints: `CHECK (price >= 0)`, `CHECK (stock_quantity >= 0)`.
  - Index: `(farmer_id)`, `(category_id)`, `(price)`, `FULLTEXT (name, description)`.
- `[x]` **Migration 9**: `2026_01_01_000009_create_weekly_stock_templates_table.php`:
  - `id`, `product_id` (FK `products.id` cascade), `day_of_week` (tinyint 0-6), `default_quantity` (decimal 10,2), `is_active` (default 1).
  - Constraints: `UNIQUE (product_id, day_of_week)`, `CHECK (default_quantity >= 0)`.
- `[x]` **Migration 10**: `2026_01_01_000010_create_carts_table.php`:
  - `id`, `user_id` (FK `users.id` cascade, unique), `timestamps()`.
- `[x]` **Migration 11**: `2026_01_01_000011_create_cart_items_table.php`:
  - `id`, `cart_id` (FK `carts.id` cascade), `product_id` (FK `products.id` cascade), `quantity` (decimal 10,2), `timestamps()`.
  - Constraints: `UNIQUE (cart_id, product_id)`, `CHECK (quantity > 0)`.
- `[x]` **Migration 12**: `2026_01_01_000012_create_orders_table.php`:
  - `id`, `order_code` (unique), `customer_id` (FK `users.id` restrict), `farmer_id` (FK `farmers.id` restrict), `market_id` (FK `markets.id` restrict), `pickup_date`, `pickup_start_time`, `pickup_end_time`, `status` (`placed`, `accepted`, `declined`, `ready_for_pickup`, `completed`, `cancelled` default `placed`), `total_amount` (decimal 10,2), `note` (nullable), `cancel_reason` (nullable), `cutoff_at` (datetime), `accepted_at` (nullable), `ready_at` (nullable), `completed_at` (nullable), `cancelled_at` (nullable), `timestamps()`.
  - Constraints: `CHECK (total_amount >= 0)`.
  - Index: `(customer_id, status)`, `(farmer_id, status)`, `(pickup_date)`, `(market_id)`.
- `[x]` **Migration 13**: `2026_01_01_000013_create_order_items_table.php`:
  - `id`, `order_id` (FK `orders.id` cascade), `product_id` (FK `products.id` restrict), `product_name`, `unit`, `unit_price` (decimal 10,2), `quantity` (decimal 10,2), `subtotal` (decimal 10,2).
  - Constraints: `CHECK (quantity > 0)`.
  - Index: `(order_id)`, `(product_id)`.
- `[x]` **Migration 14**: `2026_01_01_000014_create_favorites_table.php`:
  - `id`, `user_id` (FK `users.id` cascade), `favoritable_type` (`farmer`, `product`, `market`), `favoritable_id` (bigint unsigned), `created_at`.
  - Constraints: `UNIQUE (user_id, favoritable_type, favoritable_id)`.
  - Index: `(favoritable_type, favoritable_id)`.
- `[x]` **Migration 15**: `2026_01_01_000015_create_reviews_table.php`:
  - `id`, `customer_id` (FK `users.id` cascade), `order_id` (FK `orders.id` cascade), `farmer_id` (nullable, FK `farmers.id` cascade), `product_id` (nullable, FK `products.id` cascade), `rating` (tinyint 1-5), `comment` (nullable), `farmer_reply` (nullable), `farmer_replied_at` (nullable), `is_hidden` (default 0), `timestamps()`, `softDeletes()`.
  - Constraints: `CHECK ((farmer_id IS NULL) <> (product_id IS NULL))`, `CHECK (rating BETWEEN 1 AND 5)`.
- `[x]` **Migration 16**: `2026_01_01_000016_create_notifications_table.php`:
  - `id`, `user_id` (FK `users.id` cascade), `type`, `title`, `message`, `order_id` (nullable, FK `orders.id` set null), `is_read` (default 0), `created_at`.
  - Index: `(user_id, is_read)`.
- `[x]` **Migration 17**: `2026_01_01_000017_create_announcements_table.php`:
  - `id`, `created_by` (FK `users.id` restrict), `title`, `content`, `target_role` (`all`, `farmer`, `customer` default `all`), `is_active` (default 1), `timestamps()`.
- `[x]` **Migration 18**: `2026_01_01_000018_create_contact_messages_table.php`:
  - `id`, `name`, `email`, `subject`, `message`, `is_read` (default 0), `timestamps()`.
  - Index: `(is_read)`.

---

## Phase 2.2: Tạo 17 Eloquent Models Chuẩn Convention

Toàn bộ Model tuân thủ:
- `declare(strict_types=1);` ở đầu file.
- Định nghĩa Constants cho Roles, Statuses, Enums.
- `$fillable` bảo vệ Mass Assignment.
- `$casts` cho Datetime, Decimal, Boolean, JSON.
- Helper methods (VD: `isAdmin()`, `isFarmer()`, `isCustomer()`, `isAvailable()`).

Danh sách 17 Models:
1. `User.php`: Authentication, Roles (`admin`, `farmer`, `customer`), Statuses (`pending`, `active`, `inactive`, `banned`).
2. `Market.php`: Địa điểm chợ, coordinates, map embed, SoftDeletes.
3. `MarketSchedule.php`: Lịch họp theo ngày trong tuần.
4. `Farmer.php`: Hồ sơ gian hàng sạp, quan hệ 1-1 với User, SoftDeletes.
5. `FarmerMarket.php`: Pivot model với thông tin pickup slot, cutoff hours, stall location.
6. `Category.php`: Danh mục phân loại nông sản sạch.
7. `Product.php`: Sản phẩm nông sản, giá, tồn kho, SoftDeletes.
8. `WeeklyStockTemplate.php`: Định mức kho theo thứ.
9. `Cart.php`: Giỏ hàng người dùng (1-1 với User).
10. `CartItem.php`: Món trong giỏ hàng.
11. `Order.php`: Đơn pre-order, Statuses (`placed`, `accepted`, `declined`, `ready_for_pickup`, `completed`, `cancelled`).
12. `OrderItem.php`: Chi tiết đơn hàng với snapshot giá và tên.
13. `Favorite.php`: Đa hình (Polymorphic).
14. `Review.php`: Đánh giá 1-5 sao, SoftDeletes.
15. `Notification.php`: Thông báo in-app.
16. `Announcement.php`: Thông báo toàn sàn.
17. `ContactMessage.php`: Phản ánh liên hệ từ khách vãng lai.

---

## Phase 2.3: Thiết Lập Eloquent Relationships Đầy Đủ

- **`User`**:
  - `hasOne(Farmer::class)`
  - `hasOne(Cart::class)`
  - `hasMany(Order::class, 'customer_id')`
  - `hasMany(Review::class, 'customer_id')`
  - `hasMany(Favorite::class)`
  - `hasMany(Notification::class)`
  - `hasMany(Announcement::class, 'created_by')`
- **`Farmer`**:
  - `belongsTo(User::class)`
  - `hasMany(FarmerMarket::class)`
  - `belongsToMany(Market::class, 'farmer_markets')->withPivot(['stall_location', 'pickup_days', 'pickup_start_time', 'pickup_end_time', 'slot_minutes', 'cutoff_hours', 'is_active'])`
  - `hasMany(Product::class)`
  - `hasMany(Order::class)`
  - `hasMany(Review::class)`
- **`Market`**:
  - `hasMany(MarketSchedule::class)`
  - `hasMany(FarmerMarket::class)`
  - `belongsToMany(Farmer::class, 'farmer_markets')`
  - `hasMany(Order::class)`
- **`Product`**:
  - `belongsTo(Farmer::class)`
  - `belongsTo(Category::class)`
  - `hasMany(WeeklyStockTemplate::class)`
  - `hasMany(CartItem::class)`
  - `hasMany(OrderItem::class)`
  - `hasMany(Review::class)`
- **`Order`**:
  - `belongsTo(User::class, 'customer_id')`
  - `belongsTo(Farmer::class)`
  - `belongsTo(Market::class)`
  - `hasMany(OrderItem::class)`
  - `hasMany(Review::class)`
  - `hasMany(Notification::class)`
- **`Review`**:
  - `belongsTo(User::class, 'customer_id')`
  - `belongsTo(Order::class)`
  - `belongsTo(Farmer::class)`
  - `belongsTo(Product::class)`
- **`Favorite`**:
  - `belongsTo(User::class)`
  - `morphTo()`

---

## Phase 2.4: Xây Dựng Bộ Seeders Thực Tế Phục Vụ Demo (TechWiz Ready)

- `[x]` Tạo 3 tài khoản chuẩn:
  - **Admin**: `admin@marketlink.com` / `password123` / role: `admin`.
  - **Farmer**: `farmer@marketlink.com` / `password123` / role: `farmer` (Green Valley Organic Farm).
  - **Customer**: `customer@marketlink.com` / `password123` / role: `customer` (David Miller, Chicago IL).
- `[x]` Seed 6 Chợ Nông Sản Chicago với toạ độ thực & lịch họp:
  1. Lincoln Park Farmers Market (Armitage Ave, Sat 07:00 - 13:00)
  2. Green City Market (Lincoln Park, Wed & Sat 07:00 - 13:00)
  3. Logan Square Farmers Market (Logan Blvd, Sun 08:30 - 15:00)
  4. Downtown Evanston Farmers Market (University Pl, Sat 07:30 - 13:00)
  5. Wicker Park Farmers Market (Damen Ave, Sun 08:00 - 14:00)
  6. Daley Plaza City Market (Washington St, Thu 07:00 - 14:00)
- `[x]` Seed 5 Ngành hàng: *Fresh Vegetables, Orchard Fruits, Farm Dairy & Eggs, Artisan Bakery, Pantry & Honey*.
- `[x]` Seed 20+ Sản phẩm nông sản có hình ảnh Unsplash sắc nét, đơn giá, tồn kho thực tế.
- `[x]` Seed Weekly Stock Templates cho các sản phẩm mở bán ngày Thứ 7 và Chủ Nhật.
- `[x]` Seed 4 Đơn hàng Pre-order mẫu ở các trạng thái khác nhau (`placed`, `accepted`, `ready_for_pickup`, `completed`).
- `[x]` Seed Đánh giá Review 5 sao, Thông báo in-app, Announcements và Tin nhắn liên hệ mẫu.

---

## Tổng Kết Day 2
- `[x]` 18 Migrations chạy trơn tru, không có bất kỳ xung đột khóa ngoại nào.
- `[x]` 17 Models hoàn thiện với đầy đủ quan hệ và type-hints.
- `[x]` Cơ sở dữ liệu mẫu sẵn sàng cho Day 3 xây dựng các API Controllers và Form Requests.
