import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeadsBusinessInformationRepository } from '@/finance-db/repositories/leads-business-information.repository';
import { RiskRadarEmailTemplateRepository } from '@/finance-db/repositories/risk-radar-email-template.repository';
import { RiskRadarUserRepository } from '@/finance-db/repositories/risk-radar-user.repository';
import { LeadsEntity } from '@/iris-db/entities';
import { LeadsRepository } from '@/iris-db/repositories/';

import { RiskRadarController } from './risk-radar.controller';
import { RiskRadarService } from './risk-radar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RiskRadarUserRepository,
      RiskRadarEmailTemplateRepository,
      LeadsBusinessInformationRepository,
    ]),
    TypeOrmModule.forFeature([LeadsEntity]),
  ],
  controllers: [RiskRadarController],
  providers: [RiskRadarService, LeadsRepository],
})
export class RiskRadarModule {}
