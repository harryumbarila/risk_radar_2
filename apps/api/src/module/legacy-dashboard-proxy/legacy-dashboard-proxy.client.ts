import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  kpiStatisticsResponseDto,
  KpiStatisticsResponseDto,
} from './kpi-statistics.response.dto';
import {
  riskRadarResponseDto,
  RiskRadarResponseDto,
} from './risk-radar.response.dto';

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

  riskRadar(): RiskRadarResponseDto[] {
    return riskRadarResponseDto;
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
