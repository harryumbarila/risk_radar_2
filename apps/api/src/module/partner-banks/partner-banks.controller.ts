import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@/api/shared/auth/decorator/public.decorator';
import { InternalApiKeyGuard } from '@/api/shared/guard/internal-api-key.guard';

import { ListInvoiceInputDto } from './dto/get-invoce.dto';
import { PartnerBanksService } from './partner-banks.service';

@ApiTags('partner-banks')
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
    return this.partnerBanksService.getInvoices(query);
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

  @ApiResponse({
    status: 200,
    description: 'The invoices from aws',
  })
  @ApiOperation({
    operationId: 'partner-banks-invoice-url',
    summary: 'Execute msp mernchant invoice generation',
  })
  @Public()
  @Post('execute')
  @UseGuards(InternalApiKeyGuard)
  public async sendInvoices() {
    return this.partnerBanksService.fillInvoiceTemplate();
  }
}
