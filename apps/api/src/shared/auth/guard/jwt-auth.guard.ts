import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { AuthService } from '@/api/shared/auth/auth.service';
import { IS_PUBLIC_KEY } from '@/api/shared/auth/decorator/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  public static readonly REQUEST_USER_ENTITY_KEY: string = 'userEntity';

  public constructor(
    private authService: AuthService,
    private reflector: Reflector
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.authService.verifyAndGetUser(token);

      if (user) {
        request[JwtAuthGuard.REQUEST_USER_ENTITY_KEY] = user;
        return true;
      }
    } catch (e) {
      throw new UnauthorizedException();
    }

    throw new UnauthorizedException();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization;
  }
}
