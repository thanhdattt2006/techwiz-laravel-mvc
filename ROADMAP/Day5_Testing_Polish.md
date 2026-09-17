# DAY 5: QA TESTING, FIX BUG, DỌN DỮ LIỆU & CHUẨN BỊ DEMO

**Mục tiêu**: Đóng băng tính năng mới (Code Freeze). Toàn lực kiểm thử, sửa sạch các lỗi phát sinh, chuẩn bị bộ dữ liệu demo chỉn chu nhất và sẵn sàng thuyết trình trước Ban Giám Khảo (BGK).

---

## Phase 5.1: Đóng Băng Code & QA Testing Toàn Diện

- `[ ]` Thống nhất toàn team KHÔNG thêm bất kỳ tính năng mới nào.
- `[ ]` Rà soát lại toàn bộ yêu cầu của đề thi xem có bị sót mục quan trọng nào không.
- `[ ]` Đóng vai Người Dùng cuối: Thao tác toàn bộ các luồng (User flow) từ đầu đến cuối.
- `[ ]` Kiểm thử các tình huống biên: Bỏ trống form, nhập ký tự đặc biệt, upload file sai định dạng.

## Phase 5.2: Khắc Phục Lỗi (Bug Fixing)

- `[ ]` Ưu tiên 1: Sửa các lỗi văng Exception (Error 500) hoặc crash ứng dụng.
- `[ ]` Ưu tiên 2: Sửa các lỗi nghiệp vụ và tính toán dữ liệu.
- `[ ]` Ưu tiên 3: Sửa lỗi hiển thị, vỡ giao diện trên thiết bị di động.
- `[ ]` Ghi chép và theo dõi lỗi qua `ai/BUGS.md`.

## Phase 5.3: Chuẩn Bị Dữ Liệu Demo Chuẩn Chỉ (Clean Demo Data)

- `[ ]` Xoá sạch toàn bộ dữ liệu rác/text vô nghĩa sinh ra trong quá trình test.
- `[ ]` Nhập bộ dữ liệu mẫu thực tế, đẹp mắt, có đầy đủ hình ảnh chất lượng cao.
- `[ ]` Chuẩn bị sẵn 1 tài khoản Admin và 1 tài khoản User có sẵn mật khẩu trong `README.md` để BGK dễ dàng đăng nhập kiểm tra.

## Phase 5.4: Kiểm Tra Môi Trường Production Trên Render

- `[ ]` Đảm bảo `APP_ENV=production` và `APP_DEBUG=false`.
- `[ ]` Kiểm tra trang báo lỗi thân thiện (404, 500) không để lộ stack trace.
- `[ ]` Đảm bảo toàn bộ tài nguyên (CSS, JS, Hình ảnh) load qua HTTPS mượt mà, không bị lỗi mixed content.

## Phase 5.5: Chuẩn Bị Kịch Bản Thuyết Trình & Nộp Bài

- `[ ]` Soạn kịch bản Demo: Giới thiệu dự án -> Trình diễn luồng Khách -> Trình diễn luồng Admin -> Điểm nhấn kỹ thuật.
- `[ ]` Chạy thử bản demo (Dry run) bấm giờ để đảm bảo không bị lố thời gian.
- `[ ]` Commit phiên bản cuối cùng: `git commit -m "Final version for submission"`.
- `[ ]` Kiểm tra link live Render hoạt động ổn định và nộp bài đúng hạn.

---

## Tổng Kết Day 5

- `[ ]` Hoàn thành xuất sắc 5 ngày dự án TechWiz!
