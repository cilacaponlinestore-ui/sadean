# SADEAN — Screen Specifications

> Detailed screen layouts and specifications

---

## Buyer Screens

### 1. Splash Screen

#### Layout
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│            [LOGO]                   │
│                                     │
│       Dodolane Wong Cilacap         │
│                                     │
│                                     │
│                                     │
│          ● ● ● Loading              │
│                                     │
└─────────────────────────────────────┘
```

#### Specifications
- **Logo:** Centered, 120px width
- **Tagline:** Below logo, 14px, gray
- **Loading:** 3 dots animation
- **Duration:** 2-3 seconds
- **Transition:** Fade to Home

---

### 2. Login Screen

#### Layout
```
┌─────────────────────────────────────┐
│                                     │
│            [LOGO]                   │
│                                     │
│         Selamat Datang              │
│       Masuk ke akun Anda            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Email                       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Password              [👁]  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         MASUK               │   │
│  └─────────────────────────────┘   │
│                                     │
│     Lupa password?                  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│   Belum punya akun? [Daftar]        │
│                                     │
└─────────────────────────────────────┘
```

#### Specifications
- **Logo:** 80px width, centered
- **Title:** "Selamat Datang", 20px, semibold
- **Subtitle:** "Masuk ke akun Anda", 14px, gray
- **Input Height:** 48px
- **Button:** Full width, primary
- **Links:** Centered, primary color

---

### 3. Register Screen

#### Layout
```
┌─────────────────────────────────────┐
│                                     │
│            [LOGO]                   │
│                                     │
│         Daftar Akun                 │
│       Mulai berjualan di SADEAN     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Nama Lengkap                │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Email                       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Nomor HP                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Password              [👁]  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Konfirmasi Password   [👁]  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Saya ingin menjadi:                │
│  ┌──────────┐ ┌──────────┐        │
│  │  Pembeli │ │ Penjual  │        │
│  └──────────┘ └──────────┘        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         DAFTAR              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│   Sudah punya akun? [Masuk]         │
│                                     │
└─────────────────────────────────────┘
```

#### Specifications
- **Role Selector:** Segmented control
- **Phone Input:** Numeric keyboard
- **Password Toggle:** Show/hide password
- **Validation:** Real-time feedback

---

### 4. Home Screen (Buyer)

#### Layout
```
┌─────────────────────────────────────┐
│ SADEAN                    🔔  🛒[2] │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ 🔍 Cari produk...           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │      [Banner Carousel]      │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Kategori Populer                   │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐     │
│  │ 🍜 │ │ 🍪 │ │ ☕ │ │ 🎨 │     │
│  │Mknn│ │Krip│ │Kopi│ │Kraj│     │
│  └────┘ └────┘ └────┘ └────┘     │
│                                     │
│  Produk Terbaru                     │
│  ┌──────────┐ ┌──────────┐        │
│  │ [Image]  │ │ [Image]  │        │
│  │ Dodol    │ │ Keripik  │        │
│  │ Rp 25k   │ │ Rp 15k   │        │
│  │ Toko A   │ │ Toko B   │        │
│  └──────────┘ └──────────┘        │
│  ┌──────────┐ ┌──────────┐        │
│  │ [Image]  │ │ [Image]  │        │
│  │ Kopi     │ │ Batik    │        │
│  │ Rp 45k   │ │ Rp 150k  │        │
│  │ Toko C   │ │ Toko D   │        │
│  └──────────┘ └──────────┘        │
│                                     │
├─────────────────────────────────────┤
│  🏠    🔍    🛒    📦    👤        │
│ Home  Cari  Keranjang Pesanan Profil│
└─────────────────────────────────────┘
```

#### Specifications
- **App Bar:** Logo left, icons right
- **Banner:** Auto-scroll, 3:1 ratio
- **Categories:** Horizontal scroll, 64px icons
- **Products:** 2-column grid
- **Bottom Nav:** 5 items, icons + labels
- **Cart Badge:** Red circle with count

---

### 5. Search Screen

#### Layout
```
┌─────────────────────────────────────┐
│ ←  ┌───────────────────────────┐   │
│    │ 🔍 Cari produk...         │   │
│    └───────────────────────────┘   │
├─────────────────────────────────────┤
│  Pencarian Terakhir                │
│  ┌─────────────────────────────┐   │
│  │ Dodol           [×]         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Kopi            [×]         │   │
│  └─────────────────────────────┘   │
│                                     │
│  Filter: [Kategori ▼] [Harga ▼]   │
│                                     │
│  Hasil Pencarian (12)              │
│  ┌──────────┐ ┌──────────┐        │
│  │ [Image]  │ │ [Image]  │        │
│  │ Dodol    │ │ Dodol    │        │
│  │ Rp 25k   │ │ Rp 30k   │        │
│  └──────────┘ └──────────┘        │
│  ...                                │
│                                     │
├─────────────────────────────────────┤
│  🏠    🔍    🛒    📦    👤        │
└─────────────────────────────────────┘
```

#### Specifications
- **Search Bar:** Auto-focus, back button
- **Recent Searches:** Horizontal chips
- **Filters:** Category, price range
- **Results:** Grid layout
- **Empty State:** "Tidak ada hasil"

---

### 6. Product Detail Screen

#### Layout
```
┌─────────────────────────────────────┐
│ ←                        🔗  ❤️     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │      [Product Image]        │   │
│  │                             │   │
│  │         ● ● ○ ○            │   │
│  └─────────────────────────────┘   │
│                                     │
│  Dodol Cilacap Asli                 │
│  Rp 25.000                          │
│  Stok: 50 tersedia                  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  ┌──────┐                           │
│  │ [📷] │  Toko Dodol Mak          │
│  └──────┘  ⭐ 4.8 (120 ulasan)     │
│            📍 Cilacap Tengah        │
│            [💬 Chat Penjual]        │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Deskripsi Produk                   │
│  Dodol khas Cilacap yang dibuat     │
│  dengan bahan alami pilihan...      │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Produk Lainnya                     │
│  ┌──────────┐ ┌──────────┐        │
│  │ [Image]  │ │ [Image]  │        │
│  └──────────┘ └──────────┘        │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │  - [1] +     [Tambah Keranjang]│ │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Specifications
- **Image Gallery:** Swipeable, 1:1 ratio
- **Pagination Dots:** Below image
- **Price:** Bold, primary color
- **Seller Card:** Avatar, name, rating
- **WhatsApp Button:** Opens WhatsApp
- **Quantity Selector:** Minus, count, plus
- **Add to Cart:** Fixed bottom button

---

### 7. Cart Screen

#### Layout
```
┌─────────────────────────────────────┐
│ Keranjang                   Edit    │
├─────────────────────────────────────┤
│  Toko: Toko Dodol Mak              │
│  ┌─────────────────────────────┐   │
│  │ [Image] Dodol Cilacap       │   │
│  │         Rp 25.000           │   │
│  │         - [2] +      [🗑]   │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ [Image] Keripik Singkong    │   │
│  │         Rp 15.000           │   │
│  │         - [1] +      [🗑]   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Ringkasan Belanja                  │
│  Subtotal (3 item)     Rp 65.000   │
│  Total                 Rp 65.000   │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │      Checkout (3)           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Specifications
- **Seller Grouping:** Products grouped by seller
- **Quantity Control:** Inline with product
- **Swipe to Delete:** Left swipe reveals delete
- **Empty State:** Illustration + "Mulai Belanja"
- **Checkout Button:** Fixed bottom, shows total

---

### 8. Checkout Screen

#### Layout
```
┌─────────────────────────────────────┐
│ ← Checkout                          │
├─────────────────────────────────────┤
│  Alamat Pengiriman                  │
│  ┌─────────────────────────────┐   │
│  │ John Doe                    │   │
│  │ 081234567890                │   │
│  │ Jl. Merdeka No. 1           │   │
│  │ Cilacap Tengah              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Pesanan (2 item)                   │
│  ┌─────────────────────────────┐   │
│  │ [Img] Dodol Cilacap  x2    │   │
│  │       Rp 50.000             │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ [Img] Keripik        x1    │   │
│  │       Rp 15.000             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Catatan (opsional)                 │
│  ┌─────────────────────────────┐   │
│  │ Tolong packing yang rapi   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Total             Rp 65.000       │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │   Buat Pesanan              │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Specifications
- **Address:** Editable, default from profile
- **Order Summary:** Read-only list
- **Notes:** Optional textarea
- **Total:** Bold, prominent
- **Button:** Full width, primary

---

### 9. Order Success Screen

#### Layout
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│            ✅                       │
│                                     │
│       Pesanan Berhasil!             │
│                                     │
│   Nomor Pesanan:                    │
│   ORD-20260711-0001                │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  💬 Chat Penjual via WA     │  │
│   └─────────────────────────────┘  │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  Lihat Pesanan              │  │
│   └─────────────────────────────┘  │
│                                     │
│       Kembali ke Beranda            │
│                                     │
└─────────────────────────────────────┘
```

#### Specifications
- **Icon:** Large checkmark, success color
- **Order Number:** Prominent display
- **WhatsApp Button:** Primary action
- **View Order:** Secondary action
- **Back Home:** Text link

---

### 10. Order History Screen

#### Layout
```
┌─────────────────────────────────────┐
│ Pesanan Saya                        │
├─────────────────────────────────────┤
│ [Semua] [Diproses] [Dikirim] [Selesai]│
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ ORD-20260711-0001           │   │
│  │ 11 Jul 2026                 │   │
│  │ ─────────────────────────── │   │
│  │ [Img] Dodol Cilacap  x2    │   │
│  │ ─────────────────────────── │   │
│  │ Total: Rp 50.000            │   │
│  │ Status: [Diproses]          │   │
│  │ [💬 Hubungi Penjual]        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ORD-20260710-0003           │   │
│  │ 10 Jul 2026                 │   │
│  │ ─────────────────────────── │   │
│  │ Total: Rp 75.000            │   │
│  │ Status: [Selesai]           │   │
│  │ [Beli Lagi] [Beri Rating]   │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  🏠    🔍    🛒    📦    👤        │
└─────────────────────────────────────┘
```

#### Specifications
- **Tabs:** Horizontal scrollable
- **Order Card:** Summary with actions
- **Status Badge:** Color-coded
- **Actions:** Context-dependent

---

### 11. Profile Screen

#### Layout
```
┌─────────────────────────────────────┐
│ Profil Saya                         │
├─────────────────────────────────────┤
│           ┌────────┐               │
│           │ [Avatar]│              │
│           └────────┘               │
│         John Doe                    │
│      john@example.com               │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ 👤 Profil Saya           →  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 📍 Alamat Saya           →  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 📦 Pesanan Saya          →  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ❤️ Favorit              →  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ⚙️ Pengaturan            →  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🚪 Keluar               →  │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  🏠    🔍    🛒    📦    👤        │
└─────────────────────────────────────┘
```

#### Specifications
- **Avatar:** 80px, centered
- **Name/Email:** Centered below avatar
- **Menu List:** Full-width cards
- **Icons:** Left-aligned
- **Chevron:** Right-aligned

---

## Seller Screens

### 1. Seller Dashboard

#### Layout
```
┌─────────────────────────────────────┐
│ Dashboard                    ⚙️     │
├─────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐        │
│  │ 📦       │ │ 📋       │        │
│  │ 12       │ │ 5        │        │
│  │ Produk   │ │ Pesanan  │        │
│  └──────────┘ └──────────┘        │
│  ┌──────────┐ ┌──────────┐        │
│  │ 💰       │ │ ⭐       │        │
│  │ Rp 2.5jt │ │ 4.8      │        │
│  │ Bulan Ini │ │ Rating   │        │
│  └──────────┘ └──────────┘        │
│                                     │
│  Pesanan Baru                       │
│  ┌─────────────────────────────┐   │
│  │ ORD-20260711-0001           │   │
│  │ John Doe • 2 item           │   │
│  │ Rp 65.000                   │   │
│  │ [Konfirmasi] [Lihat]        │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ORD-20260711-0002           │   │
│  │ Jane Doe • 1 item           │   │
│  │ Rp 25.000                   │   │
│  │ [Konfirmasi] [Lihat]        │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  📊    📦    📋    🏪    👤        │
│ Dashboard Produk Pesanan Toko Profil│
└─────────────────────────────────────┘
```

#### Specifications
- **Stats Cards:** 2x2 grid
- **Recent Orders:** List with actions
- **Quick Actions:** Prominent buttons

---

### 2. Product List (Seller)

#### Layout
```
┌─────────────────────────────────────┐
│ Produk Saya               + Tambah  │
├─────────────────────────────────────┤
│  🔍 Cari produk...                 │
│                                     │
│  Filter: [Semua ▼] [Kategori ▼]   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Image] Dodol Cilacap       │   │
│  │         Rp 25.000           │   │
│  │         Stok: 50            │   │
│  │         [Aktif]             │   │
│  │         [Edit] [Hapus]      │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ [Image] Keripik             │   │
│  │         Rp 15.000           │   │
│  │         Stok: 0             │   │
│  │         [Stok Habis]        │   │
│  │         [Edit] [Hapus]      │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  📊    📦    📋    🏪    👤        │
└─────────────────────────────────────┘
```

#### Specifications
- **Add Button:** Top right
- **Product Card:** Image, info, actions
- **Stock Badge:** Color-coded
- **Bulk Actions:** Select multiple

---

### 3. Add/Edit Product

#### Layout
```
┌─────────────────────────────────────┐
│ ← Tambah Produk                     │
├─────────────────────────────────────┤
│  Foto Produk                        │
│  ┌──────────┐ ┌──────────┐        │
│  │    +     │ │ [Image]  │        │
│  │ Tambah   │ │   [×]    │        │
│  │ Foto     │ │          │        │
│  └──────────┘ └──────────┘        │
│                                     │
│  Nama Produk *                      │
│  ┌─────────────────────────────┐   │
│  │ Dodol Cilacap Asli          │   │
│  └─────────────────────────────┘   │
│                                     │
│  Deskripsi *                        │
│  ┌─────────────────────────────┐   │
│  │ Dodol khas Cilacap yang...  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Harga *           Stok *          │
│  ┌───────────────┐ ┌──────────┐   │
│  │ Rp 25.000     │ │ 50       │   │
│  └───────────────┘ └──────────┘   │
│                                     │
│  Satuan *         Berat (gram)     │
│  ┌───────────────┐ ┌──────────┐   │
│  │ pcs            │ │ 200      │   │
│  └───────────────┘ └──────────┘   │
│                                     │
│  Kategori *                         │
│  ┌─────────────────────────────┐   │
│  │ Pilih Kategori        ▼     │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │         Simpan              │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Specifications
- **Image Upload:** Max 5 photos
- **Drag & Drop:** Reorder photos
- **Validation:** Required fields marked
- **Auto-save:** Draft saved locally

---

### 4. Orders (Seller)

#### Layout
```
┌─────────────────────────────────────┐
│ Pesanan Masuk                       │
├─────────────────────────────────────┤
│ [Baru (3)] [Diproses] [Selesai]     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ ORD-20260711-0001           │   │
│  │ 11 Jul 2026 • 14:30         │   │
│  │ ─────────────────────────── │   │
│  │ John Doe                    │   │
│  │ 081234567890                │   │
│  │ ─────────────────────────── │   │
│  │ • Dodol Cilacap x2          │   │
│  │ • Keripik x1                │   │
│  │ ─────────────────────────── │   │
│  │ Total: Rp 65.000            │   │
│  │ ─────────────────────────── │   │
│  │ [💬 WhatsApp] [✅ Konfirmasi]│  │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  📊    📦    📋    🏪    👤        │
└─────────────────────────────────────┘
```

#### Specifications
- **Tabs:** Filter by status
- **Order Card:** Full details
- **Quick Actions:** WhatsApp, Confirm
- **Swipe Actions:** Update status

---

### 5. Store Profile

#### Layout
```
┌─────────────────────────────────────┐
│ Profil Toko                    Edit │
├─────────────────────────────────────┤
│           ┌────────┐               │
│           │[Logo]  │              │
│           └────────┘               │
│      Toko Dodol Mak                │
│      ⭐ 4.8 (120 ulasan)          │
│                                     │
│  Deskripsi Toko                     │
│  Menjual dodol dan keripik khas    │
│  Cilacap sejak 2020...             │
│                                     │
│  Informasi Kontak                   │
│  📞 081234567890                   │
│  💬 6281234567890 (WhatsApp)       │
│  📍 Jl. Merdeka No. 1, Cilacap    │
│                                     │
│  Statistik Toko                     │
│  Produk: 12                        │
│  Terjual: 250                      │
│  Bergabung: Jan 2026               │
│                                     │
├─────────────────────────────────────┤
│  📊    📦    📋    🏪    👤        │
└─────────────────────────────────────┘
```

#### Specifications
- **Logo:** 100px, centered
- **Rating:** Star display
- **Contact Info:** Icon + value
- **Stats:** Summary cards

---

## Admin Screens

### 1. Admin Dashboard

#### Layout
```
┌─────────────────────────────────────┐
│ ☰ Dashboard Admin                   │
├──────────┬──────────────────────────┤
│          │                          │
│ 📊 Dash  │  Overview                │
│ 👥 Users │                          │
│ 🏪 UMKM  │  ┌────┐ ┌────┐ ┌────┐  │
│ 📦 Produk│  │150 │ │ 50 │ │ 5  │  │
│ 📋 Order │  │User│ │UMKM│ │New │  │
│ 🖼️ Banner│  └────┘ └────┘ └────┘  │
│ ⚙️ Set   │                          │
│          │  ┌────────────────────┐  │
│          │  │ Revenue Chart      │  │
│          │  │                    │  │
│          │  └────────────────────┘  │
│          │                          │
│          │  Recent Activity         │
│          │  • New seller registered │
│          │  • Order completed       │
│          │  • User registered       │
│          │                          │
└──────────┴──────────────────────────┘
```

#### Specifications
- **Sidebar:** Fixed, collapsible
- **Stats Cards:** 4 cards
- **Charts:** Revenue, orders
- **Activity Feed:** Recent events

---

### 2. UMKM Management

#### Layout
```
┌─────────────────────────────────────┐
│ ☰ Manajemen UMKM                    │
├──────────┬──────────────────────────┤
│          │                          │
│ 📊 Dash  │  [Pending (5)] [Verified]│
│ 👥 Users │  [All]                   │
│ 🏪 UMKM  │                          │
│ 📦 Produk│  ┌────────────────────┐  │
│ 📋 Order │  │ [Logo] Toko Mak   │  │
│ 🖼️ Banner│  │ Owner: John Doe   │  │
│ ⚙️ Set   │  │ Phone: 0812...    │  │
│          │  │ Status: Pending   │  │
│          │  │ [View] [Verify]   │  │
│          │  └────────────────────┘  │
│          │  ┌────────────────────┐  │
│          │  │ [Logo] Toko Keripik│  │
│          │  │ Owner: Jane Doe   │  │
│          │  │ Status: Pending   │  │
│          │  │ [View] [Verify]   │  │
│          │  └────────────────────┘  │
│          │                          │
└──────────┴──────────────────────────┘
```

#### Specifications
- **Tabs:** Filter by status
- **Seller Card:** Logo, owner, actions
- **Verify Flow:** Review → Approve/Reject
- **Bulk Actions:** Approve all pending

---

### 3. Banner Management

#### Layout
```
┌─────────────────────────────────────┐
│ ☰ Manajemen Banner                  │
├──────────┬──────────────────────────┤
│          │                          │
│ 📊 Dash  │  + Tambah Banner         │
│ 👥 Users │                          │
│ 🏪 UMKM  │  ┌────────────────────┐  │
│ 📦 Produk│  │ [Image Preview]    │  │
│ 📋 Order │  │ Promo Spesial      │  │
│ 🖼️ Banner│  │ Active • 1-31 Jul  │  │
│ ⚙️ Set   │  │ [Edit] [Delete]    │  │
│          │  └────────────────────┘  │
│          │  ┌────────────────────┐  │
│          │  │ [Image Preview]    │  │
│          │  │ Produk Baru        │  │
│          │  │ Inactive           │  │
│          │  │ [Edit] [Delete]    │  │
│          │  └────────────────────┘  │
│          │                          │
└──────────┴──────────────────────────┘
```

#### Specifications
- **Banner Card:** Preview, info, actions
- **Upload:** Drag & drop area
- **Preview:** Live preview before save
- **Scheduling:** Start/end date

---

**Status:** [x] Final

**Last Updated:** 11 Juli 2026