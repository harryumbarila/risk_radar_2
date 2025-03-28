import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Public } from '@/api/shared/auth/decorator/public.decorator';
import { CrescentViewEntity } from '@/crescent-view-db/entities';
import { RiskRadarMerchantTaxIdRepository } from '@/crescent-view-db/repositories';

export type IrisProxyControllerConfig = {
  IRIS_ENV: string;
};

@ApiTags('Example for multi DB connection')
@Controller('/v1/multi_dn')
export class ExampleMultiDbController {
  public constructor(
    @InjectRepository(CrescentViewEntity, 'crescent-view')
    private readonly crescentViewRepo: Repository<CrescentViewEntity>,
    //    @InjectRepository(RiskRadarMerchantTaxIdRepository, 'crescent-view')
    private readonly merchantTINRepo: RiskRadarMerchantTaxIdRepository
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Pick some data from 2 dbs.',
  })
  @ApiOperation({ operationId: 'users', summary: 'Get filtered users' })
  @Public()
  @Get('data')
  public data(): unknown {
    return {};
  }

  @ApiOperation({ operationId: 'merchantTIN', summary: 'Get Merchant TIN' })
  @Public()
  @Get('get-merchant-tin')
  @ApiResponse({}) // TODO: Define type
  public async getMerchantTIN(@Query('mid') mid: string): Promise<unknown> {
    const merchantTIN =
      await this.merchantTINRepo.getMerchantWithSameTaxID(mid);

    return { merchantTIN };
  }
}
