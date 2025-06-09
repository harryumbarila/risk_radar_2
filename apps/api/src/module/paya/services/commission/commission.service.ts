import { createHash } from 'node:crypto';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { FileUploadDto } from '@/api/shared/aws/dto/s3.dto';
import { S3Service } from '@/api/shared/aws/s3.service';
import { PayaMonthlyResidualMetadataRepository } from '@/paya-db/repositories';

import type { CommissionFileUploadDto } from './dto/file-upload.dto';
import type { GetCommissionFileDownloadDto } from './dto/get-download.dto';
import type {
  ListCommissionPaginationInput,
  ListCommissionPaginationOutput,
} from './dto/list-commission.dto';

@Injectable()
export class CommissionService {
  private bucketName = '';
  private readonly COMMISSION_PREFIX = 'monthly_residual_reports/';

  public constructor(
    private readonly s3Service: S3Service,
    private readonly payaMonthlyResidualMetadataRepository: PayaMonthlyResidualMetadataRepository,
    private readonly configService: ConfigService
  ) {
    console.log('🚀 CommissionService - CONSTRUCTOR START');
    console.log('📦 Services injected:', {
      s3Service: !!this.s3Service,
      payaMonthlyResidualMetadataRepository: !!this.payaMonthlyResidualMetadataRepository,
      configService: !!this.configService
    });
    
    this.bucketName = this.configService.get('AWS_PARTNER_BANK_INVOICE_BUCKET');
    console.log('Bucket name configured:', this.bucketName);
    console.log('CommissionService - CONSTRUCTOR COMPLETE');
  }

  public async listFiles(
    query: ListCommissionPaginationInput
  ): Promise<ListCommissionPaginationOutput> {
    console.log('CommissionService.listFiles - START', { query });
    
    const { page, limit } = query; // fallback defaults
    console.log('Extracted pagination params:', { page, limit });

    try {
      console.log('About to call payaMonthlyResidualMetadataRepository.findAndCount...');
      
      const [files, totalResults] =
        await this.payaMonthlyResidualMetadataRepository.findAndCount({
          take: limit,
          skip: (page - 1) * limit,
          order: {
            createdAt: 'DESC',
          },
        });

      console.log('✅ Database query successful:', { 
        filesCount: files.length, 
        totalResults, 
        firstFile: files[0] ? { id: files[0].id, fileId: files[0].fileId } : 'no files'
      });

      const pageCount = Math.ceil(totalResults / limit);
      console.log('Calculated pagination:', { pageCount, page, limit, totalResults });

      const result = {
        data: files,
        count: files.length,
        page,
        pageCount,
        total: totalResults,
      };

      console.log('CommissionService.listFiles - SUCCESS', { 
        resultCount: result.count,
        resultTotal: result.total 
      });

      return result;
    } catch (error) {
      console.error('CommissionService.listFiles - ERROR:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      throw new HttpException(
        `Failed to list files: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async getDownloadUrl(input: GetCommissionFileDownloadDto, ip: string) {
    try {
      const { id, userName } = input;
      const item = await this.payaMonthlyResidualMetadataRepository.findOneBy({
        id,
      });

      if (item.downloaderIp) {
        throw new Error('File already downloaded');
      }

      await this.payaMonthlyResidualMetadataRepository.update(
        {
          id: item.id,
        },
        {
          downloaderIp: ip,
          downloadedAt: new Date(),
          downloaderUserName: userName,
        }
      );
      return await this.s3Service.getFileSignedUrl(
        this.bucketName,
        item.s3DirectoryPath || item.originalS3Key
      );
    } catch (error) {
      throw new HttpException(
        `Failed ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async uploadFile(
    body: CommissionFileUploadDto & Partial<FileUploadDto> & { ip: string }
  ) {
    try {
      const { fileId, file, fileMonth, ip, userName, modifiedAt } = body;
      
      const item = await this.payaMonthlyResidualMetadataRepository.findOneBy({
        fileId,
        fileMonth: new Date(fileMonth),
      });

      if (item) {
        throw new Error('File already uploaded for this month');
      }
      
      const fileContent = file.buffer;
      const contentHash = createHash('sha256').update(fileContent).digest('hex');

      const fileMonthDate = new Date(fileMonth);
      const year = fileMonthDate.getFullYear();
      const month = String(fileMonthDate.getMonth() + 1).padStart(2, '0');

      const s3DirectoryPath = `monthly_residual_reports/${year}/${month}/${file.originalname}`;

      await this.payaMonthlyResidualMetadataRepository.save(
        this.payaMonthlyResidualMetadataRepository.create({
          fileId,
          fileMonth: fileMonthDate,
          originalS3Key: s3DirectoryPath,
          s3DirectoryPath,
          contentHash,
          contentsHash: contentHash,
          fileSizeBytes: file.size,
          uploaderIp: ip,
          uploaderUserName: userName,
          modifiedAt: new Date(Number(modifiedAt)),
        })
      );

      return await this.s3Service.uploadFile(
        this.bucketName,
        file.buffer,
        s3DirectoryPath
      );
    } catch (error) {
      throw new HttpException(
        `Failed file upload ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}