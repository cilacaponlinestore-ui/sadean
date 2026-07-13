# SADEAN — UI Guideline

> **Dodolane Wong Cilacap**
> Platform Digital UMKM Cilacap

---

## Filosofi Desain

> **Sederhana, cepat, dan mudah digunakan oleh semua kalangan, termasuk pelaku UMKM yang belum terbiasa dengan teknologi.**

### Prinsip Utama
- **Mobile First** — Desain dimulai dari mobile, lalu diperluas ke desktop
- **Minimal Learning Curve** — Interface intuitif tanpa perlu pembelajaran
- **Maksimal 3 Klik** — Dari homepage ke checkout maksimal 3 langkah
- **Navigasi Sederhana** — Menu yang mudah dipahami semua usia
- **Akses Cepat** — WhatsApp seller selalu mudah diakses
- **Fokus Transaksi** — Tampilan bersih tanpa dekorasi berlebih

---

## 1. Design System

### Color Palette

#### Primary
```
Primary:        #2563EB (Blue-600)
Primary Light:  #3B82F6 (Blue-500)
Primary Dark:   #1D4ED8 (Blue-700)
Primary 50:     #EFF6FF (Blue-50)
Primary 100:    #DBEAFE (Blue-100)
```

#### Secondary
```
Secondary:        #10B981 (Emerald-500)
Secondary Light:  #34D399 (Emerald-400)
Secondary Dark:   #059669 (Emerald-600)
```

#### Success
```
Success:        #22C55E (Green-500)
Success Light:  #4ADE80 (Green-400)
Success Dark:   #16A34A (Green-600)
```

#### Warning
```
Warning:        #F59E0B (Amber-500)
Warning Light:  #FBBF24 (Amber-400)
Warning Dark:   #D97706 (Amber-600)
```

#### Danger
```
Danger:        #EF4444 (Red-500)
Danger Light:  #F87171 (Red-400)
Danger Dark:   #DC2626 (Red-600)
```

#### Neutral
```
Background:    #F9FAFB (Gray-50)
Surface:       #FFFFFF (White)
Text Primary:  #111827 (Gray-900)
Text Secondary:#6B7280 (Gray-500)
Text Tertiary: #9CA3AF (Gray-400)
Border:        #E5E7EB (Gray-200)
Border Light:  #F3F4F6 (Gray-100)
```

#### Brand Accent (Cultural)
```
Batik Brown:   #8B4513
Keramik Red:   #B22222
Alam Green:    #2E8B57
```

---

### Typography

#### Font Family
```css
/* Primary Font */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Heading Font (Optional - for branding) */
font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
```

#### Type Scale

| Name | Size | Weight | Line Height | Use Case |
|------|------|--------|-------------|----------|
| Display | 36px | Bold (700) | 44px | Hero text |
| H1 | 30px | Bold (700) | 36px | Page title |
| H2 | 24px | Semibold (600) | 32px | Section title |
| H3 | 20px | Semibold (600) | 28px | Card title |
| H4 | 16px | Medium (500) | 24px | Subsection |
| Body Large | 16px | Regular (400) | 24px | Body text |
| Body | 14px | Regular (400) | 20px | Default text |
| Body Small | 12px | Regular (400) | 16px | Caption |
| Caption | 10px | Regular (400) | 14px | Small text |

---

### Spacing

#### Base Unit: 4px

| Token | Value | Use Case |
|-------|-------|----------|
| space-1 | 4px | Icon padding, small gaps |
| space-2 | 8px | Inline elements, tight spacing |
| space-3 | 12px | Button padding, input padding |
| space-4 | 16px | Card padding, section gaps |
| space-5 | 20px | Medium spacing |
| space-6 | 24px | Section spacing |
| space-8 | 32px | Large section gaps |
| space-10 | 40px | Page margins |
| space-12 | 48px | Hero sections |

---

### Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| radius-sm | 4px | Badges, chips |
| radius-md | 8px | Buttons, inputs, cards |
| radius-lg | 12px | Modals, large cards |
| radius-xl | 16px | Bottom sheets |
| radius-full | 9999px | Avatars, icons |

---

### Shadow

| Token | Value | Use Case |
|-------|-------|----------|
| shadow-sm | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| shadow-md | `0 4px 6px rgba(0,0,0,0.1)` | Cards, dropdowns |
| shadow-lg | `0 10px 15px rgba(0,0,0,0.1)` | Modals, popovers |
| shadow-xl | `0 20px 25px rgba(0,0,0,0.15)` | Floating elements |

---

## 2. Component Library

### Button

#### Variants
```yaml
Primary:
  Background: Primary (#2563EB)
  Text: White
  Hover: Primary Dark (#1D4ED8)
  
Secondary:
  Background: Transparent
  Border: Primary (#2563EB)
  Text: Primary
  Hover: Primary 50 (#EFF6FF)
  
Danger:
  Background: Danger (#EF4444)
  Text: White
  Hover: Danger Dark (#DC2626)
  
Ghost:
  Background: Transparent
  Text: Primary
  Hover: Gray 100 (#F3F4F6)
```

#### Sizes
```yaml
Small:
  Height: 32px
  Padding: 8px 12px
  Font: 12px
  
Medium:
  Height: 40px
  Padding: 8px 16px
  Font: 14px
  
Large:
  Height: 48px
  Padding: 12px 24px
  Font: 16px
```

#### States
```yaml
Default: As defined
Hover: Slightly darker
Active: Even darker
Disabled: 50% opacity, cursor not-allowed
Loading: Spinner icon, text hidden
```

---

### Card

```yaml
Base Card:
  Background: White
  Border: 1px solid Gray-200
  Border Radius: 8px
  Shadow: shadow-sm
  Padding: 16px
  
Elevated Card:
  Background: White
  Border: None
  Border Radius: 8px
  Shadow: shadow-md
  Padding: 16px
```

---

### Product Card

```yaml
Container:
  Width: 100% (grid item)
  Background: White
  Border: 1px solid Gray-200
  Border Radius: 8px
  Overflow: hidden

Image:
  Width: 100%
  Aspect Ratio: 1:1
  Object Fit: cover
  Background: Gray-100

Content:
  Padding: 12px
  
  Name:
    Font: Body (14px)
    Weight: Medium
    Color: Text Primary
    Max Lines: 2
    
  Price:
    Font: Body (14px)
    Weight: Bold
    Color: Primary
    
  Store:
    Font: Caption (12px)
    Color: Text Secondary
    
  Badge (Optional):
    Position: Absolute top-right
    Background: Danger
    Color: White
    Font: 10px
```

---

### Input

```yaml
Container:
  Height: 40px
  Border: 1px solid Gray-300
  Border Radius: 8px
  Padding: 0 12px
  Background: White
  
Label:
  Font: Body Small (12px)
  Weight: Medium
  Color: Text Primary
  Margin Bottom: 4px
  
Helper Text:
  Font: Caption (10px)
  Color: Text Secondary
  Margin Top: 4px
  
States:
  Default: Border Gray-300
  Focus: Border Primary, Ring 2px Primary 20%
  Error: Border Danger, Ring 2px Danger 20%
  Disabled: Background Gray-100
```

---

### Search Bar

```yaml
Container:
  Height: 48px
  Background: Gray-100
  Border Radius: 24px
  Padding: 0 16px
  Display: Flex
  Align: Center
  
Icon:
  Width: 20px
  Height: 20px
  Color: Text Secondary
  Margin Right: 12px
  
Input:
  Flex: 1
  Border: None
  Background: Transparent
  Font: Body (14px)
  
Placeholder:
  Color: Text Tertiary
```

---

### Badge

```yaml
Variants:
  Primary:
    Background: Primary 100
    Color: Primary
  Success:
    Background: Green 100
    Color: Success
  Warning:
    Background: Amber 100
    Color: Warning
  Danger:
    Background: Red 100
    Color: Danger
    
Size:
  Small: Height 20px, Padding 4px 8px, Font 10px
  Medium: Height 24px, Padding 4px 12px, Font 12px
  
Border Radius: Full (9999px)
```

---

### Modal

```yaml
Overlay:
  Background: Black 50%
  Blur: 4px
  
Container:
  Background: White
  Border Radius: 16px
  Width: 90% (Mobile), 480px (Desktop)
  Max Height: 80vh
  Shadow: shadow-xl
  
Header:
  Padding: 16px 20px
  Border Bottom: 1px solid Gray-200
  Font: H3 (20px)
  
Body:
  Padding: 20px
  
Footer:
  Padding: 16px 20px
  Border Top: 1px solid Gray-200
  Display: Flex
  Gap: 12px
```

---

### Navbar (Mobile Bottom)

```yaml
Container:
  Height: 64px
  Background: White
  Border Top: 1px solid Gray-200
  Display: Flex
  Justify: Space Around
  Align: Center
  Position: Fixed
  Bottom: 0
  
Item:
  Display: Flex
  Flex Direction: Column
  Align: Center
  Gap: 4px
  
  Icon:
    Width: 24px
    Height: 24px
    Color: Text Secondary
    
  Label:
    Font: 10px
    Color: Text Secondary
    
  Active:
    Icon Color: Primary
    Label Color: Primary
    Weight: Medium
```

---

### Sidebar (Desktop)

```yaml
Container:
  Width: 256px
  Background: White
  Border Right: 1px solid Gray-200
  Height: 100vh
  Position: Fixed
  Left: 0
  
Logo:
  Height: 64px
  Padding: 16px
  Border Bottom: 1px solid Gray-200
  
Menu:
  Padding: 8px 0
  
Item:
  Height: 44px
  Padding: 0 16px
  Display: Flex
  Align: Center
  Gap: 12px
  Font: Body (14px)
  Color: Text Secondary
  
  Hover:
    Background: Gray-50
    
  Active:
    Background: Primary 50
    Color: Primary
    Weight: Medium
```

---

### App Bar (Mobile Header)

```yaml
Container:
  Height: 56px
  Background: White
  Border Bottom: 1px solid Gray-200
  Display: Flex
  Align: Center
  Padding: 0 16px
  
Title:
  Font: H4 (16px)
  Weight: Medium
  Flex: 1
  
Actions:
  Display: Flex
  Gap: 8px
  
IconButton:
  Width: 40px
  Height: 40px
  Border Radius: 20px
  Display: Flex
  Justify: Center
  Align: Center
  Hover: Gray-100
```

---

### Banner

```yaml
Container:
  Width: 100%
  Aspect Ratio: 3:1 (Mobile), 4:1 (Desktop)
  Border Radius: 12px
  Overflow: hidden
  Position: relative
  
Image:
  Width: 100%
  Height: 100%
  Object Fit: cover
  
Overlay (Optional):
  Background: Linear gradient from transparent to black 50%
  Position: absolute
  
Content:
  Position: Absolute bottom
  Padding: 16px
  Color: White
  
Title:
  Font: H3 (20px)
  Weight: Bold
  
Description:
  Font: Body (14px)
```

---

### Category Card

```yaml
Container:
  Width: 80px
  Display: Flex
  Flex Direction: Column
  Align: Center
  Gap: 8px
  
Image:
  Width: 64px
  Height: 64px
  Border Radius: 16px
  Background: Gray-100
  Object Fit: cover
  
Name:
  Font: Caption (12px)
  Text Align: center
  Max Lines: 2
```

---

### Empty State

```yaml
Container:
  Display: Flex
  Flex Direction: Column
  Align: Center
  Padding: 48px 24px
  
Icon:
  Width: 80px
  Height: 80px
  Color: Text Tertiary
  Margin Bottom: 16px
  
Title:
  Font: H3 (20px)
  Color: Text Primary
  Margin Bottom: 8px
  
Description:
  Font: Body (14px)
  Color: Text Secondary
  Text Align: center
  Max Width: 280px
  Margin Bottom: 24px
```

---

### Loading

```yaml
Spinner:
  Width: 24px
  Height: 24px
  Border: 2px solid Gray-200
  Border Top: 2px solid Primary
  Border Radius: 50%
  Animation: Spin 1s linear infinite
  
Skeleton:
  Background: Gray-200
  Border Radius: 4px
  Animation: Pulse 2s ease-in-out infinite
```

---

### Toast

```yaml
Container:
  Min Width: 280px
  Max Width: 400px
  Background: Gray-900
  Color: White
  Border Radius: 8px
  Padding: 12px 16px
  Shadow: shadow-lg
  Position: Fixed
  Bottom: 80px (above navbar)
  Left: 50%
  Transform: translateX(-50%)
  
Variants:
  Success: Background Green-600
  Error: Background Red-600
  Warning: Background Amber-600
  Info: Background Blue-600
```

---

## 3. Icon System

### Icon Set
Use **Lucide Icons** or **Heroicons** for consistency.

### Required Icons

| Icon | Name | Use Case |
|------|------|----------|
| 🏠 | Home | Bottom nav, main menu |
| 🔍 | Search | Search bar, search button |
| 🛒 | Cart | Bottom nav, add to cart |
| 🏪 | Store | Seller profile, my store |
| 👤 | Profile | Bottom nav, user menu |
| ❤️ | Favorite | Favorite button, wishlist |
| 📂 | Category | Category menu, filter |
| 📦 | Order | Order list, order history |
| 🔔 | Notification | Notification center |
| 💬 | WhatsApp | Contact seller |
| 📊 | Dashboard | Admin/Seller dashboard |
| ⚙️ | Settings | Settings menu |

### Icon Sizes
```yaml
Small: 16px × 16px
Medium: 20px × 20px
Large: 24px × 24px
XL: 32px × 32px
```

### Icon Colors
```yaml
Default: Text Secondary (#6B7280)
Active: Primary (#2563EB)
Disabled: Text Tertiary (#9CA3AF)
White: White (on dark backgrounds)
```

---

## 4. Screen Specifications

### Buyer Screens

#### Splash Screen
```
Layout:
  - Logo SADEAN (centered)
  - Tagline "Dodolane Wong Cilacap"
  - Loading indicator
  
Duration: 2-3 seconds
Transition: Fade to Home/Login
```

#### Login Screen
```
Layout:
  - Logo (top)
  - Email input
  - Password input
  - Login button
  - "Belum punya akun? Daftar" link
  - "Lupa password?" link
  
Fields:
  - Email: email keyboard
  - Password: password toggle
```

#### Register Screen
```
Layout:
  - Logo (top)
  - Name input
  - Email input
  - Phone input
  - Password input
  - Confirm password input
  - Role selector (Buyer/Seller)
  - Register button
  - "Sudah punya akun? Login" link
  
Fields:
  - Name: text
  - Email: email keyboard
  - Phone: phone keyboard
  - Password: password toggle
  - Confirm Password: password toggle
  - Role: radio buttons or segmented control
```

#### Home Screen (Buyer)
```
Layout:
  - App Bar (logo, search icon, cart icon)
  - Search Bar (prominent)
  - Banner Carousel
  - Category Horizontal Scroll
  - Product Grid (2 columns on mobile)
  - Bottom Navigation
  
Sections:
  1. Header: Logo + Icons
  2. Search: Full-width search bar
  3. Banner: Auto-scroll carousel
  4. Categories: Horizontal scroll
  5. Products: Grid layout
  6. Bottom Nav: Home, Search, Cart, Orders, Profile
```

#### Search Screen
```
Layout:
  - Search Bar (with back button)
  - Recent Searches (optional)
  - Search Results (grid)
  - Filter/Sort options
  
Filters:
  - Category
  - Price Range
  - Sort: Relevance, Price, Newest
```

#### Product Detail Screen
```
Layout:
  - Back button
  - Image Gallery (swipeable)
  - Product Info (name, price, stock)
  - Seller Info (with WhatsApp button)
  - Description
  - Related Products
  - Add to Cart button (fixed bottom)
  
Actions:
  - Share product
  - Add to favorite
  - Add to cart
  - Buy now
  - Chat seller (WhatsApp)
```

#### Cart Screen
```
Layout:
  - App Bar (title, edit mode)
  - Cart Items (list)
  - Seller grouping
  - Quantity controls
  - Swipe to delete
  - Total price
  - Checkout button (fixed bottom)
  
Empty State:
  - Illustration
  - "Keranjang kosong"
  - "Mulai belanja" button
```

#### Checkout Screen
```
Layout:
  - Order Summary
  - Shipping Address
  - Contact Person
  - Notes (optional)
  - Total Price
  - Checkout button
  
Fields:
  - Name
  - Phone
  - Address (textarea)
  - Notes (optional textarea)
```

#### Order Success Screen
```
Layout:
  - Success illustration
  - Order number
  - "Pesanan berhasil dibuat!"
  - WhatsApp button (contact seller)
  - "Lihat Pesanan" button
  - "Kembali ke Beranda" link
```

#### Order History Screen
```
Layout:
  - App Bar (title)
  - Tabs: Semua, Diproses, Dikirim, Selesai
  - Order List
  
Order Card:
  - Order number
  - Date
  - Items preview
  - Total price
  - Status badge
  - Action buttons
```

#### Profile Screen
```
Layout:
  - User Avatar
  - User Name
  - Menu List:
    - Profil Saya
    - Alamat
    - Pesanan
    - Favorit
    - Pengaturan
    - Logout
  
Empty State (Not logged in):
  - Login prompt
  - Register link
```

---

### Seller Screens

#### Seller Dashboard
```
Layout:
  - Sidebar (desktop) / Bottom Nav (mobile)
  - Stats Cards (Products, Orders, Revenue)
  - Recent Orders
  - Quick Actions
  
Stats:
  - Total Produk
  - Pesanan Baru
  - Pendapatan Bulan Ini
  - Rating Rata-rata
```

#### Product List (Seller)
```
Layout:
  - App Bar (title, add button)
  - Search/Filter
  - Product Grid/List
  - FAB (add product)
  
Product Card:
  - Image
  - Name
  - Price
  - Stock
  - Status badge
  - Edit/Delete actions
```

#### Add/Edit Product
```
Layout:
  - Back button
  - Form sections:
    1. Foto Produk (upload)
    2. Nama Produk
    3. Deskripsi
    4. Harga
    5. Stok
    6. Satuan
    7. Berat
    8. Kategori (dropdown)
  - Simpan button
  
Validation:
  - Required fields marked
  - Real-time validation
  - Error messages below fields
```

#### Orders (Seller)
```
Layout:
  - Tabs: Baru, Diproses, Selesai
  - Order List
  
Order Card:
  - Order number
  - Buyer name
  - Items
  - Total
  - Status
  - Actions:
    - Konfirmasi (WhatsApp)
    - Update Status
    - Lihat Detail
```

#### Store Profile
```
Layout:
  - Store Logo
  - Store Name
  - Description
  - Contact Info
  - Address
  - Edit button
  
Fields:
  - Logo upload
  - Name
  - Description (textarea)
  - Phone
  - WhatsApp
  - Address
```

---

### Admin Screens

#### Admin Dashboard
```
Layout:
  - Sidebar (desktop) / Top Nav (mobile)
  - Stats Overview
  - Recent Activity
  - Charts (optional)
  
Stats:
  - Total Users
  - Total Sellers
  - Pending Verifications
  - Total Orders
  - Revenue
```

#### User Management
```
Layout:
  - Search/Filter
  - User Table (desktop) / List (mobile)
  - Pagination
  
Columns:
  - Name
  - Email
  - Role
  - Status
  - Joined Date
  - Actions
```

#### UMKM Management
```
Layout:
  - Tabs: Pending, Verified, All
  - Seller List
  - Verification actions
  
Seller Card:
  - Store Name
  - Owner Name
  - Status
  - Documents
  - Actions:
    - Verify
    - Reject
    - Suspend
```

#### Banner Management
```
Layout:
  - Banner List
  - Add Banner button
  
Banner Card:
  - Preview image
  - Title
  - Status
  - Date range
  - Actions:
    - Edit
    - Delete
    - Toggle status
```

---

## 5. Navigation

### Buyer (Mobile Bottom Nav)
```yaml
Items:
  - Home: Icon + Label
  - Cari: Icon + Label
  - Keranjang: Icon + Badge + Label
  - Pesanan: Icon + Label
  - Profil: Icon + Label
  
Behavior:
  - Active state highlighted
  - Badge shows cart count
  - Smooth transitions
```

### Seller (Mobile Bottom Nav)
```yaml
Items:
  - Dashboard: Icon + Label
  - Produk: Icon + Label
  - Pesanan: Icon + Badge + Label
  - Toko: Icon + Label
  - Profil: Icon + Label
```

### Admin (Desktop Sidebar)
```yaml
Items:
  - Dashboard
  - Users
  - UMKM
  - Produk
  - Pesanan
  - Banner
  - Pengaturan
  
Behavior:
  - Collapsible (icon only mode)
  - Active state highlighted
  - Submenu support
```

---

## 6. Responsive Breakpoints

```yaml
Mobile: 0 - 639px
  - Single column layout
  - Bottom navigation
  - Full-width cards
  - Stack elements vertically

Tablet: 640px - 1023px
  - 2-column grid
  - Side navigation (optional)
  - More spacing
  - Larger touch targets

Desktop: 1024px+
  - Sidebar navigation
  - Multi-column grid (3-4 columns)
  - Hover states
  - More detailed layouts
```

---

## 7. Animation & Transition

```yaml
Duration:
  Fast: 150ms
  Normal: 200ms
  Slow: 300ms
  
Easing:
  Default: ease-in-out
  In: ease-in
  Out: ease-out
  
Transitions:
  - Page transitions: Slide left/right
  - Modal: Fade in + scale
  - Toast: Slide up from bottom
  - Loading: Skeleton pulse
  - Hover: Background color
```

---

## 8. Dark Mode (Future)

```yaml
Background: #111827 (Gray-900)
Surface: #1F2937 (Gray-800)
Text Primary: #F9FAFB (Gray-50)
Text Secondary: #9CA3AF (Gray-400)
Primary: #3B82F6 (Blue-500)
```

---

## 9. Accessibility

### Color Contrast
- Text on background: Minimum 4.5:1
- Large text: Minimum 3:1

### Touch Targets
- Minimum: 44px × 44px
- Recommended: 48px × 48px

### Focus States
- Visible focus ring for keyboard navigation
- Skip navigation links

### Screen Reader
- Alt text for images
- Semantic HTML
- ARIA labels where needed

---

## 10. File Naming Convention

```
Components:
  Button.tsx
  Card.tsx
  ProductCard.tsx
  
Screens:
  buyer/
    HomeScreen.tsx
    ProductDetailScreen.tsx
  seller/
    DashboardScreen.tsx
  admin/
    UserManagementScreen.tsx
    
Assets:
  icons/
    home.svg
    search.svg
  images/
    logo.png
    empty-cart.png
```

---

**Status:** [x] Final

**Last Updated:** 11 Juli 2026