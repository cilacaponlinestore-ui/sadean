# SADEAN — Documentation

> **Dodolane Wong Cilacap**
> Platform Digital UMKM Cilacap

---

## Overview

SADEAN adalah platform digital marketplace untuk UMKM di Cilacap. Platform ini memungkinkan UMKM untuk menjual produk secara online dan pembeli untuk menemukan serta membeli produk lokal dengan mudah.

---

## Dokumentasi

| Dokumen | Deskripsi | Status |
|---------|-----------|--------|
| [VISION.md](VISION.md) | Visi, misi, dan tujuan proyek | ✅ Final |
| [PRD.md](PRD.md) | Product Requirement Document | ✅ Final |
| [PROJECT_CHARTER.md](PROJECT_CHARTER.md) | Charter proyek | ✅ Final |
| [ROADMAP.md](ROADMAP.md) | Roadmap pengembangan | ✅ Final |
| [USER_FLOW.md](USER_FLOW.md) | User flow untuk setiap role | ✅ Final |
| [BUSINESS_RULE.md](BUSINESS_RULE.md) | Aturan bisnis | ✅ Final |
| [FEATURE_LIST.md](FEATURE_LIST.md) | Daftar fitur | ✅ Final |
| [ERD.md](ERD.md) | Entity Relationship Diagram | ✅ Final |
| [API_SPEC.md](API_SPEC.md) | Spesifikasi API | ✅ Final |

---

## Quick Start

### Prerequisites
- Node.js 18+ (atau Go/Rust untuk backend)
- PostgreSQL 14+
- Docker & Docker Compose

### Development

```bash
# Clone repository
git clone https://github.com/username/sadean.git

# Masuk ke direktori
cd sadean

# Jalankan dengan Docker
docker-compose up -d

# Akses aplikasi
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Database: localhost:5432
```

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────>│   Backend   │────>│  Database   │
│  (React/    │     │   (API)     │     │ (PostgreSQL)│
│   Next.js)  │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           │
                    ┌─────────────┐
                    │  WhatsApp   │
                    │  API        │
                    └─────────────┘
```

---

## Tech Stack

### Frontend
- React / Next.js
- Tailwind CSS
- TypeScript

### Backend
- Node.js / Express
- TypeScript
- Prisma ORM

### Database
- PostgreSQL
- Redis (Cache)

### Infrastructure
- Docker
- Nginx (Reverse Proxy)

---

## Features

### V1 (Current)
- ✅ Marketplace UMKM
- ✅ Buyer Dashboard
- ✅ Seller Dashboard
- ✅ Admin Dashboard
- ✅ WhatsApp Checkout

### V2 (Planned)
- ⏳ Rating & Review
- ⏳ Promo System
- ⏳ Favorit

### V3 (Planned)
- ⏳ Payment Gateway
- ⏳ Notifikasi Push

---

## User Roles

### Buyer
- Mencari dan membeli produk
- Melihat riwayat order
- Menghubungi seller via WhatsApp

### Seller
- Mengelola produk
- Memproses order
- Melihat dashboard penjualan

### Admin
- Memverifikasi UMKM
- Mengelola platform
- Monitoring transaksi

---

## API Documentation

Lihat [API_SPEC.md](API_SPEC.md) untuk detail lengkap API endpoints.

### Base URL
```
Development: http://localhost:3001/api/v1
Production: https://api.sadean.com/v1
```

### Authentication
```
Authorization: Bearer <jwt_token>
```

---

## Database

Lihat [ERD.md](ERD.md) untuk diagram relasi database.

### Tables
- users
- sellers (UMKM)
- categories
- products
- product_images
- orders
- order_items
- addresses
- favorites
- banners

---

## Development

### Project Structure

```
SADEAN/
├── docs/           # Dokumentasi
├── frontend/       # Frontend application
├── backend/        # Backend API
├── docker/         # Docker configuration
└── README.md       # File ini
```

### Git Flow

1. `main` — Production
2. `develop` — Development
3. `feature/*` — Feature branches
4. `hotfix/*` — Hotfix branches

### Commit Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Code refactoring
test: Add tests
chore: Maintenance tasks
```

---

## Deployment

### Development
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

---

## License

MIT License

---

## Contact

- **Website:** https://sadean.com
- **Email:** hello@sadean.com
- **WhatsApp:** +62 812 3456 7890

---

**Last Updated:** 11 Juli 2026