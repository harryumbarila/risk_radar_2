import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import type { PaginatedRiskRadarExceptionsDto } from '@/api/module/risk-radar-exceptions/dto/risk-radar-exceptions-pagination.dto';
import { Public } from '@/api/shared/auth/decorator/public.decorator';
import {
  ChargebacksAndRetrievalReasonCodeLookupRepository,
  RiskRadarNotesRepository,
} from '@/finance-db/repositories';
import { RiskRadarExceptionStatusRepository } from '@/finance-db/repositories/risk-radar-exception-status.repository';
import { RiskRadarUserRepository } from '@/finance-db/repositories/risk-radar-user.repository';
import type { ExceptionDataResponseDto } from '@/shared/response/legacy-dashboard-proxy/dto/exception-data';

import { MerchantExceptionDetailResponseDto } from './dtos/merchant-exception-detail.dto';
import { SendExceptionMemoEmailDto } from './dtos/send-exception-memo-email.dto';
import { RiskRadarService } from './risk-radar.service';
import { AssignExceptionsService } from './services/assign-exceptions/assign-exceptions.service';
import {
  AssignExceptionsDto,
  AssignExceptionsResponseDto,
} from './services/assign-exceptions/dto/assign-exceptions.dto';
import { ExceptionListInputDto } from './services/exceptions-list/dto/exception-list-input.dto';
import { ExceptionsListService } from './services/exceptions-list/exceptions-list.service';
import { MerchantCardNumHistoryQueryDto } from './services/merchant-card-num-history/dto/get-merchant-card-num.dto';
import { MerchantCardNumHistoryService } from './services/merchant-card-num-history/merchant-card-num-history.service';
import { MerchantExceptionDetailService } from './services/merchant-exception-detail.service';
import { MerchantExceptionTransactionsInputDto } from './services/merchant-exception-transactions/dto/merchant-exception-transactions.dto';
import { MerchantExceptionTransactionsService } from './services/merchant-exception-transactions/merchant-exception-transactions.service';
import { MerchantWithSameTaxIdService } from './services/merchant-with-same-tax-id/merchant-with-same-tax-id.service';
import { PushNoteToIrisInputDto } from './services/push-note-to-iris/dto/push-note-to-iris-input.dto';
import { PushNoteToIrisService } from './services/push-note-to-iris/push-note-to-iris.service';
import { ReviewExceptionInputDto } from './services/review-exception/dto/review-exception-input.dto';
import { ReviewExceptionService } from './services/review-exception/review-exception.service';
import { EmailTemplatesResponseDto } from './services/risk-radar-email-template/dto/email-template.dto';
import { RiskRadarEmailTemplateService } from './services/risk-radar-email-template/risk-radar-email-template.service';
import { RiskRadarExceptionsService } from './services/risk-radar-exceptions.service';
import { RiskRadarSaveInputDto } from './services/risk-radar-save/dto/risk-radar-save-input.dto';
import { RiskRadarSaveService } from './services/risk-radar-save/risk-radar-save.service';

@ApiTags('risk-radar')
@Controller('v1/risk-radar')
export class RiskRadarController {
  public constructor(
    private readonly riskRadarService: RiskRadarService,
    private readonly merchantExceptionDetailService: MerchantExceptionDetailService,
    private readonly merchantCardNumHistoryService: MerchantCardNumHistoryService,
    private readonly reviewExceptionService: ReviewExceptionService,
    private readonly riskRadarExceptionsService: RiskRadarExceptionsService,
    private readonly riskRadarSaveService: RiskRadarSaveService,
    private readonly exceptionStatusRepo: RiskRadarExceptionStatusRepository,
    private readonly riskRadarUserRepository: RiskRadarUserRepository,
    private readonly merchantExceptionTransactionsService: MerchantExceptionTransactionsService,
    private readonly exceptionsListService: ExceptionsListService,
    private readonly riskRadarNotesRepository: RiskRadarNotesRepository,
    private readonly chargebackTransactionsService: ChargebacksAndRetrievalReasonCodeLookupRepository,
    private readonly emailTemplateService: RiskRadarEmailTemplateService,
    private readonly merchantWithSameTaxIdService: MerchantWithSameTaxIdService,
    private readonly assignExceptionsService: AssignExceptionsService,
    private readonly pushNoteToIrisService: PushNoteToIrisService
  ) {}

  @Post('send-exception-memo-email')
  @ApiOkResponse({ description: 'Send exception memo emails' })
  public async sendExceptionMemoEmail(
    @Body() emailDto: SendExceptionMemoEmailDto
  ): Promise<unknown> {
    const message =
      await this.riskRadarService.sendExceptionMemoEmail(emailDto);
    return { message };
  }

  @Get('merchant-exception-detail')
  @ApiOperation({
    summary: 'Get merchant exception details',
    description: 'Retrieves detailed information about a merchant exception',
  })
  @ApiResponse({
    status: 200,
    description:
      'The merchant exception details have been successfully retrieved',
    type: MerchantExceptionDetailResponseDto,
  })
  public async getMerchantExceptionDetail(
    @Query('merchantId') merchantId: string,
    @Query('exceptionId') exceptionId: number,
    @Query('user') user: string
  ): Promise<MerchantExceptionDetailResponseDto> {
    return this.merchantExceptionDetailService.getMerchantExceptionDetail({
      pkRiskRadarExceptions: exceptionId,
      sMID: merchantId,
      sUser: user,
    });
  }

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
      recordsPerPage,
    });
  }

  @Get('exception_data')
  @ApiOperation({
    summary: 'Get exception data',
    description: 'Returns exception statuses and related data for UI dropdowns',
  })
  @ApiResponse({
    status: 200,
    description: 'Exception data successfully retrieved',
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
      { id: 3, description: 'TalusPay Only' },
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
      { id: 24, description: 'Credits' },
    ];

    return {
      source_type: sourceTypes.map((type) => ({
        pk: type.id,
        sName: type.description,
        bHidden: false,
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
        bHidden: false,
      })),
      risk_user: riskUsers.map((user) => ({
        pkRiskRadarUser: user.id,
        sName: user.name,
        sNTUserID: user.ntUserId,
        bManager: user.isManager,
        bHidden: user.isHidden,
        dtCreated: user.createdAt.toISOString(),
      })),
    };
  }

  @Post('review-exceptions')
  @ApiOperation({
    summary: 'Review exceptions',
    description:
      'Marks risk radar exceptions as reviewed by the specified user',
  })
  @ApiResponse({
    status: 200,
    description: 'The exceptions were successfully reviewed',
  })
  public async reviewExceptions(@Body() data: ReviewExceptionInputDto) {
    return this.reviewExceptionService.reviewExceptions(data);
  }

  @Post('save')
  @ApiOkResponse()
  public async saveRiskRadar(@Body() data: RiskRadarSaveInputDto) {
    return this.riskRadarSaveService.saveRiskRadar(data);
  }

  @Get('merchant-exception-transaction')
  @ApiOkResponse()
  public async getMerchantExceptionTransactions(
    @Query(ValidationPipe) query: MerchantExceptionTransactionsInputDto
  ) {
    return this.merchantExceptionTransactionsService.getExceptionsTransactions(
      query
    );
  }

  @Get('exception-list')
  @ApiOkResponse()
  public async getExceptionList(
    @Query(ValidationPipe) query: ExceptionListInputDto
  ) {
    return this.exceptionsListService.getExceptionList(query);
  }

  @Get('notes')
  @ApiOkResponse()
  public async getNotes(@Query('mid') mid: string) {
    return this.riskRadarNotesRepository.getNotesByMid(mid);
  }

  @Get('chargeback-transactions')
  @ApiOkResponse()
  public async getChargebackTransactions(@Query('mid') mid: string) {
    return this.chargebackTransactionsService.getChargebackTransactions(mid);
  }

  @Public()
  @Get('email-templates')
  @ApiOperation({
    summary: 'Get active email templates',
    description: 'Retrieves a list of all active email templates',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active email templates successfully retrieved',
    type: EmailTemplatesResponseDto,
  })
  public async getEmailTemplates(): Promise<EmailTemplatesResponseDto> {
    const templates = await this.emailTemplateService.getActiveEmailTemplates();
    return { templates };
  }

  @Public()
  @Get('merchants-with-same-tax-id')
  @ApiOperation({
    summary: 'Get merchants with the same tax ID',
    description:
      'Retrieves a list of merchant IDs that have the same tax ID as the provided merchant',
  })
  @ApiResponse({
    status: 200,
    description:
      'List of merchant IDs with the same tax ID as the provided merchant',
    schema: {
      type: 'object',
      properties: {
        merchantIds: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'List of merchant IDs with the same tax ID',
        },
      },
    },
  })
  public async getMerchantsWithSameTaxId(
    @Query('merchantId') merchantId: string
  ): Promise<{ merchantIds: string[] }> {
    return this.merchantWithSameTaxIdService.getMerchantsWithSameTaxId(
      merchantId
    );
  }

  @Post('assign-exceptions')
  @ApiOperation({
    summary: 'Assign exceptions to a user',
    description: 'Assigns selected risk radar exceptions to a specific user',
  })
  @ApiResponse({
    status: 200,
    description: 'The exceptions were successfully assigned',
    type: AssignExceptionsResponseDto,
  })
  public async assignExceptions(
    @Body() data: AssignExceptionsDto
  ): Promise<AssignExceptionsResponseDto> {
    return this.assignExceptionsService.assignExceptions(
      data.exceptionIds,
      data.assignToUserId,
      data.createdBy
    );
  }

  @Public()
  @Post('push-note-to-iris')
  @ApiOperation({
    summary: 'Push a note to Iris',
    description: 'Pushes a note to Iris for a given merchant ID',
  })
  @ApiResponse({
    status: 200,
    description: 'The note was successfully pushed to Iris',
  })
  public async pushNoteToIris(@Body() data: PushNoteToIrisInputDto) {
    return this.pushNoteToIrisService.pushNoteToIris(data);
  }
}
