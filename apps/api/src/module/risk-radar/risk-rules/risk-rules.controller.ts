import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RiskRulesService } from './risk-rules.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  ListRiskRulesPaginationInput,
  ListRiskRulesPaginationOutput,
} from './dto/risk-rules.dto';
import { Public } from '@/api/shared/auth/decorator/public.decorator';
import {
  MerchanRiskThresholdsEntity,
  RiskRuleParamValue,
  RiskRuleWhiteListMccEntity,
} from '@/risk-radar-db/entities';
import { CreateRiskRuleParamValueDto } from './dto/create-risk-rule-param-value.dto';
import { CreateOrUpdateWhiteListMidDto } from './dto/create-or-update-white-list-mids.dto';
import { RiskRuleWhiteListMidEntity } from '@/risk-radar-db/entities/risk-rule_white_list_mid.entity';
import { CreateOrUpdateWhiteListMccDto } from './dto/create-or-update-white-list-mcc.dto';
import { CreateOrUpdateMerchantRiskThresholdDto } from './dto/create-or-update-merchant_risk_threshold.dto';
import {
  ListRiskRuleParamValuesInput,
  ListRiskRuleParamValuesOutput,
} from './dto/risk-rule-param-value.dto';

@ApiTags('risk-rule')
@Controller('v1/risk-rule')
export class RiskRulesController {
  constructor(public riskRuleService: RiskRulesService) {}

  @Get()
  @Public()
  @ApiOkResponse({
    description: 'Paginated list of risk rules and their parameters.',
    type: ListRiskRulesPaginationOutput,
  })
  async listRiskRules(
    @Query() pagination: ListRiskRulesPaginationInput
  ): Promise<ListRiskRulesPaginationOutput> {
    return this.riskRuleService.listRiskRulesWithPagination(pagination);
  }

  @Post()
  @Public()
  @ApiCreatedResponse({
    description: 'Creates a new risk rule parameter value.',
    type: RiskRuleParamValue,
  })
  async createParamValue(
    @Body() dto: CreateRiskRuleParamValueDto
  ): Promise<RiskRuleParamValue> {
    return this.riskRuleService.createParamValue(dto);
  }

  @Post('white-list-mid')
  @Public()
  @ApiCreatedResponse({
    description: 'Creates a new white list mid.',
    type: RiskRuleWhiteListMidEntity,
  })
  async createOrUpdateWhiteListMid(
    @Body() dto: CreateOrUpdateWhiteListMidDto
  ): Promise<RiskRuleWhiteListMidEntity> {
    return this.riskRuleService.createOrUpdateWhiteListMid(dto);
  }

  @Get('white-list-mid')
  @Public()
  @ApiOkResponse({
    description: 'Gets a list of white list mids.',
    type: [RiskRuleWhiteListMidEntity],
  })
  async getWhiteListMids(
    @Query('mid') mid: string
  ): Promise<RiskRuleWhiteListMidEntity[]> {
    return this.riskRuleService.getWhiteListMids(mid);
  }

  @Post('white-list-mcc')
  @Public()
  @ApiCreatedResponse({
    description: 'Creates a new white list mcc.',
    type: RiskRuleWhiteListMccEntity,
  })
  async createOrUpdateWhiteListMcc(
    @Body() dto: CreateOrUpdateWhiteListMccDto
  ): Promise<RiskRuleWhiteListMccEntity> {
    return this.riskRuleService.createOrUpdateWhiteListMcc(dto);
  }

  @Get('white-list-mcc')
  @Public()
  @ApiOkResponse({
    description: 'Gets a list of white list mccs.',
    type: RiskRuleWhiteListMccEntity,
    isArray: true,
  })
  async getWhiteListMccs(
    @Query('mcc') mcc: string
  ): Promise<RiskRuleWhiteListMccEntity[]> {
    return this.riskRuleService.getWhiteListMccs(mcc);
  }

  @Post('merchant-risk-threshold')
  @Public()
  @ApiCreatedResponse({
    description: 'Creates a new merchant risk threshold.',
    type: MerchanRiskThresholdsEntity,
  })
  async createOrUpdateMerchantRiskThreshold(
    @Body() dto: CreateOrUpdateMerchantRiskThresholdDto
  ): Promise<MerchanRiskThresholdsEntity> {
    return this.riskRuleService.createOrUpdateMerchantRiskThreshold(dto);
  }

  @Get('merchant-risk-threshold')
  @Public()
  @ApiOkResponse({
    description: 'Gets a list of merchant risk thresholds.',
    type: [MerchanRiskThresholdsEntity],
  })
  async getMerchantRiskThresholds(
    @Query('mid') mid: string
  ): Promise<MerchanRiskThresholdsEntity[]> {
    return this.riskRuleService.getMerchantRiskThresholds(mid);
  }

  @Get('param-values')
  @Public()
  @ApiOperation({
    summary:
      'List risk rule parameter values with pagination and optional filter by ruleParamId',
  })
  @ApiOkResponse({
    description: 'List risk rule parameter values.',
    type: ListRiskRuleParamValuesOutput,
  })
  async listRiskRuleParamValue(
    @Query() query: ListRiskRuleParamValuesInput
  ): Promise<ListRiskRuleParamValuesOutput> {
    return this.riskRuleService.listRiskRuleParamValue(query);
  }
}
