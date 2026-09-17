# DAY 2: MIGRATIONS, ELOQUENT MODELS & DATABASE SEEDERS

**Mục tiêu**: Hiện thực hóa sơ đồ ERD thành code Laravel chuẩn (Migrations, Models, Relationships) và tạo sẵn dữ liệu mẫu (Seeders) đầy đủ để sẵn sàng code logic trong Day 3.

---

## Phase 2.1: Tạo Migrations Theo ERD

- `[ ]` Tạo migration cho các bảng độc lập (không chứa khóa ngoại) trước.
- `[ ]` Tạo migration cho các bảng phụ thuộc (chứa khóa ngoại) sau.
- `[ ]` Tạo migration cho các bảng trung gian (Pivot tables) cho quan hệ N-N (nếu có).
- `[ ]` Chạy `php artisan migrate` kiểm tra tính chính xác và khóa ngoại.
- `[ ]` Thử nghiệm rollback: `php artisan migrate:rollback` và `php artisan migrate` để đảm bảo migration có thể rollback sạch sẽ.

## Phase 2.2: Cấu Hình Eloquent Models (Tuân Thủ CONVENTION.md)

- `[ ]` Tạo các Model tương ứng (PascalCase, số ít).
- `[ ]` Khai báo `declare(strict_types=1);` ở đầu mọi file Model.
- `[ ]` Cấu hình thuộc tính `$fillable` để bảo vệ Mass Assignment.
- `[ ]` Sử dụng trait `SoftDeletes` cho các thực thể quan trọng (chống xoá cứng dữ liệu).
- `[ ]` Khai báo các hằng số trạng thái (Status constants) thay vì dùng Magic Numbers.

## Phase 2.3: Thiết Lập Relationships (Quan Hệ Thực Thể)

- `[ ]` Thiết lập quan hệ 1-N (`hasMany`, `belongsTo`) giữa các Model.
- `[ ]` Thiết lập quan hệ N-N (`belongsToMany`) nếu có.
- `[ ]` Khai báo đầy đủ Return Types cho tất cả các relationship methods.
- `[ ]` Dùng `php artisan tinker` để kiểm tra truy vấn quan hệ hoạt động đúng.

## Phase 2.4: Tạo Factories & Seeders (Dữ Liệu Mẫu)

- `[ ]` Tạo Model Factories sinh dữ liệu mẫu hợp lý bằng Faker.
- `[ ]` Tạo `DatabaseSeeder.php` với thứ tự seed logic (tạo bảng cha trước, bảng con sau).
- `[ ]` Tạo sẵn 1 tài khoản Admin mẫu và 1 tài khoản User mẫu với mật khẩu cố định cho cả team test.
- `[ ]` Chạy `php artisan migrate:fresh --seed` kiểm tra sinh dữ liệu hoàn tất không lỗi.

---

## Tổng Kết Day 2

- `[ ]` Toàn bộ bảng đã có trong Database kèm quan hệ chuẩn.
- `[ ]` Dữ liệu mẫu (Dummy data) đã sẵn sàng phục vụ hiển thị cho Day 3 và Day 4.
- `[ ]` Cả team commit code và phân chia Controllers cho Day 3.
