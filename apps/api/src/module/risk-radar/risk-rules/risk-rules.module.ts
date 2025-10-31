import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import * as entities from '@/risk-radar-db/entities';
import { RiskRuleRepository } from '@/risk-radar-db/repositories';

import { RiskRulesController } from './risk-rules.controller';
import { RiskRulesService } from './risk-rules.service';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities), 'risk-radar')],
  controllers: [RiskRulesController],
  providers: [RiskRulesService, RiskRuleRepository],
})
export class RiskRulesModule {}
