# SADEAN — Deployment

> Panduan deployment SADEAN V1

---

## Overview

SADEAN V1 di-deploy menggunakan Docker di VPS (Virtual Private Server).

---

## Prerequisites

### Server Requirements
```yaml
OS: Ubuntu 22.04 LTS
CPU: 1 vCPU
RAM: 1 GB
Storage: 20 GB
IP: Static IP
Domain: sadean.com
```

### Software Requirements
```yaml
Docker: 24.x
Docker Compose: 2.x
Nginx: 1.25.x
Certbot: Latest (for SSL)
```

---

## Docker Configuration

### Dockerfile (Backend)
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nestjs

EXPOSE 3001

CMD ["node", "dist/main.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: sadean-backend
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://sadean:${DB_PASSWORD}@postgres:5432/sadean
      - REDIS_URL=redis://redis:6379
      - MINIO_ENDPOINT=minio
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      minio:
        condition: service_started
    volumes:
      - ./uploads:/app/uploads

  postgres:
    image: postgres:16-alpine
    container_name: sadean-postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=sadean
      - POSTGRES_USER=sadean
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sadean"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: sadean-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    container_name: sadean-minio
    restart: unless-stopped
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=${MINIO_ACCESS_KEY}
      - MINIO_ROOT_PASSWORD=${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

  nginx:
    image: nginx:alpine
    container_name: sadean-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

---

## Environment Variables

### .env.example
```env
# Database
DB_PASSWORD=your-strong-password-here

# Redis
REDIS_URL=redis://redis:6379

# MinIO
MINIO_ACCESS_KEY=your-minio-access-key
MINIO_SECRET_KEY=your-minio-secret-key

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here

# App
NODE_ENV=production
PORT=3001
```

---

## Nginx Configuration

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10M;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript;

    # Upstream
    upstream backend {
        server backend:3001;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name sadean.com www.sadean.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name sadean.com www.sadean.com;

        # SSL
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
        ssl_prefer_server_ciphers off;

        # Security Headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # API Proxy
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Health Check
        location /health {
            proxy_pass http://backend;
        }

        # Frontend (Static Files)
        location / {
            root /var/www/html;
            try_files $uri $uri/ /index.html;
        }

        # Cache Static Assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

---

## SSL Configuration

### Using Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL Certificate
sudo certbot --nginx -d sadean.com -d www.sadean.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Manual SSL
```bash
# Create SSL directory
mkdir -p ./nginx/ssl

# Copy certificates
cp /path/to/fullchain.pem ./nginx/ssl/
cp /path/to/privkey.pem ./nginx/ssl/
```

---

## Deployment Steps

### 1. Initial Setup
```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y
```

### 2. Clone Repository
```bash
# Clone repository
git clone https://github.com/username/sadean.git
cd sadean

# Create .env file
cp .env.example .env
nano .env  # Edit with your values
```

### 3. Start Services
```bash
# Build and start
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f backend
```

### 4. Run Migrations
```bash
# Run database migrations
docker compose exec backend npx prisma migrate deploy

# Seed database (optional)
docker compose exec backend npx prisma db seed
```

### 5. Setup Nginx
```bash
# Create nginx config
mkdir -p ./nginx
cp nginx.conf.example ./nginx/nginx.conf

# Get SSL certificate
sudo certbot --nginx -d sadean.com

# Restart nginx
docker compose restart nginx
```

---

## Production Commands

### Service Management
```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart backend
docker compose restart backend

# View logs
docker compose logs -f backend

# Check status
docker compose ps
```

### Database Operations
```bash
# Run migrations
docker compose exec backend npx prisma migrate deploy

# Create migration
docker compose exec backend npx prisma migrate dev --name migration_name

# Reset database
docker compose exec backend npx prisma migrate reset

# Seed database
docker compose exec backend npx prisma db seed
```

### Backup
```bash
# Backup database
docker compose exec postgres pg_dump -U sadean sadean > backup_$(date +%Y%m%d).sql

# Backup MinIO
docker compose exec minio mc mirror /data ./backup/minio
```

---

## Monitoring

### Health Check
```bash
# Backend health
curl https://sadean.com/health

# Response:
{
  "status": "ok",
  "services": {
    "database": "connected",
    "redis": "connected",
    "storage": "connected"
  }
}
```

### Logs
```bash
# View all logs
docker compose logs

# View backend logs
docker compose logs backend

# View database logs
docker compose logs postgres

# View last 100 lines
docker compose logs --tail 100 backend
```

### Metrics
```bash
# Docker stats
docker stats

# Specific container
docker stats sadean-backend
```

---

## Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check logs
docker compose logs backend

# Common fixes:
# 1. Check environment variables
# 2. Ensure database is running
# 3. Check port availability
```

#### Database connection failed
```bash
# Check if postgres is running
docker compose ps postgres

# Check connection
docker compose exec postgres psql -U sadean -d sadean

# Restart postgres
docker compose restart postgres
```

#### SSL certificate expired
```bash
# Renew certificate
sudo certbot renew

# Restart nginx
docker compose restart nginx
```

---

## Rollback

### Rollback Deployment
```bash
# Stop current version
docker compose down

# Pull previous version
git checkout HEAD~1

# Rebuild and start
docker compose up -d --build

# Run migrations if needed
docker compose exec backend npx prisma migrate deploy
```

### Database Rollback
```bash
# Restore from backup
docker compose exec -T postgres psql -U sadean sadean < backup_20260711.sql
```

---

## Security Checklist

### Pre-Launch
- [ ] SSL certificate installed
- [ ] Environment variables secured
- [ ] Database password strong
- [ ] JWT secrets random and strong
- [ ] Rate limiting enabled
- [ ] Firewall configured
- [ ] SSH key authentication
- [ ] Root login disabled

### Post-Launch
- [ ] Monitor logs
- [ ] Regular backups
- [ ] Security updates
- [ ] SSL renewal
- [ ] Performance monitoring

---

**Status:** [x] Final

**Last Updated:** 11 Juli 2026