# SADEAN — API Specification

> RESTful API specification untuk SADEAN V1

---

## Overview

API SADEAN menggunakan REST architecture dengan JSON payloads.

### Base URL
```
Development: http://localhost:3001/api/v1
Production: https://api.sadean.com/v1
```

### Common Headers
```
Content-Type: application/json
Authorization: Bearer <token>
Accept: application/json
```

---

## Authentication API

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
  "token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

**Errors:**
- 400: Validation error
- 409: Email already exists

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
    "role": "buyer",
    "avatar": "url"
  },
  "token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

**Errors:**
- 401: Invalid credentials
- 400: Validation error

---

### POST /auth/logout
Logout user.

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST /auth/refresh
Refresh access token.

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

**Errors:**
- 401: Invalid refresh token

---

## Users API

### GET /users/profile
Get current user profile.

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "081234567890",
    "role": "buyer",
    "avatar": "url",
    "created_at": "2026-07-11T00:00:00Z"
  }
}
```

---

### PUT /users/profile
Update current user profile.

**Headers:** Authorization required

**Request:**
```json
{
  "name": "John Updated",
  "phone": "081234567891"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Updated",
    "phone": "081234567891"
  }
}
```

---

### POST /users/avatar
Upload user avatar.

**Headers:** Authorization required, multipart/form-data

**Request:** FormData with 'avatar' file

**Response (200):**
```json
{
  "success": true,
  "data": {
    "avatar": "https://storage.sadean.com/avatars/uuid.jpg"
  }
}
```

---

## Sellers API

### GET /sellers
Get all active sellers.

**Query Params:**
- page (default: 1)
- limit (default: 20)
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
        "slug": "toko-dodol-mak",
        "description": "Dodol khas Cilacap",
        "logo": "url",
        "is_verified": true,
        "products_count": 12,
        "rating": 4.8
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "total_pages": 3
    }
  }
}
```

---

### GET /sellers/:slug
Get seller by slug.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "store_name": "Toko Dodol Mak",
    "slug": "toko-dodol-mak",
    "description": "Dodol khas Cilacap",
    "address": "Jl. Merdeka No. 1",
    "phone": "081234567890",
    "whatsapp": "6281234567890",
    "logo": "url",
    "is_verified": true,
    "products_count": 12,
    "rating": 4.8,
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

---

### POST /sellers
Create seller profile (register as seller).

**Headers:** Authorization required

**Request:**
```json
{
  "store_name": "Toko Dodol Mak",
  "description": "Dodol khas Cilacap",
  "address": "Jl. Merdeka No. 1, Cilacap",
  "phone": "081234567890",
  "whatsapp": "6281234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "store_name": "Toko Dodol Mak",
    "slug": "toko-dodol-mak",
    "is_verified": false
  }
}
```

---

### PUT /sellers/profile
Update seller profile.

**Headers:** Authorization required (seller)

**Request:**
```json
{
  "store_name": "Toko Dodol Mak Updated",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "store_name": "Toko Dodol Mak Updated"
  }
}
```

---

### POST /sellers/logo
Upload seller logo.

**Headers:** Authorization required, multipart/form-data

**Request:** FormData with 'logo' file

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logo": "https://storage.sadean.com/sellers/uuid.jpg"
  }
}
```

---

### GET /sellers/dashboard
Get seller dashboard data.

**Headers:** Authorization required (seller)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_products": 12,
      "total_orders": 25,
      "total_revenue": 1250000,
      "pending_orders": 3,
      "average_rating": 4.8
    },
    "recent_orders": [
      {
        "id": "uuid",
        "order_number": "ORD-20260711-0001",
        "buyer_name": "John Doe",
        "total": 50000,
        "status": "pending",
        "created_at": "2026-07-11T00:00:00Z"
      }
    ],
    "top_products": [
      {
        "id": "uuid",
        "name": "Dodol Cilacap",
        "sold": 50,
        "revenue": 1250000
      }
    ]
  }
}
```

---

## Products API

### GET /products
Get all active products.

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
        "unit": "pcs",
        "category": {
          "id": "uuid",
          "name": "Makanan"
        },
        "seller": {
          "id": "uuid",
          "store_name": "Toko Dodol Mak",
          "slug": "toko-dodol-mak"
        },
        "images": [
          {
            "id": "uuid",
            "url": "url",
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

### GET /products/:id
Get product by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Dodol Cilacap",
    "slug": "dodol-cilacap",
    "description": "Dodol khas Cilacap yang dibuat dengan bahan alami",
    "price": 25000,
    "stock": 100,
    "unit": "pcs",
    "weight": 200,
    "category": {
      "id": "uuid",
      "name": "Makanan",
      "slug": "makanan"
    },
    "seller": {
      "id": "uuid",
      "store_name": "Toko Dodol Mak",
      "slug": "toko-dodol-mak",
      "whatsapp": "6281234567890",
      "rating": 4.8
    },
    "images": [
      {
        "id": "uuid",
        "url": "url",
        "is_primary": true
      }
    ],
    "related_products": [
      {
        "id": "uuid",
        "name": "Keripik Singkong",
        "price": 15000,
        "image": "url"
      }
    ],
    "created_at": "2026-07-11T00:00:00Z"
  }
}
```

---

### POST /products
Create new product.

**Headers:** Authorization required (seller)

**Request:** multipart/form-data
- name: string
- description: string
- price: number
- stock: number
- unit: string
- weight: number
- category_id: uuid
- images: File[]

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

### PUT /products/:id
Update product.

**Headers:** Authorization required (seller, owner)

**Request:** multipart/form-data (same as create, all fields optional)

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

### DELETE /products/:id
Delete product.

**Headers:** Authorization required (seller, owner)

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Categories API

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
      "image": "url",
      "children": [
        {
          "id": "uuid",
          "name": "Dodol",
          "slug": "dodol",
          "image": "url"
        }
      ]
    }
  ]
}
```

---

### GET /categories/:slug
Get category by slug with products.

**Query Params:**
- page (default: 1)
- limit (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": "uuid",
      "name": "Makanan",
      "slug": "makanan",
      "description": "Produk makanan khas Cilacap"
    },
    "products": [
      {
        "id": "uuid",
        "name": "Dodol Cilacap",
        "price": 25000,
        "image": "url"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "total_pages": 3
    }
  }
}
```

---

## Orders API

### POST /orders
Create new order (checkout).

**Headers:** Authorization required

**Request:**
```json
{
  "seller_id": "uuid",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2
    }
  ],
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
    "subtotal": 50000,
    "total": 50000,
    "whatsapp_link": "https://wa.me/6281234567890?text=...",
    "items": [
      {
        "id": "uuid",
        "product_name": "Dodol Cilacap",
        "product_price": 25000,
        "quantity": 2,
        "subtotal": 50000
      }
    ]
  }
}
```

---

### GET /orders
Get user orders (buyer view).

**Headers:** Authorization required

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
          "store_name": "Toko Dodol Mak",
          "whatsapp": "6281234567890"
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

### GET /orders/:id
Get order detail.

**Headers:** Authorization required

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

### PUT /orders/:id/status
Update order status.

**Headers:** Authorization required (seller/buyer depending on status)

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

**Status Transitions:**
| From | To | By |
|------|-----|-----|
| pending | confirmed | Seller |
| confirmed | processing | Seller |
| processing | shipped | Seller |
| shipped | delivered | Buyer |
| delivered | completed | Buyer |
| pending | cancelled | Seller/Buyer |
| confirmed | cancelled | Seller/Buyer |

---

### GET /seller/orders
Get seller orders.

**Headers:** Authorization required (seller)

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

## Addresses API

### GET /addresses
Get user addresses.

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "phone": "081234567890",
      "address_line1": "Jl. Merdeka No. 1",
      "address_line2": "RT 01/RW 02",
      "city": "Cilacap",
      "province": "Jawa Tengah",
      "postal_code": "53211",
      "is_default": true
    }
  ]
}
```

---

### POST /addresses
Create new address.

**Headers:** Authorization required

**Request:**
```json
{
  "name": "John Doe",
  "phone": "081234567890",
  "address_line1": "Jl. Merdeka No. 1",
  "address_line2": "RT 01/RW 02",
  "city": "Cilacap",
  "province": "Jawa Tengah",
  "postal_code": "53211",
  "is_default": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe"
  }
}
```

---

### PUT /addresses/:id
Update address.

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Updated"
  }
}
```

---

### DELETE /addresses/:id
Delete address.

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

---

## Favorites API

### GET /favorites
Get user favorites.

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "product": {
        "id": "uuid",
        "name": "Dodol Cilacap",
        "price": 25000,
        "image": "url"
      },
      "created_at": "2026-07-11T00:00:00Z"
    }
  ]
}
```

---

### POST /favorites
Add product to favorites.

**Headers:** Authorization required

**Request:**
```json
{
  "product_id": "uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product added to favorites"
}
```

---

### DELETE /favorites/:productId
Remove product from favorites.

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "Product removed from favorites"
}
```

---

## Banners API

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
      "image_url": "url",
      "link": "/products/uuid"
    }
  ]
}
```

---

## Admin API

### GET /admin/dashboard
Get admin dashboard data.

**Headers:** Authorization required (admin)

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

**Headers:** Authorization required (admin)

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

**Headers:** Authorization required (admin)

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
          "name": "John Doe",
          "email": "john@example.com"
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

### PUT /admin/sellers/:id/verify
Verify seller.

**Headers:** Authorization required (admin)

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

### PUT /admin/sellers/:id/status
Update seller status.

**Headers:** Authorization required (admin)

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

### POST /admin/banners
Create banner.

**Headers:** Authorization required (admin), multipart/form-data

**Request:** FormData with title, image, link, is_active, start_date, end_date

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

## Error Responses

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

### 409 Conflict
```json
{
  "success": false,
  "error": "Email already exists"
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

| Endpoint | Limit | Window |
|----------|-------|--------|
| Public API | 100 req/min | 1 minute |
| Auth API | 10 req/min | 1 minute |
| Authenticated API | 300 req/min | 1 minute |
| Admin API | 600 req/min | 1 minute |

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

**Last Updated:** 11 Juli 2026