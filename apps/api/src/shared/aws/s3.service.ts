import type {
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
} from '@aws-sdk/client-s3';
import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import type { InvoiceResponseDto } from '@/shared/response';

import type { S3PaginationInput } from './dto/s3.dto';

@Injectable()
export class S3Service {
  public constructor(
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
    @InjectPinoLogger(S3Service.name) private readonly logger: PinoLogger
  ) {}

  public async uploadFile(
    bucketName: string,
    file: Buffer | string,
    fileName: string,
    contentType?: string
  ) {
    const fileKey = fileName;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    this.logger.info(`File uploaded to S3: ${fileKey}`);

    return {
      key: fileKey,
      url: `https://${bucketName}.s3.amazonaws.com/${fileKey}`,
    };
  }

  public async getFile(bucketName: string, key: string) {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    return this.s3Client.send(command);
  }

  public async getFileSignedUrl(
    bucketName: string,
    key: string,
    expiresInSeconds = 3600
  ) {
    try {
      const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
      // Generate the signed URL with an expiration time
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });
      return {
        key,
        url: signedUrl,
        expiresAt: new Date(Date.now() + expiresInSeconds * 10),
      };
    } catch (error) {
      this.logger.error('Error generating signed URL', error);
      throw error;
    }
  }

  public async listObjects(
    input: S3PaginationInput
  ): Promise<InvoiceResponseDto> {
    const { bucketName, maxKeys = 50, prefix = '', continuationToken } = input;
    const params: ListObjectsV2CommandInput = {
      Bucket: bucketName,
      Prefix: prefix,
      ContinuationToken: continuationToken,
      Delimiter: '/', // This ensures we get proper folder structure
      MaxKeys: maxKeys,
    };

    try {
      const data: ListObjectsV2CommandOutput = await this.s3Client.send(
        new ListObjectsV2Command(params)
      );

      const result = {
        objects: data.Contents || [],
        folders: (data.CommonPrefixes || []).map(
          (cPrefix) => cPrefix.Prefix || ''
        ),
        nextContinuationToken: data.NextContinuationToken,
        isTruncated: data.IsTruncated || false,
        currentPrefix: prefix || '',
      } as InvoiceResponseDto;

      return result;
    } catch (error) {
      this.logger.error('Error listing S3 objects:', error);
      throw error;
    }
  }
}
