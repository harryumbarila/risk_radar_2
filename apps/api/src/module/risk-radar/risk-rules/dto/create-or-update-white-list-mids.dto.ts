import { OmitType, PartialType } from '@nestjs/swagger';

import { RiskRuleWhiteListMidEntity } from '@/risk-radar-db/entities';

export class CreateOrUpdateWhiteListMidDto extends PartialType(
  OmitType(RiskRuleWhiteListMidEntity, ['lastUpdatedDate'])
) {}
