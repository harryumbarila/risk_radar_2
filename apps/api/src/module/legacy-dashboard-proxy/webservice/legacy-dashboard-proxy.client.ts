import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';

import type { ExceptionFiltersDto } from '@/api/module/legacy-dashboard-proxy/legacy-dashboard-proxy.controller';
import type {
  ExceptionDataResponseDto,
  KpiStatisticsResponseDto,
  MerchantChargebacksResponseDto,
  MerchantContactResponseDto,
  MerchantNetSettlementResponseDto,
  MerchantNotesResponseDto,
  MerchantResponseDto,
  RiskRadarResponseDto,
  TransactionExceptionResponseDto,
} from '@/shared/response/legacy-dashboard-proxy';
import { kpiStatisticsResponseDto } from '@/shared/response/legacy-dashboard-proxy';

export type LegacyDashboardProxyClientConfig = {
  LEGACY_DASHBOARD_URL: string;
  LEGACY_DASHBOARD_API_KEY: string;
};

@Injectable()
export class LegacyDashboardProxyClient {
  private readonly logger = new Logger(LegacyDashboardProxyClient.name);

  private readonly client: AxiosInstance;

  public constructor(
    configService: ConfigService<LegacyDashboardProxyClientConfig>
  ) {
    this.client = axios.create({
      baseURL: configService.get('LEGACY_DASHBOARD_URL'),
      timeout: 10000,
      headers: {
        'x-api-key': configService.get<string>('LEGACY_DASHBOARD_API_KEY'),
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        this.logger.debug(
          `Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
          {
            headers: config.headers,
            params: config.params as unknown,
            data: config.data as unknown,
          }
        );
        return config;
      },
      (error) => {
        this.logger.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        this.logger.debug(`Response: ${response.status}`, {
          data: response.data as unknown,
          headers: response.headers,
        });
        return response;
      },
      (error: AxiosError) => {
        this.logger.error('Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  public getKPI(): KpiStatisticsResponseDto {
    return kpiStatisticsResponseDto;
  }

  public async getExceptionData(): Promise<ExceptionDataResponseDto> {
    const response = await this.get<ExceptionDataResponseDto>(
      '/api/v1/dashboard/riskradar/exception-information'
    );
    return response.data;
  }

  public async getRiskRadarUsers(): Promise<ExceptionDataResponseDto> {
    const response = await this.get<ExceptionDataResponseDto>(
      '/api/v1/dashboard/riskradar/risk-radar-users'
    );
    return response.data;
  }

  public async getCardHistory(
    cardNumber: string
  ): Promise<ExceptionDataResponseDto> {
    const response = await this.get<ExceptionDataResponseDto>(
      `/api/v1/dashboard/riskradar/card-history?cardNumber=${cardNumber}`
    );
    return response.data;
  }

  public async getEmailtemplates(): Promise<ExceptionDataResponseDto> {
    const response = await this.get<ExceptionDataResponseDto>(
      `/api/v1/dashboard/riskradar/email-templates`
    );
    return response.data;
  }

  public async pushNoteToIris(
    noteId: string
  ): Promise<ExceptionDataResponseDto> {
    const response = await this.post<ExceptionDataResponseDto>(
      `/api/v1/dashboard/riskradar/push-note-to-iris?noteId=${noteId}`,
      {}
    );

    return response.data;
  }

  public async saveNewNetSettlement(
    category: string,
    tranDate: string,
    tranAmt: number,
    balAmt: number,
    pendingAmt: number,
    writeOffAmt: number,
    reason: string,
    createdBy: string,
    mid: string
  ) {
    const response = await this.post<ExceptionDataResponseDto>(
      `/api/v1/dashboard/riskradar/save-net-settlement`,
      {
        category,
        tranDate,
        tranAmt,
        balAmt,
        pendingAmt,
        writeOffAmt,
        reason,
        createdBy,
        mid,
      }
    );

    return response.data;
  }

  public async saveMerchantData(
    mid: string,
    note: string,
    isPinned: boolean,
    bbbRating: string,
    author: string,
    preferredContact: string
  ): Promise<ExceptionDataResponseDto> {
    const response = await this.post<ExceptionDataResponseDto>(
      `/api/v1/dashboard/riskradar/save-merchant-data?mid=${mid}`,
      {
        preferredContact,
        note,
        isPinned,
        bbbRating,
        author,
      }
    );

    return response.data;
  }

  public async getMerchantContactInfo(
    mid: string
  ): Promise<MerchantContactResponseDto> {
    this.logger.debug('Merchant MID:', mid);

    const response = await this.get<MerchantContactResponseDto>(
      `/api/v1/dashboard/riskradar/merchant-tab/contact?mid=${mid}`
    );
    return response.data;
  }

  public async postExecuteDivertCommand(
    exceptionsId: number[]
  ): Promise<MerchantContactResponseDto> {
    this.logger.debug('exceptionIds:', exceptionsId);

    const response = await this.post<MerchantContactResponseDto>(
      `/api/v1/dashboard/riskradar/execute-command/divert`,
      {
        riskExceptionIds: exceptionsId,
      }
    );
    return response.data;
  }

  public async postExecuteManagersQueueCommand(
    exceptionsId: number[]
  ): Promise<MerchantContactResponseDto> {
    this.logger.debug('exceptionIds:', exceptionsId);

    const response = await this.post<MerchantContactResponseDto>(
      `/api/v1/dashboard/riskradar/execute-command/mgrq`,
      {
        riskExceptionIds: exceptionsId,
      }
    );
    return response.data;
  }

  public async postReviewException(
    exceptionsId: number[],
    reviewerUsername: string
  ): Promise<MerchantContactResponseDto> {
    this.logger.debug('exceptionIds:', exceptionsId);

    const response = await this.post<MerchantContactResponseDto>(
      `/api/v1/dashboard/riskradar/execute-command/reviewed`,
      {
        riskExceptionIds: exceptionsId,
        reviewerUsername,
      }
    );
    return response.data;
  }

  public async postSentToManagersQueue(
    exceptionsId: number[]
  ): Promise<MerchantContactResponseDto> {
    this.logger.debug('exceptionIds:', exceptionsId);

    const response = await this.post<MerchantContactResponseDto>(
      `/api/v1/dashboard/riskradar/execute-command/mgrq`,
      {
        riskExceptionIds: exceptionsId,
      }
    );
    return response.data;
  }

  public async postAssignExceptionToUser(
    exceptionsId: number[],
    riskUserId: string
  ): Promise<MerchantContactResponseDto> {
    this.logger.debug('exceptionIds:', exceptionsId);

    const response = await this.post<MerchantContactResponseDto>(
      `/api/v1/dashboard/riskradar/assign-exception-to-user`,
      {
        riskExceptionsIds: exceptionsId,
        userId: riskUserId,
      }
    );
    return response.data;
  }

  public async putExecuteAutoHoldWhiteLabelCommand(
    exceptionsId: number[],
    isActive: boolean
  ): Promise<MerchantContactResponseDto> {
    this.logger.debug('exceptionIds:', exceptionsId);

    const response = await this.put<MerchantContactResponseDto>(
      `/api/v1/dashboard/riskradar/execute-command/bAutoHoldWhiteLabel`,
      {
        riskExceptionIds: exceptionsId,
        isActive,
      }
    );
    return response.data;
  }

  public async putExecuteRiskWatchCommand(
    exceptionsId: number[],
    isActive: boolean
  ): Promise<MerchantContactResponseDto> {
    this.logger.debug('exceptionIds:', exceptionsId);

    const response = await this.put<MerchantContactResponseDto>(
      `/api/v1/dashboard/riskradar/execute-command/bRiskWatch`,
      {
        riskExceptionIds: exceptionsId,
        isActive,
      }
    );
    return response.data;
  }

  public async getTransactionExceptions(
    mid: string
  ): Promise<TransactionExceptionResponseDto> {
    this.logger.debug('Merchant MID:', mid);

    const response = await this.get<TransactionExceptionResponseDto>(
      `/api/v1/dashboard/riskradar/merchant-tab/exceptions?mid=${mid}`
    );
    return response.data;
  }

  public async getMerchantNotes(
    mid: string
  ): Promise<MerchantNotesResponseDto> {
    this.logger.debug('Merchant MID:', mid);

    const response = await this.get<MerchantNotesResponseDto>(
      `/api/v1/dashboard/riskradar/merchant-tab/notes?mid=${mid}`
    );
    return response.data;
  }

  public async getMerchantChargebacks(
    mid: string
  ): Promise<MerchantChargebacksResponseDto> {
    this.logger.debug('Merchant MID:', mid);

    const response = await this.get<MerchantChargebacksResponseDto>(
      `/api/v1/dashboard/riskradar/merchant-tab/chargebacks?mid=${mid}`
    );
    return response.data;
  }

  public async getMerchantNetSettlement(
    mid: string
  ): Promise<MerchantNetSettlementResponseDto> {
    this.logger.debug('Merchant MID:', mid);

    const response = await this.get<MerchantNetSettlementResponseDto>(
      `/api/v1/dashboard/riskradar/merchant-tab/netsettlement?mid=${mid}`
    );
    return response.data;
  }

  public async getMerchant(
    mid: string,
    exceptionId: string
  ): Promise<MerchantResponseDto> {
    this.logger.debug('Merchant MID:', mid);

    const response = await this.get<MerchantResponseDto>(
      `/api/v1/dashboard/riskradar/merchant-data-path?mid=${mid}&exceptionId=${exceptionId}`
    );
    return response.data;
  }

  public async riskRadar(
    filters: ExceptionFiltersDto
  ): Promise<RiskRadarResponseDto> {
    this.logger.debug('Risk Radar filters:', filters);
    const response = await this.get<RiskRadarResponseDto>(
      '/api/v1/dashboard/riskradar/exception-list',
      { params: filters }
    );
    return response.data;
  }

  public async get<T>(url: string, config = {}) {
    return this.client.get<T>(url, config);
  }

  public async post<T>(url: string, data = {}, config = {}) {
    return this.client.post<T>(url, data, config);
  }

  public async put<T>(url: string, data = {}, config = {}) {
    return this.client.put<T>(url, data, config);
  }

  public async delete<T>(url: string, config = {}) {
    return this.client.delete<T>(url, config);
  }
}
