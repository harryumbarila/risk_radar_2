import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ListInvoiceInputDto } from './dto/get-invoce.dto';
import { PartnerBanksService } from './partner-banks.service';

@ApiTags('risk-radar')
@Controller('v1/partner-banks')
export class PartnerBanksController {
  public constructor(
    private readonly partnerBanksService: PartnerBanksService
  ) {}

  @ApiResponse({
    status: 200,
    description: 'The invoices from aws',
  })
  @ApiOperation({
    operationId: 'partner-banks-invoices',
    summary: 'Retrieve invoices from s3',
  })
  @Get('invoices')
  public async getInvoices(@Query() query: ListInvoiceInputDto) {
    try {
      return await this.partnerBanksService.getInvoices(query);
    } catch (error) {
      if (error instanceof Error) {
        return {
          status: 'error',
          message: 'Error retrieving invoices',
          error: error.message,
        };
      }
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    description: 'The invoices from aws',
  })
  @ApiOperation({
    operationId: 'partner-banks-invoice-url',
    summary: 'Retrieve invoice url from s3',
  })
  @Get('download-url')
  public async getDownloadUrl(@Query('key') key: string) {
    return this.partnerBanksService.getDownloadUrl(key);
  }
}
