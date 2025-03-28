import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Public } from '@/api/shared/auth/decorator/public.decorator';
import { CrescentViewEntity } from '@/crescent-view-db/entities';
import { RiskRadarUserEntity } from '@/finance-db/entities/risk-radar-user.entity';

export type IrisProxyControllerConfig = {
  IRIS_ENV: string;
};

@ApiTags('Example for multi DB connection')
@Controller('/v1/multi_dn')
export class ExampleMultiDbController {
  public constructor(
    @InjectRepository(CrescentViewEntity, 'crescent-view')
    private readonly crescentViewRepo: Repository<CrescentViewEntity>,

    @InjectRepository(RiskRadarUserEntity, 'finance')
    private readonly financeRepo: Repository<RiskRadarUserEntity>
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Pick some data from 2 dbs.',
  })
  @ApiOperation({ operationId: 'users', summary: 'Get filtered users' })
  @Public()
  @Get('data')
  public async data(): Promise<unknown> {
    const crescentView = await this.crescentViewRepo.findBy({
      isActive: false,
    });
    const financeData = await this.financeRepo.findBy({ name: 'Test' });

    return { crescentView, financeData };
  }
}
