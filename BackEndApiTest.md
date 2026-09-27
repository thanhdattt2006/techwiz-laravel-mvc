# MarketLink - API Test Payloads

- **Base URL Local**: `http://127.0.0.1:8000/api/v1`
- **Base URL Production**: `https://techwiz-laravel-mvc.onrender.com/api/v1`

---

## 1. Authentication & User Profile (Phase 3.2)

### 1.1. Customer Register
- **Method**: `POST /api/v1/auth/register`
- **Body**:
```json
{
  "fullname": "Jane Doe",
  "username": "janedoe",
  "email": "jane.doe@example.com",
  "phone": "+13125550188",
  "address": "742 Evergreen Terrace, Chicago, IL",
  "password": "SecurePassword123!"
}
```

---

### 1.2. Farmer Register (Stall Application)
- **Method**: `POST /api/v1/auth/register-farmer`
- **Body**:
```json
{
  "fullname": "Robert Sterling",
  "username": "sterlingfarm",
  "email": "robert@sterlingorganics.com",
  "phone": "+13125550190",
  "password": "FarmerPassword123!",
  "stall_name": "Sterling Organic Orchards",
  "contact_person": "Robert Sterling",
  "contact_phone": "+13125550190",
  "address": "Plot #44, Batavia, IL 60510",
  "description": "Certified organic heirloom apples, raw honey, and cold-pressed cider.",
  "latitude": 41.8500,
  "longitude": -88.3100,
  "logo": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"
}
```

---

### 1.3. User Login
- **Method**: `POST /api/v1/auth/login`
- **Body**:
```json
{
  "login": "jane.doe@example.com",
  "password": "SecurePassword123!"
}
```
*(Or test with demo accounts: `admin@marketlink.com`, `farmer@marketlink.com`, `customer@marketlink.com` with password `password`)*

---

### 1.4. Current User Profile
- **Method**: `GET /api/v1/auth/me`
- **Headers**:
```http
Authorization: Bearer <token>
```

---

### 1.5. Update Profile
- **Method**: `PUT /api/v1/auth/profile`
- **Headers**:
```http
Authorization: Bearer <token>
```
- **Body**:
```json
{
  "fullname": "Jane Doe Updated",
  "phone": "+13125550999",
  "address": "100 N LaSalle St, Chicago, IL"
}
```

---

### 1.6. Change Password
- **Method**: `PUT /api/v1/auth/change-password`
- **Headers**:
```http
Authorization: Bearer <token>
```
- **Body**:
```json
{
  "current_password": "SecurePassword123!",
  "new_password": "BrandNewPassword456!",
  "new_password_confirmation": "BrandNewPassword456!"
}
```

---

### 1.7. User Logout
- **Method**: `POST /api/v1/auth/logout`
- **Headers**:
```http
Authorization: Bearer <token>
```

---

## 2. Farmers Markets Directory & Schedules (Phase 3.3)

### 2.1. List Markets
- **Method**: `GET /api/v1/markets`
- **Query Params (Optional)**:
  - `?search=Lincoln`
  - `?day_of_week=6` (0=Sun, 1=Mon, ..., 6=Sat)

---

### 2.2. Get Market Details
- **Method**: `GET /api/v1/markets/{id}`
*(Example: `GET /api/v1/markets/1`)*

---

### 2.3. Create Market [Admin Only]
- **Method**: `POST /api/v1/admin/markets`
- **Headers**:
```http
Authorization: Bearer <admin_token>
```
- **Body**:
```json
{
  "name": "Pilsen Community Farmers Market",
  "address": "1821 S Blue Island Ave, Chicago, IL 60608",
  "latitude": 41.8576,
  "longitude": -87.6599,
  "map_provider": "osm",
  "description": "Vibrant neighborhood market offering fresh Midwest produce, heirloom chiles, and handmade tortillas.",
  "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
  "status": "active",
  "schedules": [
    {
      "day_of_week": 0,
      "open_time": "09:00",
      "close_time": "14:00"
    },
    {
      "day_of_week": 6,
      "open_time": "08:00",
      "close_time": "13:30"
    }
  ]
}
```

---

### 2.4. Update Market [Admin Only]
- **Method**: `PUT /api/v1/admin/markets/{id}`
*(Example: `PUT /api/v1/admin/markets/1`)*
- **Headers**:
```http
Authorization: Bearer <admin_token>
```
- **Body**:
```json
{
  "name": "Lincoln Park Farmers Market (Extended Hours)",
  "address": "2001 N Clark St, Chicago, IL 60614",
  "latitude": 41.9184,
  "longitude": -87.6358,
  "status": "active",
  "schedules": [
    {
      "day_of_week": 6,
      "open_time": "07:00",
      "close_time": "14:00"
    }
  ]
}
```

---

### 2.5. Delete Market [Admin Only]
- **Method**: `DELETE /api/v1/admin/markets/{id}`
*(Example: `DELETE /api/v1/admin/markets/7`)*
- **Headers**:
```http
Authorization: Bearer <admin_token>
```

---

## 3. Farmers & Market Stall Configuration (Phase 3.4)

### 3.1. List Farmers Directory
- **Method**: `GET /api/v1/farmers`
- **Query Params (Optional)**:
  - `?search=Green`
  - `?market_id=1`
  - `?sort_by=avg_rating` (Options: `avg_rating`, `review_count`, `stall_name`)

---

### 3.2. Get Farmer Details
- **Method**: `GET /api/v1/farmers/{id}`
*(Example: `GET /api/v1/farmers/1`)*

---

### 3.3. View Own Stall Profile [Farmer Only]
- **Method**: `GET /api/v1/farmer/profile`
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```

---

### 3.4. Update Stall Profile [Farmer Only]
- **Method**: `PUT /api/v1/farmer/profile`
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```
- **Body**:
```json
{
  "stall_name": "Green Valley Organics (Updated)",
  "contact_person": "Tom Greenfield",
  "contact_phone": "+13125550199",
  "address": "Farm Plot #12, Naperville, IL",
  "description": "Locally grown certified organic vegetables, heirloom tomatoes, and crisp greens.",
  "logo": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"
}
```

---

### 3.5. List Registered Market Stalls [Farmer Only]
- **Method**: `GET /api/v1/farmer/markets`
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```

---

### 3.6. Register Stall at New Market [Farmer Only]
- **Method**: `POST /api/v1/farmer/markets`
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```
- **Body**:
```json
{
  "market_id": 1,
  "stall_location": "Booth #A-14 (North Pavilion)",
  "pickup_days": [6],
  "pickup_start_time": "08:00",
  "pickup_end_time": "12:30",
  "slot_minutes": 30,
  "cutoff_hours": 12,
  "is_active": true
}
```

---

### 3.7. Update Stall Schedule & Slots at Market [Farmer Only]
- **Method**: `PUT /api/v1/farmer/markets/{marketId}`
*(Example: `PUT /api/v1/farmer/markets/1`)*
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```
- **Body**:
```json
{
  "stall_location": "Booth #A-14 (North Pavilion - Corner)",
  "pickup_days": [0, 6],
  "pickup_start_time": "07:30",
  "pickup_end_time": "13:00",
  "slot_minutes": 15,
  "cutoff_hours": 24,
  "is_active": true
}
```

---

### 3.8. Unregister Stall from Market [Farmer Only]
- **Method**: `DELETE /api/v1/farmer/markets/{marketId}`
*(Example: `DELETE /api/v1/farmer/markets/1`)*
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```

---

## 4. Categories & Produce Catalog (Phase 3.5)

### 4.1. List Categories
- **Method**: `GET /api/v1/categories`

---

### 4.2. Get Category Details
- **Method**: `GET /api/v1/categories/{id}`
*(Example: `GET /api/v1/categories/1`)*

---

### 4.3. Create Category [Admin Only]
- **Method**: `POST /api/v1/admin/categories`
- **Headers**:
```http
Authorization: Bearer <admin_token>
```
- **Body**:
```json
{
  "name": "Microgreens & Shoots",
  "description": "Nutrient-dense indoor microgreens, sunflower shoots, and pea tendrils.",
  "is_active": true
}
```

---

### 4.4. Update Category [Admin Only]
- **Method**: `PUT /api/v1/admin/categories/{id}`
*(Example: `PUT /api/v1/admin/categories/1`)*
- **Headers**:
```http
Authorization: Bearer <admin_token>
```
- **Body**:
```json
{
  "name": "Fresh Organic Vegetables",
  "description": "Heirloom greens, roots, heirloom tomatoes, and freshly harvested seasonal brassicas.",
  "is_active": true
}
```

---

### 4.5. Delete Category [Admin Only]
- **Method**: `DELETE /api/v1/admin/categories/{id}`
*(Example: `DELETE /api/v1/admin/categories/6`)*
- **Headers**:
```http
Authorization: Bearer <admin_token>
```

---

### 4.6. List Products Catalog (Public)
- **Method**: `GET /api/v1/products`
- **Query Params (Optional)**:
  - `?category_id=1`
  - `?category_slug=fresh-vegetables`
  - `?market_id=1`
  - `?farmer_id=1`
  - `?min_price=2&max_price=10`
  - `?search=Honey`
  - `?in_stock_only=true`
  - `?sort_by=price_asc` (Options: `price_asc`, `price_desc`, `rating_desc`, `name_asc`, `latest`)

---

### 4.7. Get Product Details (Public)
- **Method**: `GET /api/v1/products/{id}`
*(Example: `GET /api/v1/products/1`)*

---

### 4.8. List Stall Products [Farmer Only]
- **Method**: `GET /api/v1/farmer/products`
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```
- **Query Params (Optional)**:
  - `?category_id=1`
  - `?availability=available`
  - `?search=Kale`

---

### 4.9. Add Product to Stall [Farmer Only]
- **Method**: `POST /api/v1/farmer/products`
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```
- **Body**:
```json
{
  "category_id": 1,
  "name": "Heirloom Cherokee Purple Tomatoes",
  "description": "Rich, sweet heirloom beefsteak tomatoes harvested at peak ripeness.",
  "price": 5.50,
  "unit": "kg",
  "stock_quantity": 35,
  "availability": "available",
  "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"
}
```

---

### 4.10. Update Stall Product [Farmer Only]
- **Method**: `PUT /api/v1/farmer/products/{id}`
*(Example: `PUT /api/v1/farmer/products/1`)*
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```
- **Body**:
```json
{
  "name": "Heirloom Cherokee Purple Tomatoes (Large)",
  "price": 6.00,
  "stock_quantity": 25,
  "availability": "available"
}
```

---

### 4.11. Delete Product [Farmer Only]
- **Method**: `DELETE /api/v1/farmer/products/{id}`
*(Example: `DELETE /api/v1/farmer/products/1`)*
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```

---

### 4.12. Toggle Product Moderation Hide [Admin Only]
- **Method**: `PATCH /api/v1/admin/products/{id}/toggle-hide`
*(Example: `PATCH /api/v1/admin/products/1/toggle-hide`)*
- **Headers**:
```http
Authorization: Bearer <admin_token>
```

---

## 5. Weekly Stock Templates (Phase 3.6)

### 5.1. View Product Weekly Stock Template [Farmer Only]
- **Method**: `GET /api/v1/farmer/products/{id}/template`
*(Example: `GET /api/v1/farmer/products/1/template`)*
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```

---

### 5.2. Configure Weekly Stock Template [Farmer Only]
- **Method**: `PUT /api/v1/farmer/products/{id}/template`
*(Example: `PUT /api/v1/farmer/products/1/template`)*
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```
- **Body**:
```json
{
  "templates": [
    {
      "day_of_week": 6,
      "default_quantity": 60.00,
      "is_active": true
    },
    {
      "day_of_week": 0,
      "default_quantity": 40.00,
      "is_active": true
    }
  ]
}
```

---

### 5.3. 1-Click Apply Weekly Stock Templates [Farmer Only]
- **Method**: `POST /api/v1/farmer/apply-weekly-templates`
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```
- **Body Option 1 (Auto-detect upcoming market day)**:
```json
{}
```
- **Body Option 2 (Explicit target day: 0=Sun ... 6=Sat)**:
```json
{
  "target_day": 6
}
```
- **Body Option 3 (Specific target date)**:
```json
{
  "target_date": "2026-09-27"
}
```

---

## 6. Shopping Cart (Phase 3.7)

### 6.1. Get Shopping Cart [Customer Only]
- **Method**: `GET /api/v1/cart`
- **Headers**:
```http
Authorization: Bearer <customer_token>
```

---

### 6.2. Add Item to Cart [Customer Only]
- **Method**: `POST /api/v1/cart/items`
- **Headers**:
```http
Authorization: Bearer <customer_token>
```
- **Body**:
```json
{
  "product_id": 1,
  "quantity": 2
}
```

---

### 6.3. Update Cart Item Quantity [Customer Only]
- **Method**: `PUT /api/v1/cart/items/{id}`
*(Example: `PUT /api/v1/cart/items/1`)*
- **Headers**:
```http
Authorization: Bearer <customer_token>
```
- **Body**:
```json
{
  "quantity": 4
}
```

---

### 6.4. Remove Single Item from Cart [Customer Only]
- **Method**: `DELETE /api/v1/cart/items/{id}`
*(Example: `DELETE /api/v1/cart/items/1`)*
- **Headers**:
```http
Authorization: Bearer <customer_token>
```

---

### 6.5. Clear Entire Cart [Customer Only]
- **Method**: `DELETE /api/v1/cart/clear`
- **Headers**:
```http
Authorization: Bearer <customer_token>
```

---

## 7. Pre-Orders & Order Lifecycle (Phase 3.8)

### 7.1. Checkout Pre-Order for Stall Pickup [Customer Only]
- **Method**: `POST /api/v1/orders/checkout`
- **Headers**:
```http
Authorization: Bearer <customer_token>
Content-Type: application/json
```
- **Body**:
```json
{
  "market_id": 1,
  "pickup_date": "2026-10-03",
  "pickup_start_time": "09:00",
  "pickup_end_time": "09:30",
  "note": "Please pick fresh ripe apples.",
  "farmer_id": null
}
```

---

### 7.2. Get Customer Order History [Customer Only]
- **Method**: `GET /api/v1/orders/my-orders?status=placed`
- **Headers**:
```http
Authorization: Bearer <customer_token>
```

---

### 7.3. Get Customer Order Details [Customer Only]
- **Method**: `GET /api/v1/orders/my-orders/{id}`
*(Example: `GET /api/v1/orders/my-orders/1`)*
- **Headers**:
```http
Authorization: Bearer <customer_token>
```

---

### 7.4. Public Track Order via Order Code [Public]
- **Method**: `GET /api/v1/orders/track/{orderCode}`
*(Example: `GET /api/v1/orders/track/ML-2026-F01-7782`)*

---

### 7.5. Cancel Order Before Cutoff Deadline [Customer Only]
- **Method**: `PATCH /api/v1/orders/{id}/cancel`
*(Example: `PATCH /api/v1/orders/1/cancel`)*
- **Headers**:
```http
Authorization: Bearer <customer_token>
Content-Type: application/json
```
- **Body**:
```json
{
  "cancel_reason": "Schedule conflict, cannot attend the market."
}
```

---

### 7.6. Get Farmer Incoming Pre-Orders [Farmer Only]
- **Method**: `GET /api/v1/farmer/orders?status=placed`
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```

---

### 7.7. Accept Pre-Order [Farmer Only]
- **Method**: `PATCH /api/v1/farmer/orders/{id}/accept`
*(Example: `PATCH /api/v1/farmer/orders/1/accept`)*
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```

---

### 7.8. Decline Pre-Order & Restock [Farmer Only]
- **Method**: `PATCH /api/v1/farmer/orders/{id}/decline`
*(Example: `PATCH /api/v1/farmer/orders/1/decline`)*
- **Headers**:
```http
Authorization: Bearer <farmer_token>
Content-Type: application/json
```
- **Body**:
```json
{
  "cancel_reason": "Crop harvest affected by sudden frost."
}
```

---

### 7.9. Mark Order Ready for Stall Pickup [Farmer Only]
- **Method**: `PATCH /api/v1/farmer/orders/{id}/ready`
*(Example: `PATCH /api/v1/farmer/orders/1/ready`)*
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```

---

### 7.10. Complete Order at Stall (Cash Settled) [Farmer Only]
- **Method**: `PATCH /api/v1/farmer/orders/{id}/complete`
*(Example: `PATCH /api/v1/farmer/orders/1/complete`)*
- **Headers**:
```http
Authorization: Bearer <farmer_token>
```

---

### 7.11. Generate Available Pickup Slots [Public / Customer]
- **Method**: `GET /api/v1/orders/slots?farmer_id=1&market_id=1&pickup_date=2026-10-03`

---

## 8. Reviews & Favorites (Phase 3.9)

### 8.1. Submit Review for Completed Order [Customer Only]
- **Method**: `POST /api/v1/reviews`
- **Headers**:
```http
Authorization: Bearer <customer_token>
Content-Type: application/json
```
- **Body (Review a Farmer Stall)**:
```json
{
  "order_id": 1,
  "farmer_id": 1,
  "product_id": null,
  "rating": 5,
  "comment": "Wonderful fresh produce and super welcoming farmer!"
}
```
- **Body (Review a Specific Produce Item)**:
```json
{
  "order_id": 1,
  "farmer_id": null,
  "product_id": 2,
  "rating": 4,
  "comment": "Crisp and flavorful apples."
}
```

---

### 8.2. Get Public Reviews for a Produce Item [Public]
- **Method**: `GET /api/v1/reviews/product/{productId}`
*(Example: `GET /api/v1/reviews/product/2`)*

---

### 8.3. Get Public Reviews for a Farmer Stall [Public]
- **Method**: `GET /api/v1/reviews/farmer/{farmerId}`
*(Example: `GET /api/v1/reviews/farmer/1`)*

---

### 8.4. Respond to Produce Review [Farmer Only]
- **Method**: `POST /api/v1/farmer/reviews/{id}/reply`
*(Example: `POST /api/v1/farmer/reviews/1/reply`)*
- **Headers**:
```http
Authorization: Bearer <farmer_token>
Content-Type: application/json
```
- **Body**:
```json
{
  "farmer_reply": "Thank you for supporting our orchard! Look forward to seeing you at the stall."
}
```

---

### 8.5. Moderate Review Visibility [Admin Only]
- **Method**: `PATCH /api/v1/admin/reviews/{id}/toggle-hide`
*(Example: `PATCH /api/v1/admin/reviews/1/toggle-hide`)*
- **Headers**:
```http
Authorization: Bearer <admin_token>
```

---

### 8.6. List Customer Favorites [Customer Only]
- **Method**: `GET /api/v1/favorites`
*(Or filter by type: `GET /api/v1/favorites?type=product` | `GET /api/v1/favorites?type=farmer` | `GET /api/v1/favorites?type=market`)*
- **Headers**:
```http
Authorization: Bearer <customer_token>
```

---

### 8.7. Toggle Favorite Item (Polymorphic) [Customer Only]
- **Method**: `POST /api/v1/favorites/toggle`
- **Headers**:
```http
Authorization: Bearer <customer_token>
Content-Type: application/json
```
- **Body**:
```json
{
  "favoritable_type": "product",
  "favoritable_id": 1
}
```
*(Supports `favoritable_type`: `"farmer"`, `"product"`, `"market"`)*

---

## 9. Notifications & Announcements (Phase 3.10)

### 9.1. Get In-App Notifications with Unread Count [Protected]
- **Method**: `GET /api/v1/notifications`
*(Or unread only: `GET /api/v1/notifications?unread_only=true`)*
- **Headers**:
```http
Authorization: Bearer <token>
```

---

### 9.2. Mark Single Notification as Read [Protected]
- **Method**: `PATCH /api/v1/notifications/{id}/read`
*(Example: `PATCH /api/v1/notifications/1/read`)*
- **Headers**:
```http
Authorization: Bearer <token>
```

---

### 9.3. Mark All Notifications as Read [Protected]
- **Method**: `PATCH /api/v1/notifications/read-all`
- **Headers**:
```http
Authorization: Bearer <token>
```

---

### 9.4. Get Active Public Announcements [Public / Role-Aware]
- **Method**: `GET /api/v1/announcements/active`
*(Optional filter for guests: `GET /api/v1/announcements/active?role=farmer` | `GET /api/v1/announcements/active?role=customer`)*

---

### 9.5. List All Announcements for Moderation [Admin Only]
- **Method**: `GET /api/v1/admin/announcements`
*(Optional filters: `?is_active=true` | `?target_role=farmer`)*
- **Headers**:
```http
Authorization: Bearer <admin_token>
```

---

### 9.6. Publish Platform Announcement [Admin Only]
- **Method**: `POST /api/v1/admin/announcements`
- **Headers**:
```http
Authorization: Bearer <admin_token>
Content-Type: application/json
```
- **Body**:
```json
{
  "title": "Autumn Harvest Festival Announced",
  "content": "Join us this coming Saturday for special vendor discounts and fresh ciders.",
  "target_role": "all",
  "is_active": true
}
```
*(Supports `target_role`: `"all"`, `"farmer"`, `"customer"`)*

---

### 9.7. Update Announcement [Admin Only]
- **Method**: `PUT /api/v1/admin/announcements/{id}`
*(Example: `PUT /api/v1/admin/announcements/1`)*
- **Headers**:
```http
Authorization: Bearer <admin_token>
Content-Type: application/json
```
- **Body**:
```json
{
  "title": "Autumn Harvest Festival Announced - Updated Schedule",
  "is_active": true
}
```

---

### 9.8. Delete Announcement [Admin Only]
- **Method**: `DELETE /api/v1/admin/announcements/{id}`
*(Example: `DELETE /api/v1/admin/announcements/1`)*
- **Headers**:
```http
Authorization: Bearer <admin_token>
```







