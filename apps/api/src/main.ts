import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import { writeFileSync } from 'fs';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
    })
  );

  if (process.env.NODE_ENV !== 'production') {
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

  await app.listen(process.env.PORT ?? 3001);
}

// eslint-disable-next-line no-console
bootstrap().catch(console.error);
