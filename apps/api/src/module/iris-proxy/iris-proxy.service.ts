import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import axios from 'axios';
import { Queue } from 'bullmq';

import { IrisClient } from '@/api/shared/module/iris/iris.client';
import type { LeadDetailResponse } from '@/shared/response';
import type { IrisBasicInfoResponseDto } from '@/shared/response/iris-proxy';

import type {
  LeadUserAssignedInputDto,
  LeadUserAssignedOutputDto,
} from './dto';

@Injectable()
export class IrisProxyService {
  private readonly logger = new Logger(IrisProxyService.name);

  public constructor(
    private readonly client: IrisClient,
    @InjectQueue('assigned-users') private readonly assignedQueue: Queue
  ) {}

  public async leadAssignmentWebhook(
    payload: LeadUserAssignedInputDto
  ): Promise<LeadUserAssignedOutputDto> {
    try {
      await this.assignedQueue.add('assigned-users', payload);
      return { success: true };
    } catch (error) {
      this.logger.error(error);
      return { success: false };
    }
  }

  public async getLeadBasicInfo(
    leadId: number
  ): Promise<IrisBasicInfoResponseDto> {
    try {
      const { data } = await this.client.get<LeadDetailResponse>(
        `/api/v1/leads/${leadId}`
      );

      const dbaName =
        data.details
          .find((detail) => detail.name === 'Business Information')
          ?.fields.find((field) => field.field === 'DBA Name')?.value || '';

      const contactPhone =
        data.details
          .find((detail) => detail.name === 'Business Information')
          ?.fields.find((field) => field.field === 'Contact Phone Number')
          ?.value || '';

      const contactEmail =
        data.details
          .find((detail) => detail.name === 'Business Information')
          ?.fields.find((field) => field.field === 'Contact Email Address')
          ?.value || '';

      return { dbaName, contactPhone, contactEmail };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          `Failed to get lead: ${error.message}.`,
          error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      this.logger.error(error);

      throw new HttpException(
        `Failed to get lead: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
