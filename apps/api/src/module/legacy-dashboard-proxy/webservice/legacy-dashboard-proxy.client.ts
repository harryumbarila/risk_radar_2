import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';

import type { ExceptionFiltersDto } from '@/api/module/legacy-dashboard-proxy/legacy-dashboard-proxy.controller';
import type {
  ExceptionDataResponseDto,
  KpiStatisticsResponseDto,
  MerchantResponseDto,
  RiskRadarResponseDto,
} from '@/shared/response/legacy-dashboard-proxy';
import { kpiStatisticsResponseDto } from '@/shared/response/legacy-dashboard-proxy';

export type LegacyDashboardProxyClientConfig = {
  LEGACY_DASHBOARD_URL: string;
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

  public getMerchant(mid: string): MerchantResponseDto {
    // const response = await this.get<MerchantResponseDto>(
    //   `/api/v1/dashboard/riskradar/merchant-data-path?mid=${mid}`,
    // );
    // return response.data;

    this.logger.debug('Merchant MID:', mid);

    return {
      merchant_profile: [
        {
          pk: 5,
          sMId: '5611000000126910',
          sDBAName: 'Volcano inn',
          sDBAAddress: '19 390 old volcano',
          sDBACity: 'volcano',
          sDBAState: 'HI',
          sDBAZip: '695663',
          sOwnershipType: 'LLC (TSYS AND FD)',
          sSIC: '7011',
          sSICDesc: 'Lodging - Hotels',
          sSelfgen: 'No',
          sMerchantType: 'Lodging',
          sActivationDate: '1/8/2024',
          iMV$: 3360,
          iAT$: 320,
          iHT$: 0,
          iSwipeVolPerc: 0,
          iCB: 0,
          iRR: 0,
          bDivert: false,
          sCashAdvEnrolled: '0',
          bRiskWatch: false,
          dNetSettlementBal: 0.0,
          iSwipedPercBasedOnTransCntCurrMonth: null,
          sChannel: 'Direct channel',
          sReseller: '200',
          sReferralPartner: '100',
          sISA: '300',
          iUWApprMV: 500,
          iUWApprAT: 0,
          iUWApprSwipeVolPerc: 200,
          bAutoHoldWhiteLabel: true,
          iUWApprHT: 100,
          dtCreated: '2025-02-18T07:15:37.277',
          dtLastUpdated: '2025-02-18T07:15:37.277',
          sPreferredContact: '',
          bIsTalusPayMerchant: false,
          sSolutionConsultant: '',
          iUWApprCB: 0,
        },
        {
          pk: 7,
          sMId: '5611000000126910',
          sDBAName: 'Volcano inn',
          sDBAAddress: '19 390 old volcano',
          sDBACity: 'volcano',
          sDBAState: 'HI',
          sDBAZip: '695663',
          sOwnershipType: 'LLC (TSYS AND FD)',
          sSIC: '7011',
          sSICDesc: 'Lodging - Hotels',
          sSelfgen: 'No',
          sMerchantType: 'Lodging',
          sActivationDate: '1/8/2024',
          iMV$: 3360,
          iAT$: 320,
          iHT$: 0,
          iSwipeVolPerc: 0,
          iCB: 0,
          iRR: 0,
          bDivert: false,
          sCashAdvEnrolled: '0',
          bRiskWatch: false,
          dNetSettlementBal: 0.0,
          iSwipedPercBasedOnTransCntCurrMonth: null,
          sChannel: 'Direct channel',
          sReseller: '200',
          sReferralPartner: '100',
          sISA: '300',
          iUWApprMV: 500,
          iUWApprAT: 0,
          iUWApprSwipeVolPerc: 200,
          bAutoHoldWhiteLabel: true,
          iUWApprHT: 100,
          dtCreated: '2025-02-18T07:18:43.013',
          dtLastUpdated: '2025-02-18T07:18:43.013',
          sPreferredContact: '',
          bIsTalusPayMerchant: false,
          sSolutionConsultant: '',
          iUWApprCB: 0,
        },
      ],
      volume: [
        {
          pk: 1,
          sMId: '5611000000126910',
          iYear: 2025,
          iMonth: 2,
          sMonth: 'Feb',
          dVol: 1333144.45,
          dAvgTkt: 454.84,
          dSwipedPercBasedOnTransCnt: 0.0,
          dHighestTkt: 13978.1,
          dTotCB: 2476.61,
          dVCBPerc: 4.67,
          dMCCBPerc: 95.33,
          dDCBPerc: 0.0,
          dACBPerc: 0.0,
        },
        {
          pk: 5,
          sMId: '5611000000126910',
          iYear: 2025,
          iMonth: 1,
          sMonth: 'Jan',
          dVol: 2714367.34,
          dAvgTkt: 442.84,
          dSwipedPercBasedOnTransCnt: 0.0,
          dHighestTkt: 20554.27,
          dTotCB: 7194.2,
          dVCBPerc: 0.0,
          dMCCBPerc: 10.1,
          dDCBPerc: 0.0,
          dACBPerc: 0.0,
        },
      ],
      exception_type_legend: [],
      risk_exception: [],
    };
  }

  public riskRadar(filters: ExceptionFiltersDto): RiskRadarResponseDto {
    // const response = await this.get<RiskRadarResponseDto>(
    //   '/api/v1/dashboard/riskradar/exception-list',
    //   { params: filters },
    // );
    // return response.data;

    this.logger.debug('Risk Radar filters:', filters);

    const obj = {
      data: [
        {
          net_dep_amt: '1200.00',
          fsp_appr_auth_tot_amt: '',
          auth_decline_amt: '',
          dba: 'KRAZY KATS EMBROIDERY',
          activation_datetime: '',
          channel: '',
          reseller: '',
          referral_partner: '',
          solution_consultant: '',
          Auto_Approved_date: '',
          risk_watch: '   ',
          new_account: '',
          avg_ticket_score: '14',
          high_ticket_score: '',
          credit_score: '',
          channel_score: '',
          keyed_perc_score: '',
          monthly_vol_score: '',
          avg_batch_score: '20',
          dup_card_score: '',
          dup_bin_score: '',
          late_post_score: '',
          foreign_keyed_score: '',
          chbk_ret_req_score: '',
          next_day_funding: '',
          divert: '',
          divert_balance_amt: '',
          amex_opt_blue: '',
          moto_avs_score: '',
          settle_30perc_more_than_auth_score: '',
          no_auth_score: '',
          auth_decline_score: '',
          neg_batch_score: '',
          auto_hold_score: '',
          funding_exception_score: '',
          total_score: '34',
          user_reviewed: 'jtoth',
          exception_created_datetime: 'Feb  5 2025  8:18AM',
          exception_id: '3',
          mid: '5611000000158980',
        },
        {
          net_dep_amt: '2064.19',
          fsp_appr_auth_tot_amt: '',
          auth_decline_amt: '',
          dba: 'LAMP LIGHTER INN',
          activation_datetime: '',
          channel: '',
          reseller: '',
          referral_partner: '',
          solution_consultant: '',
          Auto_Approved_date: '',
          risk_watch: '   ',
          new_account: '',
          avg_ticket_score: '7',
          high_ticket_score: '5',
          credit_score: '',
          channel_score: '',
          keyed_perc_score: '',
          monthly_vol_score: '',
          avg_batch_score: '15',
          dup_card_score: '',
          dup_bin_score: '',
          late_post_score: '',
          foreign_keyed_score: '',
          chbk_ret_req_score: '',
          next_day_funding: '',
          divert: '',
          divert_balance_amt: '',
          amex_opt_blue: '',
          moto_avs_score: '',
          settle_30perc_more_than_auth_score: '',
          no_auth_score: '',
          auth_decline_score: '',
          neg_batch_score: '',
          auto_hold_score: '',
          funding_exception_score: '',
          total_score: '27',
          user_reviewed: 'jtoth',
          exception_created_datetime: 'Feb  5 2025  8:18AM',
          exception_id: '5',
          mid: '5611000000127837',
        },
        {
          net_dep_amt: '4501.00',
          fsp_appr_auth_tot_amt: '',
          auth_decline_amt: '',
          dba: 'WESTPAW FENCING',
          activation_datetime: '',
          channel: '',
          reseller: '',
          referral_partner: '',
          solution_consultant: '',
          Auto_Approved_date: '',
          risk_watch: '   ',
          new_account: 'Yes',
          avg_ticket_score: '11',
          high_ticket_score: '7',
          credit_score: '',
          channel_score: '',
          keyed_perc_score: '',
          monthly_vol_score: '',
          avg_batch_score: '20',
          dup_card_score: '',
          dup_bin_score: '',
          late_post_score: '',
          foreign_keyed_score: '',
          chbk_ret_req_score: '',
          next_day_funding: '',
          divert: '',
          divert_balance_amt: '',
          amex_opt_blue: '',
          moto_avs_score: '',
          settle_30perc_more_than_auth_score: '',
          no_auth_score: '',
          auth_decline_score: '',
          neg_batch_score: '',
          auto_hold_score: '',
          funding_exception_score: '',
          total_score: '38',
          user_reviewed: '',
          exception_created_datetime: 'Feb  5 2025  8:18AM',
          exception_id: '6',
          mid: '5611000000159145',
        },
        {
          net_dep_amt: '21933.52',
          fsp_appr_auth_tot_amt: '',
          auth_decline_amt: '',
          dba: 'Avani Marble and Granite',
          activation_datetime: '',
          channel: '',
          reseller: '',
          referral_partner: '',
          solution_consultant: '',
          Auto_Approved_date: '',
          risk_watch: '   ',
          new_account: '',
          avg_ticket_score: '24',
          high_ticket_score: '14',
          credit_score: '',
          channel_score: '',
          keyed_perc_score: '',
          monthly_vol_score: '',
          avg_batch_score: '5',
          dup_card_score: '',
          dup_bin_score: '',
          late_post_score: '',
          foreign_keyed_score: '',
          chbk_ret_req_score: '',
          next_day_funding: '',
          divert: '',
          divert_balance_amt: '',
          amex_opt_blue: '',
          moto_avs_score: '',
          settle_30perc_more_than_auth_score: '',
          no_auth_score: '',
          auth_decline_score: '',
          neg_batch_score: '',
          auto_hold_score: '',
          funding_exception_score: '',
          total_score: '43',
          user_reviewed: 'rparrott',
          exception_created_datetime: 'Feb  5 2025  8:18AM',
          exception_id: '7',
          mid: '5611000000169573',
        },
      ],
      meta: {
        records_per_page: 4,
        current_page: 1,
        last_page: 3,
        from_record: 1,
        to_record: 4,
        total_records: 11,
      },
    };

    return obj;
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
