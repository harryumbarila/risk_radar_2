import { RiskRuleWhiteListMccEntity } from '@/risk-radar-db/entities';
import { OmitType, PartialType } from '@nestjs/swagger';

export class CreateOrUpdateWhiteListMccDto extends PartialType(
  OmitType(RiskRuleWhiteListMccEntity, ['lastUpdatedDate'])
) {}
