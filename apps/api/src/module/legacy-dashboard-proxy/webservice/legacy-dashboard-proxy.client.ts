import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  kpiStatisticsResponseDto,
  KpiStatisticsResponseDto,
} from '../response/kpi-statistics.response.dto';
import { RiskRadarResponseDto } from '../response/risk-radar.response.dto';
import { ExceptionDataResponseDto } from '../response/exception-data.response.dto';
import { ExceptionFiltersDto } from '../legacy-dashboard-proxy.controller';

export interface LegacyDashboardProxyClientConfig {
  LEGACY_DASHBOARD_URL: string;
}

@Injectable()
export class LegacyDashboardProxyClient {
  private readonly logger = new Logger(LegacyDashboardProxyClient.name);
  private readonly client: AxiosInstance;

  constructor(configService: ConfigService<LegacyDashboardProxyClientConfig>) {
    this.client = axios.create({
      baseURL: configService.get('LEGACY_DASHBOARD_URL'),
      timeout: 10000,
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        this.logger.debug(
          `Request: ${config.method?.toUpperCase()} ${config.url}`,
          {
            headers: config.headers,
            params: config.params,
            data: config.data,
          },
        );
        return config;
      },
      (error) => {
        this.logger.error('Request Error:', error);
        return Promise.reject(error);
      },
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        this.logger.debug(`Response: ${response.status}`, {
          data: response.data,
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
      },
    );
  }

  getKPI(): KpiStatisticsResponseDto {
    return kpiStatisticsResponseDto;
  }

  async getExceptionData(): Promise<ExceptionDataResponseDto> {
    const response = await this.get<ExceptionDataResponseDto>(
      '/api/v1/dashboard/riskradar/exception-information',
    );
    return response.data;
  }

  async riskRadar(filters: ExceptionFiltersDto): Promise<RiskRadarResponseDto> {
    // const response = await this.get<RiskRadarResponseDto>(
    //   '/api/v1/dashboard/riskradar/exception-list',
    //   { params: filters },
    // );
    //return response.data;
    const obj = {
      DATA: [
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
      META: {
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

  async get<T>(url: string, config = {}) {
    return this.client.get<T>(url, config);
  }

  async post<T>(url: string, data = {}, config = {}) {
    return this.client.post<T>(url, data, config);
  }

  async put<T>(url: string, data = {}, config = {}) {
    return this.client.put<T>(url, data, config);
  }

  async delete<T>(url: string, config = {}) {
    return this.client.delete<T>(url, config);
  }
}
