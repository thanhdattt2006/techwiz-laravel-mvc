# DANH SÁCH LỖI (BUGS TRACKER)

File này dùng để theo dõi các lỗi phát sinh trong quá trình phát triển (đặc biệt hữu ích khi làm việc nhóm và nhờ AI fix lỗi).
Yêu cầu ghi lỗi: Tóm tắt ngắn gọn nhưng PHẢI ghi cụ thể nguyên nhân/file/dòng bị lỗi.

| Trạng Thái        | Ngày phát hiện | Mô tả lỗi ngắn gọn (Chỉ rõ File/Class/Line) | Người fix / AI fix | Ghi chú / Cách giải quyết |
| :---------------- | :------------- | :------------------------------------------ | :----------------- | :------------------------ |
| `[x]` (Resolved)  | 2026-09-22     | **Lỗi UI/UX cuộn trang (Scroll Restoration)**: Khi người dùng cuộn xuống dưới ở một trang rồi chuyển sang trang/route mới, màn hình không tự động cuộn lên đầu trang mà vẫn giữ nguyên vị trí cuộn cũ (`src/routes/AppRoutes.jsx`). *(Phát hiện bởi: **Thành Đạt**)* | AI (Antigravity) | Tạo component `ScrollToTop.jsx` sử dụng `useLocation()` và hook `useEffect(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }), [pathname])`, sau đó mount trực tiếp vào `<BrowserRouter>` trong `AppRoutes.jsx`. Đã kiểm tra build thành công. |
| `[ ]` (Open)      |                |                                             |                    |                           |

