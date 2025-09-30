import { createHash } from 'node:crypto';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import type { FileUploadDto } from '@/api/shared/aws/dto/s3.dto';
import { S3Service } from '@/api/shared/aws/s3.service';
import { EmailService } from '@/api/shared/email/email.service';
import { EmailTemplateMessage } from '@/api/shared/email/email-template-message';
import { TsysFiuFileVariantType } from '@/paya-db/enums';
import {
  TsysFiuFileRepository,
  TsysFiuFileVariantRepository,
} from '@/paya-db/repositories';

import type { TsysFiuFileUploadDto } from './dto/file-upload.dto';
import type { GetTsysFiuFileDownloadDto } from './dto/get-download.dto';
import type {
  ListTsysPaginationInput,
  ListTsysPaginationOutput,
} from './dto/list-tsys-fiu.dto';

@Injectable()
export class PayaService {
  private bucketName = ''; // FIXME: Test bucket

  public constructor(
    private readonly s3Service: S3Service,
    private readonly emailService: EmailService,
    private readonly tsysFiuFileRepository: TsysFiuFileRepository,
    private readonly tsysFiuFileVariantRepository: TsysFiuFileVariantRepository,
    private readonly configService: ConfigService,
    @InjectPinoLogger(PayaService.name) private readonly logger: Logger
  ) {
    this.bucketName = this.configService.get(
      'AWS_PARTNER_BANK_INVOICE_BUCKET',
      ''
    );
  }

  public async listFiles(
    query: ListTsysPaginationInput
  ): Promise<ListTsysPaginationOutput> {
    const { page, limit } = query; // fallback defaults

    try {
      const [files, totalResults] =
        await this.tsysFiuFileRepository.findAndCount({
          take: limit,
          skip: (Number(page) - 1) * Number(limit),
          order: {
            createdAt: 'DESC',
          },
          relations: ['variants'],
        });

      const pageCount = Math.ceil(totalResults / Number(limit));

      return {
        data: files,
        count: files.length,
        page: Number(page),
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

  public async getDownloadUrl(input: GetTsysFiuFileDownloadDto) {
    try {
      const { id, userName, ip } = input;
      const item = await this.tsysFiuFileVariantRepository.findOneBy({
        id,
      });

      if (!item) {
        throw new Error('No item found');
      }

      if (item.downloaderIp) {
        throw new Error('File already downloaded');
      }

      await this.tsysFiuFileVariantRepository.update(
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
        item.s3DirectoryPath
      );
    } catch (error) {
      throw new HttpException(
        `Failed ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async uploadFile(
    body: TsysFiuFileUploadDto & Partial<FileUploadDto> & { ip: string }
  ) {
    try {
      const { fileId, file, modifiedAt, ip, variant, userName } = body;
      const item = await this.tsysFiuFileVariantRepository.findOneBy({
        fileId,
        variantType: variant,
      });

      if (item) {
        throw new Error('File already SUBMITTED');
      }

      if (!file?.buffer) {
        throw new Error('File already SUBMITTED');
      }

      const previousFileVariant =
        variant === TsysFiuFileVariantType.SUBMITTED
          ? TsysFiuFileVariantType.PROVIDED
          : TsysFiuFileVariantType.SUBMITTED;

      const previousFile = await this.tsysFiuFileVariantRepository.findOneBy({
        fileId,
        variantType: previousFileVariant,
      });

      const csvContent = file.buffer.toString('utf-8');

      const parsedCsv =
        previousFileVariant === TsysFiuFileVariantType.SUBMITTED
          ? csvContent
              .split('\n')
              .map((line) => {
                const columns = line.split(','); // Split line into columns
                columns.pop(); // Remove last column
                return columns.join(','); // Join back into line
              })
              .join('\n')
          : csvContent;

      const csvHash = createHash('sha256').update(parsedCsv).digest('hex');
      let validHash = true;
      if (previousFile) {
        if (previousFile.contentsHash !== csvHash) {
          validHash = false;
          const description =
            previousFileVariant === TsysFiuFileVariantType.PROVIDED
              ? 'Alert! Uploaded TSYS FIU Paya file is different from file that was provided. Finance/Accounting department will be notified via e-mail shortly.'
              : 'Alert! Uploaded TSYS FIU response Paya file is different from file that was submitted to TSYS. Finance/Accounting department will be notified via e-mail shortly.';
          const emailTemplate = new EmailTemplateMessage(
            ['crhistian@solvedex.com'], // FIXME: Test email
            `Alert! Uploaded TSYS FIU Paya ${file.originalname}`,
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

      const s3DirectoryPath = `paya/tsys-fiu/${currentDateMMDDYYYY}/${variant.toLocaleLowerCase()}/${file.originalname}`;

      await this.tsysFiuFileVariantRepository.save(
        this.tsysFiuFileVariantRepository.create({
          fileId,
          variantType: variant,
          contentsHash: csvHash,
          validHash,
          s3DirectoryPath,
          modifiedAt: new Date(Number(modifiedAt)),
          uploaderIp: ip,
          updatedAt: new Date(),
          uploaderUserName: userName,
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
