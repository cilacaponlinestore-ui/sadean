/**
 * Application Configuration
 */
export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'SADEAN',
    url: process.env.APP_URL || 'http://localhost:3000',
    apiUrl: process.env.API_URL || 'http://localhost:3001',
    apiPrefix: process.env.API_PREFIX || 'api/v1',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret',
    jwtExpiration: process.env.JWT_EXPIRATION || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '30d',
  },

  database: {
    url: process.env.DATABASE_URL || 'postgresql://sadean:sadean_secret@localhost:5432/sadean',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  storage: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    bucket: process.env.MINIO_BUCKET || 'sadean',
    useSSL: process.env.MINIO_USE_SSL === 'true',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  throttler: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60000'),
    limit: parseInt(process.env.THROTTLE_LIMIT || '100'),
  },
} as const;

export type Config = typeof config;