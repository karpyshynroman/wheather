import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AppConfig } from '../app.config';
import { UsersService } from '../users/users.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create(dto.email, passwordHash);
    return this.createSession(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.createSession(user.id, user.email);
  }

  private async createSession(userId: string, email: string) {
    const payload: JwtPayload = { sub: userId, email };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: AppConfig.jwtSecret,
        expiresIn: AppConfig.jwtExpiresIn as never,
      }),
      user: {
        id: userId,
        email,
      },
    };
  }
}
