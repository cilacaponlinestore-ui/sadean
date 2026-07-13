# SADEAN

> **Dodolane Wong Cilacap**
> Platform Digital UMKM Cilacap

---

## About

SADEAN adalah platform digital marketplace untuk UMKM di Cilacap. Platform ini memungkinkan UMKM untuk menjual produk secara online dan pembeli untuk menemukan serta membeli produk lokal dengan mudah.

---

## Tech Stack

### Frontend (apps/web)
- React 18
- Next.js 14
- TypeScript 5
- Tailwind CSS 3

### Backend (apps/api)
- NestJS 10
- TypeScript 5
- Prisma 5
- PostgreSQL 16

### Shared Packages
- `@sadean/ui` - UI Components
- `@sadean/types` - TypeScript Types
- `@sadean/config` - Shared Configuration
- `@sadean/utils` - Utility Functions

---

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+ or pnpm 8+
- Docker & Docker Compose
- PostgreSQL 16+ (or via Docker)

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/username/sadean.git
cd sadean
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Setup Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start Development

```bash
# Start all services (API, Database, Storage)
docker compose up -d

# Run database migrations
npm run api prisma:deploy

# Seed database
npm run api prisma:seed

# Start development servers
npm run dev
```

### 5. Access Applications

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **API Docs:** http://localhost:3001/api/docs
- **MinIO Console:** http://localhost:9001

---

## Project Structure

```
sadean/
├── apps/
│   ├── web/                    # Frontend (Next.js)
│   └── api/                    # Backend (NestJS)
│
├── packages/
│   ├── ui/                     # Shared UI Components
│   ├── types/                  # TypeScript Types
│   ├── config/                 # Shared Configuration
│   └── utils/                  # Utility Functions
│
├── docs/                       # Documentation
├── docker/                     # Docker Configuration
├── scripts/                    # Development Scripts
├── .github/                    # GitHub Actions
│
├── .env.example                # Environment Template
├── docker-compose.yml          # Docker Compose
├── package.json                # Root Package.json
├── turbo.json                  # Turborepo Config
└── README.md                   # This file
```

---

## Available Scripts

### Root Level

```bash
# Development
npm run dev              # Start all apps in development mode
npm run build            # Build all apps
npm run lint             # Lint all apps
npm run test             # Run all tests
npm run typecheck        # Type check all apps

# Database
npm run db:studio        # Open Prisma Studio
npm run db:push          # Push schema changes
npm run db:seed          # Seed database

# Docker
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
npm run docker:logs      # View Docker logs
```

### App Level

```bash
# Web (Frontend)
npm run web dev          # Start web in development mode
npm run web build        # Build web for production
npm run web start        # Start web in production mode

# API (Backend)
npm run api dev          # Start API in development mode
npm run api build        # Build API for production
npm run api start        # Start API in production mode
```

---

## Development Guide

### Branch Strategy

```
main          # Production branch
  └── develop # Development branch
       ├── feature/*   # New features
       ├── bugfix/*    # Bug fixes
       ├── hotfix/*    # Critical fixes
       └── release/*   # Release preparation
```

### Commit Convention

```
feat: Add new feature
fix: Fix bug
refactor: Code refactoring
docs: Update documentation
style: Code style changes
test: Add tests
chore: Maintenance tasks
```

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Push to remote
4. Create PR to `develop`
5. Wait for CI/CD checks
6. Request review
7. Merge after approval

---

## Environment Variables

See `.env.example` for all required variables.

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection | postgresql://user:pass@localhost:5432/sadean |
| JWT_SECRET | JWT signing secret | your-secret-key |
| JWT_REFRESH_SECRET | Refresh token secret | your-refresh-secret |
| MINIO_ENDPOINT | MinIO endpoint | localhost |
| MINIO_ACCESS_KEY | MinIO access key | minioadmin |
| MINIO_SECRET_KEY | MinIO secret key | minioadmin |

---

## API Documentation

API documentation is available at `/api/docs` when the server is running.

### Base URL

```
Development: http://localhost:3001/api/v1
Production: https://api.sadean.com/v1
```

### Authentication

```bash
# Register
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "buyer"
}

# Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run specific app tests
npm run web test
npm run api test

# Run with coverage
npm run test:coverage
```

### Test Structure

```
src/
├── __tests__/           # Test files
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
├── *.spec.ts           # Co-located tests
```

---

## Deployment

### Production Build

```bash
# Build all apps
npm run build

# Start in production mode
npm run start
```

### Docker Deployment

```bash
# Build and start
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose logs -f
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Use TypeScript strict mode
- Follow ESLint rules
- Write meaningful commits
- Add tests for new features
- Update documentation

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

- **Documentation:** https://docs.sadean.com
- **Email:** hello@sadean.com
- **WhatsApp:** +62 812 3456 7890

---

**Last Updated:** 11 Juli 2026