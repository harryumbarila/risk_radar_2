import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3Service } from '@/api/shared/aws/s3.service';
import {
  TsysFiuFileRepository,
  TsysFiuFileVariantRepository,
} from '@/paya-db/repositories';

import type {
  ListTsysPaginationInput,
  ListTsysPaginationOutput,
} from './dto/list-tsys-fiu.dto';

@Injectable()
export class PayaService {
  private bucketName = ''; // FIXME: Test bucket

  public constructor(
    private readonly s3Service: S3Service,
    private readonly tsysFiuFileRepository: TsysFiuFileRepository,
    private readonly tsysFiuFileVariantRepository: TsysFiuFileVariantRepository,
    private readonly configService: ConfigService
  ) {
    this.bucketName = this.configService.get('AWS_PARTNER_BANK_INVOICE_BUCKET');
  }

  public async listFiles(
    query: ListTsysPaginationInput
  ): Promise<ListTsysPaginationOutput> {
    const { page, limit } = query; // fallback defaults

    try {
      const [files, totalResults] =
        await this.tsysFiuFileRepository.findAndCount({
          take: limit,
          skip: (page - 1) * limit,
          order: {
            createdAt: 'DESC',
          },
          relations: ['variants'],
        });

      const pageCount = Math.ceil(totalResults / limit);

      return {
        data: files,
        count: files.length,
        page,
        pageCount,
        total: totalResults,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to list files: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async getDownloadUrl(id: string, ip: string) {
    try {
      const item = await this.tsysFiuFileVariantRepository.findOneBy({
        id,
      });

      if (item.downloaderIp) {
        throw new Error('File already downloaded');
      }

      await this.tsysFiuFileVariantRepository.update(
        {
          id,
        },
        {
          downloaderIp: ip,
        }
      );
      return await this.s3Service.getFileSignedUrl(
        this.bucketName,
        item.s3DirectoryPath
      );
    } catch (error) {
      throw new HttpException(
        `Failed ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
