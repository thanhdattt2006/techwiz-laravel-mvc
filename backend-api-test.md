# MarketLink (eGreen Basket) - RESTful Web API Test Guide

This document provides the complete API specification, request endpoints, authentication requirements, and sample test payloads for manual and automated testing.

- **Base URL (Local)**: `http://127.0.0.1:8000/api/v1`
- **Base URL (Production)**: `https://techwiz-laravel-mvc.onrender.com/api/v1`
- **Standard Response Envelope**:
  ```json
  {
    "success": true,
    "message": "Human-readable description of result.",
    "data": { ... },
    "errors": null
  }
  ```

---

## 1. Authentication & User Profile APIs (Phase 3.2)

### 1.1. Customer Registration
Registers a new customer account. Automatically provisions an empty shopping cart (`carts` table) and returns a Sanctum Bearer token.

- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/register`
- **Auth**: Public (No Token required)
- **Headers**:
  ```http
  Content-Type: application/json
  Accept: application/json
  ```
- **Sample Request Body**:
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
- **Sample Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Customer registered successfully.",
    "data": {
      "token": "1|qWf89J7Xz...",
      "user": {
        "id": 1,
        "fullname": "Jane Doe",
        "username": "janedoe",
        "email": "jane.doe@example.com",
        "phone": "+13125550188",
        "address": "742 Evergreen Terrace, Chicago, IL",
        "role": "customer",
        "status": "active",
        "created_at": "2026-09-26T17:00:00.000000Z",
        "updated_at": "2026-09-26T17:00:00.000000Z"
      }
    },
    "errors": null
  }
  ```

---

### 1.2. Farmer Stall Application
Registers a new farmer vendor stall. Account is created with `status: pending` awaiting Admin approval.

- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/register-farmer`
- **Auth**: Public
- **Headers**:
  ```http
  Content-Type: application/json
  Accept: application/json
  ```
- **Sample Request Body**:
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
- **Sample Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Farmer registration submitted successfully. Your account is pending admin approval.",
    "data": {
      "user": {
        "id": 2,
        "fullname": "Robert Sterling",
        "username": "sterlingfarm",
        "email": "robert@sterlingorganics.com",
        "phone": "+13125550190",
        "address": "Plot #44, Batavia, IL 60510",
        "role": "farmer",
        "status": "pending",
        "farmer": {
          "id": 1,
          "stall_name": "Sterling Organic Orchards",
          "contact_person": "Robert Sterling",
          "contact_phone": "+13125550190",
          "address": "Plot #44, Batavia, IL 60510",
          "latitude": 41.85,
          "longitude": -88.31,
          "description": "Certified organic heirloom apples, raw honey, and cold-pressed cider.",
          "logo": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80",
          "avg_rating": 0,
          "review_count": 0
        },
        "created_at": "2026-09-26T17:05:00.000000Z",
        "updated_at": "2026-09-26T17:05:00.000000Z"
      }
    },
    "errors": null
  }
  ```

---

### 1.3. User Login
Authenticates users using either email or username and issues a Sanctum Bearer token. Validates account status (rejects `pending`, `banned`, and `inactive` users with HTTP 403).

- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/login`
- **Auth**: Public
- **Headers**:
  ```http
  Content-Type: application/json
  Accept: application/json
  ```
- **Sample Request Body**:
  ```json
  {
    "login": "jane.doe@example.com",
    "password": "SecurePassword123!"
  }
  ```
  *(Or use username: `"login": "admin"` with `"password": "password"`)*
- **Sample Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "token": "2|NkL928xU0...",
      "user": {
        "id": 1,
        "fullname": "Jane Doe",
        "username": "janedoe",
        "email": "jane.doe@example.com",
        "phone": "+13125550188",
        "address": "742 Evergreen Terrace, Chicago, IL",
        "role": "customer",
        "status": "active"
      }
    },
    "errors": null
  }
  ```

---

### 1.4. Current User Profile
Retrieves the authenticated user's profile and vendor stall details (if user is a farmer).

- **Method**: `GET`
- **Endpoint**: `/api/v1/auth/me`
- **Auth**: Protected (`Authorization: Bearer <token>`)
- **Headers**:
  ```http
  Authorization: Bearer 2|NkL928xU0...
  Accept: application/json
  ```
- **Sample Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User profile retrieved successfully.",
    "data": {
      "user": {
        "id": 1,
        "fullname": "Jane Doe",
        "username": "janedoe",
        "email": "jane.doe@example.com",
        "phone": "+13125550188",
        "address": "742 Evergreen Terrace, Chicago, IL",
        "role": "customer",
        "status": "active",
        "created_at": "2026-09-26T17:00:00.000000Z",
        "updated_at": "2026-09-26T17:00:00.000000Z"
      }
    },
    "errors": null
  }
  ```

---

### 1.5. Update Profile
Updates authenticated user details (`fullname`, `phone`, `address`).

- **Method**: `PUT`
- **Endpoint**: `/api/v1/auth/profile`
- **Auth**: Protected (`Authorization: Bearer <token>`)
- **Sample Request Body**:
  ```json
  {
    "fullname": "Jane Doe Updated",
    "phone": "+13125550999",
    "address": "100 N LaSalle St, Chicago, IL"
  }
  ```
- **Sample Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Profile updated successfully.",
    "data": {
      "user": {
        "id": 1,
        "fullname": "Jane Doe Updated",
        "username": "janedoe",
        "email": "jane.doe@example.com",
        "phone": "+13125550999",
        "address": "100 N LaSalle St, Chicago, IL",
        "role": "customer",
        "status": "active"
      }
    },
    "errors": null
  }
  ```

---

### 1.6. Change Password
Changes the user's password. Requires valid current password and confirmed new password.

- **Method**: `PUT`
- **Endpoint**: `/api/v1/auth/change-password`
- **Auth**: Protected (`Authorization: Bearer <token>`)
- **Sample Request Body**:
  ```json
  {
    "current_password": "SecurePassword123!",
    "new_password": "BrandNewPassword456!",
    "new_password_confirmation": "BrandNewPassword456!"
  }
  ```
- **Sample Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Password changed successfully.",
    "data": null,
    "errors": null
  }
  ```

---

### 1.7. User Logout
Revokes the current access token.

- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/logout`
- **Auth**: Protected (`Authorization: Bearer <token>`)
- **Sample Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully.",
    "data": null,
    "errors": null
  }
  ```

---

## 2. Farmers Markets Directory & Schedules APIs (Phase 3.3)

### 2.1. List Markets with Filters
Lists farmers markets with operating schedules. Supports full-text search by name or address and filter by day of week.

- **Method**: `GET`
- **Endpoint**: `/api/v1/markets`
- **Auth**: Public
- **Query Parameters**:
  - `search` *(optional string)*: Filter by market name or address (e.g., `?search=Lincoln`)
  - `day_of_week` *(optional integer 0-6)*: Filter markets operating on a specific day (`0=Sunday`, `1=Monday`, ..., `6=Saturday`) (e.g., `?day_of_week=6`)
- **Sample Request**:
  `GET /api/v1/markets?day_of_week=6&search=Green`
- **Sample Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Markets retrieved successfully.",
    "data": [
      {
        "id": 1,
        "name": "Lincoln Park Farmers Market",
        "address": "2001 N Clark St, Chicago, IL 60614",
        "latitude": 41.9184,
        "longitude": -87.6358,
        "map_provider": "osm",
        "map_embed_url": "https://www.openstreetmap.org/export/embed.html?bbox=-87.640%2C41.915%2C-87.630%2C41.920&layer=mapnik",
        "description": "Historic outdoor market hosting over 40 local Illinois farms, artisan cheesemakers, and bakeries.",
        "image": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80",
        "status": "active",
        "active_stalls_count": 8,
        "schedules": [
          {
            "id": 1,
            "day_of_week": 6,
            "day_name": "Saturday",
            "open_time": "07:00",
            "close_time": "13:00"
          },
          {
            "id": 2,
            "day_of_week": 3,
            "day_name": "Wednesday",
            "open_time": "07:00",
            "close_time": "13:00"
          }
        ],
        "created_at": "2026-09-26T17:00:00.000000Z",
        "updated_at": "2026-09-26T17:00:00.000000Z"
      }
    ],
    "errors": null
  }
  ```

---

### 2.2. Get Single Market Details
Returns comprehensive market data including weekly operating schedules and registered active farmer stalls.

- **Method**: `GET`
- **Endpoint**: `/api/v1/markets/{id}`
- **Auth**: Public
- **Sample Request**:
  `GET /api/v1/markets/1`
- **Sample Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Market details retrieved successfully.",
    "data": {
      "id": 1,
      "name": "Lincoln Park Farmers Market",
      "address": "2001 N Clark St, Chicago, IL 60614",
      "latitude": 41.9184,
      "longitude": -87.6358,
      "map_provider": "osm",
      "map_embed_url": "https://www.openstreetmap.org/export/embed.html",
      "description": "Historic outdoor market hosting over 40 local Illinois farms.",
      "image": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80",
      "status": "active",
      "active_stalls_count": 1,
      "schedules": [
        {
          "id": 1,
          "day_of_week": 6,
          "day_name": "Saturday",
          "open_time": "07:00",
          "close_time": "13:00"
        }
      ],
      "farmers": [
        {
          "id": 1,
          "stall_name": "Green Valley Organics",
          "contact_person": "Tom Greenfield",
          "contact_phone": "+13125550199",
          "stall_location": "Booth A-12 (North Courtyard)",
          "pickup_days": [6],
          "pickup_start_time": "08:00",
          "pickup_end_time": "12:30",
          "slot_minutes": 30,
          "cutoff_hours": 12,
          "avg_rating": 4.9,
          "review_count": 28,
          "logo": null
        }
      ],
      "created_at": "2026-09-26T17:00:00.000000Z",
      "updated_at": "2026-09-26T17:00:00.000000Z"
    },
    "errors": null
  }
  ```

---

### 2.3. Create Market with Schedules (Admin Only)
Creates a new farmers market and operating schedules within a database transaction.

- **Method**: `POST`
- **Endpoint**: `/api/v1/admin/markets`
- **Auth**: Protected (`Authorization: Bearer <admin_token>`) & Role `admin`
- **Headers**:
  ```http
  Authorization: Bearer <admin_token>
  Content-Type: application/json
  Accept: application/json
  ```
- **Sample Request Body**:
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
- **Sample Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Market created successfully.",
    "data": {
      "id": 7,
      "name": "Pilsen Community Farmers Market",
      "address": "1821 S Blue Island Ave, Chicago, IL 60608",
      "latitude": 41.8576,
      "longitude": -87.6599,
      "map_provider": "osm",
      "map_embed_url": null,
      "description": "Vibrant neighborhood market offering fresh Midwest produce, heirloom chiles, and handmade tortillas.",
      "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
      "status": "active",
      "active_stalls_count": 0,
      "schedules": [
        {
          "id": 15,
          "day_of_week": 0,
          "day_name": "Sunday",
          "open_time": "09:00",
          "close_time": "14:00"
        },
        {
          "id": 16,
          "day_of_week": 6,
          "day_name": "Saturday",
          "open_time": "08:00",
          "close_time": "13:30"
        }
      ],
      "created_at": "2026-09-26T17:10:00.000000Z",
      "updated_at": "2026-09-26T17:10:00.000000Z"
    },
    "errors": null
  }
  ```

---

### 2.4. Update Market and Schedules (Admin Only)
Updates market details and synchronizes weekly schedules.

- **Method**: `PUT`
- **Endpoint**: `/api/v1/admin/markets/{id}`
- **Auth**: Protected (`Authorization: Bearer <admin_token>`) & Role `admin`
- **Sample Request Body**:
  ```json
  {
    "name": "Pilsen Community Farmers Market (Extended Hours)",
    "address": "1821 S Blue Island Ave, Chicago, IL 60608",
    "latitude": 41.8576,
    "longitude": -87.6599,
    "status": "active",
    "schedules": [
      {
        "day_of_week": 0,
        "open_time": "08:30",
        "close_time": "15:00"
      }
    ]
  }
  ```
- **Sample Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Market updated successfully.",
    "data": {
      "id": 7,
      "name": "Pilsen Community Farmers Market (Extended Hours)",
      "address": "1821 S Blue Island Ave, Chicago, IL 60608",
      "latitude": 41.8576,
      "longitude": -87.6599,
      "status": "active",
      "active_stalls_count": 0,
      "schedules": [
        {
          "id": 17,
          "day_of_week": 0,
          "day_name": "Sunday",
          "open_time": "08:30",
          "close_time": "15:00"
        }
      ]
    },
    "errors": null
  }
  ```

---

### 2.5. Delete Market (Admin Only)
Soft-deletes a market by ID.

- **Method**: `DELETE`
- **Endpoint**: `/api/v1/admin/markets/{id}`
- **Auth**: Protected (`Authorization: Bearer <admin_token>`) & Role `admin`
- **Sample Request**:
  `DELETE /api/v1/admin/markets/7`
- **Sample Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Market deleted successfully.",
    "data": null,
    "errors": null
  }
  ```
