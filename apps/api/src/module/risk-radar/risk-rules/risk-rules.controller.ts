import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RiskRulesService } from './risk-rules.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import {
  ListRiskRulesPaginationInput,
  ListRiskRulesPaginationOutput,
} from './dto/risk-rules.dto';
import { Public } from '@/api/shared/auth/decorator/public.decorator';
import { RiskRuleParamValue } from '@/risk-radar-db/entities';
import { CreateRiskRuleParamValueDto } from './dto/create-risk-rule-param-value.dto';

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
}
