import type { INestApplication } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppController } from '@/api/app.controller';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
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

  describe('/ (GET)', () => {
    it('should return version information', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('version', '1.0.0');
          expect(res.body).toHaveProperty('branch', 'develop');
          expect(res.body).toHaveProperty('commit', 'develop');
          expect(res.body).toHaveProperty('created_at', '2025-02-01');
          expect(res.body).toHaveProperty('current_server_time');
        });
    });
  });

  describe('/status (GET)', () => {
    it('should return UP status', async () => {
      const response = await request(app.getHttpServer())
        .get('/status')
        .expect(200);

      expect(response.body).toEqual({ status: 'UP' });
    });
  });
});
