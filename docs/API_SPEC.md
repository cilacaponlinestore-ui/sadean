# SADEAN — API SPEC

---

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://sadean.com/api/v1
```

---

## Authentication

### POST /auth/register
Register user baru.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "081234567890",
  "role": "buyer"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "buyer"
  },
  "token": "jwt_token"
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

### POST /auth/login
Login user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "buyer"
  },
  "token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### POST /auth/logout
Logout user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST /auth/refresh
Refresh token.

**Request:**
```json
{
  "refresh_token": "refresh_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "new_jwt_token",
  "refresh_token": "new_refresh_token"
}
```

---

## Product

### GET /products
Get all products.

**Query Params:**
- page (default: 1)
- limit (default: 20)
- category (category_id)
- seller (seller_id)
- search (keyword)
- min_price
- max_price
- sort (price_asc, price_desc, newest, oldest)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Dodol Cilacap",
        "slug": "dodol-cilacap",
        "price": 25000,
        "stock": 100,
        "category": {
          "id": "uuid",
          "name": "Makanan"
        },
        "seller": {
          "id": "uuid",
          "store_name": "Toko Dodol Mak"
        },
        "images": [
          {
            "url": "https://...",
            "is_primary": true
          }
        ],
        "created_at": "2026-07-11T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "total_pages": 5
    }
  }
}
```

---

### GET /products/{id}
Get product by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Dodol Cilacap",
    "slug": "dodol-cilacap",
    "description": "Dodol khas Cilacap",
    "price": 25000,
    "stock": 100,
    "unit": "pcs",
    "weight": 200,
    "category": {
      "id": "uuid",
      "name": "Makanan"
    },
    "seller": {
      "id": "uuid",
      "store_name": "Toko Dodol Mak",
      "phone": "081234567890",
      "whatsapp": "6281234567890",
      "address": "Jl. Merdeka No. 1"
    },
    "images": [
      {
        "id": "uuid",
        "url": "https://...",
        "is_primary": true
      }
    ],
    "created_at": "2026-07-11T00:00:00Z",
    "updated_at": "2026-07-11T00:00:00Z"
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "error": "Product not found"
}
```

---

### POST /products
Create new product.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**
```json
{
  "name": "Dodol Cilacap",
  "description": "Dodol khas Cilacap",
  "price": 25000,
  "stock": 100,
  "unit": "pcs",
  "weight": 200,
  "category_id": "uuid",
  "images": [file1, file2]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Dodol Cilacap",
    "slug": "dodol-cilacap"
  }
}
```

---

### PUT /products/{id}
Update product.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "Dodol Cilacap Updated",
  "price": 30000,
  "stock": 50
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Dodol Cilacap Updated"
  }
}
```

---

### DELETE /products/{id}
Delete product.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Category

### GET /categories
Get all categories.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Makanan",
      "slug": "makanan",
      "children": [
        {
          "id": "uuid",
          "name": "Dodol",
          "slug": "dodol"
        }
      ]
    }
  ]
}
```

---

## Cart

### GET /cart
Get user cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "product": {
          "id": "uuid",
          "name": "Dodol Cilacap",
          "price": 25000,
          "stock": 100
        },
        "quantity": 2,
        "subtotal": 50000
      }
    ],
    "total": 50000
  }
}
```

---

### POST /cart
Add item to cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "product_id": "uuid",
  "quantity": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item added to cart"
}
```

---

### PUT /cart/{id}
Update cart item quantity.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart updated"
}
```

---

### DELETE /cart/{id}
Remove item from cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

## Order

### POST /orders
Create new order (checkout).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "shipping_name": "John Doe",
  "shipping_phone": "081234567890",
  "shipping_address": "Jl. Merdeka No. 1, Cilacap",
  "notes": "Tolong packing yang rapi"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-20260711-0001",
    "status": "pending",
    "total": 50000,
    "whatsapp_link": "https://wa.me/6281234567890?text=..."
  }
}
```

---

### GET /orders
Get user orders.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
- page (default: 1)
- limit (default: 20)
- status (pending, confirmed, etc.)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "order_number": "ORD-20260711-0001",
        "status": "pending",
        "total": 50000,
        "seller": {
          "store_name": "Toko Dodol Mak"
        },
        "items_count": 2,
        "created_at": "2026-07-11T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10
    }
  }
}
```

---

### GET /orders/{id}
Get order detail.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-20260711-0001",
    "status": "pending",
    "subtotal": 50000,
    "total": 50000,
    "notes": "Tolong packing yang rapi",
    "shipping_name": "John Doe",
    "shipping_phone": "081234567890",
    "shipping_address": "Jl. Merdeka No. 1, Cilacap",
    "seller": {
      "id": "uuid",
      "store_name": "Toko Dodol Mak",
      "whatsapp": "6281234567890"
    },
    "items": [
      {
        "id": "uuid",
        "product_name": "Dodol Cilacap",
        "product_price": 25000,
        "quantity": 2,
        "subtotal": 50000
      }
    ],
    "created_at": "2026-07-11T00:00:00Z"
  }
}
```

---

### PUT /orders/{id}
Update order status.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "confirmed"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "confirmed"
  }
}
```

---

## Seller

### GET /seller/dashboard
Get seller dashboard data.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_products": 10,
      "total_orders": 25,
      "total_revenue": 1250000,
      "pending_orders": 3
    },
    "recent_orders": [
      {
        "id": "uuid",
        "order_number": "ORD-20260711-0001",
        "total": 50000,
        "status": "pending",
        "created_at": "2026-07-11T00:00:00Z"
      }
    ]
  }
}
```

---

### GET /seller/orders
Get seller orders.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
- page (default: 1)
- limit (default: 20)
- status (pending, confirmed, etc.)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "order_number": "ORD-20260711-0001",
        "status": "pending",
        "total": 50000,
        "buyer": {
          "name": "John Doe",
          "phone": "081234567890"
        },
        "items_count": 2,
        "created_at": "2026-07-11T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25
    }
  }
}
```

---

### PUT /seller/orders/{id}/status
Update order status (seller).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "confirmed"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "confirmed"
  }
}
```

---

## Admin

### GET /admin/dashboard
Get admin dashboard data.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_users": 150,
      "total_sellers": 50,
      "total_buyers": 100,
      "pending_verifications": 5,
      "total_orders": 200,
      "total_revenue": 10000000
    },
    "recent_activities": [
      {
        "type": "new_seller",
        "message": "Toko Baru terdaftar",
        "created_at": "2026-07-11T00:00:00Z"
      }
    ]
  }
}
```

---

### GET /admin/users
Get all users.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
- page (default: 1)
- limit (default: 20)
- role (buyer, seller, admin)
- search (keyword)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "buyer",
        "is_active": true,
        "created_at": "2026-07-11T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    }
  }
}
```

---

### GET /admin/sellers
Get all sellers.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
- page (default: 1)
- limit (default: 20)
- status (pending, verified, inactive)
- search (keyword)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sellers": [
      {
        "id": "uuid",
        "store_name": "Toko Dodol Mak",
        "user": {
          "name": "Mak Dodol",
          "email": "mak@example.com"
        },
        "is_verified": false,
        "is_active": true,
        "created_at": "2026-07-11T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50
    }
  }
}
```

---

### PUT /admin/sellers/{id}/verify
Verify seller.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "action": "approve"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "is_verified": true
  }
}
```

---

### PUT /admin/sellers/{id}/status
Update seller status.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "is_active": false,
  "reason": "Melanggar ketentuan"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "is_active": false
  }
}
```

---

## Banner

### GET /banners
Get active banners.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Promo Spesial",
      "image_url": "https://...",
      "link": "/products/uuid"
    }
  ]
}
```

---

### POST /admin/banners
Create banner (admin).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**
```json
{
  "title": "Promo Spesial",
  "link": "/products/uuid",
  "image": file,
  "is_active": true,
  "start_date": "2026-07-11",
  "end_date": "2026-07-31"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Promo Spesial"
  }
}
```

---

## Error Response

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Email is required"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

- Public API: 100 requests/minute
- Authenticated API: 300 requests/minute
- Admin API: 600 requests/minute

---

## Pagination

All list endpoints support pagination:

```
GET /products?page=1&limit=20
```

Response includes:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

**Status:** [x] Final