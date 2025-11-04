import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';

import { AttributionUrlService } from '@/api/module/attribution-url/attribution-url.service';
import type { GenerateAttributionTokenDto } from '@/api/module/attribution-url/dto/generate-attribution-token.dto';

describe('AttributionUrlService', () => {
  let service: AttributionUrlService;
  let configService: ConfigService;
  const mockSignSecret = 'test-secret-key';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttributionUrlService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AttributionUrlService>(AttributionUrlService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('generateAttributionToken', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should generate a valid JWT token with all required fields', () => {
      const payload: GenerateAttributionTokenDto = {
        user_id: '12345',
        channel_id: '67890',
        pb_key: 'pb_test_key123',
      };

      jest.spyOn(configService, 'get').mockReturnValue(mockSignSecret);

      const result = service.generateAttributionToken(payload);

      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');

      // Verify the token can be decoded and contains the correct payload
      const decoded = jwt.verify(result.token, mockSignSecret) as Record<
        string,
        unknown
      >;
      expect(decoded.user_id).toBe(payload.user_id);
      expect(decoded.channel_id).toBe(payload.channel_id);
      expect(decoded.pb_key).toBe(payload.pb_key);
    });

    it('should generate a JWT token with all optional fields', () => {
      const payload: GenerateAttributionTokenDto = {
        user_id: '12345',
        channel_id: '67890',
        pb_key: 'pb_test_key123',
        rsl_user_id: '11111',
        referral_partner_user_id: '22222',
        source_id: '33333',
        lead_id: '44444',
      };

      jest.spyOn(configService, 'get').mockReturnValue(mockSignSecret);

      const result = service.generateAttributionToken(payload);

      expect(result).toBeDefined();
      expect(result.token).toBeDefined();

      // Verify the token contains all fields
      const decoded = jwt.verify(result.token, mockSignSecret) as Record<
        string,
        unknown
      >;
      expect(decoded.user_id).toBe(payload.user_id);
      expect(decoded.channel_id).toBe(payload.channel_id);
      expect(decoded.pb_key).toBe(payload.pb_key);
      expect(decoded.rsl_user_id).toBe(payload.rsl_user_id);
      expect(decoded.referral_partner_user_id).toBe(
        payload.referral_partner_user_id
      );
      expect(decoded.source_id).toBe(payload.source_id);
      expect(decoded.lead_id).toBe(payload.lead_id);
    });

    it('should generate a JWT token without expiration', () => {
      const payload: GenerateAttributionTokenDto = {
        user_id: '12345',
        channel_id: '67890',
        pb_key: 'pb_test_key123',
      };

      jest.spyOn(configService, 'get').mockReturnValue(mockSignSecret);

      const result = service.generateAttributionToken(payload);

      // Verify the token has no expiration (exp field should not exist)
      const decoded = jwt.decode(result.token) as Record<string, unknown>;
      expect(decoded.exp).toBeUndefined();
    });

    it('should throw an error when ATTRIBUTION_DATA_SIGN_SECRET is not configured', () => {
      const payload: GenerateAttributionTokenDto = {
        user_id: '12345',
        channel_id: '67890',
        pb_key: 'pb_test_key123',
      };

      jest.spyOn(configService, 'get').mockReturnValue(undefined);

      expect(() => service.generateAttributionToken(payload)).toThrow(
        'Attribution signing secret is not configured'
      );
    });

    it('should throw an error when ATTRIBUTION_DATA_SIGN_SECRET is empty string', () => {
      const payload: GenerateAttributionTokenDto = {
        user_id: '12345',
        channel_id: '67890',
        pb_key: 'pb_test_key123',
      };

      jest.spyOn(configService, 'get').mockReturnValue('');

      expect(() => service.generateAttributionToken(payload)).toThrow(
        'Attribution signing secret is not configured'
      );
    });

    it('should handle JWT signing errors gracefully', () => {
      const payload: GenerateAttributionTokenDto = {
        user_id: '12345',
        channel_id: '67890',
        pb_key: 'pb_test_key123',
      };

      jest.spyOn(configService, 'get').mockReturnValue(mockSignSecret);

      // Mock jwt.sign to throw an error
      const jwtSignSpy = jest.spyOn(jwt, 'sign').mockImplementation(() => {
        throw new Error('JWT signing failed');
      });

      expect(() => service.generateAttributionToken(payload)).toThrow(
        'Failed to generate attribution token'
      );

      // Restore original implementation
      jwtSignSpy.mockRestore();
    });

    it('should use HS256 algorithm for signing', () => {
      const payload: GenerateAttributionTokenDto = {
        user_id: '12345',
        channel_id: '67890',
        pb_key: 'pb_test_key123',
      };

      jest.spyOn(configService, 'get').mockReturnValue(mockSignSecret);

      const jwtSignSpy = jest.spyOn(jwt, 'sign');

      service.generateAttributionToken(payload);

      expect(jwtSignSpy).toHaveBeenCalledWith(
        expect.any(Object),
        mockSignSecret,
        expect.objectContaining({
          algorithm: 'HS256',
        })
      );
    });

    it('should generate different tokens for different payloads', () => {
      const payload1: GenerateAttributionTokenDto = {
        user_id: '12345',
        channel_id: '67890',
        pb_key: 'pb_test_key123',
      };

      const payload2: GenerateAttributionTokenDto = {
        user_id: '99999',
        channel_id: '67890',
        pb_key: 'pb_test_key123',
      };

      jest.spyOn(configService, 'get').mockReturnValue(mockSignSecret);

      const result1 = service.generateAttributionToken(payload1);
      const result2 = service.generateAttributionToken(payload2);

      expect(result1.token).not.toBe(result2.token);
    });
  });
});
