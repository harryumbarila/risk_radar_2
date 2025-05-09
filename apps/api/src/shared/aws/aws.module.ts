import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Module } from './s3.module';

@Module({
  imports: [S3Module],
  providers: [S3Service],
  exports: [S3Service],
})
export class AWSModule {}
