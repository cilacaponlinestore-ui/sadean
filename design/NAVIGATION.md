# SADEAN — Navigation Structure

> Navigation flows and information architecture

---

## Information Architecture

### Sitemap

```
SADEAN
├── Public
│   ├── Splash Screen
│   ├── Login
│   └── Register
│
├── Buyer
│   ├── Home
│   │   ├── Search
│   │   ├── Category
│   │   └── Product Detail
│   ├── Cart
│   │   └── Checkout
│   │       └── Order Success
│   ├── Orders
│   │   └── Order Detail
│   └── Profile
│       ├── Edit Profile
│       ├── Addresses
│       ├── Favorites
│       └── Settings
│
├── Seller
│   ├── Dashboard
│   ├── Products
│   │   ├── Add Product
│   │   └── Edit Product
│   ├── Orders
│   │   └── Order Detail
│   ├── Store Profile
│   │   └── Edit Store
│   └── Profile
│
└── Admin
    ├── Dashboard
    ├── Users
    ├── UMKM
    │   └── Verification
    ├── Products
    ├── Orders
    ├── Banners
    │   └── Add/Edit Banner
    └── Settings
```

---

## Buyer Navigation

### Bottom Navigation (Mobile)

```
┌────────┬────────┬────────┬────────┬────────┐
│  Home  │  Cari  │Keranjang│ Pesanan│ Profil │
│   🏠   │   🔍   │   🛒   │   📦   │   👤   │
└────────┴────────┴────────┴────────┴────────┘
```

#### Items
| Key | Label | Icon | Badge | Route |
|-----|-------|------|-------|-------|
| home | Home | HomeIcon | - | / |
| search | Cari | SearchIcon | - | /search |
| cart | Keranjang | CartIcon | Count | /cart |
| orders | Pesanan | OrderIcon | - | /orders |
| profile | Profil | ProfileIcon | - | /profile |

### Navigation Flow

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Home ──────────────────────────────────────────────>  │
│    │                                                     │
│    ├──> Search ──> Product Detail ──> Cart ──> Checkout │
│    │                                                     │
│    ├──> Category ──> Product List ──> Product Detail    │
│    │                                                     │
│    └──> Banner ──> Product Detail / Promotion           │
│                                                         │
│  Cart ──────────────────────────────────────────────>  │
│    │                                                     │
│    └──> Checkout ──> Order Success ──> Orders           │
│                                                         │
│  Orders ────────────────────────────────────────────>  │
│    │                                                     │
│    └──> Order Detail ──> WhatsApp Seller                │
│                                                         │
│  Profile ───────────────────────────────────────────>  │
│    │                                                     │
│    ├──> Edit Profile                                    │
│    ├──> Addresses                                       │
│    ├──> Favorites                                       │
│    └──> Settings                                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Seller Navigation

### Bottom Navigation (Mobile)

```
┌────────┬────────┬────────┬────────┬────────┐
│Dashboard│Produk │ Pesanan│  Toko  │ Profil │
│   📊   │   📦   │   📋   │   🏪   │   👤   │
└────────┴────────┴────────┴────────┴────────┘
```

#### Items
| Key | Label | Icon | Badge | Route |
|-----|-------|------|-------|-------|
| dashboard | Dashboard | DashboardIcon | - | /seller |
| products | Produk | ProductIcon | - | /seller/products |
| orders | Pesanan | OrderIcon | NewCount | /seller/orders |
| store | Toko | StoreIcon | - | /seller/store |
| profile | Profil | ProfileIcon | - | /seller/profile |

### Navigation Flow

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Dashboard ────────────────────────────────────────>   │
│    │                                                     │
│    ├──> Stats Overview                                  │
│    └──> Recent Orders ──> Order Detail                  │
│                                                         │
│  Products ──────────────────────────────────────────>  │
│    │                                                     │
│    ├──> Add Product ──> Form ──> Success                │
│    │                                                     │
│    └──> Edit Product ──> Form ──> Success               │
│                                                         │
│  Orders ────────────────────────────────────────────>  │
│    │                                                     │
│    ├──> Order Detail ──> WhatsApp Buyer                 │
│    └──> Update Status                                   │
│                                                         │
│  Store ─────────────────────────────────────────────>  │
│    │                                                     │
│    └──> Edit Store Profile                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Admin Navigation

### Sidebar Navigation (Desktop)

```
┌──────────────────┐
│      SADEAN      │
│    Admin Panel   │
├──────────────────┤
│ 📊 Dashboard    │
│ 👥 Users        │
│ 🏪 UMKM         │
│ 📦 Products     │
│ 📋 Orders       │
│ 🖼️ Banners      │
│ ⚙️ Settings     │
├──────────────────┤
│ 👤 Admin Name   │
│ 🚪 Logout       │
└──────────────────┘
```

#### Items
| Key | Label | Icon | Route |
|-----|-------|------|-------|
| dashboard | Dashboard | DashboardIcon | /admin |
| users | Users | UsersIcon | /admin/users |
| umkm | UMKM | StoreIcon | /admin/umkm |
| products | Products | ProductIcon | /admin/products |
| orders | Orders | OrderIcon | /admin/orders |
| banners | Banners | BannerIcon | /admin/banners |
| settings | Settings | SettingsIcon | /admin/settings |

### Navigation Flow

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Dashboard ────────────────────────────────────────>   │
│    │                                                     │
│    ├──> Stats Overview                                  │
│    ├──> Recent Activity                                 │
│    └──> Quick Actions                                   │
│                                                         │
│  Users ────────────────────────────────────────────>   │
│    │                                                     │
│    └──> User Detail ──> Edit / Deactivate               │
│                                                         │
│  UMKM ─────────────────────────────────────────────>   │
│    │                                                     │
│    ├──> Pending ──> Verification ──> Approve/Reject    │
│    ├──> Verified ──> View / Suspend                     │
│    └──> All ──> Search / Filter                         │
│                                                         │
│  Products ──────────────────────────────────────────>  │
│    │                                                     │
│    └──> Product Detail ──> Edit / Remove                │
│                                                         │
│  Orders ────────────────────────────────────────────>  │
│    │                                                     │
│    └──> Order Detail ──> Status / Refund                │
│                                                         │
│  Banners ───────────────────────────────────────────>  │
│    │                                                     │
│    ├──> Add Banner ──> Upload ──> Preview ──> Save     │
│    └──> Edit Banner ──> Update                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Route Structure

### Public Routes
```
/                   → Splash → Home/Login
/login              → Login Screen
/register           → Register Screen
```

### Buyer Routes
```
/                   → Home
/search             → Search
/search?q=query     → Search Results
/category/:id       → Category Products
/product/:id        → Product Detail
/cart                → Cart
/checkout            → Checkout
/order-success       → Order Success
/orders              → Order History
/orders/:id          → Order Detail
/profile             → Profile
/profile/edit        → Edit Profile
/profile/addresses   → Addresses
/profile/favorites   → Favorites
/settings            → Settings
```

### Seller Routes
```
/seller              → Dashboard
/seller/products     → Product List
/seller/products/add → Add Product
/seller/products/:id/edit → Edit Product
/seller/orders       → Order List
/seller/orders/:id   → Order Detail
/seller/store        → Store Profile
/seller/store/edit   → Edit Store
/seller/profile      → Profile
```

### Admin Routes
```
/admin               → Dashboard
/admin/users         → User List
/admin/users/:id     → User Detail
/admin/umkm          → UMKM List
/admin/umkm/:id      → UMKM Detail
/admin/products      → Product List
/admin/products/:id  → Product Detail
/admin/orders        → Order List
/admin/orders/:id    → Order Detail
/admin/banners       → Banner List
/admin/banners/add   → Add Banner
/admin/banners/:id/edit → Edit Banner
/admin/settings      → Settings
```

---

## Deep Linking

### Mobile Deep Links
```
sadean://product/:id        → Open product detail
sadean://order/:id          → Open order detail
sadean://seller/:id         → Open seller profile
sadean://category/:id       → Open category
```

### Universal Links (Web)
```
https://sadean.com/product/:id
https://sadean.com/order/:id
https://sadean.com/seller/:id
https://sadean.com/category/:id
```

---

## Back Navigation

### Rules
1. **Hardware Back (Android):** Goes to previous screen
2. **Software Back (AppBar):** Goes to parent screen
3. **Modal Back:** Closes modal, stays on screen
4. **Deep Link Back:** Goes to home if no history

### Stack Management
```
Screen Stack:
[Home] → [Search] → [Product] → [Cart] → [Checkout]

Back from Checkout:
[Home] → [Search] → [Product] → [Cart]

Back from Cart:
[Home] → [Search] → [Product]

Back from Product:
[Home] → [Search]

Back from Search:
[Home]
```

---

## Authentication Flow

### Unauthenticated
```
App Launch → Splash → Login/Register
                    ↓
            Home (Limited Access)
            - Can browse products
            - Cannot add to cart
            - Cannot checkout
```

### Authenticated
```
Login Success → Home (Full Access)
             → Save token
             → Load user data

Token Expired → Refresh token
              → If refresh fails → Logout → Login
```

### Role-Based Navigation
```
Buyer Login → / (Home)
Seller Login → /seller (Dashboard)
Admin Login → /admin (Dashboard)
```

---

## Search Flow

### Search Entry Points
1. Home screen search bar
2. Search tab in bottom nav
3. Category screen search
4. Product list filter

### Search Flow
```
Search Entry → Search Screen
            → Type query
            → Results appear (debounced 300ms)
            → Tap result → Product Detail
            → Apply filters → Updated results
            → Clear search → Recent searches
```

---

## Cart Flow

### Cart Entry Points
1. Add to cart button on product
2. Cart tab in bottom nav
3. "Buy Now" on product detail

### Cart Flow
```
Add to Cart → Toast confirmation
           → Update badge count

View Cart → List items
         → Adjust quantities
         → Remove items
         → Proceed to Checkout

Checkout → Enter address
        → Review order
        → Confirm → Order Success
```

---

## Order Flow

### Order States
```
pending → confirmed → processing → shipped → delivered → completed
    ↓         ↓           ↓          ↓
 cancelled  cancelled  cancelled  cancelled
```

### Order Flow
```
Checkout → Order Created (pending)
        → WhatsApp Seller

Seller Confirms → Status: confirmed
               → Notification buyer

Seller Processes → Status: processing

Seller Ships → Status: shipped
            → Tracking info (V4)

Buyer Receives → Status: delivered
              → Confirm receipt

Buyer Completes → Status: completed
               → Can rate (V2)
```

---

## Error Navigation

### 404 Page
```
┌─────────────────────────────────────┐
│                                     │
│            404                      │
│                                     │
│      Halaman tidak ditemukan        │
│                                     │
│     [Kembali ke Beranda]           │
│                                     │
└─────────────────────────────────────┘
```

### Network Error
```
┌─────────────────────────────────────┐
│                                     │
│         [No Internet]              │
│                                     │
│    Tidak ada koneksi internet       │
│                                     │
│        [Coba Lagi]                  │
│                                     │
└─────────────────────────────────────┘
```

### Server Error
```
┌─────────────────────────────────────┐
│                                     │
│          [Error]                    │
│                                     │
│      Terjadi kesalahan              │
│                                     │
│        [Coba Lagi]                  │
│                                     │
└─────────────────────────────────────┘
```

---

**Status:** [x] Final

**Last Updated:** 11 Juli 2026