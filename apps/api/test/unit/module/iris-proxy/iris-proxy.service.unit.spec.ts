import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { AxiosResponse } from 'axios';

import type { LeadUserAssignedInputDto } from '@/api/module/iris-proxy/dto';
import { IrisProxyService } from '@/api/module/iris-proxy/iris-proxy.service';
import { IrisClient } from '@/api/shared/module/iris/iris.client';
import { AssignedUsersConsumer } from '@/api/module/iris-proxy/consumer/assigned-user.consumer';

describe('IrisProxyService', () => {
  let service: IrisProxyService;
  let assignment: AssignedUsersConsumer;
  let client: IrisClient;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IrisProxyService,
        AssignedUsersConsumer,
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
        {
          provide: 'BullQueue_assigned-users',
          useValue: {
            add: jest.fn(), // mock queue add
          },
        },
      ],
    }).compile();

    service = module.get<IrisProxyService>(IrisProxyService);
    assignment = module.get<AssignedUsersConsumer>(AssignedUsersConsumer);
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
              { id: 1, userClass: 'Int - Disabled SC', name: 'Marie Doe' },
              { id: 2, userClass: 'Int - ISC', name: 'John Doe' },
              { id: 3, userClass: 'Int - ISC', name: 'John Doe 2' },
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
    });
  });

  describe('findHighestPriorityUser', () => {
    it('should return the highest priority user based on priority order', () => {
      const users = [
        { id: 3, userClass: 'Int - SC $', name: 'Jane Doe' },
        { id: 2, userClass: 'Int - Disabled SC', name: 'Alice' },
        { id: 1, userClass: 'Int - ISC', name: 'John Doe' },
      ];

      const priorityOrder = ['Int - ISC', 'Int - SC $', 'Int - Disabled SC'];

      const result = assignment.findHighestPriorityUser(users, priorityOrder);

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

      const result = assignment.findHighestPriorityUser(users, priorityOrder);

      expect(result).toBeUndefined();
    });
  });
});
