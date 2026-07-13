# SADEAN — Security

> Keamanan sistem SADEAN V1

---

## Overview

Security adalah prioritas utama dalam arsitektur SADEAN. Semua data sensitif harus dilindungi dari akses tidak sah.

---

## Security Layers

### 1. Network Security

#### SSL/TLS
```
- HTTPS enforced
- TLS 1.2 minimum
- Strong cipher suites
- HSTS headers
```

#### Nginx Configuration
```nginx
# SSL Configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers off;

# HSTS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

### 2. Application Security

#### Helmet (NestJS)
```typescript
// main.ts
import helmet from 'helmet';

app.use(helmet());
```

#### CORS
```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});
```

#### Rate Limiting
```typescript
// ThrottlerModule
ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000, // 1 second
    limit: 3,
  },
  {
    name: 'medium',
    ttl: 10000, // 10 seconds
    limit: 20,
  },
  {
    name: 'long',
    ttl: 60000, // 1 minute
    limit: 100,
  },
]),
```

---

### 3. Authentication Security

#### JWT Configuration
```typescript
// jwt.config.ts
export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '15m', // Access token: 15 minutes
  },
};
```

#### Refresh Token
```typescript
// Refresh token: 30 days
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000;
```

#### Token Rotation
- Access token: 15 minutes
- Refresh token: 30 days
- Rotation on each refresh
- Old refresh tokens invalidated

---

### 4. Password Security

#### Hashing (bcrypt)
```typescript
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Hash password
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

// Verify password
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

#### Password Policy
```yaml
Minimum Length: 8 characters
Required:
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
Not Allowed:
  - Email as password
  - Common passwords
  - Sequential characters
```

---

### 5. Input Validation

#### Class Validator (NestJS)
```typescript
// dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
```

#### Sanitization
```typescript
// Sanitize input
import * as sanitizeHtml from 'sanitize-html';

const clean = sanitizeHtml(dirty, {
  allowedTags: [],
  allowedAttributes: {},
});
```

---

### 6. SQL Injection Prevention

#### Prisma ORM
```typescript
// Prisma uses parameterized queries automatically
const user = await prisma.user.findUnique({
  where: { email: userInput },
});
```

#### Raw Queries (if needed)
```typescript
// Use parameterized queries
const result = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${email}
`;
```

---

### 7. XSS Protection

#### Output Encoding
```typescript
// All output is JSON (automatically escaped)
// React escapes output by default
```

#### Content Security Policy
```nginx
# Nginx CSP header
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';" always;
```

---

### 8. File Upload Security

#### Allowed Types
```typescript
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
```

#### Validation
```typescript
// Validate file type
if (!ALLOWED_TYPES.includes(file.mimetype)) {
  throw new BadRequestException('Invalid file type');
}

// Validate file size
if (file.size > MAX_FILE_SIZE) {
  throw new BadRequestException('File too large');
}
```

#### Storage Security
- Random filenames (UUID)
- Separate storage bucket
- No direct file access (use signed URLs)
- Regular malware scanning

---

### 9. Authorization

#### Role-Based Access Control (RBAC)
```typescript
// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

#### Resource Ownership
```typescript
// Ensure user owns the resource
const product = await this.productService.findOne(id);

if (product.seller.userId !== user.id) {
  throw new ForbiddenException('Not your product');
}
```

---

### 10. Audit Logging

#### What to Log
```yaml
Authentication:
  - Login attempts (success/failure)
  - Logout
  - Password changes
  - Token refresh

Data Changes:
  - Create/Update/Delete operations
  - Old and new values
  - User ID
  - Timestamp
  - IP address

Security Events:
  - Rate limit exceeded
  - Invalid token
  - Unauthorized access
```

#### Audit Log Schema
```typescript
// audit-logs.service.ts
async log(params: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  await this.prisma.auditLog.create({
    data: {
      ...params,
      createdAt: new Date(),
    },
  });
}
```

---

## Security Checklist

### Pre-Launch
- [ ] SSL/TLS configured
- [ ] Environment variables secured
- [ ] JWT secret is strong and random
- [ ] Database password is strong
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection enabled
- [ ] CORS configured properly
- [ ] File upload validation
- [ ] Audit logging enabled
- [ ] Error messages don't leak info

### Production
- [ ] Disable debug mode
- [ ] Enable HTTPS only
- [ ] Regular security updates
- [ ] Monitor logs
- [ ] Backup encryption
- [ ] Access control review

---

## Environment Variables

### Required Security Variables
```env
# JWT
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRATION=15m

# Refresh Token
REFRESH_TOKEN_SECRET=your-refresh-secret-here
REFRESH_TOKEN_EXPIRY=30d

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sadean

# Redis
REDIS_URL=redis://localhost:6379

# MinIO
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://sadean.com
```

### Security Rules for Environment
1. Never commit to git
2. Use .env.example for documentation
3. Rotate secrets regularly
4. Use different secrets for dev/prod
5. Restrict file permissions (chmod 600)

---

## Incident Response

### Security Breach Steps
1. Identify the breach
2. Contain the breach
3. Eradicate the cause
4. Recover systems
5. Notify affected users
6. Document lessons learned

### Monitoring Alerts
```yaml
High Priority:
  - Multiple failed logins
  - SQL injection attempts
  - Unauthorized access
  - Data exfiltration

Medium Priority:
  - Rate limit exceeded
  - Invalid file uploads
  - Unusual traffic patterns

Low Priority:
  - Configuration changes
  - User registration spikes
```

---

## Compliance

### Data Protection
- Encrypt sensitive data at rest
- Encrypt data in transit
- Implement data retention policies
- Allow user data deletion

### Privacy
- Clear privacy policy
- User consent for data collection
- Opt-out options
- Data portability

---

**Status:** [x] Final

**Last Updated:** 11 Juli 2026