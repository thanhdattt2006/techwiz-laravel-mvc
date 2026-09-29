# MarketLink – eGreen Basket Marketplace Portal (TechWiz 7)

**Slogan**: *Farm Fresh Just a Click Away*
**Theme**: **eGreen Basket** – Farm produce marketplace connecting local farmers markets & shoppers
**Architecture**: Decoupled Client-Server (Laravel 13 RESTful API + React 19 SPA)

| Layer | Technology | Deployment |
|---|---|---|
| Backend API | PHP 8.4 + Laravel 13 + Sanctum | Render.com (Docker) |
| Frontend SPA | React 19 + Vite + TailwindCSS | Vercel |
| Database | MySQL 8.0+ · Aiven Cloud · 18 tables | Aiven Cloud |

---

## ⚠️ Mandatory Guidelines (Read Before Coding)

All developers, testers and AI assistants **MUST** read and strictly follow:

| File | Purpose |
|---|---|
| [`RULE.md`](RULE.md) | Working rules, Git Conventional Commits, no debug leftovers |
| [`ai/CONVENTION.md`](ai/CONVENTION.md) | SOLID, DRY, strict_types=1, JSON envelope, anti-N+1, FormRequest |
| [`ai/DATABASE_ERD.md`](ai/DATABASE_ERD.md) | ERD of all 18 tables + full Data Dictionary |
| [`ai/WORKFLOW.md`](ai/WORKFLOW.md) | Business workflows, Order State Machine, Time Slot & Cutoff logic |
| [`ai/AGENTS.md`](ai/AGENTS.md) | AI technical guide, hard SRS constraints (no online payment, no delivery) |
| [`ai/PROGRESS.md`](ai/PROGRESS.md) | Day-by-day progress tracker |
| [`ai/BUGS.md`](ai/BUGS.md) | Bug tracking log |

---

## 📂 Project Structure

```
Laravel_MVC/
├── backend/                           Laravel 13 RESTful API
│   ├── app/
│   │   ├── Http/Controllers/Api/V1/   14 API Controllers
│   │   │   ├── AuthController.php         MarketController.php
│   │   │   ├── ProductController.php      OrderController.php
│   │   │   ├── ReviewController.php       CartController.php
│   │   │   ├── FarmerController.php       CategoryController.php
│   │   │   ├── AdminController.php        ContactController.php
│   │   │   ├── NotificationController.php FavoriteController.php
│   │   │   ├── AnnouncementController.php WeeklyStockController.php
│   │   ├── Http/Requests/             18 FormRequest validation classes
│   │   ├── Http/Resources/            15 JsonResource transformation classes
│   │   ├── Http/Middleware/           RoleMiddleware, EnsureFarmerActive,
│   │   │                              EnsureAccountActive
│   │   ├── Models/                    17 Eloquent Models
│   │   │   ├── User.php  Farmer.php  Market.php  Product.php
│   │   │   ├── Order.php  OrderItem.php  Review.php  Cart.php
│   │   │   ├── CartItem.php  Category.php  FarmerMarket.php
│   │   │   ├── MarketSchedule.php  WeeklyStockTemplate.php
│   │   │   ├── Favorite.php  Notification.php  Announcement.php
│   │   │   └── ContactMessage.php
│   │   └── Services/                  7 Service classes
│   │       ├── PreOrderCheckoutService.php
│   │       ├── TimeSlotGeneratorService.php
│   │       ├── RatingCalculationService.php
│   │       ├── FarmerOrderService.php
│   │       ├── CustomerOrderService.php
│   │       ├── AdminAnalyticsService.php
│   │       └── FarmerMarketService.php
│   ├── routes/api.php                 All /api/v1/ endpoints
│   ├── database/
│   │   ├── migrations/                18 migration files (000001..000018)
│   │   └── seeders/                   11 modular seeders
│   │       ├── UserSeeder.php         MarketSeeder.php    FarmerSeeder.php
│   │       ├── CategorySeeder.php     ProductSeeder.php   OrderSeeder.php
│   │       ├── ReviewSeeder.php       NotificationSeeder.php
│   │       ├── AnnouncementSeeder.php ContactMessageSeeder.php
│   │       └── DatabaseSeeder.php     (orchestrator)
│   └── Dockerfile                     PHP 8.4 container for Render.com
│
├── frontend/                          React 19 + Vite SPA
│   ├── src/
│   │   ├── api/                       15 API service modules
│   │   │   ├── axiosClient.js         authApi.js   marketApi.js
│   │   │   ├── productApi.js          orderApi.js  reviewApi.js
│   │   │   ├── cartApi.js             farmerApi.js adminApi.js
│   │   │   ├── categoryApi.js         contactApi.js favoriteApi.js
│   │   │   ├── notificationApi.js     weeklyStockApi.js  index.js
│   │   ├── components/
│   │   │   ├── common/                ProductCard, MarketCard, StatusBadge,
│   │   │   │                          FilterSidebar, RatingStars, Modal, ScrollToTop
│   │   │   └── layout/                PublicNavbar, PublicFooter,
│   │   │                              AdminLayout, FarmerLayout, CustomerLayout
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        Global auth state (user, token, role)
│   │   │   ├── CartContext.jsx        Global cart state + CartDrawer
│   │   │   └── ModalContext.jsx       React Portal modal system
│   │   ├── pages/
│   │   │   ├── public/                HomePage, MarketsPage, ProductsPage,
│   │   │   │                          ProductDetailPage, AboutPage, FeedbackPage,
│   │   │   │                          ContactPage, SitemapPage,
│   │   │   │                          OrderPickupTrackerPage, NotFoundPage
│   │   │   ├── auth/                  LoginPage, RegisterPage,
│   │   │   │                          ForgotPasswordPage, UnauthorizedPage
│   │   │   ├── admin/                 AdminDashboard
│   │   │   │                          (tabs: Markets, Vendors, Users,
│   │   │   │                           Reviews, Messages, Reports & Analytics)
│   │   │   ├── farmer/                FarmerDashboard
│   │   │   │                          (tabs: Pre-Order Queue, Weekly Stock,
│   │   │   │                           Markets Config, Reviews, Settings)
│   │   │   └── customer/              CustomerDashboard, CustomerOrdersPage,
│   │   │                              CustomerProfilePage
│   │   └── routes/
│   │       ├── AppRoutes.jsx          Full router with React.lazy + Suspense
│   │       └── ProtectedRoute.jsx     RBAC HOC (admin / farmer / customer)
│   ├── vercel.json                    SPA routing rewrite: /* -> /index.html
│   └── package.json                   react-router-dom, axios, lucide-react,
│                                       chart.js, tailwindcss
│
├── ai/                                Architecture docs & conventions
│   ├── AGENTS.md                      AI guide & tech stack overview
│   ├── CONVENTION.md                  Code standards (SOLID, DRY, Clean Code)
│   ├── DATABASE_ERD.md                ERD 18 tables + full Data Dictionary
│   ├── WORKFLOW.md                    Business workflows, Order State Machine
│   ├── PROGRESS.md                    Day-by-day progress (Day 0 to Day 5)
│   └── BUGS.md                        Bug tracker log
│
├── ROADMAP/                           5-day competition roadmap
│   ├── Day0_Setup_DB_Deploy.md
│   ├── Day1_Analysis_Database_Design.md
│   ├── Day2_Models_Migrations.md
│   ├── Day3_Controllers_Core_Logic.md
│   ├── Day4_Views_Frontend.md
│   └── Day5_Testing_Polish.md
│
├── Document.txt                       Project documentation (Word report source)
├── render.yaml                        Render.com IaC configuration
├── RULE.md                            Team working rules & Git conventions
└── README.md                          This file
```

---

## 🗺️ API Route Tree (`/api/v1/`)

```
/api/v1/
|
|-- [PUBLIC] No authentication required
|   POST /auth/register                    Register customer (phone + address required)
|   POST /auth/register-farmer             Register farmer stall (status = pending)
|   POST /auth/login                       Login -> Sanctum token + user role
|   GET  /markets                          Markets directory (filter: day, GPS coords)
|   GET  /markets/{id}                     Market detail + schedules + active stalls
|   GET  /farmers                          Public farmer stall listing
|   GET  /farmers/{id}                     Stall detail + produce catalog + reviews
|   GET  /categories                       5 produce categories
|   GET  /products                         Catalog (filter: category, price, stall, search)
|   GET  /products/{id}                    Product detail + reviews
|   GET  /reviews/product/{productId}      Product reviews + farmer replies
|   GET  /reviews/farmer/{farmerId}        Farmer stall reviews
|   GET  /announcements/active             Active platform announcements
|   POST /contact                          Submit contact / feedback message
|   GET  /orders/track/{orderCode}         Public order progress tracker
|
|-- [SHARED PROTECTED] auth:sanctum
|   GET    /auth/me                        Current user info + farmer profile
|   PUT    /auth/profile                   Update personal information
|   PUT    /auth/change-password           Change password
|   POST   /auth/logout                    Revoke Bearer token
|   GET    /notifications                  In-app notifications (+ unread_count)
|   PATCH  /notifications/{id}/read        Mark single notification read
|   PATCH  /notifications/read-all         Mark all notifications read
|
|-- [CUSTOMER] auth:sanctum + role:customer
|   GET    /cart                           Cart grouped by farmer stall
|   POST   /cart/items                     Add item to cart
|   PUT    /cart/items/{id}                Update item quantity
|   DELETE /cart/items/{id}                Remove single item
|   DELETE /cart/clear                     Clear entire cart
|   POST   /orders/checkout                Place pre-order (auto-split by stall, DB Transaction)
|   GET    /orders/my-orders               Order history
|   GET    /orders/my-orders/{id}          Single order detail
|   PATCH  /orders/{id}/cancel             Cancel order before cutoff_at (stock restored)
|   POST   /reviews                        Submit 1-5 star review (XOR: farmer OR product)
|   GET    /favorites                      Favorites list (markets, stalls, products)
|   POST   /favorites/toggle               Toggle favorite (add / remove)
|
|-- [FARMER] auth:sanctum + role:farmer + EnsureFarmerActive
|   GET    /farmer/dashboard-stats         Stall stats (orders, revenue estimate)
|   GET    /farmer/profile                 View stall profile
|   PUT    /farmer/profile                 Update stall profile
|   GET    /farmer/markets                 Markets stall is registered at
|   POST   /farmer/markets                 Register stall at new market
|   PUT    /farmer/markets/{marketId}      Configure stall: pickup days, slots, cutoff
|   DELETE /farmer/markets/{marketId}      Withdraw stall from market
|   GET    /farmer/products                Manage stall products
|   POST   /farmer/products                Create product
|   PUT    /farmer/products/{id}           Update product
|   DELETE /farmer/products/{id}           Soft-delete product
|   GET    /farmer/products/{id}/template  View weekly stock template
|   PUT    /farmer/products/{id}/template  Configure weekly stock (Sat / Sun quantities)
|   POST   /farmer/apply-weekly-templates  1-Click apply stock templates for next session
|   GET    /farmer/orders                  Incoming pre-order queue
|   PATCH  /farmer/orders/{id}/accept      Accept pre-order
|   PATCH  /farmer/orders/{id}/decline     Decline pre-order (+ reason, stock restored)
|   PATCH  /farmer/orders/{id}/ready       Mark produce ready at stall
|   PATCH  /farmer/orders/{id}/complete    Confirm customer collected & paid cash
|   POST   /farmer/reviews/{id}/reply      Reply to product review
|
`-- [ADMIN] auth:sanctum + role:admin
    GET    /admin/stats/overview           Platform KPI report
    GET    /admin/users                    All users management
    PATCH  /admin/users/{id}/status        Lock / unlock account
    GET    /admin/farmers/pending          Pending stall applications
    PATCH  /admin/farmers/{id}/approve     Approve farmer stall
    PATCH  /admin/farmers/{id}/reject      Reject farmer stall
    POST   /admin/markets                  Add market
    PUT    /admin/markets/{id}             Update market
    DELETE /admin/markets/{id}             Soft-delete market
    POST   /admin/categories               Add category
    PUT    /admin/categories/{id}          Update category
    PATCH  /admin/products/{id}/toggle-hide  Hide / show violating product
    PATCH  /admin/reviews/{id}/toggle-hide   Hide / show inappropriate review
    GET    /admin/announcements            Manage announcements
    POST   /admin/announcements            Create announcement (target: all/farmer/customer)
    PUT    /admin/announcements/{id}       Edit announcement
    DELETE /admin/announcements/{id}       Delete announcement
    GET    /admin/inquiries                Admin inquiry inbox
    PATCH  /admin/inquiries/{id}/read      Mark inquiry as handled
```

---

## 🗄️ Database – 18 Tables

| # | Table | Description |
|---|---|---|
| 1 | `users` | All accounts: admin, farmer, customer. role ENUM, status ENUM, SoftDeletes |
| 2 | `personal_access_tokens` | Sanctum Bearer tokens for REST API auth |
| 3 | `markets` | Farmers market directory. GPS coords, map embed URL. SoftDeletes |
| 4 | `market_schedules` | Weekly operating hours per market (0=Sun … 6=Sat) |
| 5 | `farmers` | Stall profiles 1-1 with users. avg_rating, review_count. SoftDeletes |
| 6 | `farmer_markets` | Stall to Market link. pickup_days JSON, slot_minutes, cutoff_hours |
| 7 | `categories` | 5 produce categories (vegetables, fruits, dairy, bakery, pantry/honey) |
| 8 | `products` | Farm produce listings. price, stock_quantity, availability ENUM, FULLTEXT. SoftDeletes |
| 9 | `weekly_stock_templates` | Recurring stock quantities per day-of-week for 1-Click reset |
| 10 | `carts` | Shopping cart 1-1 with users |
| 11 | `cart_items` | Individual items in cart |
| 12 | `orders` | Pre-orders. order_code UNIQUE (ML-YYYY-F##-####), pickup slot, cutoff_at, status ENUM |
| 13 | `order_items` | Price & name snapshot at checkout time (immutable price history) |
| 14 | `favorites` | Polymorphic favorites: farmer / product / market |
| 15 | `reviews` | 1-5 star ratings. XOR constraint: farmer_id OR product_id. farmer_reply. SoftDeletes |
| 16 | `notifications` | In-app alerts triggered by order status events |
| 17 | `announcements` | Admin platform-wide broadcasts (target_role: all / farmer / customer) |
| 18 | `contact_messages` | Public contact form & feedback inbox for Admin |

**Migration safe execution order**: users -> personal_access_tokens -> markets -> market_schedules -> farmers -> farmer_markets -> categories -> products -> weekly_stock_templates -> carts -> cart_items -> orders -> order_items -> favorites -> reviews -> notifications -> announcements -> contact_messages

---

## 🚀 Local Development Setup

### System Requirements
- PHP >= 8.4 (extensions: pdo_mysql, mbstring, openssl, xml, zip)
- Composer >= 2.x
- Node.js >= 20.x + npm >= 10.x
- MySQL >= 8.0 (or Aiven Cloud MySQL account)
- Git

### 1. Backend (Laravel REST API)

```bash
cd backend

# Install PHP dependencies
composer install

# Configure environment
cp .env.example .env
# Edit .env: set DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD
# Set SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173

# Generate application key
php artisan key:generate

# Run 18 migrations + seed all demo data (11 seeders)
php artisan migrate:fresh --seed

# Start API server -> http://127.0.0.1:8000
php artisan serve

# (Optional) Run full test suite
php artisan test
# Expected: 177 tests, 1,271 assertions, 100% PASSED
```

### 2. Frontend (React + Vite SPA)

```bash
cd frontend

# Install JavaScript dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1" > .env.local

# Start Vite dev server -> http://localhost:5173
npm run dev

# (Optional) Production build
npm run build
# Output: frontend/dist/
# Build time: ~707ms | Initial bundle: 92.74 kB (vs 1,057 kB before optimization)
```

### 3. Access the Application

| Service | URL |
|---|---|
| Frontend SPA | http://localhost:5173 |
| Backend API | http://127.0.0.1:8000/api/v1 |
| API Health Check | GET http://127.0.0.1:8000/api/v1/categories |

### CORS Configuration (if CORS errors appear)

Open `backend/config/cors.php` and ensure:
```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
],
```

---

## 🔑 Demo Login Credentials

> All demo accounts use password: **`password123`**
> Login page (local): **http://localhost:5173/login**

| Role | Email | Password | Notes |
|---|---|---|---|
| **Admin** | `admin@marketlink.com` | `password123` | Full platform management rights |
| **Farmer** | `farmer@marketlink.com` | `password123` | Green Valley Organics · **Active** |
| **Farmer** | `sarah@marketlink.com` | `password123` | Sunny Meadow Dairy & Apiary · **Active** |
| **Farmer** | `robert@marketlink.com` | `password123` | Prairie Roots Microgreens · **Pending** approval |
| **Customer** | `customer@marketlink.com` | `password123` | David Miller · has sample orders in all 4 statuses |

After login, the system automatically redirects by role:
- Admin → `/admin/dashboard`
- Farmer → `/farmer/dashboard`
- Customer → `/user/dashboard`

> 💡 **1-Click Demo Login** buttons on the Login page let you log in instantly without typing credentials (dev environment only).

---

## 📊 Quality & Performance Metrics

| Metric | Result |
|---|---|
| Backend tests | **177** Feature + Unit tests |
| Assertions | **1,271** total assertions |
| Pass rate | **100%** (0 failures, 0 errors) |
| N+1 queries | **0** – verified by `ZeroNPlusOneIntegrationTest.php` |
| Debug artifacts | **0** – no `dd()`, `dump()`, or `console.log()` |
| Initial JS bundle | **92.74 kB** (91.2% reduction from 1,057 kB via `React.lazy`) |
| Production build | **707 ms** |
| Files over 230 lines (FE) | **0** – all files < 230 lines (SRP enforced) |
| Files over 200 lines (BE) | **0** – all files < 200 lines (SRP enforced) |

---

## 🔒 Core Business Constraints (SRS TechWiz 7)

| Constraint | Detail |
|---|---|
| ❌ No online payment | Customers pay **cash at the stall** on pickup. No Stripe / PayPal / VNPay. |
| ❌ No home delivery | Customers **come to the farmers market stall** to collect their produce. |
| ✅ Pre-order for pickup | Reserve produce online → pick up at selected time slot on market day. |
| ✅ 3-role RBAC | `admin` · `farmer` · `customer` – enforced by Sanctum + RoleMiddleware. |
| ✅ Single light theme | Fresh Botanical `#F8FAF6` background. No dark mode toggle. |
| ✅ 100% English source code | All code, comments, API messages, and test descriptions in English. |

---

## 🛠️ Full Tech Stack

### Backend
| Technology | Version / Detail |
|---|---|
| PHP | 8.4 – `strict_types=1`, typed properties, property hooks |
| Laravel | 13 – RESTful API, JSON-only responses, Sanctum |
| Laravel Sanctum | Token-based API authentication (Bearer) |
| Eloquent ORM | 1-1, 1-N, N-N, Polymorphic, SoftDeletes, Eager Loading |
| MySQL | 8.0+ on Aiven Cloud – FULLTEXT, JSON columns, CHECK constraints |
| PHPUnit | 177 Feature & Unit tests – 100% pass |
| Docker | PHP 8.4 container |
| render.yaml | Infrastructure as Code (IaC) for Render.com |

### Frontend
| Technology | Version / Detail |
|---|---|
| React | 19 – Functional Components, Hooks (useState, useEffect, useContext, useCallback, useMemo) |
| Vite | Latest – build tool, HMR, `manualChunks` vendor splitting |
| TailwindCSS | 100% utility-first, Fresh Botanical & Harvest Gold design system |
| Axios | HTTP client with Bearer token interceptor |
| React Router DOM | SPA client-side routing with `React.lazy` + `Suspense` |
| Chart.js (`chart.js/auto`) | Line, Doughnut, Bar charts for Admin Analytics |
| Lucide React | Icon library |
| Google Maps Embed | Market location map (< 200ms via Edge CDN) |

---

## 📝 Team Working Rules

- Read [`RULE.md`](RULE.md) **before** writing any code or making commits.
- Update [`ai/PROGRESS.md`](ai/PROGRESS.md) after completing each phase.
- Follow all conventions in [`ai/CONVENTION.md`](ai/CONVENTION.md).
- Consult [`ai/DATABASE_ERD.md`](ai/DATABASE_ERD.md) before touching any DB table.
- Log every bug in [`ai/BUGS.md`](ai/BUGS.md) with file/line reference.
- Git commits: **English only**, Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`…).
- **Always ask before committing.** Never self-commit without user confirmation.
- No `dd()`, `dump()`, `console.log()` left in production code.
