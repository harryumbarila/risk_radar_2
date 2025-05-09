import { Module } from '@nestjs/common';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

@Module({
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: () => {
        const prodConfig: S3ClientConfig = {
          region: process.env.AWS_REGION,
          endpoint: process.env.AWS_ENDPOINT,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        };

        const devConfig: S3ClientConfig = {
          region: process.env.AWS_REGION,
          endpoint: process.env.AWS_ENDPOINT,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
          forcePathStyle: true,
        };

        return new S3Client(
          process.env.NODE_ENV === 'development' ? devConfig : prodConfig
        );
      },
    },
  ],
  exports: ['S3_CLIENT'],
})
export class S3Module {}
