import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from '../app.config';
import type { AuthenticatedRequest } from './current-user.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest & { headers: Record<string, string | undefined> }>();
    const header = request.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing access token.');
    }

    const token = header.slice(7);

    try {
      request.user = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token, {
        secret: AppConfig.jwtSecret,
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token.');
    }
  }
}
