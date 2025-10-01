/* eslint-disable */
import fastifyCompress from '@fastify/compress';
import fastifyHelmet from '@fastify/helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

import { AppModule } from './app.module';
import { config } from './config';

// TODO: Handle as a env variable

process.env.TZ = 'America/Chicago';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // TODO: Remove this once we have a proper CORS policy
  app.enableCors({
    origin: [
      'https://dashboard.taluspay-staging.com',
      'https://dashboard.taluspay.com',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  });

  // TODO: Check error types

  await app.register(fastifyCompress as any);

  await app.register(fastifyHelmet as any);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
    })
  );

  if (config.node.env !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('TalusPay Dashboard API')
      .setVersion('v1')
      .addBearerAuth(
        {
          type: 'http',
          description: 'Current frontegg session token - using JWT',
        },
        'session-token'
      )
      // Local setup
      .addServer('http://localhost:3001', 'Local environment endpoint')
      .addServer(
        'https://dashboard-api.taluspay-staging.com',
        'Staging environment endpoint'
      )
      .addServer(
        'https://dashboard-api.taluspay.com',
        'Production environment endpoint'
      )
      .build();

    const document = SwaggerModule.createDocument(app, options);

    // Add x-logo extension
    document.info['x-logo'] = {
      url: 'https://apply.taluspay.com/assets/company-logo.svg', // URL of your logo image
      href: 'https://taluspay.com',
    };

    // Save the Swagger document as JSON
    writeFileSync('./swagger.json', JSON.stringify(document));

    SwaggerModule.setup('api/swagger', app, document);
  }

  await app.listen(config.app.port, '0.0.0.0');
}

bootstrap().catch(console.error);
