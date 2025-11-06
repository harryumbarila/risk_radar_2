import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

import {
  GenerateAttributionTokenDto,
  GenerateAttributionTokenResponseDto,
} from './dto/generate-attribution-token.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AttributionUrlService {
  private readonly logger = new Logger(AttributionUrlService.name);

  public constructor(private configService: ConfigService) {}

  public generateAttributionToken(
    payload: GenerateAttributionTokenDto
  ): GenerateAttributionTokenResponseDto {
    const signSecret = this.configService.get<string>(
      'ATTRIBUTION_DATA_SIGN_SECRET'
    );

    if (!signSecret) {
      this.logger.error('ATTRIBUTION_DATA_SIGN_SECRET is not configured');
      throw new Error('Attribution signing secret is not configured');
    }

    try {
      const objectPayload = instanceToPlain(payload);

      // Sign the JWT with no expiration
      const token = jwt.sign(objectPayload, signSecret, {
        algorithm: 'HS256',
        // No expiration set as per requirements
      });

      this.logger.log(
        `Generated attribution token for user_id: ${payload.user_id}`
      );

      return { token };
    } catch (error) {
      this.logger.error('Failed to generate attribution token', error);
      throw new Error('Failed to generate attribution token');
    }
  }
}
