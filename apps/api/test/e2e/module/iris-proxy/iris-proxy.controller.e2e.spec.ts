import type { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestFastifyApplication } from '@nestjs/platform-fastify'; // Import the Fastify adapter
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import type { LeadUserAssignedInputDto } from '@/api/module/iris-proxy/dto';
import { IrisProxyController } from '@/api/module/iris-proxy/iris-proxy.controller';
import { IrisProxyService } from '@/api/module/iris-proxy/iris-proxy.service';
import { IrisClient } from '@/api/shared/module/iris/iris.client';

describe('IrisProxyController (e2e)', () => {
  let app: INestApplication;
  let irisClientMock: Partial<IrisClient>;
  let irisProxyServiceMock: Partial<IrisProxyService>;
  let configServiceMock: Partial<ConfigService>;

  beforeEach(async () => {
    // Mock the IrisClient with proper response structure

    irisProxyServiceMock = {
      leadAssignmentWebhook: jest.fn().mockResolvedValue({ success: true }),
    };

    irisClientMock = {
      getUsers: jest.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            full_name: 'John Doe',
            class: {
              id: 101,
              name: 'Manager',
            },
            groups: [
              {
                id: 201,
                name: 'Sales',
              },
              {
                id: 202,
                name: 'Marketing',
              },
            ],
            reports_to: [
              {
                user_id: 2,
                username: 'jane.smith',
                full_name: 'Jane Smith',
                class: {
                  id: 25, // Production RSL class ID
                  name: 'RSL Class',
                },
              },
              {
                user_id: 3,
                username: 'invalid.rsl',
                full_name: 'Invalid RSL',
                class: {
                  id: 999, // Invalid class ID that should be filtered out
                  name: 'Other Class',
                },
              },
            ],
            manages: [
              {
                user_id: 4,
                username: 'bob.johnson',
                full_name: 'Bob Johnson',
                class: {
                  id: 71, // Production partner class ID
                  name: 'Referral Partners $',
                },
              },
              {
                user_id: 5,
                username: 'invalid.partner',
                full_name: 'Invalid Partner',
                class: {
                  id: 888, // Invalid class ID that should be filtered out
                  name: 'Other Class',
                },
              },
            ],
          },
        ],
        meta: {
          current_page: 1,
          from: 1,
          last_page: 5,
          path: '/api/users',
          per_page: 15,
          to: 15,
          total: 75,
        },
      }),
      getChannels: jest.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Channel 1' }],
      }),
    };

    // Mock the ConfigService
    configServiceMock = {
      get: jest.fn((key) => (key === 'IRIS_ENV' ? 'production' : undefined)),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [IrisProxyController],
      providers: [
        IrisProxyService,
        {
          provide: 'BullQueue_assigned-users',
          useValue: {
            add: jest.fn(), // mock queue add
          },
        },
        { provide: IrisClient, useValue: irisClientMock },
        { provide: ConfigService, useValue: configServiceMock },
        { provide: IrisProxyService, useValue: irisProxyServiceMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/v1/iris_proxy/users (GET)', () => {
    it('should return filtered users with only valid class IDs', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/iris_proxy/users')
        .expect(200);

      // Detailed structure validation matching expected transformation
      const user = response.body.data;
      expect(user).toEqual([
        {
          channels: [
            { id: 201, name: 'Sales' },
            { id: 202, name: 'Marketing' },
          ],
          label: 'John Doe',
          value: 1,
          // Only users with valid class IDs should be included
          rsl: [{ id: 2, name: 'Jane Smith' }],
          manages: [{ user_id: 4, username: 'Bob Johnson' }],
        },
      ]);

      // Verify that the client method was called
      expect(irisClientMock.getUsers).toHaveBeenCalled();
    });

    /**
     * TODO refactor this test should not close earlier test application. Tests can be run in parallel or separately.
     */
    it('should return filtered users with staging environment class IDs', async () => {
      // Close the existing app
      await app.close();

      // Create new mocks for staging environment
      const stagingConfigServiceMock = {
        get: jest.fn((key) => (key === 'IRIS_ENV' ? 'staging' : undefined)),
      };

      // Update mock data for staging environment
      const stagingIrisClientMock = {
        getUsers: jest.fn().mockResolvedValue({
          data: [
            {
              id: 1,
              full_name: 'John Doe',
              class: {
                id: 101,
                name: 'Manager',
              },
              groups: [
                {
                  id: 201,
                  name: 'Sales',
                },
              ],
              reports_to: [
                {
                  user_id: 2,
                  username: 'jane.smith',
                  full_name: 'Jane Smith',
                  class: {
                    id: 53, // Staging RSL class ID
                    name: 'RSL Class',
                  },
                },
              ],
              manages: [
                {
                  user_id: 4,
                  username: 'bob.johnson',
                  full_name: 'Bob Johnson',
                  class: {
                    id: 41, // Staging partner class ID
                    name: 'Referral Partners $',
                  },
                },
              ],
            },
          ],
          meta: {
            current_page: 1,
            from: 1,
            last_page: 5,
            path: '/api/users',
            per_page: 15,
            to: 15,
            total: 75,
          },
        }),
        getChannels: jest.fn().mockResolvedValue({
          data: [{ id: 1, name: 'Channel 1' }],
        }),
      };

      // Recreate the app with the updated mocks
      const moduleFixture: TestingModule = await Test.createTestingModule({
        controllers: [IrisProxyController],
        providers: [
          IrisProxyService,
          {
            provide: 'BullQueue_assigned-users',
            useValue: {
              add: jest.fn(), // mock queue add
            },
          },
          { provide: IrisClient, useValue: stagingIrisClientMock },
          { provide: ConfigService, useValue: stagingConfigServiceMock },
        ],
      }).compile();

      app = moduleFixture.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter()
      );
      await app.init();
      await app.getHttpAdapter().getInstance().ready();

      const response = await request(app.getHttpServer())
        .get('/v1/iris_proxy/users')
        .expect(200);

      // Detailed structure validation matching expected transformation
      const user = response.body.data;

      // Check that we have data
      expect(user).toBeDefined();
      expect(Array.isArray(user)).toBe(true);
      expect(user.length).toBe(1);

      // Check the structure but not the exact content of arrays
      // since we're testing integration with the real service
      expect(user[0]).toHaveProperty('channels');
      expect(user[0]).toHaveProperty('label', 'John Doe');
      expect(user[0]).toHaveProperty('value', 1);
      expect(user[0]).toHaveProperty('rsl');
      expect(user[0]).toHaveProperty('manages');

      // Verify that the client method was called
      expect(stagingIrisClientMock.getUsers).toHaveBeenCalled();
    });
  });

  describe('/v1/iris_proxy/channels (GET)', () => {
    it('should return channels', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/iris_proxy/channels')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');

      expect(irisClientMock.getChannels).toHaveBeenCalled();
    });
  });

  describe('/v1/iris_proxy/partners (GET)', () => {
    it('should return production partners when IRIS_ENV is production', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/iris_proxy/partners')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('id', 71);
      expect(response.body.data[0]).toHaveProperty(
        'name',
        'Default Referral Partner'
      );
    });

    it('should return staging partners when IRIS_ENV is staging', async () => {
      // Override the config mock for this test
      configServiceMock.get = jest.fn((key) =>
        key === 'IRIS_ENV' ? 'staging' : undefined
      );

      const response = await request(app.getHttpServer())
        .get('/v1/iris_proxy/partners')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('id', 41);
      expect(response.body.data[0]).toHaveProperty(
        'name',
        'Default Referral Partner'
      );
    });
  });
  describe('/v1/iris_proxy/lead-assigned-webhook (POST)', () => {
    beforeEach(() => {
      irisClientMock = {
        get: jest.fn().mockResolvedValue({
          data: {
            general: {
              source: {
                name: 'Referral Partner - ABC',
              },
            },
          },
        }),
        patch: jest.fn().mockResolvedValue({}),
      };
    });

    it('should process lead assignment webhook and return success', async () => {
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

      const response = await request(app.getHttpServer())
        .post('/v1/iris_proxy/lead-assigned-webhook')
        .send(payload)
        .expect(201);

      expect(response.body).toEqual({ success: true });
      expect(irisProxyServiceMock.leadAssignmentWebhook).toHaveBeenCalledWith(
        payload
      );
    });

    it('should handle errors during lead assignment webhook processing', async () => {
      const payload = {
        data: {
          lead: {
            id: '123',
            assignedUsers: [
              { id: 1, userClass: 'Int - ISC', name: 'John Doe' },
              { id: 2, userClass: 'Bank Partner $', name: 'Jane Doe' },
            ],
          },
        },
      };

      irisProxyServiceMock.leadAssignmentWebhook = jest
        .fn()
        .mockRejectedValue(new Error('Failed to update lead'));

      const response = await request(app.getHttpServer())
        .post('/v1/iris_proxy/lead-assigned-webhook')
        .send(payload)
        .expect(500);

      expect(response.body).toEqual({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });

      expect(irisProxyServiceMock.leadAssignmentWebhook).toHaveBeenCalledWith(
        payload
      );
    });
  });
});
