import { MerchanRiskThresholdsEntity } from '@/risk-radar-db/entities';
import { OmitType, PartialType } from '@nestjs/swagger';

export class CreateOrUpdateMerchantRiskThresholdDto extends PartialType(
  OmitType(MerchanRiskThresholdsEntity, ['lastUpdatedDate'])
) {}
