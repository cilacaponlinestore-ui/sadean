# SADEAN — Authentication

> Sistem autentikasi dan otorisasi SADEAN V1

---

## Overview

SADEAN menggunakan JWT (JSON Web Token) untuk autentikasi dengan refresh token rotation untuk keamanan.

---

## Authentication Flow

### Login Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────>│   Backend   │────>│  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │
      │  1. Login Request │                   │
      │  (email, password)│                   │
      │──────────────────>│                   │
      │                   │  2. Find User     │
      │                   │──────────────────>│
      │                   │                   │
      │                   │  3. User Found    │
      │                   │<──────────────────│
      │                   │                   │
      │                   │  4. Verify Pass   │
      │                   │  (bcrypt.compare) │
      │                   │                   │
      │                   │  5. Generate JWT  │
      │                   │  (access + refresh)│
      │                   │                   │
      │  6. Return Tokens │                   │
      │<──────────────────│                   │
      │                   │                   │
      │  7. Store Tokens  │                   │
      │  (localStorage)   │                   │
```

### Token Refresh Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────>│   Backend   │────>│  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │
      │  1. Refresh Token │                   │
      │──────────────────>│                   │
      │                   │  2. Verify Token  │
      │                   │──────────────────>│
      │                   │                   │
      │                   │  3. Valid?        │
      │                   │<──────────────────│
      │                   │                   │
      │                   │  4. Generate New  │
      │                   │  Tokens           │
      │                   │                   │
      │                   │  5. Invalidate Old│
      │                   │──────────────────>│
      │                   │                   │
      │  6. Return New    │                   │
      │  Tokens           │                   │
      │<──────────────────│                   │
```

---

## JWT Structure

### Access Token
```json
{
  "sub": "user-id-uuid",
  "email": "user@example.com",
  "role": "buyer",
  "iat": 1689000000,
  "exp": 1689000900
}
```

### Token Configuration
```typescript
// Access Token
{
  expiresIn: '15m',      // 15 minutes
  secret: process.env.JWT_SECRET
}

// Refresh Token
{
  expiresIn: '30d',      // 30 days
  secret: process.env.REFRESH_TOKEN_SECRET
}
```

---

## User Roles

### Role Hierarchy
```yaml
admin:
  permissions:
    - users:read
    - users:write
    - sellers:read
    - sellers:write
    - products:read
    - products:write
    - orders:read
    - orders:write
    - banners:read
    - banners:write
    - dashboard:admin

seller:
  permissions:
    - products:read
    - products:write (own)
    - orders:read (own)
    - orders:write (own)
    - profile:read
    - profile:write
    - dashboard:seller

buyer:
  permissions:
    - products:read
    - orders:read (own)
    - orders:write (own)
    - profile:read
    - profile:write
    - favorites:read
    - favorites:write
    - addresses:read
    - addresses:write
```

---

## Guards

### Auth Guard
```typescript
// auth.guard.ts
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException();
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

### Roles Guard
```typescript
// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

### Owner Guard
```typescript
// owner.guard.ts
@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resource = request.resource; // Set by interceptor
    
    // Admin can access everything
    if (user.role === 'admin') {
      return true;
    }
    
    // Check ownership
    if (resource.userId === user.sub || resource.sellerId === user.sub) {
      return true;
    }
    
    throw new ForbiddenException('Not your resource');
  }
}
```

---

## Decorators

### @Roles
```typescript
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

### @CurrentUser
```typescript
// current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
```

### @Public
```typescript
// public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

---

## Implementation

### Auth Module
```typescript
// auth.module.ts
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### Auth Service
```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshTokens(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '30d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
```

### Auth Controller
```typescript
// auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Public()
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @Public()
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@CurrentUser('sub') userId: string) {
    return this.authService.logout(userId);
  }
}
```

---

## Token Storage

### Client Side
```typescript
// token.service.ts
@Injectable()
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  isTokenExpiring(token: string): boolean {
    const payload = this.decodeToken(token);
    const expiresIn = payload.exp * 1000 - Date.now();
    return expiresIn < 5 * 60 * 1000; // Less than 5 minutes
  }
}
```

---

## Security Measures

### Password Hashing
```typescript
const SALT_ROUNDS = 10;

// Hash on registration/update
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

// Verify on login
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### Token Expiration
```yaml
Access Token:
  Expiration: 15 minutes
  Storage: Memory/State
  Refresh: Automatic

Refresh Token:
  Expiration: 30 days
  Storage: HttpOnly Cookie or Secure Storage
  Rotation: On each refresh
```

### Token Revocation
```typescript
// Logout: Invalidate refresh token
async logout(userId: string) {
  await this.prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
}

// Password change: Invalidate all tokens
async changePassword(userId: string, newPassword: string) {
  await this.prisma.user.update({
    where: { id: userId },
    data: {
      password: await bcrypt.hash(newPassword, 10),
      refreshToken: null, // Invalidate all sessions
    },
  });
}
```

---

## Error Handling

### Common Errors

| Error | Status | Message |
|-------|--------|---------|
| Invalid credentials | 401 | "Invalid email or password" |
| Token expired | 401 | "Token expired" |
| Invalid token | 401 | "Invalid token" |
| Insufficient permissions | 403 | "Forbidden" |
| User not found | 404 | "User not found" |

### Error Response Format
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid token"
}
```

---

## Testing

### Unit Tests
```typescript
describe('AuthService', () => {
  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });
      
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw for invalid credentials', async () => {
      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'wrong',
        }),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

### E2E Tests
```typescript
describe('Auth (e2e)', () => {
  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
      });
  });
});
```

---

**Status:** [x] Final

**Last Updated:** 11 Juli 2026