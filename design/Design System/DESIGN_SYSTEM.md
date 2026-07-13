# SADEAN — Design System

> Detailed component specifications and design tokens

---

## Design Tokens

### Colors

```css
:root {
  /* Primary */
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-200: #BFDBFE;
  --color-primary-300: #93C5FD;
  --color-primary-400: #60A5FA;
  --color-primary-500: #3B82F6;
  --color-primary-600: #2563EB;
  --color-primary-700: #1D4ED8;
  --color-primary-800: #1E40AF;
  --color-primary-900: #1E3A8A;
  
  /* Secondary (Emerald) */
  --color-secondary-50: #ECFDF5;
  --color-secondary-100: #D1FAE5;
  --color-secondary-200: #A7F3D0;
  --color-secondary-300: #6EE7B7;
  --color-secondary-400: #34D399;
  --color-secondary-500: #10B981;
  --color-secondary-600: #059669;
  --color-secondary-700: #047857;
  --color-secondary-800: #065F46;
  --color-secondary-900: #064E3B;
  
  /* Neutral */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;
  
  /* Semantic */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #3B82F6;
}
```

---

### Typography

```css
:root {
  /* Font Family */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Plus Jakarta Sans', var(--font-sans);
  
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

---

### Spacing

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

---

### Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;
}
```

---

### Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

---

## Component Specifications

### Button

#### HTML Structure
```html
<button class="btn btn-primary btn-md">
  <span class="btn-icon">Icon</span>
  <span class="btn-text">Label</span>
</button>
```

#### CSS Classes
```css
/* Base */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  transition: all 150ms ease-in-out;
  cursor: pointer;
  border: none;
  outline: none;
}

.btn:focus-visible {
  ring: 2px;
  ring-offset: 2px;
}

/* Sizes */
.btn-sm {
  height: 32px;
  padding: 0 var(--space-3);
  font-size: var(--text-xs);
}

.btn-md {
  height: 40px;
  padding: 0 var(--space-4);
  font-size: var(--text-sm);
}

.btn-lg {
  height: 48px;
  padding: 0 var(--space-6);
  font-size: var(--text-base);
}

/* Variants */
.btn-primary {
  background-color: var(--color-primary-600);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-700);
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--color-primary-600);
  color: var(--color-primary-600);
}

.btn-danger {
  background-color: var(--color-danger);
  color: white;
}

.btn-ghost {
  background-color: transparent;
  color: var(--color-primary-600);
}

.btn-ghost:hover {
  background-color: var(--color-gray-100);
}

/* States */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

---

### Input

#### HTML Structure
```html
<div class="input-group">
  <label class="input-label">Label</label>
  <input class="input" type="text" placeholder="Placeholder" />
  <span class="input-helper">Helper text</span>
</div>
```

#### CSS Classes
```css
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.input-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-700);
}

.input {
  height: 40px;
  padding: 0 var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  background-color: white;
  transition: all 150ms ease-in-out;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-600);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.input::placeholder {
  color: var(--color-gray-400);
}

.input-error {
  border-color: var(--color-danger);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-helper {
  font-size: var(--text-xs);
  color: var(--color-gray-500);
}

.input-error .input-helper {
  color: var(--color-danger);
}

.input:disabled {
  background-color: var(--color-gray-100);
  cursor: not-allowed;
}
```

---

### Card

#### HTML Structure
```html
<div class="card">
  <div class="card-header">Header</div>
  <div class="card-body">Content</div>
  <div class="card-footer">Footer</div>
</div>
```

#### CSS Classes
```css
.card {
  background-color: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.card-elevated {
  border: none;
  box-shadow: var(--shadow-md);
}

.card-header {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-gray-200);
}

.card-body {
  padding: var(--space-4);
}

.card-footer {
  padding: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
  background-color: var(--color-gray-50);
}
```

---

### Product Card

#### HTML Structure
```html
<div class="product-card">
  <div class="product-card-image">
    <img src="product.jpg" alt="Product Name" />
    <span class="product-card-badge">-20%</span>
  </div>
  <div class="product-card-content">
    <h3 class="product-card-name">Product Name</h3>
    <p class="product-card-price">Rp 25.000</p>
    <p class="product-card-store">Toko Dodol Mak</p>
  </div>
</div>
```

#### CSS Classes
```css
.product-card {
  background-color: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all 150ms ease-in-out;
}

.product-card:hover {
  box-shadow: var(--shadow-md);
}

.product-card-image {
  position: relative;
  aspect-ratio: 1;
  background-color: var(--color-gray-100);
}

.product-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card-badge {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  background-color: var(--color-danger);
  color: white;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
}

.product-card-content {
  padding: var(--space-3);
}

.product-card-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-900);
  margin: 0 0 var(--space-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card-price {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-primary-600);
  margin: 0 0 var(--space-1);
}

.product-card-store {
  font-size: var(--text-xs);
  color: var(--color-gray-500);
  margin: 0;
}
```

---

### Modal

#### HTML Structure
```html
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Title</h2>
      <button class="modal-close">×</button>
    </div>
    <div class="modal-body">Content</div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

#### CSS Classes
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: var(--space-4);
  animation: fadeIn 150ms ease-in-out;
}

.modal {
  background-color: white;
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  animation: scaleIn 150ms ease-in-out;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-gray-200);
}

.modal-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-gray-900);
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  font-size: var(--text-xl);
  color: var(--color-gray-500);
  cursor: pointer;
  border-radius: var(--radius-md);
}

.modal-close:hover {
  background-color: var(--color-gray-100);
}

.modal-body {
  padding: var(--space-5);
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-gray-200);
  background-color: var(--color-gray-50);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

### Bottom Navigation

#### HTML Structure
```html
<nav class="bottom-nav">
  <a href="#" class="bottom-nav-item active">
    <svg class="bottom-nav-icon">Home</svg>
    <span class="bottom-nav-label">Home</span>
  </a>
  <a href="#" class="bottom-nav-item">
    <svg class="bottom-nav-icon">Search</svg>
    <span class="bottom-nav-label">Cari</span>
  </a>
  <a href="#" class="bottom-nav-item">
    <svg class="bottom-nav-icon">Cart</svg>
    <span class="bottom-nav-badge">3</span>
    <span class="bottom-nav-label">Keranjang</span>
  </a>
</nav>
```

#### CSS Classes
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: white;
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 40;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  text-decoration: none;
  color: var(--color-gray-500);
  padding: var(--space-2);
  position: relative;
}

.bottom-nav-item.active {
  color: var(--color-primary-600);
}

.bottom-nav-icon {
  width: 24px;
  height: 24px;
}

.bottom-nav-label {
  font-size: 10px;
  font-weight: var(--font-medium);
}

.bottom-nav-badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 18px;
  height: 18px;
  background-color: var(--color-danger);
  color: white;
  font-size: 10px;
  font-weight: var(--font-bold);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
```

---

### Search Bar

#### HTML Structure
```html
<div class="search-bar">
  <svg class="search-bar-icon">Search</svg>
  <input class="search-bar-input" type="text" placeholder="Cari produk..." />
</div>
```

#### CSS Classes
```css
.search-bar {
  display: flex;
  align-items: center;
  height: 48px;
  background-color: var(--color-gray-100);
  border-radius: var(--radius-full);
  padding: 0 var(--space-4);
  gap: var(--space-3);
}

.search-bar-icon {
  width: 20px;
  height: 20px;
  color: var(--color-gray-500);
  flex-shrink: 0;
}

.search-bar-input {
  flex: 1;
  border: none;
  background: none;
  font-size: var(--text-sm);
  color: var(--color-gray-900);
}

.search-bar-input::placeholder {
  color: var(--color-gray-400);
}

.search-bar-input:focus {
  outline: none;
}
```

---

### Toast

#### HTML Structure
```html
<div class="toast toast-success">
  <svg class="toast-icon">Check</svg>
  <span class="toast-message">Success message</span>
</div>
```

#### CSS Classes
```css
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-gray-900);
  color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  animation: slideUp 300ms ease-out;
}

.toast-success {
  background-color: var(--color-secondary-600);
}

.toast-error {
  background-color: var(--color-danger);
}

.toast-warning {
  background-color: var(--color-warning);
}

.toast-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.toast-message {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
```

---

## Animation Classes

```css
/* Fade */
.fade-in {
  animation: fadeIn 200ms ease-in-out;
}

.fade-out {
  animation: fadeOut 200ms ease-in-out;
}

/* Slide */
.slide-up {
  animation: slideUp 200ms ease-out;
}

.slide-down {
  animation: slideDown 200ms ease-out;
}

/* Scale */
.scale-in {
  animation: scaleIn 200ms ease-out;
}

/* Skeleton Loading */
.skeleton {
  background: linear-gradient(90deg, var(--color-gray-200) 25%, var(--color-gray-100) 50%, var(--color-gray-200) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

**Status:** [x] Final

**Last Updated:** 11 Juli 2026