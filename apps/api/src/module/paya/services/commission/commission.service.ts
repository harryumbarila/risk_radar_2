import { createHash } from 'node:crypto';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import type { FileUploadDto } from '@/api/shared/aws/dto/s3.dto';
import { S3Service } from '@/api/shared/aws/s3.service';
import { EmailService } from '@/api/shared/email/email.service';
import { EmailTemplateMessage } from '@/api/shared/email/email-template-message';
import { CommissionFileVariantType } from '@/paya-db/enums';
import {
  CommissionFileRepository,
  CommissionFileVariantRepository,
} from '@/paya-db/repositories';

import type { CommissionFileUploadDto } from './dto/file-upload.dto';
import type { GetCommissionFileDownloadDto } from './dto/get-download.dto';
import type {
  ListCommissionPaginationInput,
  ListCommissionPaginationOutput,
} from './dto/list-commission.dto';

@Injectable()
export class CommissionService {
  private bucketName = ''; // FIXME: Test bucket

  public constructor(
    private readonly s3Service: S3Service,
    private readonly emailService: EmailService,
    private readonly commissionFileRepository: CommissionFileRepository,
    private readonly commissionFileVariantRepository: CommissionFileVariantRepository,
    private readonly configService: ConfigService,
    @InjectPinoLogger(CommissionService.name) private readonly logger: Logger
  ) {
    this.bucketName = this.configService.get('AWS_COMISSION_BUCKET');
  }

  public async listFiles(
    query: ListCommissionPaginationInput
  ): Promise<ListCommissionPaginationOutput> {
    const { page, limit } = query; // fallback defaults

    try {
      const [files, totalResults] =
        await this.commissionFileRepository.findAndCount({
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

  public async getDownloadUrl(input: GetCommissionFileDownloadDto) {
    try {
      const { id, userName, ip } = input;
      const item = await this.commissionFileVariantRepository.findOneBy({
        id,
      });

      if (item.downloaderIp) {
        throw new Error('File already downloaded');
      }

      const url = await this.s3Service.getFileSignedUrl(
        this.bucketName,
        item.s3DirectoryPath
      );

      await this.commissionFileVariantRepository.update(
        {
          id: item.id,
        },
        {
          downloaderIp: ip,
          downloadedAt: new Date(),
          downloaderUserName: userName,
        }
      );
      return url;
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
      const { fileId, file, modifiedAt, ip, variant, userName } = body;
      const item = await this.commissionFileVariantRepository.findOneBy({
        fileId,
        variantType: variant,
      });

      if (item) {
        throw new Error('File already SUBMITTED');
      }

      const previousFileVariant =
        variant === CommissionFileVariantType.SUBMITTED
          ? CommissionFileVariantType.PROVIDED
          : CommissionFileVariantType.SUBMITTED;

      const previousFile = await this.commissionFileVariantRepository.findOneBy(
        {
          fileId,
          variantType: previousFileVariant,
        }
      );

      const fileContent = file.buffer;
      const contentHash = createHash('sha256')
        .update(fileContent)
        .digest('hex');

      let validHash = true;
      if (previousFile) {
        if (previousFile.contentsHash !== contentHash) {
          validHash = false;
          const description =
            previousFileVariant === CommissionFileVariantType.PROVIDED
              ? 'Alert! Uploaded Commission file is different from file that was provided. Finance/Accounting department will be notified via e-mail shortly.'
              : 'Alert! Uploaded Commission response file is different from file that was submitted. Finance/Accounting department will be notified via e-mail shortly.';
          const emailTemplate = new EmailTemplateMessage(
            ['crhistian@solvedex.com'], // FIXME: Test email
            `Alert! Uploaded Commission ${file.originalname}`,
            'tsys-fiu-changed-file',
            {
              description,
            }
          );
          await this.emailService.send(emailTemplate).catch((error) => {
            this.logger.error('Failed to send email');
            this.logger.error(error);
          });
        }
      }

      const currentDate = new Date();
      const currentDateMMDDYYYY = `${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}${currentDate.getFullYear()}`;

      const s3DirectoryPath = `commission/${currentDateMMDDYYYY}/${variant.toLocaleLowerCase()}/${file.originalname}`;

      const s3UploadResult = await this.s3Service.uploadFile(
        this.bucketName,
        file.buffer,
        s3DirectoryPath
      );

      await this.commissionFileVariantRepository.save(
        this.commissionFileVariantRepository.create({
          fileId,
          variantType: variant,
          contentsHash: contentHash,
          validHash,
          s3DirectoryPath,
          modifiedAt: new Date(Number(modifiedAt)),
          uploaderIp: ip,
          updatedAt: new Date(),
          uploaderUserName: userName,
        })
      );

      return s3UploadResult;
    } catch (error) {
      throw new HttpException(
        `Failed file upload ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
