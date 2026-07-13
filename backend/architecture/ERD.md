# SADEAN — ERD (Entity Relationship Diagram)

> Diagram relasi database SADEAN V1

---

## Overview

ERD ini mendefinisikan seluruh entitas dan relasi dalam database SADEAN.

---

## Complete ERD

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SADEAN DATABASE ERD                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                PUBLIC SCHEMA                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                  users                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ id UUID PK                                                                  │
│ email VARCHAR(255) UNIQUE                                                   │
│ password VARCHAR(255)                                                        │
│ name VARCHAR(255)                                                            │
│ phone VARCHAR(20)                                                            │
│ role ENUM('buyer','seller','admin')                                          │
│ avatar VARCHAR(500)                                                          │
│ is_active BOOLEAN                                                            │
│ last_login TIMESTAMP                                                         │
│ created_at TIMESTAMP                                                         │
│ updated_at TIMESTAMP                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         │ 1
         │
         ├─────────────────────────────────────────────────────────────────────┐
         │                                                                     │
         │                                                                     │
         ▼ 1                                                                   ▼ 1
┌───────────────────────┐                                         ┌───────────────────────┐
│     refresh_tokens    │                                         │      addresses        │
├───────────────────────┤                                         ├───────────────────────┤
│ id UUID PK            │                                         │ id UUID PK            │
│ user_id UUID FK       │─────────────────────────┐               │ user_id UUID FK       │
│ token VARCHAR(500)    │                         │               │ name VARCHAR(255)     │
│ expires_at TIMESTAMP  │                         │               │ phone VARCHAR(20)     │
│ created_at TIMESTAMP  │                         │               │ address_line1 TEXT    │
└───────────────────────┘                         │               │ address_line2 TEXT    │
                                                  │               │ city VARCHAR(100)     │
                                                  │               │ province VARCHAR(100) │
                                                  │               │ postal_code VARCHAR(10)│
                                                  │               │ is_default BOOLEAN    │
                                                  │               │ created_at TIMESTAMP  │
                                                  │               │ updated_at TIMESTAMP  │
                                                  │               └───────────────────────┘
                                                  │
         1                                        │
         │                                        │
         ▼                                        │
┌───────────────────────┐                         │
│       sellers         │                         │
├───────────────────────┤                         │
│ id UUID PK            │                         │
│ user_id UUID FK       │─────────────────────────┘
│ store_name VARCHAR(255)│
│ slug VARCHAR(255) UNIQUE
│ description TEXT       │
│ address TEXT           │
│ phone VARCHAR(20)      │
│ whatsapp VARCHAR(20)   │
│ logo VARCHAR(500)      │
│ is_verified BOOLEAN    │
│ is_active BOOLEAN      │
│ verified_at TIMESTAMP  │
│ created_at TIMESTAMP   │
│ updated_at TIMESTAMP   │
└───────────┬───────────┘
            │
            │ 1
            │
            ├─────────────────────────────────────────────────────────────────────┐
            │                                                                     │
            │                                                                     │
            ▼ 1                                                                   ▼ 1
┌───────────────────────┐                                         ┌───────────────────────┐
│      products         │                                         │       orders          │
├───────────────────────┤                                         ├───────────────────────┤
│ id UUID PK            │                                         │ id UUID PK            │
│ seller_id UUID FK     │                                         │ order_number VARCHAR(20) UNIQUE
│ category_id UUID FK   │                                         │ user_id UUID FK       │
│ name VARCHAR(255)     │                                         │ seller_id UUID FK     │
│ slug VARCHAR(255) UNIQUE                                         │ status VARCHAR(20)    │
│ description TEXT      │                                         │ subtotal DECIMAL(12,2)│
│ price DECIMAL(12,2)   │                                         │ total DECIMAL(12,2)   │
│ stock INTEGER         │                                         │ notes TEXT            │
│ unit VARCHAR(50)      │                                         │ shipping_name VARCHAR(255)
│ weight INTEGER        │                                         │ shipping_phone VARCHAR(20)
│ is_active BOOLEAN     │                                         │ shipping_address TEXT │
│ created_at TIMESTAMP  │                                         │ cancelled_reason TEXT │
│ updated_at TIMESTAMP  │                                         │ cancelled_at TIMESTAMP│
└───────────┬───────────┘                                         │ confirmed_at TIMESTAMP│
            │                                                     │ processing_at TIMESTAMP│
            │                                                     │ shipped_at TIMESTAMP   │
            │ 1                                                   │ delivered_at TIMESTAMP │
            │                                                     │ completed_at TIMESTAMP │
            ├─────────────────────────────────────┐               │ created_at TIMESTAMP   │
            │                                     │               │ updated_at TIMESTAMP   │
            │                                     │               └───────────┬───────────┘
            ▼ *                                   ▼ *                         │
┌───────────────────────┐             ┌───────────────────────┐               │ 1
│   product_images      │             │      favorites        │               │
├───────────────────────┤             ├───────────────────────┤               │
│ id UUID PK            │             │ id UUID PK            │               │
│ product_id UUID FK    │             │ user_id UUID FK       │               │
│ image_url VARCHAR(500)│             │ product_id UUID FK    │               │
│ is_primary BOOLEAN    │             │ created_at TIMESTAMP  │               │
│ sort_order INTEGER    │             └───────────────────────┘               │
│ created_at TIMESTAMP  │                                                     │
└───────────────────────┘                                                     │
                                                                              │
                                                                              ▼ *
                                                                    ┌───────────────────────┐
                                                                    │     order_items       │
                                                                    ├───────────────────────┤
                                                                    │ id UUID PK            │
                                                                    │ order_id UUID FK      │
                                                                    │ product_id UUID FK    │
                                                                    │ product_name VARCHAR(255)
                                                                    │ product_price DECIMAL(12,2)
                                                                    │ quantity INTEGER       │
                                                                    │ subtotal DECIMAL(12,2) │
                                                                    │ created_at TIMESTAMP  │
                                                                    └───────────────────────┘

┌───────────────────────┐
│     categories        │
├───────────────────────┤
│ id UUID PK            │
│ parent_id UUID FK     │──────┐ (self-referencing)
│ name VARCHAR(255)     │      │
│ slug VARCHAR(255) UNIQUE      │
│ description TEXT      │      │
│ image VARCHAR(500)    │      │
│ is_active BOOLEAN     │      │
│ sort_order INTEGER    │      │
│ created_at TIMESTAMP  │      │
│ updated_at TIMESTAMP  │      │
└───────────────────────┘      │
                               │
                               └──────> categories (parent)

┌───────────────────────┐
│       banners         │
├───────────────────────┤
│ id UUID PK            │
│ title VARCHAR(255)    │
│ image_url VARCHAR(500)│
│ link VARCHAR(500)     │
│ is_active BOOLEAN     │
│ sort_order INTEGER    │
│ start_date TIMESTAMP  │
│ end_date TIMESTAMP    │
│ created_at TIMESTAMP  │
│ updated_at TIMESTAMP  │
└───────────────────────┘

┌───────────────────────┐
│     audit_logs        │
├───────────────────────┤
│ id UUID PK            │
│ user_id UUID FK       │
│ action VARCHAR(50)    │
│ entity VARCHAR(50)    │
│ entity_id UUID        │
│ old_data JSONB        │
│ new_data JSONB        │
│ ip_address VARCHAR(45)│
│ user_agent TEXT       │
│ created_at TIMESTAMP  │
└───────────────────────┘
```

---

## Relationship Summary

### One-to-One Relationships
| From | To | FK Column |
|------|----|-----------|
| users | sellers | user_id |

### One-to-Many Relationships
| From | To | FK Column |
|------|----|-----------|
| users | addresses | user_id |
| users | refresh_tokens | user_id |
| users | orders | user_id |
| users | favorites | user_id |
| sellers | products | seller_id |
| sellers | orders | seller_id |
| categories | products | category_id |
| categories | categories | parent_id |
| products | product_images | product_id |
| products | order_items | product_id |
| products | favorites | product_id |
| orders | order_items | order_id |

### Many-to-Many Relationships
| From | To | Through |
|------|----|---------|
| users | products | favorites |

---

## Constraints

### Primary Keys
- All tables have UUID primary keys
- Generated with gen_random_uuid()

### Foreign Keys
```sql
-- users
ALTER TABLE refresh_tokens ADD CONSTRAINT fk_refresh_tokens_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE sellers ADD CONSTRAINT fk_sellers_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE addresses ADD CONSTRAINT fk_addresses_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- sellers
ALTER TABLE products ADD CONSTRAINT fk_products_seller
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE;

ALTER TABLE orders ADD CONSTRAINT fk_orders_seller
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE RESTRICT;

-- categories
ALTER TABLE categories ADD CONSTRAINT fk_categories_parent
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL;

-- products
ALTER TABLE products ADD CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;

ALTER TABLE product_images ADD CONSTRAINT fk_product_images_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE favorites ADD CONSTRAINT fk_favorites_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

-- orders
ALTER TABLE orders ADD CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;

ALTER TABLE order_items ADD CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
```

### Unique Constraints
```sql
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);
ALTER TABLE sellers ADD CONSTRAINT uq_sellers_user_id UNIQUE (user_id);
ALTER TABLE sellers ADD CONSTRAINT uq_sellers_slug UNIQUE (slug);
ALTER TABLE categories ADD CONSTRAINT uq_categories_slug UNIQUE (slug);
ALTER TABLE products ADD CONSTRAINT uq_products_slug UNIQUE (slug);
ALTER TABLE orders ADD CONSTRAINT uq_orders_order_number UNIQUE (order_number);
ALTER TABLE favorites ADD CONSTRAINT uq_favorites_user_product UNIQUE (user_id, product_id);
```

### Check Constraints
```sql
ALTER TABLE products ADD CONSTRAINT chk_products_price CHECK (price > 0);
ALTER TABLE products ADD CONSTRAINT chk_products_stock CHECK (stock >= 0);
ALTER TABLE order_items ADD CONSTRAINT chk_order_items_quantity CHECK (quantity > 0);
```

---

## Indexes

### users
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
```

### sellers
```sql
CREATE INDEX idx_sellers_user_id ON sellers(user_id);
CREATE INDEX idx_sellers_slug ON sellers(slug);
CREATE INDEX idx_sellers_is_verified ON sellers(is_verified);
CREATE INDEX idx_sellers_is_active ON sellers(is_active);
```

### products
```sql
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
```

### orders
```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

---

## Cascade Rules

### CASCADE (Delete related records)
- refresh_tokens → users
- addresses → users
- sellers → users
- products → sellers
- product_images → products
- favorites → products
- order_items → orders

### RESTRICT (Prevent deletion)
- products → categories
- orders → sellers
- orders → users
- order_items → products

### SET NULL (Set to null)
- categories → categories (parent)

---

## Sample Queries

### Get all active products with seller info
```sql
SELECT 
    p.*,
    s.store_name,
    s.slug as seller_slug,
    u.name as seller_name
FROM products p
JOIN sellers s ON p.seller_id = s.id
JOIN users u ON s.user_id = u.id
WHERE p.is_active = true
AND s.is_active = true
ORDER BY p.created_at DESC;
```

### Get order with items
```sql
SELECT 
    o.*,
    json_agg(
        json_build_object(
            'id', oi.id,
            'product_name', oi.product_name,
            'product_price', oi.product_price,
            'quantity', oi.quantity,
            'subtotal', oi.subtotal
        )
    ) as items
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.id = $1
GROUP BY o.id;
```

### Get seller dashboard stats
```sql
SELECT 
    COUNT(DISTINCT p.id) as total_products,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.total), 0) as total_revenue
FROM sellers s
LEFT JOIN products p ON s.id = p.seller_id
LEFT JOIN orders o ON s.id = o.seller_id
WHERE s.id = $1;
```

---

**Status:** [x] Final

**Last Updated:** 11 Juli 2026