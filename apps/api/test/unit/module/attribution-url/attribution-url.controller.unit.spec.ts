import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { AttributionUrlController } from '@/api/module/attribution-url/attribution-url.controller';
import { AttributionUrlService } from '@/api/module/attribution-url/attribution-url.service';
import type {
  GenerateAttributionTokenDto,
  GenerateAttributionTokenResponseDto,
} from '@/api/module/attribution-url/dto/generate-attribution-token.dto';

describe('AttributionUrlController', () => {
  let controller: AttributionUrlController;
  let service: AttributionUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttributionUrlController],
      providers: [
        {
          provide: AttributionUrlService,
          useValue: {
            generateAttributionToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AttributionUrlController>(AttributionUrlController);
    service = module.get<AttributionUrlService>(AttributionUrlService);
  });

  describe('generateAttributionToken', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should call service.generateAttributionToken with correct payload', () => {
      const payload: GenerateAttributionTokenDto = {
        user_id: '12345',
        channel_id: '67890',
        pb_key: 'pb_test_key123',
      };

      const expectedResponse: GenerateAttributionTokenResponseDto = {
        token: 'mock-jwt-token',
      };

      jest
        .spyOn(service, 'generateAttributionToken')
        .mockReturnValue(expectedResponse);

      const result = controller.generateAttributionToken(payload);

      expect(service.generateAttributionToken).toHaveBeenCalledWith(payload);
      expect(service.generateAttributionToken).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle payload with all optional fields', () => {
      const payload: GenerateAttributionTokenDto = {
        user_id: '12345',
        channel_id: '67890',
        pb_key: 'pb_test_key123',
        rsl_user_id: '11111',
        referral_partner_user_id: '22222',
        source_id: '33333',
        lead_id: '44444',
      };

      const expectedResponse: GenerateAttributionTokenResponseDto = {
        token: 'mock-jwt-token-with-optional-fields',
      };

      jest
        .spyOn(service, 'generateAttributionToken')
        .mockReturnValue(expectedResponse);

      const result = controller.generateAttributionToken(payload);

      expect(service.generateAttributionToken).toHaveBeenCalledWith(payload);
      expect(result).toEqual(expectedResponse);
    });

    it('should propagate errors from service', () => {
      const payload: GenerateAttributionTokenDto = {
        user_id: '12345',
        channel_id: '67890',
        pb_key: 'pb_test_key123',
      };

      const error = new Error('Attribution signing secret is not configured');
      jest.spyOn(service, 'generateAttributionToken').mockImplementation(() => {
        throw error;
      });

      expect(() => controller.generateAttributionToken(payload)).toThrow(error);
      expect(service.generateAttributionToken).toHaveBeenCalledWith(payload);
    });

    it('should return response with token property', () => {
      const payload: GenerateAttributionTokenDto = {
        user_id: '12345',
        channel_id: '67890',
        pb_key: 'pb_test_key123',
      };

      const expectedResponse: GenerateAttributionTokenResponseDto = {
        token: 'valid-jwt-token-string',
      };

      jest
        .spyOn(service, 'generateAttributionToken')
        .mockReturnValue(expectedResponse);

      const result = controller.generateAttributionToken(payload);

      expect(result).toHaveProperty('token');
      expect(result.token).toBe('valid-jwt-token-string');
    });
  });
});
