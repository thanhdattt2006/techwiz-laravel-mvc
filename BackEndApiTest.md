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

