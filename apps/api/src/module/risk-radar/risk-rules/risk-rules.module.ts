import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import * as entities from '@/risk-radar-db/entities';
import {
  RiskRuleRepository,
  RiskRuleWhiteListMidRepository,
  RiskRuleWhiteListMidRepositoryAuditLog,
  RiskRuleWhiteListMccRepository,
  RiskRuleWhiteListMccRepositoryAuditLog,
  MerchantRiskThresholdsRepository,
  MerchantRiskThresholdsAuditLogsRepository,
} from '@/risk-radar-db/repositories';

import { RiskRulesController } from './risk-rules.controller';
import { RiskRulesService } from './risk-rules.service';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities), 'risk-radar')],
  controllers: [RiskRulesController],
  providers: [
    RiskRulesService,
    RiskRuleRepository,
    RiskRuleWhiteListMidRepository,
    RiskRuleWhiteListMidRepositoryAuditLog,
    RiskRuleWhiteListMccRepository,
    RiskRuleWhiteListMccRepositoryAuditLog,
    MerchantRiskThresholdsRepository,
    MerchantRiskThresholdsAuditLogsRepository,
  ],
})
export class RiskRulesModule {}
