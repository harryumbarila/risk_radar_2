/* eslint-disable */
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectPinoLogger } from 'nestjs-pino';

import { Readable } from 'node:stream';

import { DataSource } from 'typeorm';
import { Logger } from 'pino';
import {
  PDFDocument,
  PDFPageDrawTextOptions,
  rgb,
  StandardFonts,
} from 'pdf-lib';

import { S3Service } from '@/api/shared/aws/s3.service';
import { EmailService } from '@/api/shared/email/email.service';
import { BufferUtilsService } from '@/api/shared/buffer/buffer-utils.service';

import {
  InvoiceResponseDto,
  MSPMerchantBillingRecord,
} from '@/shared/response';

import { MSPMerchantMonthlyBillingRepository } from '@/finance-db/repositories';
import { EmailTemplateMessage } from '@/api/shared/email/email-template-message';
import { ListInvoiceInputDto } from './dto/get-invoce.dto';
import { formatCurrency } from '@/api/utils/number';

@Injectable()
export class PartnerBanksService {
  private bucketName = ''; // FIXME: Test bucket
  public constructor(
    private readonly s3Service: S3Service,
    private readonly bufferUtils: BufferUtilsService,
    private readonly mspMerchantMonthlyBillingRepository: MSPMerchantMonthlyBillingRepository,
    private readonly emailService: EmailService,
    @InjectDataSource('iris') private readonly irisDataSource: DataSource,
    private readonly configService: ConfigService,
    @InjectPinoLogger(PartnerBanksService.name) private readonly logger: Logger
  ) {
    this.bucketName = this.configService.get(
      'AWS_PARTNER_BANK_INVOICE_BUCKET',
      ''
    );
  }

  // @Cron(CronExpression.EVERY_10_SECONDS, {
  //   name: 'schedulerSendInvoice',
  //   waitForCompletion: true,
  // })
  public async schedulerSendInvoice() {
    this.logger.info('Scheduler schedulerSendInvoice started');

    await this.fillInvoiceTemplate();
  }

  public async getInvoices(
    input: ListInvoiceInputDto
  ): Promise<InvoiceResponseDto> {
    return this.s3Service.listObjectsWithSearch({
      ...input,
      bucketName: this.bucketName,
    });
  }

  public async getDownloadUrl(key: string) {
    return this.s3Service.getFileSignedUrl(this.bucketName, key);
  }

  public async getUnInvoicedMSPMerchants(): Promise<
    MSPMerchantBillingRecord[] | undefined
  > {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);

    const previousYear = currentDate.getFullYear();
    const previousMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0');

    const previousYYYYMM = `${previousYear}${previousMonth}`;
    const query = `
      SELECT 
        b.pk,
        l.IrisMId,
        lbi.ContactName,
        lbi.ContactEmailAddress,
        lml.InvoiceEmail AS InvoiceEmails,
        'MSP' + '-' + CONVERT(VARCHAR(25), b.pk) AS InvoiceNumber,
        lbi.DBAName,
        lbi.DBAAddress,
        lbi.DBACity,
        lbi.DBAState,
        lbi.DBAZIP,
        b.dMMFSalesVolume,
        b.dMMFRate,
        b.dMMFBilledAmt
      FROM
        finance..tblMSPMerchantsMonthlyBilling b
        JOIN leads l ON l.IrisMId = b.sMId AND l.IsArchived = 0
        JOIN LeadsBusinessInformation lbi ON lbi.LeadId = l.Id
        JOIN LeadsMerchantLead lml ON lml.LeadId = l.id
        JOIN LeadsOwner lo ON lo.LeadId = l.id
      WHERE
        b.sYYYYMM = '${previousYYYYMM}' AND
        b.dtACHBilled is not NULL AND
        b.dtInvoiceGenerated is NULL
         `;

    try {
      const result =
        await this.irisDataSource.query<MSPMerchantBillingRecord[]>(query);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to fetch un invoiced MSP merchants: ${error.message}`
        );
        throw new Error(
          `Failed to fetch un invoiced MSP merchants: ${error.message}`
        );
      }
      throw error;
    }
  }

  public async fillInvoiceTemplate() {
    try {
      const file = await this.s3Service.getFile(
        this.bucketName,
        'invoice-template.pdf'
      );
      const templateBuffer = await this.bufferUtils.streamToBuffer(
        file.Body as Readable
      );
      if (!templateBuffer || templateBuffer.byteLength === 0) {
        throw new RuntimeException(`Template buffer not loaded for lead `);
      }

      const partners = await this.getUnInvoicedMSPMerchants();
      if (!partners || partners.length === 0) {
        this.logger.info('No un-invoiced partners found');
        return {
          status: 'success',
        };
      }

      const previousDate = new Date();

      const formattedDate = `${(previousDate.getMonth() + 1).toString().padStart(2, '0')}/${previousDate.getDate().toString().padStart(2, '0')}/${previousDate.getFullYear()}`;

      const year = previousDate.getFullYear();
      const currentMonth = (previousDate.getMonth() + 1)
        .toString()
        .padStart(2, '0');
      const currentYYYYMM = `${year}${currentMonth}`;

      while (partners.length > 0) {
        await Promise.all(
          partners.splice(0, 10).map(async (partner) => {
            const invoiceTemplate = await PDFDocument.load(templateBuffer);
            // Get the first page of the document
            const font = await invoiceTemplate.embedFont(
              StandardFonts.TimesRoman
            );

            const defaultOptions: PDFPageDrawTextOptions = {
              font,
              size: 11,
              color: rgb(0, 0, 0),
            };
            const pages = invoiceTemplate.getPages();
            const firstPage = pages[0];

            const { width, height } = firstPage.getSize();

            const {
              pk,
              DBAName,
              ContactEmailAddress,
              InvoiceEmails,
              ContactName,
              InvoiceNumber,
              DBAAddress,
              DBACity,
              DBAState,
              DBAZIP,
              dMMFSalesVolume,
              dMMFRate,
              dMMFBilledAmt,
              IrisMId,
            } = partner;

            const fields: Record<
              string,
              PDFPageDrawTextOptions & { label: string }
            > = {
              date: {
                label: formattedDate,
                x: width - 214,
                y: height - 108,
              },
              invoice: {
                label: `${InvoiceNumber}`,
                x: width - 134,
                y: height - 108,
              },
              name: {
                label: DBAName,
                x: 80,
                y: height - 190,
              },
              legalName: {
                label: ContactName,
                x: 80,
                y: height - 204,
              },
              address: {
                label: DBAAddress,
                x: 80,
                y: height - 218,
              },
              city: {
                label: `${DBACity}, ${DBAState} ${DBAZIP}`,
                x: 80,
                y: height - 232,
              },
              salesAmount: {
                label: `${formatCurrency(dMMFSalesVolume)} X ${dMMFRate.toFixed(2)}%)`,
                x: 172,
                y: height - 410,
              },
              rate: {
                label: `${formatCurrency(dMMFBilledAmt)}`,
                x: 434,
                y: height - 396,
              },
              amount: {
                label: `${formatCurrency(dMMFBilledAmt)}`,
                x: 520,
                y: height - 396,
              },
              total: {
                label: `${formatCurrency(dMMFBilledAmt)}`,
                x: 520,
                y: height - 606,
              },
              paymentsOrCredit: {
                label: `-${formatCurrency(dMMFBilledAmt)}`,
                x: 516,
                y: height - 638,
              },
            };

            Object.values(fields).forEach((value) => {
              const { label, ...options } = value;
              firstPage.drawText(label || '', {
                ...defaultOptions,
                ...options,
              });
            });
            const filledPdf = await invoiceTemplate.save();
            const pdf = Buffer.from(filledPdf);

            // Save the modified PDF document
            const fileName = `invoices/${currentYYYYMM}/${IrisMId}_${InvoiceNumber}.pdf`;
            await this.s3Service.uploadFile(
              this.bucketName,
              pdf,
              fileName,
              'application/pdf'
            );
            await this.mspMerchantMonthlyBillingRepository.update(pk, {
              dtInvoiceGenerated: () => 'GETDATE()',
            });

            if (InvoiceEmails || ContactEmailAddress) {
              const emailTemplate = new EmailTemplateMessage(
                InvoiceEmails
                  ? InvoiceEmails.split(';').map((email) => email.trim())
                  : [ContactEmailAddress],
                `${DBAName} Invoice From Talus`,
                'partner-invoice',
                {
                  contactName: ContactName,
                },
                [
                  {
                    FileName: `${IrisMId}_${InvoiceNumber}.pdf`,
                    RawContent: pdf,
                    ContentType: 'application/pdf',
                    ContentDisposition: 'ATTACHMENT',
                    ContentTransferEncoding: 'BASE64',
                    ContentDescription: `${IrisMId}_${InvoiceNumber}.pdf`,
                  },
                ]
              );
              try {
                await this.emailService.send(emailTemplate);
                await this.mspMerchantMonthlyBillingRepository.update(pk, {
                  dtInvoiceEmailed: () => 'GETDATE()',
                });
              } catch (error) {
                if (error instanceof Error) {
                  this.logger.error(`Error sending email: ${error.message}`);
                }
                this.logger.error(error);
              }
            }
          })
        );
      }

      return {
        status: 'success',
      };
    } catch (error) {
      this.logger.error('Error filling invoice template');
      this.logger.error(error);
      throw new RuntimeException(`Error filling invoice template`);
    }
  }
}
