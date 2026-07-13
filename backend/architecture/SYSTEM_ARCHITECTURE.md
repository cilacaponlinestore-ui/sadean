# SADEAN — System Architecture

> Arsitektur sistem backend SADEAN V1

---

## Overview

SADEAN menggunakan arsitektur modular dengan pendekatan API-first. Sistem dirancang sederhana, mudah dipelihara, dan siap berkembang tanpa over-engineering.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTS                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Web App   │  │  Mobile App │  │  WhatsApp   │        │
│  │    (PWA)    │  │   (Future)  │  │             │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Nginx     │
                    │  (Reverse   │
                    │   Proxy)    │
                    └──────┬──────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                      BACKEND                                │
├──────────────────────────┼──────────────────────────────────┤
│                    ┌─────▼─────┐                           │
│                    │  NestJS   │                           │
│                    │  Backend  │                           │
│                    └─────┬─────┘                           │
│                          │                                 │
│    ┌─────────────────────┼─────────────────────┐          │
│    │                     │                     │          │
│  ┌─▼────┐          ┌────▼────┐          ┌────▼────┐     │
│  │ Auth │          │Business │          │ Storage │     │
│  │Module│          │ Modules │          │ Module  │     │
│  └──┬───┘          └────┬────┘          └────┬────┘     │
│     │                   │                    │          │
└─────┼───────────────────┼────────────────────┼──────────┘
      │                   │                    │
      └───────────────────┼────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
   ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
   │ PostgreSQL│    │   MinIO   │    │   Redis   │
   │ Database  │    │  Storage  │    │  (Cache)  │
   └───────────┘    └───────────┘    └───────────┘
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Next.js | 14.x | Framework |
| Tailwind CSS | 3.x | Styling |
| PWA | - | Offline Support |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 10.x | Framework |
| TypeScript | 5.x | Type Safety |
| Prisma | 5.x | ORM |
| Node.js | 20.x | Runtime |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 16.x | Primary Database |
| Redis | 7.x | Cache, Session |

### Storage
| Technology | Version | Purpose |
|------------|---------|---------|
| MinIO | Latest | Object Storage |

### Infrastructure
| Technology | Version | Purpose |
|------------|---------|---------|
| Docker | 24.x | Containerization |
| Docker Compose | 2.x | Orchestration |
| Nginx | 1.25.x | Reverse Proxy |

---

## Module Architecture

### Backend Modules

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/           # Authentication & Authorization
│   │   ├── users/          # User management
│   │   ├── sellers/        # Seller/UMKM management
│   │   ├── products/       # Product management
│   │   ├── categories/     # Category management
│   │   ├── orders/         # Order management
│   │   ├── banners/        # Banner management
│   │   └── storage/        # File upload/storage
│   │
│   ├── common/             # Shared utilities
│   │   ├── guards/         # Auth guards
│   │   ├── interceptors/   # Logging, transform
│   │   ├── filters/        # Exception filters
│   │   ├── pipes/          # Validation pipes
│   │   └── decorators/     # Custom decorators
│   │
│   ├── config/             # Configuration
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── storage.config.ts
│   │   └── app.config.ts
│   │
│   ├── prisma/             # Database
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   └── main.ts             # Entry point
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
└── docker/
    ├── Dockerfile
    └── docker-compose.yml
```

---

## Data Flow

### Request Flow

```
Client Request
      │
      ▼
┌─────────────┐
│   Nginx     │ SSL Termination, Rate Limiting
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   NestJS    │ Request Processing
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middleware   │ Auth, Validation, Logging
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Controller │ Route Handling
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Service    │ Business Logic
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Repository │ Data Access (Prisma)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ PostgreSQL  │ Data Storage
└─────────────┘
```

### Authentication Flow

```
Login Request
      │
      ▼
┌─────────────┐
│ Validate    │ Check email & password
│ Credentials │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Generate    │ Create JWT token
│ JWT Token   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Generate    │ Create refresh token
│ Refresh     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Store       │ Save refresh token
│ Refresh     │ in database
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Return      │ Send tokens to client
│ Tokens      │
└─────────────┘
```

### File Upload Flow

```
Upload Request
      │
      ▼
┌─────────────┐
│ Validate    │ Check file type, size
│ File        │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Generate    │ Create unique filename
│ Filename    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Upload to   │ Store in MinIO
│ MinIO       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Save URL    │ Store file URL
│ in Database │ in database
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Return      │ Send file URL
│ Response    │ to client
└─────────────┘
```

---

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (no session in memory)
- Load balancer support (Nginx)
- Database connection pooling

### Vertical Scaling
- PostgreSQL can handle increased load
- MinIO scales with storage
- Redis for caching reduces DB load

### Future Enhancements
- Microservices architecture
- Message queue (RabbitMQ/Kafka)
- CDN for static assets
- Multiple database replicas

---

## Performance Optimization

### Caching Strategy
```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Redis     │ Cache Layer (TTL: 5 min)
└──────┬──────┘
       │ Cache Miss
       ▼
┌─────────────┐
│ PostgreSQL  │ Database
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Redis     │ Update Cache
└─────────────┘
```

### What to Cache
- Product listings (5 min)
- Categories (1 hour)
- User sessions (24 hours)
- Frequently accessed data

### What NOT to Cache
- Order data (real-time)
- Stock information (real-time)
- User-specific data

---

## Monitoring & Observability

### Health Checks
```
GET /health
{
  "status": "ok",
  "services": {
    "database": "connected",
    "redis": "connected",
    "storage": "connected"
  }
}
```

### Metrics to Monitor
- API response time
- Error rates
- Database connections
- Memory usage
- Storage usage
- Active users

### Logging Levels
- ERROR: System errors
- WARN: Potential issues
- INFO: Request logs
- DEBUG: Development only

---

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────┐
│           Nginx                     │
│  - Rate Limiting                    │
│  - SSL/TLS                          │
│  - Request Size Limit               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│           NestJS                    │
│  - Helmet (Headers)                 │
│  - CORS                             │
│  - Input Validation                 │
│  - JWT Authentication               │
│  - Role-Based Access Control        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         PostgreSQL                  │
│  - Parameterized Queries            │
│  - Row-Level Security               │
│  - Encrypted Connections            │
└─────────────────────────────────────┘
```

### Security Features
- JWT with short expiration (15 min)
- Refresh token rotation
- Password hashing (bcrypt)
- Rate limiting (100 req/min)
- Input sanitization
- SQL injection prevention
- XSS protection

---

## Deployment Architecture

### Development
```
┌─────────────────────────────────────┐
│         Docker Compose              │
├─────────────────────────────────────┤
│  Backend (NestJS)    :3001         │
│  PostgreSQL          :5432         │
│  Redis               :6379         │
│  MinIO               :9000         │
└─────────────────────────────────────┘
```

### Production
```
┌─────────────────────────────────────┐
│           VPS Server                │
├─────────────────────────────────────┤
│  Nginx              :80, 443       │
│  Backend (PM2)      :3001         │
│  PostgreSQL          :5432         │
│  Redis               :6379         │
│  MinIO               :9000         │
└─────────────────────────────────────┘
```

---

## Future Considerations

### V2 Enhancements
- Payment gateway integration
- Push notifications
- Email service

### V3 Enhancements
- Delivery integration
- Real-time tracking
- Advanced analytics

### V4 Enhancements
- AI recommendations
- Chat system
- Multi-language support

---

**Status:** [x] Final

**Last Updated:** 11 Juli 2026