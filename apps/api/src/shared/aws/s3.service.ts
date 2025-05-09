import { Injectable, Inject } from '@nestjs/common';

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2CommandOutput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
} from '@aws-sdk/client-s3';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3PaginationInput } from './dto/s3.dto';
import { InvoiceResponseDto } from '@/shared/response';

@Injectable()
export class S3Service {
  constructor(
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
    @InjectPinoLogger(S3Service.name) private readonly logger: PinoLogger
  ) {}

  async uploadFile(
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

  async getFile(bucketName: string, key: string) {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    return this.s3Client.send(command);
  }

  async getFileSignedUrl(
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

  async listObjects(input: S3PaginationInput): Promise<InvoiceResponseDto> {
    const { bucketName, maxKeys = 5, prefix = '', continuationToken } = input;
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
          (prefix) => prefix.Prefix || ''
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
