import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
    })
  );

  await app.listen(process.env.PORT ?? 3001);

  const url = await app.getUrl();
  Logger.log(`🚀 Application is running on port: ${url}`);
}

// eslint-disable-next-line no-console
bootstrap().catch(console.error);
