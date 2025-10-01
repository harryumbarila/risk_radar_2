import { SharedBullAsyncConfiguration } from '@nestjs/bullmq/dist/interfaces';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const bullConfigAsync = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    connection: {
      host: configService.get('REDIS_QUEUE_HOST'),
      port: configService.get('REDIS_QUEUE_PORT'),
    },
  }),
  inject: [ConfigService],
} as SharedBullAsyncConfiguration;
