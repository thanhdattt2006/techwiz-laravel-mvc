# LUẬT LÀM VIỆC DÀNH CHO DỰ ÁN (PROJECT RULES)

# DỰ ÁN: MARKETLINK - EGREEN BASKET (TECHWIZ 7)

File này quy định luật làm việc và cách thức phối hợp giữa **Developer duy nhất (chịu trách nhiệm toàn bộ mã nguồn)**, **Team Tester (kiểm thử, rà soát nghiệp vụ, báo lỗi)** và **AI Assistant**, đảm bảo tốc độ tối đa, chất lượng code chuẩn mực và không phát sinh lỗi trong 5 ngày thi.

---

## 0. BẮT BUỘC ĐỌC VÀ TUÂN THỦ CÁC TÀI LIỆU TRONG THƯ MỤC `ai/`

Trước khi bắt tay vào code bất kỳ tính năng nào hoặc tiến hành viết test case, **BẮT BUỘC** phải đọc kỹ các tài liệu cốt lõi sau:

1. [`ai/AGENTS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/AGENTS.md):
   - Nắm rõ kiến trúc Client-Server: Backend Laravel 13 RESTful API + Frontend React Vite SPA.
   - 3 vai trò RBAC: `admin`, `farmer`, `customer`.
   - **Ràng buộc cứng SRS**: Tuyệt đối không tích hợp cổng thanh toán online (thanh toán tiền mặt tại sạp); Không làm giao hàng shipper tận nhà (khách tự đến sạp nhận pre-order).
2. [`ai/CONVENTION.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/CONVENTION.md):
   - Backend: Bắt buộc `declare(strict_types=1);` trên mọi file PHP, type hints đầy đủ, API response envelope JSON đồng nhất, chống N+1 bằng Eager Loading `with()`, Form Request validation (422), JsonResource transformation.
   - Frontend: 100% Functional Components + React Hooks, TailwindCSS, Axios Interceptors, không copy-paste logic.
3. [`ai/DATABASE_ERD.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/DATABASE_ERD.md):
   - Đối chiếu chính xác cấu trúc 18 bảng CSDL, tên cột, kiểu dữ liệu, ràng buộc khóa ngoại (Foreign Keys), default values và indexes.
4. [`ai/WORKFLOW.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/WORKFLOW.md):
   - Cỗ máy trạng thái đơn hàng (Order State Machine: `placed` -> `accepted` -> `ready_for_pickup` -> `completed` / `cancelled`).
   - Logic tự động tính khung giờ nhận hàng (Time Slots) và giờ chốt nhận đơn (Cutoff Time).
   - Cơ chế tồn kho mở bán theo tuần (Weekly Stock Rollover).
5. [`ai/PROGRESS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/PROGRESS.md):
   - Bảng theo dõi tiến độ chi tiết từng ngày (Day 0 đến Day 5). Cập nhật ngay sau khi hoàn thành từng phase.
6. [`ai/BUGS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/BUGS.md):
   - Sổ theo dõi lỗi hệ thống. Tester và Developer ghi chép ngay mọi lỗi phát sinh kèm HTTP status, response và hướng khắc phục.

---

## 1. QUY TẮC NHẬN TASK & TRIỂN KHAI

- Đầu mỗi buổi làm việc, mở file tương ứng trong thư mục [`ROADMAP/`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ROADMAP) ra để xem mục tiêu của ngày.
- Khi bắt đầu thực hiện một Phase: đánh dấu `[/]` (In progress) vào file ROADMAP và cập nhật [`ai/PROGRESS.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/PROGRESS.md).
- Làm xong và test pass: tick `[x]` và commit code ngay lập tức. Không ngâm code dồn nhiều tính năng.
- Tester bám sát các tiêu chí nghiệm thu của từng Phase trong file ROADMAP để tiến hành kiểm thử End-to-End.

## 2. QUY TẮC VIẾT CODE CƠ BẢN

- **Không vứt rác debug**: Tuyệt đối KHÔNG ĐỂ LẠI `dd()`, `dump()`, `print_r()`, `var_dump()` ở Backend hay `console.log()` ở Frontend trước khi commit. Bắt buộc rà soát sạch sẽ!
- **CSS & Giao diện**: 100% sử dụng **TailwindCSS**. Cấm viết CSS tay vào file `.css` hoặc thẻ `<style>` trừ trường hợp bất khả kháng.
- **BẢNG MÀU CHUẨN NÔNG SẢN XANH (Fresh Botanical & Harvest Gold Theme)**:
  - **Primary Brand (xanh lá nông sản tươi)**: `#16A34A` / `#198754` (Nút chính, link, navbar active, logo)
  - **Primary Tối (xanh rừng đậm)**: `#15803D` / `#146C43` (Hover nút, header, footer)
  - **Accent / Harvest (vàng cam mùa gặt)**: `#F59E0B` (Đánh giá sao, badge nổi bật, nút phụ)
  - **Produce Badge / Alert (đỏ chín)**: `#DC2626` (Ưu đãi, nhãn hết hàng, nút huỷ đơn)
  - **Nền sáng sinh thái (Light Eco BG)**: `#F8FAF6` (Background toàn bộ trang web)
  - **Card**: `#FFFFFF` (Card nông sản, form đặt hàng)
  - **Chữ chính**: `#0F172A` / `#1E293B` (Body text, tiêu đề)
  - **Chữ phụ**: `#475569` / `#64748B` (Mô tả xuất xứ, placeholder)
  - **Viền mềm**: `#E2E8DF` (Border mềm ô liu)
- **KHÔNG LÀM DARK/LIGHT THEME**: Cố định duy nhất 1 giao diện nền sáng tươi mát (`#F8FAF6`), tuyệt đối không tốn thời gian viết toggle dark mode.
- **Tuân thủ CONVENTION.md**: Đọc kỹ [`ai/CONVENTION.md`](file:///c:/Users/Dave/Desktop/Aptech/my-project/Laravel_MVC/ai/CONVENTION.md) về cách đặt tên biến, tên hàm, bắt buộc khai báo `declare(strict_types=1);`. Code không chuẩn quy cách sẽ bị yêu cầu refactor lại.

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

## 6. QUY TẮC COMMIT CHO AI

- LUÔN DÙNG `git status` để kiểm tra tình trạng
- LUÔN COMMIT SAU KHI HOÀN THIỆN 1 TÍNH NĂNG, NẾU TÍNH NĂNG CHƯA XONG SỬA TIẾP THÌ COMMIT AMMEND NO EDIT (ĐẶC BIỆT LUÔN HỎI Ý COMMIT ĐỂ USER REVIEW TRƯỚC KHI THỰC THI)
- LUÔN DÙNG `git diff` để kiểm tra code đã thay đổi
- LUÔN DÙNG `git log --oneline` để xem lịch sử commit
- LUÔN DÙNG `git push origin main` để đẩy code lên server
- LUÔN DÙNG `git push --force-with-lease` để đẩy code lên server
- LUÔN LUÔN PUSH CODE CỦA MÌNH LÊN NHÁNH CUẢ MÌNH TRƯỚC, KHÔNG ĐƯỢC PUSH DIRECT VÀO main
