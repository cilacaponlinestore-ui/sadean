# SADEAN — Component Library

> Reusable UI components specification

---

## Components Overview

| Component | Status | Variants |
|-----------|--------|----------|
| Button | ✅ | Primary, Secondary, Danger, Ghost |
| Card | ✅ | Default, Elevated, Interactive |
| Product Card | ✅ | Grid, List |
| Input | ✅ | Text, Password, Number, Textarea |
| Search Bar | ✅ | Default, Expanded |
| Badge | ✅ | Primary, Success, Warning, Danger |
| Chip | ✅ | Selectable, Removable |
| Modal | ✅ | Default, Fullscreen, Bottom Sheet |
| Dialog | ✅ | Confirm, Alert |
| Navbar | ✅ | Top, Bottom |
| Sidebar | ✅ | Collapsible, Fixed |
| App Bar | ✅ | Default, With Back |
| Banner | ✅ | Single, Carousel |
| Category Card | ✅ | Default, Compact |
| Empty State | ✅ | Default, With Action |
| Loading | ✅ | Spinner, Skeleton, Pulse |
| Toast | ✅ | Success, Error, Warning, Info |
| Pagination | ✅ | Default, Load More |

---

## Button

### Purpose
Trigger actions or events.

### Variants

#### Primary
- **Use:** Main actions (Checkout, Submit, Save)
- **Color:** Primary blue
- **Background:** #2563EB
- **Text:** White

#### Secondary
- **Use:** Secondary actions (Cancel, Back)
- **Color:** White with blue border
- **Background:** Transparent
- **Border:** 1px solid #2563EB
- **Text:** #2563EB

#### Danger
- **Use:** Destructive actions (Delete, Remove)
- **Color:** Red
- **Background:** #EF4444
- **Text:** White

#### Ghost
- **Use:** Tertiary actions, navigation
- **Color:** Transparent
- **Background:** Transparent
- **Text:** #2563EB

### Sizes
- **Small:** 32px height, 12px padding, 12px font
- **Medium:** 40px height, 16px padding, 14px font
- **Large:** 48px height, 24px padding, 16px font

### States
- **Default:** Normal appearance
- **Hover:** Slightly darker
- **Active:** Even darker
- **Disabled:** 50% opacity, no pointer events
- **Loading:** Spinner replaces content

### Usage
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Checkout
</Button>

<Button variant="secondary" onClick={handleCancel}>
  Batal
</Button>

<Button variant="danger" onClick={handleDelete}>
  Hapus
</Button>

<Button variant="primary" loading={isSubmitting}>
  Simpan
</Button>
```

---

## Card

### Purpose
Container for content groups.

### Variants

#### Default
- **Use:** General content containers
- **Style:** Border, no shadow
- **Border:** 1px solid #E5E7EB

#### Elevated
- **Use:** Important content, hoverable items
- **Style:** No border, shadow
- **Shadow:** 0 4px 6px rgba(0,0,0,0.1)

#### Interactive
- **Use:** Clickable items
- **Style:** Hover effect
- **Hover:** Shadow increase, slight scale

### Structure
```
┌─────────────────────┐
│      Header         │
├─────────────────────┤
│                     │
│       Body          │
│                     │
├─────────────────────┤
│      Footer         │
└─────────────────────┘
```

### Usage
```jsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>

<Card variant="elevated">
  <Card.Body>Important content</Card.Body>
</Card>
```

---

## Product Card

### Purpose
Display product information in grids or lists.

### Variants

#### Grid Card
- **Use:** Product grid on home/search
- **Layout:** Vertical (image on top)
- **Width:** Flexible (grid item)

#### List Card
- **Use:** Product list on manage/compare
- **Layout:** Horizontal (image on left)
- **Width:** Full width

### Structure (Grid)
```
┌─────────────────────┐
│                     │
│      [Image]        │
│                     │
├─────────────────────┤
│ Product Name        │
│ Rp 25.000           │
│ Toko Dodol Mak      │
└─────────────────────┘
```

### Structure (List)
```
┌──────┬──────────────┐
│      │ Product Name │
│      │ Rp 25.000    │
│ [Img]│ Toko Dodol   │
│      │ ─────────── │
│      │ Stok: 50     │
└──────┴──────────────┘
```

### Props
- `product` - Product data object
- `variant` - "grid" | "list"
- `onPress` - Click handler
- `showStock` - Show stock info (seller mode)
- `showActions` - Show edit/delete (seller mode)

### Usage
```jsx
<ProductCard product={product} variant="grid" onPress={viewProduct} />

<ProductCard product={product} variant="list" showActions onEdit={editProduct} />
```

---

## Input

### Purpose
Collect user input.

### Types
- **Text:** General text input
- **Password:** Masked input with toggle
- **Number:** Numeric input
- **Email:** Email keyboard
- **Phone:** Phone keyboard
- **Textarea:** Multi-line input

### Structure
```
┌─────────────────────┐
│ Label               │
├─────────────────────┤
│ Input field         │
├─────────────────────┤
│ Helper text / Error │
└─────────────────────┘
```

### States
- **Default:** Gray border
- **Focus:** Blue border, blue ring
- **Error:** Red border, red ring, error message
- **Disabled:** Gray background

### Props
- `label` - Field label
- `type` - Input type
- `placeholder` - Placeholder text
- `value` - Current value
- `onChange` - Change handler
- `error` - Error message
- `helper` - Helper text
- `disabled` - Disable input
- `required` - Required field

### Usage
```jsx
<Input
  label="Email"
  type="email"
  placeholder="email@example.com"
  value={email}
  onChange={setEmail}
  required
/>

<Input
  label="Password"
  type="password"
  value={password}
  onChange={setPassword}
  error="Password minimal 8 karakter"
/>

<Input
  label="Catatan"
  type="textarea"
  placeholder="Catatan untuk penjual..."
  value={notes}
  onChange={setNotes}
/>
```

---

## Search Bar

### Purpose
Search functionality.

### Structure
```
┌─────────────────────────────┐
│ 🔍 Cari produk...          │
└─────────────────────────────┘
```

### Props
- `placeholder` - Placeholder text
- `value` - Search value
- `onChange` - Change handler
- `onSearch` - Search submit handler
- `onFocus` - Focus handler
- `autoFocus` - Auto focus on mount

### Usage
```jsx
<SearchBar
  placeholder="Cari produk..."
  value={search}
  onChange={setSearch}
  onSearch={handleSearch}
/>
```

---

## Badge

### Purpose
Status indicators, counts.

### Variants
- **Primary:** Blue background
- **Success:** Green background
- **Warning:** Amber background
- **Danger:** Red background
- **Neutral:** Gray background

### Sizes
- **Small:** 20px height, 10px font
- **Medium:** 24px height, 12px font

### Usage
```jsx
<Badge variant="success">Aktif</Badge>
<Badge variant="danger">Stok Habis</Badge>
<Badge variant="warning">Menunggu</Badge>
```

---

## Chip

### Purpose
Selectable options, filters.

### Variants
- **Default:** Non-interactive display
- **Selectable:** Toggle on/off
- **Removable:** Can be removed

### Structure
```
┌─────────────────┐
│ Label     ×     │
└─────────────────┘
```

### Props
- `label` - Chip text
- `selected` - Selected state
- `onPress` - Click handler
- `removable` - Show remove icon
- `onRemove` - Remove handler

### Usage
```jsx
<Chip label="Makanan" selected={isSelected} onPress={toggleFilter} />

<Chip label="Dodol" removable onRemove={removeFilter} />
```

---

## Modal

### Purpose
Overlay content, dialogs.

### Variants
- **Default:** Centered modal
- **Bottom Sheet:** Slides from bottom (mobile)
- **Fullscreen:** Full screen overlay

### Structure
```
┌─────────────────────────────┐
│ Title                  [×]  │
├─────────────────────────────┤
│                             │
│         Content             │
│                             │
├─────────────────────────────┤
│ [Cancel]           [Confirm]│
└─────────────────────────────┘
```

### Props
- `isOpen` - Control visibility
- `onClose` - Close handler
- `title` - Modal title
- `variant` - "default" | "bottom" | "fullscreen"
- `children` - Modal content

### Usage
```jsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Konfirmasi">
  <p>Apakah anda yakin?</p>
</Modal>

<Modal variant="bottom" isOpen={showSheet} onClose={closeSheet}>
  <BottomSheetContent />
</Modal>
```

---

## Dialog

### Purpose
Confirm actions, show alerts.

### Variants
- **Confirm:** Yes/No questions
- **Alert:** Information display
- **Destructive:** Dangerous actions

### Structure
```
┌─────────────────────────────┐
│           Icon              │
│                             │
│         Title               │
│                             │
│      Description            │
│                             │
│  [Cancel]        [Confirm]  │
└─────────────────────────────┘
```

### Props
- `isOpen` - Control visibility
- `onClose` - Close handler
- `onConfirm` - Confirm handler
- `title` - Dialog title
- `description` - Dialog description
- `variant` - "default" | "destructive" | "alert"
- `confirmText` - Confirm button text
- `cancelText` - Cancel button text

### Usage
```jsx
<Dialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Hapus Produk?"
  description="Produk akan dihapus secara permanen"
  variant="destructive"
  confirmText="Hapus"
  cancelText="Batal"
/>
```

---

## Navbar (Mobile Bottom)

### Purpose
Primary navigation on mobile.

### Structure
```
┌────────┬────────┬────────┬────────┬────────┐
│  Home  │  Cari  │Keranjang│ Pesanan│ Profil │
└────────┴────────┴────────┴────────┴────────┘
```

### Props
- `items` - Navigation items
- `active` - Active item key
- `onNavigate` - Navigation handler

### Usage
```jsx
<BottomNav
  items={[
    { key: 'home', label: 'Home', icon: HomeIcon },
    { key: 'search', label: 'Cari', icon: SearchIcon },
    { key: 'cart', label: 'Keranjang', icon: CartIcon, badge: 3 },
    { key: 'orders', label: 'Pesanan', icon: OrderIcon },
    { key: 'profile', label: 'Profil', icon: ProfileIcon },
  ]}
  active={currentTab}
  onNavigate={setCurrentTab}
/>
```

---

## Sidebar (Desktop)

### Purpose
Primary navigation on desktop.

### Structure
```
┌──────────────────┐
│      Logo        │
├──────────────────┤
│ 🏠 Dashboard    │
│ 👥 Users        │
│ 🏪 UMKM         │
│ 📦 Products     │
│ 📋 Orders       │
│ 🖼️ Banners      │
│ ⚙️ Settings     │
└──────────────────┘
```

### Props
- `items` - Navigation items
- `active` - Active item key
- `onNavigate` - Navigation handler
- `collapsible` - Allow collapse
- `collapsed` - Collapsed state

### Usage
```jsx
<Sidebar
  items={menuItems}
  active={currentPage}
  onNavigate={setCurrentPage}
  collapsible
/>
```

---

## App Bar

### Purpose
Top navigation, page header.

### Variants
- **Default:** Logo + Actions
- **With Back:** Back button + Title + Actions

### Structure
```
┌─────────────────────────────────────┐
│ [←] Page Title              [🔔][👤]│
└─────────────────────────────────────┘
```

### Props
- `title` - Page title
- `showBack` - Show back button
- `onBack` - Back handler
- `actions` - Action buttons
- `transparent` - Transparent background

### Usage
```jsx
<AppBar title="Produk" showBack onBack={goBack} />

<AppBar
  title="SADEAN"
  actions={[
    <IconButton icon={BellIcon} onClick={openNotifications} />,
    <IconButton icon={CartIcon} onClick={openCart} />,
  ]}
/>
```

---

## Banner

### Purpose
Promotional content, highlights.

### Variants
- **Single:** One banner
- **Carousel:** Multiple banners, auto-scroll

### Structure
```
┌─────────────────────────────────────┐
│                                     │
│           [Banner Image]            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Title                       │   │
│  │ Description                 │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Props
- `banners` - Array of banner data
- `autoPlay` - Auto-scroll (carousel)
- `interval` - Auto-scroll interval
- `onPress` - Click handler

### Usage
```jsx
<Banner
  banners={[
    { id: 1, image: 'banner1.jpg', title: 'Promo Spesial' },
    { id: 2, image: 'banner2.jpg', title: 'Produk Baru' },
  ]}
  autoPlay
  onPress={handleBannerClick}
/>
```

---

## Category Card

### Purpose
Display category items.

### Variants
- **Default:** Image + Name (horizontal scroll)
- **Compact:** Small version (grid)

### Structure
```
┌──────────────┐
│    [Image]   │
│              │
│   Category   │
└──────────────┘
```

### Props
- `category` - Category data
- `onPress` - Click handler
- `variant` - "default" | "compact"

### Usage
```jsx
<CategoryCard category={category} onPress={viewCategory} />

<CategoryCard category={category} variant="compact" />
```

---

## Empty State

### Purpose
Show when no data available.

### Structure
```
┌─────────────────────────────┐
│                             │
│          [Icon]             │
│                             │
│         Title               │
│                             │
│      Description            │
│                             │
│     [Action Button]         │
│                             │
└─────────────────────────────┘
```

### Props
- `icon` - Display icon
- `title` - Empty state title
- `description` - Empty state description
- `actionLabel` - Action button text
- `onAction` - Action handler

### Usage
```jsx
<EmptyState
  icon={CartIcon}
  title="Keranjang kosong"
  description="Belum ada produk di keranjang"
  actionLabel="Mulai Belanja"
  onAction={goToHome}
/>
```

---

## Loading

### Purpose
Indicate loading states.

### Variants
- **Spinner:** Circular spinner
- **Skeleton:** Content placeholder
- **Pulse:** Pulsing animation

### Usage
```jsx
<Loading type="spinner" />

<Skeleton>
  <Skeleton.Item width="100%" height={200} />
  <Skeleton.Item width="60%" height={20} />
  <Skeleton.Item width="40%" height={16} />
</Skeleton>

<Loading type="pulse" />
```

---

## Toast

### Purpose
Show temporary notifications.

### Variants
- **Success:** Green, positive actions
- **Error:** Red, error messages
- **Warning:** Amber, caution messages
- **Info:** Blue, informational

### Structure
```
┌─────────────────────────────┐
│ ✅ Success message          │
└─────────────────────────────┘
```

### Props
- `message` - Toast message
- `variant` - "success" | "error" | "warning" | "info"
- `duration` - Auto-dismiss time
- `onDismiss` - Dismiss handler

### Usage
```jsx
<Toast message="Produk berhasil ditambahkan" variant="success" />
<Toast message="Terjadi kesalahan" variant="error" />
```

---

## Pagination

### Purpose
Navigate through pages.

### Variants
- **Default:** Page numbers
- **Load More:** Button to load more
- **Infinite:** Auto-load on scroll

### Props
- `current` - Current page
- `total` - Total pages
- `onChange` - Page change handler
- `variant` - "default" | "loadMore" | "infinite"

### Usage
```jsx
<Pagination current={1} total={10} onChange={setPage} />

<Pagination variant="loadMore" onLoadMore={loadMore} hasMore={true} />
```

---

**Status:** [x] Final

**Last Updated:** 11 Juli 2026