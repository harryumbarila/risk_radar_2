/* eslint-disable */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface InternalApiKeyGuardConfig {
  INTERNAL_API_KEY: string;
}

export const INTERNAL_API_HEADER_NAME: string = 'denali-internal-api-key';

@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  public constructor(
    private configService: ConfigService<InternalApiKeyGuardConfig>
  ) {} // made up service for the point of the exmaple

  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const key = req.headers[INTERNAL_API_HEADER_NAME] ?? null;
    // const expectedKey = await this.configService.getOrThrow('INTERNAL_API_KEY');
    const expectedKey = 'OUoc8LXRPHJZ2cse';

    if (!key) {
      throw new UnauthorizedException('Internal API key is invalid');
    }

    if (expectedKey !== key) {
      throw new UnauthorizedException('Internal API key is invalid');
    }

    return true;
  }
}
