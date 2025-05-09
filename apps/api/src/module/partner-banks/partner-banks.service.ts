import { Injectable } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions';

import { InjectPinoLogger } from 'nestjs-pino';

import { Logger } from 'pino';
import { Readable } from 'node:stream';
import {
  PDFDocument,
  PDFPageDrawTextOptions,
  rgb,
  StandardFonts,
} from 'pdf-lib';

import { S3Service } from '@/api/shared/aws/s3.service';
import { BufferUtilsService } from '@/api/shared/buffer/buffer-utils.service';

import { ListInvoiceInputDto } from './dto/get-invoce.dto';
import {
  InvoiceResponseDto,
  MSPMerchantBillingRecord,
} from '@/shared/response';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { MSPMerchantMonthlyBillingRepository } from '@/finance-db/repositories';

@Injectable()
export class PartnerBanksService {
  bucketName =
    process.env.AWS_S3_BUCKET_NAME ||
    'talus-msp-merchants-monthly-invoice-staging';
  public constructor(
    private readonly s3Service: S3Service,
    private readonly bufferUtils: BufferUtilsService,
    private readonly mspMerchantMonthlyBillingRepository: MSPMerchantMonthlyBillingRepository,

    @InjectDataSource('iris') private readonly irisDataSource: DataSource,
    @InjectPinoLogger(PartnerBanksService.name) private readonly logger: Logger
  ) {}

  async getInvoices(input: ListInvoiceInputDto): Promise<InvoiceResponseDto> {
    return this.s3Service.listObjects({
      ...input,
      bucketName: this.bucketName,
    });
  }

  async getDownloadUrl(key: string) {
    return this.s3Service.getFileSignedUrl(this.bucketName, key);
  }

  async getUnInvoicedMSPMerchants(): Promise<
    MSPMerchantBillingRecord[] | undefined
  > {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const currentYYYYMM = `${currentYear}${currentMonth}`;
    const query = `
      SELECT 
        b.pk,
        l.IrisMId,
        'MSP' + '-' + CONVERT(VARCHAR(25), b.pk) AS InvoiceNumber,
        lbi.LegalName,
        lo.FirstName + ' ' + lo.LastName AS sOwner,
        lbi.LegalAddress,
        lbi.LegalCity,
        lbi.LegalState,
        lbi.LegalZIP,
        b.dMMFSalesVolume,
        b.dMMFRate,
        b.dMMFBilledAmt
      FROM
        finance..tblMSPMerchantsMonthlyBilling b
        JOIN leads l ON l.IrisMId = b.sMId
        JOIN LeadsBusinessInformation lbi ON lbi.LeadId = l.Id
        JOIN LeadsOwner lo ON lo.LeadId = l.id
      WHERE
        b.sYYYYMM = '${currentYYYYMM}' AND
        b.dtInvoiced IS NULL
    `;

    try {
      const result =
        await this.irisDataSource.query<MSPMerchantBillingRecord[]>(query);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch un invoiced MSP merchants: ${error.message}`
      );
      throw new Error(
        `Failed to fetch un invoiced MSP merchants: ${error.message}`
      );
    }
  }

  async fillInvoiceTemplate() {
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

      // Get the width and height of the first page

      const partners = await this.getUnInvoicedMSPMerchants();
      if (!partners || partners.length === 0) {
        this.logger.info('No un-invoiced partners found');
        return;
      }
      for (const partner of partners) {
        const invoiceTemplate = await PDFDocument.load(templateBuffer);
        // Get the first page of the document
        const font = await invoiceTemplate.embedFont(StandardFonts.TimesRoman);

        const defaultOptions = {
          font,
          size: 11,
          color: rgb(0, 0, 0),
        };
        const pages = invoiceTemplate.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        const {
          pk,
          InvoiceNumber,
          LegalName,
          sOwner,
          LegalAddress,
          LegalCity,
          LegalState,
          LegalZIP,
          dMMFSalesVolume,
          dMMFRate,
          dMMFBilledAmt,
        } = partner;
        // Draw the text on the page
        const options: PDFPageDrawTextOptions = {
          ...defaultOptions,
        };
        const fields: Record<
          string,
          PDFPageDrawTextOptions & { label: string }
        > = {
          date: {
            label: '02/17/2025',
            x: width - 214,
            y: height - 108,
          },
          invoice: {
            label: InvoiceNumber,
            x: width - 134,
            y: height - 108,
          },
          name: {
            label: LegalName,
            x: 80,
            y: height - 190,
          },
          legalName: {
            label: sOwner,
            x: 80,
            y: height - 204,
          },
          address: {
            label: LegalAddress,
            x: 80,
            y: height - 218,
          },
          city: {
            label: `${LegalCity}, ${LegalState} ${LegalZIP}`,
            x: 80,
            y: height - 232,
          },
          salesAmount: {
            label: `${Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(dMMFSalesVolume)} X ${dMMFRate.toFixed(2)}%)`,
            x: 172,
            y: height - 410,
          },
          rate: {
            label: `${dMMFBilledAmt.toFixed(2)}`,
            x: 446,
            y: height - 396,
          },
          amount: {
            label: `${dMMFBilledAmt.toFixed(2)}`,
            x: 532,
            y: height - 396,
          },
          total: {
            label: `${dMMFBilledAmt.toFixed(2)}`,
            x: 532,
            y: height - 606,
          },
          paymentsOrCredit: {
            label: `-${dMMFBilledAmt.toFixed(2)}`,
            x: 528,
            y: height - 638,
          },
        };

        Object.entries(fields).forEach(([_, value]) => {
          const { label, ...options } = value;
          firstPage.drawText(label, {
            ...defaultOptions,
            ...options,
          });
        });
        const filledPdf = await invoiceTemplate.save();
        const pdf = Buffer.from(filledPdf);

        // Save the modified PDF document
        const fileName = `invoices/${InvoiceNumber}.pdf`;
        await this.s3Service.uploadFile(
          this.bucketName,
          pdf,
          fileName,
          'application/pdf'
        );
        await this.mspMerchantMonthlyBillingRepository.update(pk, {
          dtInvoiced: () => 'GETDATE()',
        });
      }
    } catch (error) {
      this.logger.error('Error filling invoice template', error);
      throw new RuntimeException(`Error filling invoice template`);
    }
  }
}
