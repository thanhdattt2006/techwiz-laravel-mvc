# 📊 ROADMAP_TEST: KẾ HOẠCH XÂY DỰNG & KIỂM THỬ ADMIN DASHBOARD
## (PHIÊN BẢN FRONTEND THUẦN: HTML + TAILWIND CSS + MODULAR JAVASCRIPT)

> **Mục tiêu**: Xây dựng một trang Dashboard Quản trị (Admin Panel) độc lập bằng **HTML, TailwindCSS và JavaScript thuần dạng Modular (ES Modules)**.
> **Nguyên tắc cốt lõi**:
> - **SOLID Principles**: Mỗi file/class/module chỉ làm duy nhất MỘT nhiệm vụ (Single Responsibility). Phân tách rõ ràng giữa Data Store, Services, Modules điều khiển giao diện và Configs.
> - **D.R.Y (Don't Repeat Yourself)**: Tuyệt đối không lặp lại code, đóng gói các hàm tái sử dụng (SweetAlert2 wrappers, Table helpers, Storage helpers).
> - **Cấu Trúc Tách File Chuyên Nghiệp**: Tuyệt đối **KHÔNG dồn code vào 1 file duy nhất**. Toàn bộ cấu trúc được bóc tách khoa học theo chuẩn kiến trúc Frontend hiện đại.

---

## 📁 1. Kiến Trúc Thư Mục & Phân Tách File (SOLID & DRY Architecture)

```
admin-dashboard-ui-test/
├── index.html                         # Khung HTML chính (Semantic Layout, kết nối các module)
├── ROADMAP_TEST.md                    # Tài liệu đặc tả kỹ thuật và lộ trình test
├── css/
│   └── styles.css                     # Custom animations, scrollbar mềm, print styles
└── js/
    ├── app.js                         # Điểm khởi động (Entrypoint) điều phối toàn bộ ứng dụng
    │
    ├── config/                        # Cấu hình tĩnh (Single Responsibility)
    │   ├── theme.config.js            # Cấu hình màu sắc, dark/light mode tokens
    │   └── chart.config.js            # Cấu hình biểu đồ Chart.js (options, fonts, tooltips)
    │
    ├── data/                          # Lớp dữ liệu (Data Layer / Mock Store)
    │   ├── mock-stats.js              # Dữ liệu 4 thẻ KPI và số liệu sparklines
    │   ├── mock-charts.js             # Dữ liệu biểu đồ Area & Donut theo các mốc thời gian
    │   ├── mock-users.js              # Danh sách bản ghi quản lý (Users/Items) cho bảng dữ liệu
    │   └── mock-activities.js         # Danh sách sự kiện timeline gần đây
    │
    ├── services/                      # Lớp dịch vụ tiện ích dùng chung (DRY)
    │   ├── storage.service.js         # Thao tác đọc/ghi an toàn với localStorage
    │   ├── event-bus.js               # Quản lý phát/nhận sự kiện giữa các module
    │   └── api.service.js             # Giả lập request AJAX bất đồng bộ kèm NProgress bar
    │
    ├── components/                    # Các thành phần giao diện tái sử dụng (HTML Template Generators)
    │   ├── stat-card.component.js     # Component render thẻ KPI kèm mini sparkline
    │   ├── user-row.component.js      # Component render dòng bản ghi trong Data Table
    │   ├── status-badge.component.js  # Component render Pill Badge trạng thái
    │   └── activity-item.component.js # Component render một dòng sự kiện timeline
    │
    └── modules/                       # Lớp điều khiển nghiệp vụ giao diện (UI Controllers)
        ├── theme.module.js            # Quản lý chuyển đổi chế độ Sáng / Tối (Dark/Light)
        ├── sidebar.module.js          # Quản lý thu gọn Sidebar, Mobile Drawer, Accordion
        ├── alert.module.js            # Quản lý SweetAlert2 (Toast, Alert modal, Confirm action)
        ├── chart.module.js            # Quản lý khởi tạo & update Chart.js, xuất ảnh Canvas
        ├── table.module.js            # Quản lý tìm kiếm debounce, lọc tabs, phân trang, bulk actions
        ├── modal.module.js            # Quản lý mở/đóng Modal thêm mới & Slide-over xem chi tiết
        └── shortcut.module.js         # Quản lý phím tắt trợ năng (Ctrl+K, Esc, Shift+N)
```

---

## 🎨 2. Hệ Thống Thiết Kế & Bảng Màu (Design System & Color Palette)

Giao diện sử dụng 100% **TailwindCSS**, áp dụng nguyên tắc thiết kế hiện đại: tối giản, tương phản nhẹ nhàng, không dùng các màu gốc chói lắt.

### 2.1. Bảng Màu Giao Diện (UI Theme Palette)

| Thành Phần | Mã Màu Tailwind Khuyên Dùng (Light Mode) | Mã Màu Dark Mode | Ý Nghĩa / Mục Đích Trực Quan |
| :--- | :--- | :--- | :--- |
| **Nền Toàn Trang (App Background)** | `bg-slate-50` (`#f8fafc`) | `dark:bg-slate-950` | Tạo cảm giác nhẹ nhàng, dễ chịu khi nhìn lâu |
| **Bề Mặt Thẻ (Cards & Containers)** | `bg-white` viền `border-slate-200/80` | `dark:bg-slate-900 dark:border-slate-800` | Tách bạch nội dung với đổ bóng mềm `shadow-sm` |
| **Sidebar Nền Tối Lịch Lãm** | `bg-slate-900` text `text-slate-300` | `dark:bg-slate-900 dark:border-r dark:border-slate-800` | Phong cách chuyên nghiệp, tập trung thị giác vào nội dung chính |
| **Màu Nhấn Chính (Primary Accent)** | `bg-indigo-600` hover `bg-indigo-700` | `dark:bg-indigo-500 dark:hover:bg-indigo-600` | Hiện đại, sang trọng, thường dùng cho nút CTA, link active |
| **Thành Công (Success Badge / Stat)** | `bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20` | `dark:bg-emerald-950/50 dark:text-emerald-400` | Dịu mắt, báo trạng thái Hoạt động, Đã thanh toán, Tăng trưởng dương |
| **Chờ Xử Lý (Warning / Pending)** | `bg-amber-50 text-amber-700 ring-1 ring-amber-600/20` | `dark:bg-amber-950/50 dark:text-amber-400` | Báo trạng thái Đang chờ duyệt, Đơn mới, Tạm hoãn |
| **Nguy Hiểm / Huỷ (Danger / Error)** | `bg-rose-50 text-rose-700 ring-1 ring-rose-600/20` | `dark:bg-rose-950/50 dark:text-rose-400` | Dành cho nút Xoá, Khoá tài khoản, Báo lỗi |
| **Trung Tính (Neutral / Draft)** | `bg-slate-100 text-slate-700 ring-1 ring-slate-600/20` | `dark:bg-slate-800 dark:text-slate-400` | Dành cho bản nháp, ẩn, không hoạt động |

### 2.2. Bảng Màu Trực Quan Hóa & Biểu Đồ (Chart.js & Canvas Palette)

| Mục Đích | Mã Màu HEX / Gradient | Ý Nghĩa |
| :--- | :--- | :--- |
| **Doanh Thu (Revenue Line)** | `#6366f1` (Indigo 500) | Đường cong mềm, đổ bóng gradient chuyển từ `rgba(99, 102, 241, 0.2)` về trong suốt |
| **Đơn Hàng / Tăng Trưởng (Orders Line)** | `#10b981` (Emerald 500) | Đường xanh thể hiện chỉ số tăng trưởng dương |
| **Cơ Cấu Danh Mục (Donut Slices)** | `#6366f1`, `#0ea5e9`, `#f59e0b`, `#10b981` | 4 mảng màu pastel tương phản dịu |
| **Đường Lưới Trục Toạ Độ (Gridlines)** | `rgba(226, 232, 240, 0.7)` | Lưới mờ tinh tế, không gây rối mắt |
| **Custom Tooltip Chart** | `bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700/50` | Hộp thông tin nổi bật khi hover vào điểm mốc |

---

## 🧱 3. Cấu Trúc Khung Sườn Giao Diện (Layout Architecture)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. TOPBAR: [☰ Thu gọn]  [🔍 Tìm kiếm nhanh (Ctrl+K)]   [🌓 Mode]  [🔔 (3)]  [👤 Admin ▾]│
├──────────────┬──────────────────────────────────────────────────────────────────────────┤
│ 2. SIDEBAR   │ 3. BREADCRUMBS & PAGE HEADER: Tiêu đề trang + [📥 Xuất Báo Cáo] + [➕ Mới]│
│              ├──────────────────────────────────────────────────────────────────────────┤
│  Logo Admin  │ 4. KPI STAT CARDS: (4 Thẻ thống kê kèm mini Sparkline Canvas biểu đồ)     │
│  ──────────  ├──────────────────────────────────────────┬───────────────────────────────┤
│  • Tổng quan │ 5. ANALYTICS AREA CHART (Chart.js)       │ 6. DONUT / RECENT FEED        │
│  • Khách hàng│    - Toggle: [7 Ngày] [30 Ngày] [1 Năm]  │    - Donut: Tỷ lệ danh mục    │
│  • Sản phẩm  │    - AJAX nạp data không reload          │    - Timeline hoạt động nhanh │
│  • Đơn hàng  │    - [📷 Tải ảnh biểu đồ Canvas]         │                               │
│  • Báo cáo   ├──────────────────────────────────────────┴───────────────────────────────┤
│  • Cài đặt   │ 7. QUICK FILTER TABS: [Tất cả (50)]  [Hoạt động (38)]  [Chờ duyệt (8)]   │
│  ──────────  ├──────────────────────────────────────────────────────────────────────────┤
│  [🚪 Logout] │ 8. INTERACTIVE DATA TABLE:                                               │
│              │    [Tìm kiếm tức thì] [Lọc vai trò ▾] [Cột hiển thị ▾]                   │
│              │    [x] Checkbox | Avatar + Tên + Email | Vai trò | Status Pill | Action  │
│              │    - Dòng trống: Empty State Card đẹp mắt                                │
│              │    - Dòng đang tải: Skeleton Loading nhấp nháy                           │
│              ├──────────────────────────────────────────────────────────────────────────┤
│              │ 9. FLOATING BULK ACTIONS BAR: (Hiện khi chọn ≥ 1 dòng)                   │
│              │    "Đã chọn 3 mục" -> [Đổi trạng thái ▾]  [Xuất file]  [🗑️ Xoá hàng loạt]│
│              ├──────────────────────────────────────────────────────────────────────────┤
│              │ 10. FOOTER ADMIN: Phân trang trang nhã & Trạng thái Server OK            │
└──────────────┴──────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 4. Lộ Trình Triển Khai Chi Tiết Từng Module (SOLID Roadmap)

### Bước 1: Khởi Tạo Lớp Dữ Liệu (Data Layer)
- [ ] `data/mock-stats.js`: Xuất dữ liệu tĩnh cho 4 thẻ KPI (Doanh thu, Người dùng, Đơn hàng, Tỷ lệ) và mảng số liệu cho mini sparklines.
- [ ] `data/mock-charts.js`: Xuất dữ liệu biểu đồ Revenue (theo 7D, 30D, 1Y) và dữ liệu cơ cấu Donut chart.
- [ ] `data/mock-users.js`: Xuất danh sách 15-20 người dùng mẫu với đầy đủ avatar, tên, email, vai trò, trạng thái, ngày tạo.
- [ ] `data/mock-activities.js`: Xuất danh sách 5 sự kiện hoạt động gần nhất.

### Bước 2: Khởi Tạo Lớp Dịch Vụ Dùng Chung (Services Layer)
- [ ] `services/storage.service.js`: Wrapper an toàn cho `localStorage` (hỗ trợ get, set, remove với JSON parse).
- [ ] `services/event-bus.js`: Hệ thống Event Bus đơn giản cho phép các module giao tiếp không phụ thuộc lẫn nhau (Loose Coupling).
- [ ] `services/api.service.js`: Giả lập độ trễ mạng (`async/await` với `setTimeout`), tự động kích hoạt thanh tiến trình `NProgress`.

### Bước 3: Khởi Tạo Lớp Thành Phần Giao Diện (Components Layer)
- [ ] `components/status-badge.component.js`: Hàm nhận vào trạng thái (`active`, `pending`, `blocked`) và trả về chuỗi HTML Pill Badge Tailwind chuẩn.
- [ ] `components/stat-card.component.js`: Hàm nhận dữ liệu KPI và trả về chuỗi HTML thẻ thống kê kèm canvas sparkline.
- [ ] `components/user-row.component.js`: Hàm nhận dữ liệu người dùng và trả về `<tr>...</tr>` với checkbox, avatar, thông tin và nút action.
- [ ] `components/activity-item.component.js`: Hàm render một timeline node sự kiện.

### Bước 4: Khởi Tạo Lớp Điều Khiển Giao Diện (UI Modules)
- [ ] `modules/theme.module.js`: Bắt sự kiện nút ☀️/🌙, toggle class `dark` trên thẻ `<html>`, lưu cấu hình vào `storage.service.js`.
- [ ] `modules/sidebar.module.js`: Điều khiển mở/đóng Sidebar trên Desktop và Drawer trượt trên Mobile khi bấm Hamburger.
- [ ] `modules/alert.module.js`: Đóng gói SweetAlert2:
  - `showToast(type, message)`: Toast góc trên bên phải, tự tắt sau 3s.
  - `confirmAction(options)`: Popup xác nhận thao tác xoá / hành động nguy hiểm.
- [ ] `modules/chart.module.js`:
  - Khởi tạo Main Area Line Chart bằng `Chart.js` với gradient mờ.
  - Khởi tạo Donut Chart với tổng số đơn ở giữa tâm.
  - Khởi tạo 4 mini Sparkline canvas trên thẻ KPI.
  - Xử lý đổi thời gian [7D] [30D] [1Y] gọi `api.service.js` và `chart.update()`.
  - Xử lý xuất ảnh Canvas ra file PNG (`toDataURL`).
- [ ] `modules/table.module.js`:
  - Lọc dữ liệu theo tab trạng thái (`all`, `active`, `pending`, `blocked`).
  - Tìm kiếm real-time với debounce 300ms.
  - Phân trang dữ liệu (Pagination).
  - Checkbox chọn tất cả / chọn từng dòng.
  - Hiển thị Floating Bulk Actions Bar khi có ≥ 1 bản ghi được chọn.
  - Xoá bản ghi đơn lẻ hoặc xoá hàng loạt có xác nhận SweetAlert2.
- [ ] `modules/modal.module.js`:
  - Mở/đóng Modal thêm mới bản ghi kèm backdrop blur.
  - Mở/đóng Slide-over Drawer xem chi tiết bản ghi (Offcanvas trượt từ mép phải).
- [ ] `modules/shortcut.module.js`: Bắt phím tắt `Ctrl + K` (Focus tìm kiếm), `Esc` (Đóng modal/drawer), `Shift + N` (Thêm mới).

### Bước 5: Lắp Ráp Khung Giao Diện Chính (`index.html`) & Entrypoint (`js/app.js`)
- [ ] `index.html`: Khung HTML5 chuẩn ngữ nghĩa (Semantic HTML) nhúng Tailwind CSS, Chart.js, SweetAlert2, NProgress qua CDN.
- [ ] `css/styles.css`: Các animation tinh tế, custom scrollbar mỏng nhẹ, styles cho chế độ in (`@media print`).
- [ ] `js/app.js`: Import toàn bộ các module và kích hoạt theo luồng logic tuần tự.

---

## ✅ 5. Tiêu Chuẩn Nghiệm Thu (Definition of Done)
1. **Tuyệt đối không có file nguyên khối (No Monolithic Code)**: Mỗi file giữ một trách nhiệm duy nhất, ngắn gọn, dễ đọc, dễ bảo trì.
2. **Tuân thủ SOLID & DRY**: Tái sử dụng components, services dùng chung; thay đổi một tính năng không làm gãy các tính năng khác.
3. **Trải nghiệm mượt mà**: Toàn bộ tính năng (biểu đồ, bảng, modal, drawer, phím tắt) hoạt động trơn tru 100% trên trình duyệt.
4. **Responsive chuẩn chỉnh**: Co giãn hoàn hảo từ Mobile (375px) đến Desktop màn hình rộng.
