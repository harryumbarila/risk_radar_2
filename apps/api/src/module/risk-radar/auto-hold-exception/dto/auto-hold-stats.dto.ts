import { ApiProperty } from '@nestjs/swagger';

export class AutoHoldStatsDto {
  @ApiProperty({
    description: 'Total distinct MIDs from ADF (TSYS) data source.',
    example: 1250,
  })
  midsAdfTotal: number;

  @ApiProperty({
    description: 'Total distinct MIDs from DFT (FSP) data source.',
    example: 890,
  })
  midsDftTotal: number;

  @ApiProperty({
    description: 'Count of distinct MIDs impacted by Auto Hold flag AH01.',
    example: 45,
  })
  ah01MidsImpacted: number;

  @ApiProperty({
    description: 'Count of distinct MIDs impacted by Auto Hold flag AH02.',
    example: 32,
  })
  ah02MidsImpacted: number;

  @ApiProperty({
    description: 'Count of distinct MIDs impacted by Auto Hold flag AH03.',
    example: 28,
  })
  ah03MidsImpacted: number;

  @ApiProperty({
    description: 'Count of distinct MIDs impacted by Auto Hold flag AH04.',
    example: 15,
  })
  ah04MidsImpacted: number;

  @ApiProperty({
    description: 'Count of distinct MIDs impacted by Auto Hold flag AH05.',
    example: 22,
  })
  ah05MidsImpacted: number;

  @ApiProperty({
    description: 'Count of distinct MIDs impacted by Auto Hold flag AH06.',
    example: 18,
  })
  ah06MidsImpacted: number;

  @ApiProperty({
    description: 'Count of distinct MIDs impacted by Auto Hold flag AH07.',
    example: 12,
  })
  ah07MidsImpacted: number;

  @ApiProperty({
    description: 'Count of distinct MIDs impacted by Auto Hold flag AH10.',
    example: 35,
  })
  ah10MidsImpacted: number;

  @ApiProperty({
    description: 'Count of distinct MIDs impacted by Auto Hold flag AH11.',
    example: 8,
  })
  ah11MidsImpacted: number;

  @ApiProperty({
    description: 'Count of distinct MIDs impacted by Auto Hold flag AH12.',
    example: 19,
  })
  ah12MidsImpacted: number;

  @ApiProperty({
    description: 'Count of distinct MIDs impacted by Auto Hold flag AH14.',
    example: 26,
  })
  ah14MidsImpacted: number;

  @ApiProperty({
    description: 'Count of distinct MIDs impacted by Auto Hold flag AH15.',
    example: 14,
  })
  ah15MidsImpacted: number;

  @ApiProperty({
    description: 'Count of distinct MIDs impacted by Auto Hold flag AH16.',
    example: 31,
  })
  ah16MidsImpacted: number;
}
