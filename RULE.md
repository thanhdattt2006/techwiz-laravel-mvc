# LUẬT LÀM VIỆC DÀNH CHO TEAM (TEAM RULES)

File này quy định cách thức phối hợp cho 4 anh em, đảm bảo tốc độ và tránh đụng độ (conflict) code trong 5 ngày.

## 1. QUY TẮC NHẬN TASK

- Đầu mỗi ngày (hoặc ca làm việc 4h), phải vào thư mục `ROADMAP` mở file của ngày hôm đó ra xem.
- Khi bắt đầu làm 1 task nào, phải đánh dấu `[/]` (In progress) vào mục đó và báo lên Group Chat (VD: "Tao đang làm Phase 3.2 nhé").
- Làm xong phải tick `[x]` và commit code ngay lập tức. Đừng ngâm.

## 2. QUY TẮC VIẾT CODE CƠ BẢN

- **Không vứt rác**: Tuyệt đối KHÔNG ĐỂ LẠI `dd()`, `dump()`, `print_r()` hay `console.log()` trước khi commit. Nhớ xoá!
- **CSS & Giao diện**: CHỈ SỬ DỤNG **TailwindCSS**. Cấm viết CSS tay vào file `.css` hoặc thẻ `<style>` trừ trường hợp cực kỳ bất khả kháng.
- **BẢNG MÀU CHUẨN Y TẾ (Design System)**: Bắt buộc áp dụng thống nhất các mã màu sau:
  - **Primary (xanh y tế)**: `#0B6EFD` (Nút chính, link, navbar active)
  - **Primary tối**: `#084298` (Hover, header, footer)
  - **Emergency (đỏ)**: `#DC3545` (Nút "Đặt xe ngay", badge khẩn cấp, cảnh báo)
  - **Success (xanh lá)**: `#198754` (Xe sẵn sàng, hoàn thành)
  - **Warning (vàng cam)**: `#FFB020` (Đang chờ, sắp tới)
  - **Nền sáng**: `#F5F8FC` (Background trang)
  - **Card**: `#FFFFFF` (Card, form)
  - **Chữ chính**: `#1F2A37` (Body text)
  - **Chữ phụ**: `#6B7785` (Mô tả, placeholder)
  - **Viền**: `#E2E8F0` (Border input, card)
- **KHÔNG CẦN DÙNG DARK/LIGHT THEME**: Cố định duy nhất 1 giao diện nền sáng y tế chuyên nghiệp (`#F5F8FC`), tuyệt đối không tốn thời gian viết toggle dark mode.
- **Tuân thủ CONVENTION.md**: Đọc kỹ file `CONVENTION.md` về cách đặt tên biến, tên hàm, bắt buộc khai báo `declare(strict_types=1);`. Cứ code ẩu là bắt xoá làm lại.

## 3. QUY TRÌNH COMMIT & PUSH (Cực Kỳ Quan Trọng)

Do làm chung dự án gấp, conflict Git là nỗi ác mộng làm tốn cả ngày fix. Hãy tuân thủ đúng 5 bước:

1. **Trước khi bắt đầu code**: Luôn chạy lệnh `git pull origin main` để cập nhật code mới nhất từ team.
2. **TRẢM LIÊN TỤC (Commit nhỏ & thường xuyên)**: Tuyệt đối CẤM việc dồn cả đống code, làm xong 3-4 tính năng rồi mới commit. Cứ code xong chạy được 1 tính năng nhỏ (hoặc thậm chí 1 file quan trọng) là phải "trảm" (commit) ngay. Thà commit 100 lần 1 ngày còn hơn commit 1 lần dính conflict không gỡ nổi.
3. **Cú pháp Commit**: BẮT BUỘC viết bằng TIẾNG ANH theo chuẩn Conventional Commits (`type: message`). TUYỆT ĐỐI KHÔNG ĐƯỢC CHẾ THÊM LOẠI NÀO KHÁC ngoài danh sách này:
    - `feat:` Thêm tính năng mới (VD: `feat: add Google login`)
    - `fix:` Sửa lỗi/bug (VD: `fix: resolve mobile button alignment`)
    - `docs:` Viết/Cập nhật tài liệu (VD: `docs: update README with setup instructions`)
    - `style:` Chỉnh sửa format, khoảng trắng, dấu phẩy... KHÔNG ảnh hưởng logic code (VD: `style: format react components and tailwind classes`)
    - `refactor:` Viết lại code cho sạch/tối ưu hơn nhưng KHÔNG thay đổi chức năng (VD: `refactor: clean up user controller`)
    - `perf:` Sửa code để tăng hiệu năng/tốc độ (VD: `perf: optimize database query for products`)
    - `test:` Thêm test case hoặc sửa test (VD: `test: add unit test for login logic`)
    - `build:` Đổi cấu hình build, dependency, thư viện (VD: `build: upgrade laravel framework`)
    - `ci:` Thay đổi cấu hình CI/CD, deploy (VD: `ci: update render deployment script`)
    - `chore:` Các tác vụ linh tinh, không đụng tới source code (VD: `chore: update .gitignore`)
    - `revert:` Hoàn tác lại một commit trước đó (VD: `revert: undo previous commit of feature X`)
4. **Trước khi Push**: Phải chạy lại `git pull origin main` lần nữa để tải code mới nhất (có thể ai đó vừa push lên) và tự giải quyết conflict ở máy cá nhân.
5. Sau khi resolve conflict và test code chạy vẫn mượt, mới được dùng `git push origin main`.

## 4. XỬ LÝ KHI GẶP LỖI (BUG)

- Cố gắng tự search Google/AI trong 15-30 phút.
- Nếu vướng quá lâu: Ghi log lỗi CỤ THỂ vào file `BUGS.md`, đẩy nhánh của mày lên Git, sau đó tag người khác vào fix hộ. Đừng ngâm lỗi 1 mình hỏng cả tiến độ!

## 5. HƯỚNG DẪN SỬ DỤNG GIT (GIT CHEATSHEET)

Bắt buộc anh em phải hiểu rõ mấy lệnh này để không làm banh chành Repo:

- `git pull origin main`: Lấy code mới nhất từ server về máy. Luôn chạy trước khi code và trước khi push.
- `git pull --rebase origin main`: (**Khuyên dùng**) Giống `pull` nhưng nó sẽ nhổ các commit của mày lên, đắp code mới của người khác vào dưới, rồi đặt commit của mày lên trên cùng. Giúp lịch sử Git thẳng tắp, không bị rác (Merge branch...).
- `git diff`: Kiểm tra xem mình vừa gõ cái gì, thêm bớt dòng nào trước khi gõ `git add`. Đừng nhắm mắt add bừa bãi.
- `git log --oneline`: Xem lịch sử các commit gần nhất (ai vừa commit, nội dung là gì) một cách siêu gọn.
- `git push origin main`: Đẩy code lên server.
- `git push --force-with-lease`: **CỰC KỲ NGUY HIỂM!** Lệnh này dùng để ghi đè lịch sử Git trên server (thường xài sau khi mày dùng rebase hoặc sửa commit cũ). Bắt buộc dùng `force-with-lease` thay vì `force` (`-f`) thuần túy, vì nó sẽ cản mày lại nếu có người khác vừa push code mới lên mà mày chưa kéo về. Dùng sai là bay màu code của người khác! Tốt nhất chưa rành thì HỎI trước khi gõ lệnh này.

## QUY TẮC COMMIT CHO AI

- LUÔN DÙNG `git status` để kiểm tra tình trạng
- LUÔN COMMIT SAU KHI HOÀN THIỆN 1 TÍNH NĂNG, NẾU TÍNH NĂNG CHƯA XONG SỬA TIẾP THÌ COMMIT AMMEND NO EDIT (ĐẶC BIỆT LUÔN HỎI Ý COMMIT ĐỂ USER REVIEW TRƯỚC KHI THỰC THI)
- LUÔN DÙNG `git diff` để kiểm tra code đã thay đổi
- LUÔN DÙNG `git log --oneline` để xem lịch sử commit
- LUÔN DÙNG `git push origin main` để đẩy code lên server
- LUÔN DÙNG `git push --force-with-lease` để đẩy code lên server
- LUÔN LUÔN PUSH CODE CỦA MÌNH LÊN NHÁNH CUẢ MÌNH TRƯỚC, KHÔNG ĐƯỢC PUSH DIRECT VÀO main
