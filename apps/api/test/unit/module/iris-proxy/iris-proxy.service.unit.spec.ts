import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { AxiosResponse } from 'axios';

import type { LeadUserAssignedInputDto } from '@/api/module/iris-proxy/dto';
import { IrisProxyService } from '@/api/module/iris-proxy/iris-proxy.service';
import { IrisClient } from '@/api/module/iris-proxy/webservice/iris.client';

describe('IrisProxyService', () => {
  let service: IrisProxyService;
  let client: IrisClient;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IrisProxyService,
        {
          provide: IrisClient,
          useValue: {
            get: jest.fn(),
            patch: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IrisProxyService>(IrisProxyService);
    client = module.get<IrisClient>(IrisClient);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('Service and Client', () => {
    it('should be service defined', () => {
      expect(service).toBeDefined();
    });

    it('should be client defined', () => {
      jest.spyOn(client, 'get').mockRejectedValueOnce(undefined);
      expect(client).toBeDefined();
    });
  });

  describe('leadAssignmentWebhook', () => {
    it('should update lead with highest priority users', async () => {
      const payload: LeadUserAssignedInputDto = {
        data: {
          lead: {
            id: 123,
            assignedUsers: [
              { id: 1, userClass: 'Int - ISC', name: 'John Doe' },
            ],
          },
        },
        hook: {
          event: 'lead.assigned',
          requestId: 123,
        },
      };

      const leadDetailResponse: AxiosResponse = {
        data: {
          general: {
            source: {
              name: 'Referral Partner - ABC',
            },
          },
        },
        status: 0,
        statusText: '',
        headers: undefined,
        config: undefined,
      };

      jest
        .spyOn(client, 'get')
        .mockImplementation(() => Promise.resolve(leadDetailResponse));
      jest
        .spyOn(client, 'patch')
        .mockImplementation(() => Promise.resolve(leadDetailResponse));
      jest.spyOn(configService, 'get').mockImplementation(() => 'staging');

      const result = await service.leadAssignmentWebhook(payload);

      expect(result).toEqual({ success: true });
      expect(client.get).toHaveBeenCalledWith('/api/v1/leads/123');
      expect(client.patch).toHaveBeenCalledWith('/api/v1/leads/123', {
        fields: [
          { id: '8438', value: 'John Doe' },
          { id: '8439', value: 'Referral Partner - ABC' },
          { id: '8440', value: '' },
          { id: '8441', value: '' },
        ],
      });
    });

    it('should handle errors and log them', async () => {
      const payload: LeadUserAssignedInputDto = {
        data: {
          lead: {
            id: 123,
            assignedUsers: [
              { id: 1, userClass: 'Int - ISC', name: 'John Doe' },
              { id: 2, userClass: 'Bank Partner $', name: 'Jane Doe' },
            ],
          },
        },
        hook: {
          event: 'lead.assigned',
          requestId: 123,
        },
      };

      jest.spyOn(client, 'patch').mockImplementation(() => {
        throw new Error('Failed to fetch lead details');
      });
      jest.spyOn(Logger, 'error').mockImplementation(() => {});

      await expect(service.leadAssignmentWebhook(payload)).rejects.toThrow(
        'Failed to update lead'
      );
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe('findHighestPriorityUser', () => {
    it('should return the highest priority user based on priority order', () => {
      const users = [
        { id: 1, userClass: 'Int - ISC', name: 'John Doe' },
        { id: 2, userClass: 'Int - SC $', name: 'Jane Doe' },
        { id: 3, userClass: 'Int - Disabled SC', name: 'Alice' },
      ];

      const priorityOrder = ['Int - ISC', 'Int - SC $', 'Int - Disabled SC'];

      const result = service.findHighestPriorityUser(users, priorityOrder);

      expect(result).toEqual({
        id: 1,
        userClass: 'Int - ISC',
        name: 'John Doe',
      });
    });

    it('should return undefined if no user matches the priority order', () => {
      const users = [
        { id: 1, userClass: 'Invalid Class', name: 'John Doe' },
        { id: 2, userClass: 'Another Invalid Class', name: 'Jane Doe' },
      ];

      const priorityOrder = ['Int - ISC', 'Int - SC $', 'Int - Disabled SC'];

      const result = service.findHighestPriorityUser(users, priorityOrder);

      expect(result).toBeUndefined();
    });
  });
});
