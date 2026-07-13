# SADEAN — ERD (Entity Relationship Diagram)

---

## Minimal Entity

### 1. Users
```
+-------------------+
|      users        |
+-------------------+
| id           (PK)|
| email            |
| password         |
| name             |
| phone            |
| role             |
| avatar           |
| is_active        |
| created_at       |
| updated_at       |
+-------------------+
```

**Relations:**
- 1 user → 1 seller profile (optional)
- 1 user → many orders
- 1 user → many addresses
- 1 user → many favorites

---

### 2. Roles
```
+-------------------+
|      roles        |
+-------------------+
| id           (PK)|
| name             |
| description      |
+-------------------+
```

**Values:**
- buyer
- seller
- admin

**Note:** Role disimpan di tabel users, tabel roles hanya sebagai referensi

---

### 3. Sellers (UMKM)
```
+-------------------+
|      sellers      |
+-------------------+
| id           (PK)|
| user_id      (FK)|
| store_name        |
| description      |
| address          |
| phone            |
| whatsapp         |
| logo             |
| is_verified      |
| is_active        |
| verified_at      |
| created_at       |
| updated_at       |
+-------------------+
```

**Relations:**
- 1 seller → 1 user
- 1 seller → many products
- 1 seller → many orders

---

### 4. Categories
```
+-------------------+
|    categories     |
+-------------------+
| id           (PK)|
| parent_id    (FK)|
| name             |
| slug             |
| description      |
| image            |
| is_active        |
| sort_order       |
| created_at       |
| updated_at       |
+-------------------+
```

**Relations:**
- 1 category → many products
- 1 category → many sub-categories (self-referencing)

---

### 5. Products
```
+-------------------+
|     products      |
+-------------------+
| id           (PK)|
| seller_id    (FK)|
| category_id  (FK)|
| name             |
| slug             |
| description      |
| price            |
| stock            |
| unit             |
| weight           |
| is_active        |
| created_at       |
| updated_at       |
+-------------------+
```

**Relations:**
- 1 product → 1 seller
- 1 product → 1 category
- 1 product → many product_images
- 1 product → many order_items
- 1 product → many favorites

---

### 6. Product Images
```
+-------------------+
|  product_images   |
+-------------------+
| id           (PK)|
| product_id   (FK)|
| image_url         |
| is_primary       |
| sort_order       |
| created_at       |
+-------------------+
```

**Relations:**
- 1 product_image → 1 product

---

### 7. Orders
```
+-------------------+
|      orders       |
+-------------------+
| id           (PK)|
| order_number      |
| user_id      (FK)|
| seller_id    (FK)|
| status            |
| subtotal          |
| total             |
| notes             |
| shipping_address  |
| shipping_name     |
| shipping_phone    |
| created_at       |
| updated_at       |
+-------------------+
```

**Relations:**
- 1 order → 1 user (buyer)
- 1 order → 1 seller
- 1 order → many order_items

**Status Values:**
- pending
- confirmed
- processing
- shipped
- delivered
- completed
- cancelled

---

### 8. Order Items
```
+-------------------+
|   order_items     |
+-------------------+
| id           (PK)|
| order_id     (FK)|
| product_id   (FK)|
| product_name      |
| product_price     |
| quantity          |
| subtotal          |
| created_at       |
+-------------------+
```

**Relations:**
- 1 order_item → 1 order
- 1 order_item → 1 product

**Note:** product_name dan product_price disimpan saat order dibuat (snapshot)

---

### 9. Addresses
```
+-------------------+
|     addresses     |
+-------------------+
| id           (PK)|
| user_id      (FK)|
| name             |
| phone            |
| address_line1    |
| address_line2    |
| city             |
| province         |
| postal_code      |
| is_default       |
| created_at       |
| updated_at       |
+-------------------+
```

**Relations:**
- 1 address → 1 user

---

### 10. Favorites
```
+-------------------+
|     favorites     |
+-------------------+
| id           (PK)|
| user_id      (FK)|
| product_id   (FK)|
| created_at       |
+-------------------+
```

**Relations:**
- 1 favorite → 1 user
- 1 favorite → 1 product

**Constraint:** Unique(user_id, product_id)

---

### 11. Banners
```
+-------------------+
|      banners      |
+-------------------+
| id           (PK)|
| title            |
| image_url        |
| link             |
| is_active        |
| sort_order       |
| start_date       |
| end_date         |
| created_at       |
| updated_at       |
+-------------------+
```

**Relations:** None (standalone)

---

## Relationship Diagram

```
┌─────────┐     ┌──────────┐     ┌──────────┐
│  users  │────<│ sellers  │>────│ products │
└─────────┘     └──────────┘     └──────────┘
     │                                  │
     │                                  │
     ▼                                  ▼
┌──────────┐                    ┌──────────────┐
│ addresses│                    │product_images│
└──────────┘                    └──────────────┘
     │
     │
     ▼
┌──────────┐     ┌────────────┐
│ favorites│>────│ products   │
└──────────┘     └────────────┘

┌──────────┐     ┌────────────┐
│  orders  │>────│order_items │>────│ products │
└──────────┘     └────────────┘

┌────────────┐
│ categories │ (self-referencing)
└────────────┘

┌──────────┐
│  banners │
└──────────┘
```

---

## Index Strategy

### Users
- email (unique)
- role

### Sellers
- user_id (unique)
- is_verified
- is_active

### Products
- seller_id
- category_id
- is_active
- price
- name (full-text search)

### Orders
- user_id
- seller_id
- order_number (unique)
- status
- created_at

### Order Items
- order_id
- product_id

---

## Migration Order

1. users
2. sellers
3. categories
4. products
5. product_images
6. orders
7. order_items
8. addresses
9. favorites
10. banners

---

## Sample Data

### Users
```sql
INSERT INTO users (email, password, name, phone, role) VALUES
('buyer@test.com', '$2b$10$...', 'Buyer Test', '081234567890', 'buyer'),
('seller@test.com', '$2b$10$...', 'Seller Test', '081234567891', 'seller'),
('admin@test.com', '$2b$10$...', 'Admin Test', '081234567892', 'admin');
```

### Categories
```sql
INSERT INTO categories (name, slug, parent_id) VALUES
('Makanan', 'makanan', NULL),
('Dodol', 'dodol', 1),
('Keripik', 'keripik', 1),
('Minuman', 'minuman', NULL),
('Kopi', 'kopi', 4);
```

---

**Status:** [x] Final