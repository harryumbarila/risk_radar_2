import fastifyCompress from '@fastify/compress';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

import { AppModule } from './app.module';
import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.enableCors({
    origin: [
      'https://dashboard.taluspay-staging.com',
      'https://dashboard.taluspay.com',
    ],
    credentials: true,
  });

  await app.register(fastifyCompress);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
    })
  );

  if (config.node.env === 'production') {
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

  await app.listen(config.app.port);
}

// eslint-disable-next-line no-console
bootstrap().catch(console.error);
