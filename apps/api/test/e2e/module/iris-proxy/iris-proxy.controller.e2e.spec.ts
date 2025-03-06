import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { IrisProxyController } from '@/api/module/iris-proxy/iris-proxy.controller';
import { IrisProxyService } from '@/api/module/iris-proxy/iris-proxy.service';
import { IrisClient } from '@/api/module/iris-proxy/webservice/iris.client';

describe('IrisProxyController (e2e)', () => {
  let app: INestApplication;
  let irisClientMock: Partial<IrisClient>;
  let irisProxyServiceMock: Partial<IrisProxyService>;
  let configServiceMock: Partial<ConfigService>;

  beforeEach(async () => {
    // Mock the IrisClient with proper response structure
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
              },
            ],
            manages: [
              {
                user_id: 3,
                username: 'bob.johnson',
                full_name: 'Bob Johnson',
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
        { provide: IrisClient, useValue: irisClientMock },
        { provide: ConfigService, useValue: configServiceMock },
        { provide: IrisProxyService, useValue: irisProxyServiceMock },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/v1/iris_proxy/users (GET)', () => {
    it('should return filtered users', async () => {
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
          manages: [{ user_id: 3, username: 'Bob Johnson' }],
          rsl: [{ id: 2, name: 'Jane Smith' }],
          value: 1,
        },
      ]);

      // Verify that the client method was called
      expect(irisClientMock.getUsers).toHaveBeenCalled();
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
});
