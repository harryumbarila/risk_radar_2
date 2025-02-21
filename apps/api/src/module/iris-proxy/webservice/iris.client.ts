import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { IrisUsersResponseDto } from '../response/iris-users.response.dto';
import { IrisChannelsResponseDto } from '@denali/web/src/hooks/attribution-url/response/iris-channels.response.dto';

export interface IrisClientConfig {
  IRIS_URL: string;
  IRIS_API_KEY: string;
}

const enum UserClassId {
  INT_SSC = 42,
  INT_SC = 43,
  INT_ISC = 66,
}

@Injectable()
export class IrisClient {
  private readonly logger = new Logger(IrisClient.name);
  private readonly client: AxiosInstance;
  private readonly apiKey: string;

  constructor(configService: ConfigService<IrisClientConfig>) {
    this.client = axios.create({
      baseURL: configService.get('IRIS_URL'),
      timeout: 10000,
    });

    this.apiKey = configService.get('IRIS_API_KEY');

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        this.logger.debug(
          `Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
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

  async getUsers(): Promise<IrisUsersResponseDto> {
    const classIds = [
      UserClassId.INT_SSC,
      UserClassId.INT_SC,
      UserClassId.INT_ISC,
    ];

    const combinedResponse: IrisUsersResponseDto = {
      data: [],
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        path: '',
        per_page: 100,
        to: 0,
        total: 0,
      },
    };

    for (const classId of classIds) {
      let currentPage = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        try {
          const response = await this.get<IrisUsersResponseDto>(
            `/api/v1/users/list?page=${currentPage}&per_page=100&sort_by=name&sort_dir=asc&class=${classId}&active=Yes`,
            {
              headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': this.apiKey,
              },
            },
          );

          combinedResponse.data = [
            ...combinedResponse.data,
            ...response.data.data,
          ];
          combinedResponse.meta.total += response.data.meta.total;
          combinedResponse.meta.to = combinedResponse.data.length;

          hasNextPage =
            response.data.meta.current_page < response.data.meta.last_page;
        } catch (e) {
          hasNextPage = false;
          this.logger.error(e);
        } finally {
          currentPage++;
        }
      }
    }

    return combinedResponse;
  }
  async getChannels(): Promise<IrisChannelsResponseDto> {
    const response = await this.get<IrisChannelsResponseDto>(
      '/api/v1/users/groups',
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
        },
      },
    );
    return response.data;
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
