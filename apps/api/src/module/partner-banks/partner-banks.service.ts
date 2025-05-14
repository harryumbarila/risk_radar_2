/* eslint-disable */
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { Injectable } from '@nestjs/common';

import { Cron, CronExpression } from '@nestjs/schedule';
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
    this.bucketName = this.configService.get('AWS_PARTNER_BANK_INVOICE_BUCKET');
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'schedulerSendInvoice' })
  public async schedulerSendInvoice() {
    this.logger.info('Scheduler schedulerSendInvoice started');

    await this.fillInvoiceTemplate();
  }

  public async getInvoices(
    input: ListInvoiceInputDto
  ): Promise<InvoiceResponseDto> {
    return this.s3Service.listObjects({
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
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const currentYYYYMM = `${currentYear}${currentMonth}`;
    const query = `
      SELECT 
        b.pk,
        l.IrisMId,
        lbi.DBAName,
        lbi.ContactName,
	      lbi.ContactEmailAddress,
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
      const currentDate = new Date();
      const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
      const currentYear = currentDate.getFullYear();
      const currentMonth = (currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0');
      const currentYYYYMM = `${currentYear}${currentMonth}`;
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
              // ContactEmailAddress,
              ContactName,
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

            Object.values(fields).forEach((value) => {
              const { label, ...options } = value;
              firstPage.drawText(label, {
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
              dtInvoiced: () => 'GETDATE()',
            });
            const emailTemplate = new EmailTemplateMessage(
              ['crhistian@solvedex.com'], //FIXME: Test email
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
              ],
              //TODO: Fix loading template issue
              `<html lang='en'>
                <head>
                  <meta charset='utf-8' />
                  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                  <title>Partner Invoice</title>
                </head>

                <body
                  style='margin: 0; padding: 0; background-color: #C2E3EA; font-family: Arial, sans-serif;'
                >
                  <!-- Full-width container -->
                  <table
                    role='presentation'
                    width='100%'
                    cellpadding='0'
                    cellspacing='0'
                    border='0'
                    style='background-color: #C2E3EA; padding: 20px 0;'
                  >
                    <tr>
                      <td align='center'>
                        <!-- Main container -->
                        <table
                          role='presentation'
                          width='600'
                          cellpadding='0'
                          cellspacing='0'
                          border='0'
                          style='background-color: #ffffff; border-radius: 4px; overflow: hidden; width: 100%; max-width: 600px;'
                        >
                          <!-- Content -->
                          <tr>
                            <td style='padding: 30px; font-size: 16px; color: #333333;'>
                              <p>Dear ${ContactName},</p>

                              <p>Your invoice is attached. The payment has been automatically
                                deducted from your account.</p>

                              <p>Thank you for your business &mdash; we appreciate it very
                                much.</p>

                              <div class='signature'>
                                <p>Sincerely,</p>
                                <p>Talus</p>
                              </div>
                            </td>
                          </tr>
                          <!-- Divider -->
                          <tr>
                            <td style='padding: 0 30px;'>
                              <a
                                href='https://www.taluspay.com'
                                style='color: #0066cc; text-decoration: none;'
                              >www.taluspay.com</a><br />
                              12712 Park Central Drive, Dallas, TX 75251<br />
                              24/7 Support:
                              <a
                                href='tel:18007874105'
                                style='color: #0066cc; text-decoration: none;'
                              >1-800-787-4105</a><br />
                              <a
                                href='mailto:support@taluspay.com'
                                style='color: #0066cc; text-decoration: none;'
                              >support@taluspay.com</a>
                            </td>
                          </tr>
                          <!-- Footer spacing -->
                          <tr>
                            <tr>
                              <td
                                align='left'
                                style='padding: 20px; background-color: #ffffff;'
                              >
                                <img
                                  src='https://storage.googleapis.com/iac-2-storage/c/aeb05708a4ab469b923f255dzcv3lrty/p/28f30d28069944b087d79e7b6axiib0h/logo/brand_color.png?v=454226'
                                  alt='Talus Pay Logo'
                                  width='120'
                                  style='display: block; margin-bottom: 10px; border: 0; outline: none; text-decoration: none; max-width: 100%;'
                                />
                              </td>
                            </tr>
                          </tr>
                        </table>
                        <!-- End Main container -->
                      </td>
                    </tr>
                  </table>
                </body>

              </html>
              `
            );
            await this.emailService.send(emailTemplate).catch((error) => {
              this.logger.error('Error sending email');
              if (error instanceof Error) {
                this.logger.error(error);
              }
              this.logger.error(error);
            });
            /* eslint-disable no-await-in-loop */
          })
        );
      }
    } catch (error) {
      this.logger.error('Error filling invoice template', error);
      this.logger.error(error);
      throw new RuntimeException(`Error filling invoice template`);
    }
  }

  public async getUnInvoicedMSPMerchantsTest(): Promise<
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
        lbi.DBAName,
        lbi.ContactName,
	      lbi.ContactEmailAddress,
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

  public async fillInvoiceTemplateTest() {
    try {
      const currentDate = new Date();
      const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
      const currentYear = currentDate.getFullYear();
      const currentMonth = (currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0');
      const currentYYYYMM = `${currentYear}${currentMonth}`;
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

      const partners = await this.getUnInvoicedMSPMerchantsTest();
      if (!partners || partners.length === 0) {
        this.logger.info('No un-invoiced partners found');
        return;
      }
      const partner = partners[0];
      const invoiceTemplate = await PDFDocument.load(templateBuffer);
      // Get the first page of the document
      const font = await invoiceTemplate.embedFont(StandardFonts.TimesRoman);

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
        // ContactEmailAddress,
        ContactName,
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
        IrisMId,
      } = partner;

      const fields: Record<string, PDFPageDrawTextOptions & { label: string }> =
        {
          date: {
            label: formattedDate,
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

      Object.values(fields).forEach((value) => {
        const { label, ...options } = value;
        firstPage.drawText(label, {
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
      const emailTemplate = new EmailTemplateMessage(
        ['crhistian@solvedex.com'], //FIXME: Test email
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
        ],
        //TODO: Fix loading template issue
        `<html lang='en'>
                <head>
                  <meta charset='utf-8' />
                  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                  <title>Partner Invoice</title>
                </head>

                <body
                  style='margin: 0; padding: 0; background-color: #C2E3EA; font-family: Arial, sans-serif;'
                >
                  <!-- Full-width container -->
                  <table
                    role='presentation'
                    width='100%'
                    cellpadding='0'
                    cellspacing='0'
                    border='0'
                    style='background-color: #C2E3EA; padding: 20px 0;'
                  >
                    <tr>
                      <td align='center'>
                        <!-- Main container -->
                        <table
                          role='presentation'
                          width='600'
                          cellpadding='0'
                          cellspacing='0'
                          border='0'
                          style='background-color: #ffffff; border-radius: 4px; overflow: hidden; width: 100%; max-width: 600px;'
                        >
                          <!-- Content -->
                          <tr>
                            <td style='padding: 30px; font-size: 16px; color: #333333;'>
                              <p>Dear ${ContactName},</p>

                              <p>Your invoice is attached. The payment has been automatically
                                deducted from your account.</p>

                              <p>Thank you for your business &mdash; we appreciate it very
                                much.</p>

                              <div class='signature'>
                                <p>Sincerely,</p>
                                <p>Talus</p>
                              </div>
                            </td>
                          </tr>
                          <!-- Divider -->
                          <tr>
                            <td style='padding: 0 30px;'>
                              <a
                                href='https://www.taluspay.com'
                                style='color: #0066cc; text-decoration: none;'
                              >www.taluspay.com</a><br />
                              12712 Park Central Drive, Dallas, TX 75251<br />
                              24/7 Support:
                              <a
                                href='tel:18007874105'
                                style='color: #0066cc; text-decoration: none;'
                              >1-800-787-4105</a><br />
                              <a
                                href='mailto:support@taluspay.com'
                                style='color: #0066cc; text-decoration: none;'
                              >support@taluspay.com</a>
                            </td>
                          </tr>
                          <!-- Footer spacing -->
                          <tr>
                            <tr>
                              <td
                                align='left'
                                style='padding: 20px; background-color: #ffffff;'
                              >
                                <img
                                  src='https://storage.googleapis.com/iac-2-storage/c/aeb05708a4ab469b923f255dzcv3lrty/p/28f30d28069944b087d79e7b6axiib0h/logo/brand_color.png?v=454226'
                                  alt='Talus Pay Logo'
                                  width='120'
                                  style='display: block; margin-bottom: 10px; border: 0; outline: none; text-decoration: none; max-width: 100%;'
                                />
                              </td>
                            </tr>
                          </tr>
                        </table>
                        <!-- End Main container -->
                      </td>
                    </tr>
                  </table>
                </body>

              </html>
              `
      );
      await this.emailService.send(emailTemplate);
      return {
        status: 'Success',
      };
    } catch (error) {
      this.logger.error('Error filling invoice template');
      this.logger.error(error);
      if (error instanceof Error) {
        return {
          status: 'Error',
          error: error.message,
        };
      }
      return {
        status: 'Error',
      };
    }
  }
}
