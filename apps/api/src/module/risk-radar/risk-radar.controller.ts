import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';

import { Public } from '@/api/shared/auth/decorator/public.decorator';

import { SendExceptionMemoEmailDto } from './dtos/send-exception-memo-email.dto';
import { MerchantExceptionDetailRequestDto, MerchantExceptionDetailResponseDto } from './dtos/merchant-exception-detail.dto';
import { RiskRadarService } from './risk-radar.service';
import { MerchantExceptionDetailService } from './services/merchant-exception-detail.service';
import { AssignExceptionReviewService } from './services/assign-exception-review/assign-exception-review.service';
import { AssignExceptionReviewInputDto } from './services/assign-exception-review/dto/assign-exception-review-input.dto';
import { MerchantCardNumHistoryQueryDto } from './services/merchant-card-num-history/dto/get-merchant-card-num.dto';
import { MerchantCardNumHistoryService } from './services/merchant-card-num-history/merchant-card-num-history.service';
import { RiskRadarExceptionsListResultDto } from '../risk-radar-exceptions/dto/risk-radar-exceptions-list-result.dto';
import { RiskRadarExceptionsService } from './services/risk-radar-exceptions.service';
import { RiskRadarSaveInputDto } from './services/risk-radar-save/dto/risk-radar-save-input.dto';
import { RiskRadarSaveService } from './services/risk-radar-save/risk-radar-save.service';
import { ExceptionDataResponseDto } from '@/shared/response/legacy-dashboard-proxy/dto/exception-data';
import { RiskRadarExceptionStatusRepository } from '@/finance-db/repositories/risk-radar-exception-status.repository';
import { RiskRadarUserRepository } from '@/finance-db/repositories/risk-radar-user.repository';
import { PaginatedRiskRadarExceptionsDto } from '../risk-radar-exceptions/dto/risk-radar-exceptions-pagination.dto';

@ApiTags('risk-radar')
@Controller('v1/risk-radar')
export class RiskRadarController {
  public constructor(
    private readonly riskRadarService: RiskRadarService,
    private readonly merchantExceptionDetailService: MerchantExceptionDetailService,
    private readonly merchantCardNumHistoryService: MerchantCardNumHistoryService,
    private readonly assignExceptionReviewService: AssignExceptionReviewService,
    private readonly riskRadarExceptionsService: RiskRadarExceptionsService,
    private readonly riskRadarSaveService: RiskRadarSaveService,
    private readonly exceptionStatusRepo: RiskRadarExceptionStatusRepository,
    private readonly riskRadarUserRepository: RiskRadarUserRepository
  ) {}

  @Public()
  @Post('send-exception-memo-email')
  @ApiOkResponse({ description: 'Send exception memo emails' })
  public async sendExceptionMemoEmail(
    @Body() emailDto: SendExceptionMemoEmailDto
  ): Promise<unknown> {
    const message =
      await this.riskRadarService.sendExceptionMemoEmail(emailDto);
    return { message };
  }

  @Public()
  @Post('merchant-exception-detail')
  @ApiOperation({
    summary: 'Get merchant exception details',
    description: 'Retrieves detailed information about a merchant exception',
  })
  @ApiResponse({
    status: 200,
    description: 'The merchant exception details have been successfully retrieved',
    type: MerchantExceptionDetailResponseDto,
  })
  public async getMerchantExceptionDetail(
    @Body() request: MerchantExceptionDetailRequestDto
  ): Promise<MerchantExceptionDetailResponseDto> {
    return this.merchantExceptionDetailService.getMerchantExceptionDetail(request);
  }
    
  @Public()
  @Get('merchant-card-num-history')
  @ApiResponse({})
  public async getMerchantCardNumHistory(
    @Query(ValidationPipe) query: MerchantCardNumHistoryQueryDto
  ) {
    return this.merchantCardNumHistoryService.getMerchantCardNumHistory(query);
  }

  @ApiResponse({
    status: 200,
    description: 'Get risk radar exceptions list.',
  })
  @ApiOperation({
    operationId: 'getRiskRadarExceptionsList',
    summary:
      'Get risk radar exceptions list with filtering and sorting options',
  })
  @Public()
  @Get('list')
  public async getExceptionsList(
    @Query('from_date') dtStart: Date,
    @Query('to_date') dtEnd: Date,
    @Query('status') pkRiskRadarExceptionStatus: number,
    @Query('assigned_to') pkRiskRadarUserAssigned: number,
    @Query('MID') sMIDSearch: string,
    @Query('dba_or_sic') sGeneralSearch: string,
    @Query('exception_type') sExceptionList: string,
    @Query('view_all_exceptions') bViewAll: boolean,
    @Query('iSortBy') iSortBy: number,
    @Query('source_type') iProcessor: number,
    @Query('page') currentPage?: number,
    @Query('per_page') recordsPerPage?: number
  ): Promise<PaginatedRiskRadarExceptionsDto> {
    return this.riskRadarExceptionsService.getExceptionsList({
      dtStart,
      dtEnd,
      pkRiskRadarExceptionStatus,
      pkRiskRadarUserAssigned,
      sMIDSearch,
      sGeneralSearch,
      sExceptionList,
      bViewAll,
      iSortBy,
      iProcessor,
      currentPage,
      recordsPerPage
    });
  }

  @Get('exception_data')
  @Public()
  @ApiOperation({
    summary: 'Get exception data',
    description: 'Returns exception statuses and related data for UI dropdowns'
  })
  @ApiResponse({
    status: 200,
    description: 'Exception data successfully retrieved'
  })
  public async getExceptionData(): Promise<ExceptionDataResponseDto> {
    const exceptionStatuses =
      await this.exceptionStatusRepo.getActiveExceptionStatuses();
    
    // Get active users
    const riskUsers = await this.riskRadarUserRepository.find({
      where: { isHidden: false },
    });

    // Define the source types
    const sourceTypes = [
      { id: 0, description: 'All' },
      { id: 1, description: 'TSYS Only' },
      { id: 2, description: 'FSP North Only' },
      { id: 3, description: 'TalusPay Only' }
    ];

    // Define the exception types
    const exceptionTypes = [
      { id: 1, description: 'AMEX Opt Blue' },
      { id: 2, description: 'AT' },
      { id: 3, description: 'Auth Decl' },
      { id: 4, description: 'Avg Batch' },
      { id: 5, description: 'CB/RR' },
      { id: 6, description: 'Divert' },
      { id: 7, description: 'Dupl BIN' },
      { id: 8, description: 'Dupl Card' },
      { id: 9, description: 'Foreign Keyed' },
      { id: 10, description: 'Keyed %' },
      { id: 11, description: 'Late Post' },
      { id: 12, description: 'MOTO AVS' },
      { id: 13, description: 'MV' },
      { id: 14, description: 'Neg Batch' },
      { id: 15, description: 'Net Divert Bal' },
      { id: 16, description: 'New Acct' },
      { id: 17, description: 'Next Day Funding' },
      { id: 18, description: 'No Auth' },
      { id: 19, description: 'Risk Watch' },
      { id: 20, description: 'Channel Rule' },
      { id: 21, description: 'Settle Amt more than 30% of Auth Amt' },
      { id: 22, description: 'Auto Hold' },
      { id: 23, description: 'HT' },
      { id: 24, description: 'Credits' }
    ];

    return {
      source_type: sourceTypes.map((type) => ({
        pk: type.id,
        sName: type.description,
        bHidden: false
      })),
      status: exceptionStatuses.map((status) => ({
        pkRiskRadarExceptionStatus: status.id,
        sExceptionStatusDesc: status.description,
        iSortOrder: 0,
        bHidden: false,
        dtCreated: new Date().toISOString(),
      })),
      exception_type: exceptionTypes.map((type) => ({
        pk: type.id,
        sDesc: type.description,
        bHidden: false
      })),
      risk_user: riskUsers.map(user => ({
        pkRiskRadarUser: user.id,
        sName: user.name,
        sNTUserID: user.ntUserId,
        bManager: user.isManager,
        bHidden: user.isHidden,
        dtCreated: user.createdAt.toISOString(),
      })),
    };
  }

  @Public()
  @Post('assign-exception-review')
  @ApiOkResponse()
  public assignExceptionReview(@Body() data: AssignExceptionReviewInputDto) {
    return this.assignExceptionReviewService.assignExceptionReview(data);
  }

  @Public()
  @Post('save')
  @ApiOkResponse()
  public async saveRiskRadar(@Body() data: RiskRadarSaveInputDto) {
    return this.riskRadarSaveService.saveRiskRadar(data);
  }

}
