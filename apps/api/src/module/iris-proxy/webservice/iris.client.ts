import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';

import type { IrisChannelsResponseDto } from '@/shared/response';
import type {
  IrisLeadSourcesResponseDto,
  IrisUsersResponseDto,
} from '@/shared/response/iris-proxy';

export type IrisClientConfig = {
  IRIS_URL: string;
  IRIS_API_KEY: string;
};

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

  public constructor(configService: ConfigService<IrisClientConfig>) {
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

  public async getUsers(): Promise<IrisUsersResponseDto> {
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

    // eslint-disable-next-line no-restricted-syntax
    for (const classId of classIds) {
      let currentPage = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const response = await this.get<IrisUsersResponseDto>(
            `/api/v1/users/list?page=${currentPage}&per_page=100&sort_by=name&sort_dir=asc&class=${classId}&active=Yes`,
            {
              headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': this.apiKey,
              },
            }
          );

          const clearedResponseData = response.data.data.map((user) => {
            // For class 66 (INT_ISC), clear the reports_to array
            if (classId === UserClassId.INT_ISC) {
              return {
                ...user,
                reports_to: [],
              };
            }
            return user;
          });

          combinedResponse.data = [
            ...combinedResponse.data,
            ...clearedResponseData,
          ];
          combinedResponse.meta.total += response.data.meta.total;
          combinedResponse.meta.to = combinedResponse.data.length;

          hasNextPage =
            response.data.meta.current_page < response.data.meta.last_page;
        } catch (e) {
          hasNextPage = false;
          this.logger.error(e);
        } finally {
          currentPage += 1;
        }
      }
    }

    // Sort the combined data by first name
    combinedResponse.data.sort((a, b) => {
      const aFirstName = a.full_name.split(' ')[0] || a.full_name;
      const bFirstName = b.full_name.split(' ')[0] || b.full_name;
      return aFirstName.localeCompare(bFirstName);
    });

    return combinedResponse;
  }

  public async getChannels(): Promise<IrisChannelsResponseDto> {
    const response = await this.get<IrisChannelsResponseDto>(
      '/api/v1/users/groups',
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
        },
      }
    );
    return response.data;
  }

  public async getLeadSources(): Promise<IrisLeadSourcesResponseDto> {
    const response = await this.get<IrisLeadSourcesResponseDto>(
      '/api/v1/leads/sources',
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
        },
      }
    );
    return response.data;
  }

  public async get<T>(
    url: string,
    config = {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.apiKey,
      },
    }
  ) {
    return this.client.get<T>(url, config);
  }

  public async post<T>(url: string, data = {}, config = {}) {
    return this.client.post<T>(url, data, config);
  }

  public async put<T>(url: string, data = {}, config = {}) {
    return this.client.put<T>(url, data, config);
  }

  public async patch<T>(
    url: string,
    data = {},
    config = {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.apiKey,
      },
    }
  ) {
    return this.client.patch<T>(url, data, config);
  }

  public async delete<T>(url: string, config = {}) {
    return this.client.delete<T>(url, config);
  }
}
