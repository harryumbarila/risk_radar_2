import { IdentityClient } from '@frontegg/client';
import type { IUser } from '@frontegg/client/dist/src/clients/identity/types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type AuthServiceConfig = {
  FRONTEGG_CLIENT_ID: string;
  FRONTEGG_API_KEY: string;
};

@Injectable()
export class AuthService {
  private identityClient: IdentityClient;
  private logger: Logger;

  public constructor(config: ConfigService<AuthServiceConfig>) {
    this.identityClient = new IdentityClient({
      FRONTEGG_CLIENT_ID: config.get('FRONTEGG_CLIENT_ID', ''),
      FRONTEGG_API_KEY: config.get('FRONTEGG_API_KEY', ''),
    });
  }

  public async verifyAndGetUser(token: string): Promise<IUser | boolean> {
    try {
      return (await this.identityClient.validateIdentityOnToken(
        token
      )) as unknown as IUser;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }
}
