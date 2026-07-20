import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

function superAdminEmail(): string | undefined {
  return process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase() || undefined;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: dto.name,
        phone: dto.phone,
        role: this.roleForEmail(email, dto.role || 'buyer'),
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken, lastLogin: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Akun Anda telah dinonaktifkan');
    }

    if (!user.password) {
      throw new UnauthorizedException('Gunakan login Google untuk akun ini');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const role = this.roleForEmail(user.email, user.role);
    const tokens = await this.generateTokens(user.id, user.email, role);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { role, refreshToken: tokens.refreshToken, lastLogin: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role,
      },
      ...tokens,
    };
  }

  async googleLogin(accessToken: string) {
    const supabase = createClient(
      this.configService.getOrThrow('SUPABASE_URL'),
      this.configService.getOrThrow('SUPABASE_ANON_KEY'),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data, error } = await supabase.auth.getUser(accessToken);
    const identity = data.user;
    const providers = [
      identity?.app_metadata?.provider,
      ...(identity?.app_metadata?.providers || []),
      ...(identity?.identities?.map((item) => item.provider) || []),
    ];

    if (error || !identity?.id || !identity.email || !identity.email_confirmed_at || !providers.includes('google')) {
      throw new UnauthorizedException('Identitas Google tidak valid');
    }

    const email = identity.email.trim().toLowerCase();
    let user = await this.prisma.user.findFirst({
      where: { OR: [{ supabaseAuthId: identity.id }, { email }] },
    });

    if (user?.supabaseAuthId && user.supabaseAuthId !== identity.id) {
      throw new ConflictException('Email sudah terhubung ke akun Google lain');
    }

    if (!user) {
      const name = String(identity.user_metadata?.full_name || identity.user_metadata?.name || email.split('@')[0]).slice(0, 100);
      const avatar = typeof identity.user_metadata?.avatar_url === 'string' ? identity.user_metadata.avatar_url : null;
      user = await this.prisma.user.create({
        data: { email, password: null, name, avatar, role: this.roleForEmail(email, 'buyer'), supabaseAuthId: identity.id },
      });
    } else if (!user.supabaseAuthId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { supabaseAuthId: identity.id },
      });
    }

    if (!user.isActive) throw new UnauthorizedException('Akun Anda telah dinonaktifkan');

    const role = this.roleForEmail(user.email, user.role);
    const tokens = await this.generateTokens(user.id, user.email, role);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { role, refreshToken: tokens.refreshToken, lastLogin: new Date() },
    });

    return {
      user: { id: user.id, email: user.email, name: user.name, role, avatar: user.avatar },
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findFirst({
      where: { refreshToken },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const role = this.roleForEmail(user.email, user.role);
    const tokens = await this.generateTokens(user.id, user.email, role);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { role, refreshToken: tokens.refreshToken },
    });

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '30d'),
    });

    return { accessToken, refreshToken };
  }

  private roleForEmail(email: string, fallback: string) {
    const sa = superAdminEmail();
    return sa && email.trim().toLowerCase() === sa ? 'super_admin' : fallback;
  }
}
