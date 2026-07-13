# SADEAN — USER FLOW

---

## Buyer Flow

### Flow Belanja

```
┌─────────────┐
│   Masuk     │
│  (Login)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Cari Produk │
│  (Browse)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Lihat Detail│
│  (Product)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Tambah     │
│  Keranjang  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Checkout   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Order       │
│  Dibuat     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Hubungi     │
│ Seller via  │
│ WhatsApp    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Seller      │
│ Konfirmasi  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Order       │
│  Selesai    │
└─────────────┘
```

### Detail Flow

#### 1. Masuk (Login)
- Input: Email & Password
- Process: Validasi credentials
- Output: Redirect ke Dashboard Buyer

#### 2. Cari Produk
- Input: Keyword / Kategori
- Process: Search & Filter
- Output: Daftar Produk

#### 3. Lihat Detail
- Input: Product ID
- Process: Load product data
- Output: Detail Produk

#### 4. Tambah Keranjang
- Input: Product ID, Quantity
- Process: Add to cart
- Output: Updated cart

#### 5. Checkout
- Input: Cart items, Address
- Process: Create order
- Output: Order ID

#### 6. Hubungi Seller
- Input: Order ID
- Process: Generate WhatsApp link
- Output: WhatsApp chat

#### 7. Order Selesai
- Input: Confirmation from seller
- Process: Update order status
- Output: Order completed

---

## Seller Flow

### Flow Penjualan

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Tambah     │
│  Produk     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Kelola     │
│  Produk     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Terima     │
│  Order      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Balas      │
│  WhatsApp   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Update     │
│  Status     │
└─────────────┘
```

### Detail Flow

#### 1. Login
- Input: Email & Password
- Process: Validasi credentials
- Output: Redirect ke Dashboard Seller

#### 2. Dashboard
- Input: None
- Process: Load seller data
- Output: Overview stats

#### 3. Tambah Produk
- Input: Product data, Images
- Process: Create product
- Output: Product created

#### 4. Kelola Produk
- Input: Product ID
- Process: CRUD operations
- Output: Updated products

#### 5. Terima Order
- Input: Order ID
- Process: View order details
- Output: Order info

#### 6. Balas WhatsApp
- Input: Order ID
- Process: Generate response
- Output: WhatsApp message

#### 7. Update Status
- Input: Order ID, Status
- Process: Update order
- Output: Status updated

---

## Admin Flow

### Flow Admin

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Verifikasi │
│  UMKM       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Kelola     │
│  Produk     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Kelola     │
│  Banner     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Monitoring │
└─────────────┘
```

### Detail Flow

#### 1. Login
- Input: Email & Password
- Process: Validasi credentials
- Output: Redirect ke Dashboard Admin

#### 2. Dashboard
- Input: None
- Process: Load admin data
- Output: Overview stats

#### 3. Verifikasi UMKM
- Input: UMKM ID
- Process: Review & approve/reject
- Output: UMKM status updated

#### 4. Kelola Produk
- Input: Product ID
- Process: View/edit/delete
- Output: Updated products

#### 5. Kelola Banner
- Input: Banner data
- Process: CRUD operations
- Output: Updated banners

#### 6. Monitoring
- Input: None
- Process: View all activities
- Output: Dashboard metrics

---

## Error Handling

### Common Errors
| Error | Handling |
|-------|----------|
| Login failed | Show error message |
| Product not found | Redirect to 404 |
| Cart empty | Show empty cart message |
| Order failed | Show error, retry option |
| WhatsApp not available | Show manual contact info |

### Edge Cases
| Case | Handling |
|------|----------|
| Out of stock | Disable add to cart |
| Price changed | Show updated price |
| Seller inactive | Show unavailable |
| Duplicate order | Prevent duplicate |

---

## Mobile Flow

### Responsive Design
- All flows are mobile-friendly
- Touch-friendly buttons
- Simplified navigation
- Fast loading

### Mobile Specific
- Bottom navigation bar
- Swipe gestures
- Pull to refresh
- Push notifications (V3)

---

**Status:** [x] Final