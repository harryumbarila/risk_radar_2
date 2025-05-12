import type { S3ClientConfig } from '@aws-sdk/client-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'S3_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const prodConfig: S3ClientConfig = {
          region: configService.get('AWS_REGION'),
          endpoint: configService.get('AWS_ENDPOINT'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
        };

        const devConfig: S3ClientConfig = {
          region: configService.get('AWS_REGION'),
          endpoint: configService.get('AWS_ENDPOINT'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
          forcePathStyle: true,
        };

        return new S3Client(
          configService.get('NODE_ENV') === 'development'
            ? devConfig
            : prodConfig
        );
      },
    },
  ],
  exports: ['S3_CLIENT'],
})
export class S3Module {}
