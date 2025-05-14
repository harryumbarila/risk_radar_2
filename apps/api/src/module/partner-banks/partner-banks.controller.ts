import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@/api/shared/auth/decorator/public.decorator';

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
    summary: 'Retrieve invoice url from s3',
  })
  @Get('test')
  @Public()
  public async fillInvoiceTest() {
    return this.partnerBanksService.fillInvoiceTemplateTest();
  }
}
