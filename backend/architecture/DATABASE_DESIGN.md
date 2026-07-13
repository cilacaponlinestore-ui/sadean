# SADEAN — Database Design

> Desain database PostgreSQL untuk SADEAN V1

---

## Overview

Database SADEAN menggunakan PostgreSQL dengan ORM Prisma. Desain mengutamakan:
- Normalisasi data
- Integritas referensial
- Performa query
- Skalabilitas

---

## Database Configuration

### PostgreSQL Settings
```yaml
Host: localhost
Port: 5432
Database: sadean
User: sadean_user
Password: [SECRET]
Max Connections: 20
Idle Timeout: 10 minutes
```

### Connection Pool
```yaml
Min: 2
Max: 20
Idle Timeout: 30000
```

---

## Tables

### 1. users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'buyer',
    avatar VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
```

**Notes:**
- Role: 'buyer', 'seller', 'admin'
- Password di-hash dengan bcrypt
- Email harus unik

---

### 2. refresh_tokens

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

---

### 3. sellers

```sql
CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    logo VARCHAR(500),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sellers_user_id ON sellers(user_id);
CREATE INDEX idx_sellers_slug ON sellers(slug);
CREATE INDEX idx_sellers_is_verified ON sellers(is_verified);
CREATE INDEX idx_sellers_is_active ON sellers(is_active);
```

---

### 4. categories

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
```

**Notes:**
- Self-referencing for sub-categories
- Max 2 levels deep

---

### 5. products

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'pcs',
    weight INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
```

**Constraints:**
- price > 0
- stock >= 0

---

### 6. product_images

```sql
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_is_primary ON product_images(is_primary);
```

**Rules:**
- Minimal 1 foto per produk
- Maksimal 5 foto per produk
- 1 foto harus primary

---

### 7. orders

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    subtotal DECIMAL(12, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    notes TEXT,
    shipping_name VARCHAR(255),
    shipping_phone VARCHAR(20),
    shipping_address TEXT,
    cancelled_reason TEXT,
    cancelled_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    processing_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

**Status Values:**
- pending
- confirmed
- processing
- shipped
- delivered
- completed
- cancelled

---

### 8. order_items

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(12, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

**Notes:**
- product_name & product_price are snapshots at order time
- subtotal = product_price * quantity

---

### 9. addresses

```sql
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_is_default ON addresses(is_default);
```

---

### 10. favorites

```sql
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);
```

---

### 11. banners

```sql
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    link VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_banners_is_active ON banners(is_active);
CREATE INDEX idx_banners_sort_order ON banners(sort_order);
CREATE INDEX idx_banners_start_date ON banners(start_date);
CREATE INDEX idx_banners_end_date ON banners(end_date);
```

---

### 12. audit_logs

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

---

## Relationships

### Entity Relationship Diagram

```
┌─────────────┐
│    users    │
└──────┬──────┘
       │
       ├─────────────────────────────────────────┐
       │                                         │
       ▼                                         ▼
┌─────────────┐                           ┌─────────────┐
│   sellers   │                           │  addresses  │
└──────┬──────┘                           └─────────────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌─────────────┐                   ┌─────────────┐
│  products   │                   │   orders    │
└──────┬──────┘                   └──────┬──────┘
       │                                 │
       ├─────────────┐                   │
       │             │                   │
       ▼             ▼                   ▼
┌──────────────┐ ┌─────────────┐  ┌─────────────┐
│product_images│ │  favorites  │  │ order_items │
└──────────────┘ └─────────────┘  └─────────────┘

┌─────────────┐
│ categories  │ (self-referencing)
└─────────────┘

┌─────────────┐
│   banners   │
└─────────────┘

┌─────────────┐
│ audit_logs  │
└─────────────┘
```

---

## Data Types

### UUID
- Primary keys
- Generated with gen_random_uuid()
- Version 4

### VARCHAR
- Variable length strings
- Appropriate max lengths

### TEXT
- Long text content
- Descriptions, notes

### DECIMAL(12, 2)
- Money values
- Precise calculations

### INTEGER
- Counts, quantities
- Sort orders

### BOOLEAN
- Flags
- is_active, is_verified

### TIMESTAMP
- Date and time
- With timezone support

### JSONB
- Flexible data storage
- Audit log data

---

## Indexes Strategy

### Primary Indexes
- All primary keys (automatic)

### Foreign Key Indexes
- All foreign keys for JOIN performance

### Search Indexes
- Email (unique)
- Slugs (unique)
- Product names (full-text search)

### Filter Indexes
- Status fields
- Active flags
- Category IDs

### Sort Indexes
- Created dates (DESC)
- Sort orders
- Prices

---

## Migration Strategy

### Version Control
- All migrations in version control
- Never modify production migrations
- Use rollback scripts

### Migration Naming
```
20260711_001_create_users_table.sql
20260711_002_create_sellers_table.sql
20260711_003_create_products_table.sql
```

### Rollback
```sql
-- Each migration should have a rollback
-- 20260711_001_create_users_table_rollback.sql
DROP TABLE IF EXISTS users;
```

---

## Seed Data

### Default Categories
```sql
INSERT INTO categories (name, slug, parent_id, sort_order) VALUES
('Makanan', 'makanan', NULL, 1),
('Dodol', 'dodol', (SELECT id FROM categories WHERE slug = 'makanan'), 1),
('Keripik', 'keripik', (SELECT id FROM categories WHERE slug = 'makanan'), 2),
('Kue', 'kue', (SELECT id FROM categories WHERE slug = 'makanan'), 3),
('Minuman', 'minuman', NULL, 2),
('Kopi', 'kopi', (SELECT id FROM categories WHERE slug = 'minuman'), 1),
('Teh', 'teh', (SELECT id FROM categories WHERE slug = 'minuman'), 2),
('Kerajinan', 'kerajinan', NULL, 3),
('Batik', 'batik', (SELECT id FROM categories WHERE slug = 'kerajinan'), 1),
('Anyaman', 'anyaman', (SELECT id FROM categories WHERE slug = 'kerajinan'), 2);
```

### Admin User
```sql
INSERT INTO users (email, password, name, role) VALUES
('admin@sadean.com', '$2b$10$...', 'Admin SADEAN', 'admin');
```

---

## Backup Strategy

### Automated Backups
- Daily full backup at 02:00 WIB
- Weekly backup retained for 30 days
- Monthly backup retained for 1 year

### Backup Location
- Local: /backups/postgresql/
- Remote: Cloud storage (optional)

### Restore Process
```bash
# Restore from backup
pg_restore -d sadean backup_file.dump

# Or from SQL
psql -d sadean < backup_file.sql
```

---

## Performance Tuning

### Query Optimization
- Use EXPLAIN ANALYZE for slow queries
- Add indexes for frequent queries
- Avoid SELECT * in production

### Connection Pooling
- Use PgBouncer for high traffic
- Configure appropriate pool size

### Caching
- Redis for frequently accessed data
- Cache product listings (5 min)
- Cache categories (1 hour)

---

**Status:** [x] Final

**Last Updated:** 11 Juli 2026