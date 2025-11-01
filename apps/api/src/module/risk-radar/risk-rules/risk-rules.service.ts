import { Injectable, NotFoundException } from '@nestjs/common';

import {
  ListRiskRulesPaginationInput,
  ListRiskRulesPaginationOutput,
  RiskRuleOutputDto,
} from './dto/risk-rules.dto';
import {
  RiskRuleRepository,
  RiskRuleWhiteListMidRepository,
  RiskRuleWhiteListMidRepositoryAuditLog,
  RiskRuleWhiteListMccRepository,
  RiskRuleWhiteListMccRepositoryAuditLog,
} from '@/risk-radar-db/repositories';
import { CreateRiskRuleParamValueDto } from './dto/create-risk-rule-param-value.dto';
import { RiskRuleParam, RiskRuleParamValue, RiskRuleWhiteListMccEntity } from '@/risk-radar-db/entities';
import { RiskRuleWhiteListMidEntity } from '@/risk-radar-db/entities/risk-rule_white_list_mid.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrUpdateWhiteListMidDto } from './dto/create-or-update-white-list-mids.dto';
import { CreateOrUpdateWhiteListMccDto } from './dto/create-or-update-white-list-mcc.dto';

export interface RiskRuleListItem {
  ruleTypeDefinition: string;
  ruleTypeCode: string;
  sourceDefinition: string;
  ruleId: number;
  ruleDefinition: string;
  parameterId: number;
  parameterDefinition: string;
  parameterShortName: string;
  parameterValueId: number;
  parameterValue: number;
  effectiveDate: Date;
}

@Injectable()
export class RiskRulesService {
  constructor(
    readonly riskRuleRepository: RiskRuleRepository,
    @InjectRepository(RiskRuleParam, 'risk-radar')
    private readonly paramRepository: Repository<RiskRuleParam>,
    @InjectRepository(RiskRuleParamValue, 'risk-radar')
    private readonly paramValueRepository: Repository<RiskRuleParamValue>,
    private readonly riskRuleWhiteListMidRepository: RiskRuleWhiteListMidRepository,
    private readonly riskRuleWhiteListMccRepository: RiskRuleWhiteListMccRepository,
    private readonly riskRuleWhiteListMidAuditLogRepository: RiskRuleWhiteListMidRepositoryAuditLog,
    private readonly riskRuleWhiteListMccAuditLogRepository: RiskRuleWhiteListMccRepositoryAuditLog,
  ) {}

  mapToRiskRuleHierarchy(rows: RiskRuleListItem[]): RiskRuleOutputDto[] {
    const rulesMap = new Map<number, RiskRuleOutputDto>();

    for (const row of rows) {
      const ruleId = row.ruleId;

      if (!rulesMap.has(ruleId)) {
        rulesMap.set(ruleId, {
          id: ruleId,
          definition: row.ruleDefinition,
          source: { definition: row.sourceDefinition },
          ruleType: {
            definition: row.ruleTypeDefinition,
            code: row.ruleTypeCode,
          },
          paramValues: [],
        });
      }

      const rule = rulesMap.get(ruleId)!;

      rule.paramValues.push({
        id: row.parameterId,
        value: row.parameterValue,
        definition: row.parameterDefinition,
        effectiveDate: row.effectiveDate,
      });
    }

    return Array.from(rulesMap.values());
  }

  async findRiskRulesWithLatestParams(
    page: number = 1,
    limit: number = 100
  ): Promise<ListRiskRulesPaginationOutput> {
    const offset = (page - 1) * limit;

    // Using a different approach with direct SQL for complex window functions
    const baseQuery = `
      SELECT 
        t.definition as "ruleTypeDefinition",
        t.code as "ruleTypeCode",
        s.definition as "sourceDefinition",
        x.pk_risk_rule as "ruleId",
        x.risk_rule_name as "ruleDefinition",
        x.pk_risk_rule_param as "parameterId",
        x.risk_rule_param as "parameterDefinition",
        x.risk_rule_param_short_name as "parameterShortName", 
        x.pk_rule_param_value as "parameterValueId",
        x.risk_rule_param_value as "parameterValue", 
        x.risk_rule_pram_value_effective_date as "effectiveDate"
      FROM
        (
          SELECT 
            a.pk as pk_risk_rule,
            a.definition as risk_rule_name,
            a.fk_source,
            a.fk_rule_type,
            b.pk as pk_risk_rule_param,
            b.definition as risk_rule_param,
            b.short_name as risk_rule_param_short_name, 
            c.pk as pk_rule_param_value,
            c.value as risk_rule_param_value, 
            c.effective_date as risk_rule_pram_value_effective_date,
            ROW_NUMBER() OVER(PARTITION BY b.fk_risk_rules, b.short_name ORDER BY c.effective_date DESC, c.pk DESC) as iRowOrder
          FROM
            tbl_risk_rules a
            JOIN tbl_risk_rules_params b ON b.fk_risk_rules = a.pk
            JOIN tbl_risk_rules_param_values c ON c.fk_risk_rules_params = b.pk
          WHERE
            a.bHidden = 0 AND
            c.effective_date < GETDATE()
        ) as x
        JOIN tbl_source s ON s.pk = x.fk_source
        JOIN tbl_rule_type t ON t.pk = x.fk_rule_type
      WHERE
        x.iRowOrder = 1
      ORDER BY x.pk_risk_rule
      OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
    `;

    const countQuery = `
      SELECT COUNT(*) as count
      FROM (
        SELECT DISTINCT x.pk_risk_rule
        FROM (
          SELECT 
            a.pk as pk_risk_rule,
            ROW_NUMBER() OVER(PARTITION BY b.fk_risk_rules, b.short_name ORDER BY c.effective_date DESC) as iRowOrder
          FROM
            tbl_risk_rules a
            JOIN tbl_risk_rules_params b ON b.fk_risk_rules = a.pk
            JOIN tbl_risk_rules_param_values c ON c.fk_risk_rules_params = b.pk
          WHERE
            a.bHidden = 0 AND
            c.effective_date < GETDATE()
        ) as x
        WHERE x.iRowOrder = 1
      ) as distinct_rules
    `;

    const [data, countResult] = await Promise.all([
      this.riskRuleRepository.query(baseQuery),
      this.riskRuleRepository.query(countQuery),
    ]);

    console.log({
      data,
    });

    const structuredData = this.mapToRiskRuleHierarchy(data);

    const total = parseInt(countResult[0]?.count || '0', 10);

    return {
      data: structuredData,
      count: structuredData.length,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  async listRiskRulesWithPagination(
    pagination: ListRiskRulesPaginationInput
  ): Promise<ListRiskRulesPaginationOutput> {
    const { page = 1, limit = 50 } = pagination;

    const result = await this.findRiskRulesWithLatestParams(page, limit);

    return {
      data: result.data,
      count: result.count,
      total: result.total,
      page: result.page,
      pageCount: result.pageCount,
    };
  }

  async createParamValue(
    dto: CreateRiskRuleParamValueDto
  ): Promise<RiskRuleParamValue> {
    const parameter = await this.paramRepository.findOne({
      where: { id: dto.ruleParamId },
      relations: ['rule'],
    });

    if (!parameter) {
      throw new NotFoundException(
        `RiskRuleParam with id ${dto.ruleParamId} not found`
      );
    }

    const newValue = this.paramValueRepository.create({
      ruleParamId: dto.ruleParamId,
      value: dto.value,
      createdBy: dto.createdBy,
      effectiveDate: dto.effectiveDate,
    });

    return await this.paramValueRepository.save(newValue);
  }

  async getWhiteListMccs(mcc: string): Promise<RiskRuleWhiteListMccEntity[]> {
    return this.riskRuleWhiteListMccRepository
      .createQueryBuilder('mcc')
      .where('mcc.MCC LIKE :mcc', { mcc: `%${mcc}%` })
      .getMany();
  }

  async createOrUpdateWhiteListMcc(dto: CreateOrUpdateWhiteListMccDto): Promise<RiskRuleWhiteListMccEntity> {

    const existingWhiteListMcc = await this.riskRuleWhiteListMccRepository.findOne({
      where: { MCC: dto.mcc },
    });

    const whiteListData = {
      MCC: dto.mcc,
      AH01: dto.AH01,
      AH02: dto.AH02,
      AH03: dto.AH03,
      AH04: dto.AH04,
      AH05: dto.AH05,
      AH06: dto.AH06,
      AH07: dto.AH07,
      AH08: dto.AH08,
      AH09: dto.AH09,
      AH10: dto.AH10,
      AH11: dto.AH11,
      AH12: dto.AH12,
      AH13: dto.AH13,
      AH14: dto.AH14,
      AH15: dto.AH15,
      AH16: dto.AH16,
      lastUpdatedBy: dto.lastUpdatedBy,
    };

    if (existingWhiteListMcc) {
      Object.assign(existingWhiteListMcc, whiteListData);

      const updatedWhiteListMcc = await this.riskRuleWhiteListMccRepository.save(existingWhiteListMcc);
      
      const auditLog = this.riskRuleWhiteListMccAuditLogRepository.create({
        ...whiteListData,
      });
      await this.riskRuleWhiteListMccAuditLogRepository.save(auditLog);

      return updatedWhiteListMcc;
    }

    const newWhiteListMcc = this.riskRuleWhiteListMccRepository.create(whiteListData);
    const createdWhiteListMcc = await this.riskRuleWhiteListMccRepository.save(newWhiteListMcc);
    
    const auditLog = this.riskRuleWhiteListMccAuditLogRepository.create({
      ...whiteListData,
    });
    await this.riskRuleWhiteListMccAuditLogRepository.save(auditLog);
    
    return createdWhiteListMcc;
  }

  async getWhiteListMids(mid: string): Promise<RiskRuleWhiteListMidEntity[]> {
    return this.riskRuleWhiteListMidRepository
      .createQueryBuilder('mid')
      .where('mid.MId LIKE :mid', { mid: `%${mid}%` })
      .getMany();
  }

  async createOrUpdateWhiteListMid(dto: CreateOrUpdateWhiteListMidDto): Promise<RiskRuleWhiteListMidEntity> {
    const existingWhiteListMid = await this.riskRuleWhiteListMidRepository.findOne({
      where: { MId: dto.mid },
    });

    const whiteListData = {
      MId: dto.mid,
      AH01: dto.AH01,
      AH02: dto.AH02,
      AH03: dto.AH03,
      AH04: dto.AH04,
      AH05: dto.AH05,
      AH06: dto.AH06,
      AH07: dto.AH07,
      AH08: dto.AH08,
      AH09: dto.AH09,
      AH10: dto.AH10,
      AH11: dto.AH11,
      AH12: dto.AH12,
      AH13: dto.AH13,
      AH14: dto.AH14,
      AH15: dto.AH15,
      AH16: dto.AH16,
      lastUpdatedBy: dto.lastUpdatedBy,
    };

    if (existingWhiteListMid) {
      Object.assign(existingWhiteListMid, whiteListData);

      const updatedWhiteListMid = await this.riskRuleWhiteListMidRepository.save(existingWhiteListMid);
      
      const auditLog = this.riskRuleWhiteListMidAuditLogRepository.create({
        ...whiteListData,
      });
      await this.riskRuleWhiteListMidAuditLogRepository.save(auditLog);

      return updatedWhiteListMid;
    }

    const newWhiteListMid = this.riskRuleWhiteListMidRepository.create(whiteListData);
    const createdWhiteListMid = await this.riskRuleWhiteListMidRepository.save(newWhiteListMid);
    
    const auditLog = this.riskRuleWhiteListMidAuditLogRepository.create({
      ...whiteListData,
    });
    await this.riskRuleWhiteListMidAuditLogRepository.save(auditLog);
    
    return createdWhiteListMid;
  }
}
