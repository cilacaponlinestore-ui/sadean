# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root package files for workspace support
COPY package*.json ./
COPY turbo.json ./

# Copy workspace package.json files
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/ui/package.json ./packages/ui/
COPY packages/config/package.json ./packages/config/

RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client + build
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma
RUN npm run build --workspace=apps/api

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/prisma ./prisma

USER nestjs

EXPOSE 3001

CMD ["node", "dist/src/main.js"]
