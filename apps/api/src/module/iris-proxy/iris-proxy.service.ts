import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { IrisClient } from '@/api/shared/module/iris/iris.client';
import type { LeadDetailResponse } from '@/shared/response';
import type { IrisBasicInfoResponseDto } from '@/shared/response/iris-proxy';

import type {
  LeadUserAssignedInputDto,
  LeadUserAssignedOutputDto,
  LeadUserAssignedSource,
} from './dto';
import type { IrisProxyControllerConfig } from './iris-proxy.controller';
import type { AssignedByMapper } from './mappers';

@Injectable()
export class IrisProxyService {
  private readonly logger = new Logger(IrisProxyService.name);

  public constructor(
    private readonly client: IrisClient,
    private readonly configService: ConfigService<IrisProxyControllerConfig>
  ) {}

  public findHighestPriorityUser = (
    users: AssignedByMapper[],
    priorityOrder: string[]
  ): AssignedByMapper | undefined => {
    return users.reduce<AssignedByMapper | undefined>(
      (highestPriorityUser, user) => {
        if (!user?.userClass || !user?.id) return highestPriorityUser;

        const priorityIndex = priorityOrder.indexOf(user.userClass);
        if (priorityIndex !== -1) {
          const highestPriorityIndex = highestPriorityUser?.userClass
            ? priorityOrder.indexOf(highestPriorityUser.userClass)
            : Infinity;

          if (
            priorityIndex < highestPriorityIndex ||
            (priorityIndex === highestPriorityIndex &&
              user.id < (highestPriorityUser?.id || Infinity))
          ) {
            return user;
          }
        }
        return highestPriorityUser;
      },
      undefined
    );
  };

  public async getLeadSource(
    leadId: number
  ): Promise<LeadUserAssignedSource | null> {
    try {
      const req = await this.client.get<LeadDetailResponse>(
        `/api/v1/leads/${leadId}`
      );
      const source = req.data?.general?.source?.name;
      const keywords = ['Referral Partner -', 'FI -'];

      return source && keywords.some((keyword) => source.includes(keyword))
        ? { name: source }
        : null;
    } catch (error) {
      this.logger.error(error);
    }
    return null;
  }

  public async leadAssignmentWebhook(
    payload: LeadUserAssignedInputDto
  ): Promise<LeadUserAssignedOutputDto> {
    try {
      const lead = payload?.data?.lead || payload?.data?.leads?.[0];

      this.logger.log(
        JSON.stringify({
          msg: 'lead-assigned-webhook',
          lead,
        })
      );

      if (!lead?.id) {
        throw new Error('Lead ID is required');
      }

      const { assignedUsers } = lead;

      // Define priority order for each category
      const solutionConsultantPriority = [
        'Int - ISC',
        'Int - SC $',
        'Int - SSC $',
        'Int - Disabled SC',
        'Int - Disabled SSC',
      ];
      const referralPartnerPriority = [
        'Bank Partner $',
        'Referral Partners $',
        'Disabled-Referral Pr',
      ];
      const resellerPriority = [
        'Reseller Full Serv $',
        'Reseller Par Serv $',
        'Reseller Tal Serv $',
        'Disabled-Partner',
      ];
      const isvPriority = ['ISV Full Serv $'];

      // Helper function to find the highest priority user

      // Find the highest priority user for each category
      const solutionConsultantUser = this.findHighestPriorityUser(
        assignedUsers || [],
        solutionConsultantPriority
      );
      let referralPartnerUser = this.findHighestPriorityUser(
        assignedUsers || [],
        referralPartnerPriority
      );
      const resellerUser = this.findHighestPriorityUser(
        assignedUsers || [],
        resellerPriority
      );
      const isvUser = this.findHighestPriorityUser(
        assignedUsers || [],
        isvPriority
      );

      // If the referral partner is not found in the assigned users, try to fetch it from the lead details and get from the source
      if (!referralPartnerUser?.name) {
        referralPartnerUser = (await this.getLeadSource(lead.id)) || undefined;
      }

      this.logger.log(
        JSON.stringify({
          msg: 'lead-assigned-webhook',
          solutionConsultantUser,
          referralPartnerUser,
          resellerUser,
          isvUser,
        })
      );

      // Prod Stag
      // 8046	8438	Solution Consultant
      // 8047	8439	Referral Partner
      // 8048	8440	Reseller
      // 8049	8441	ISV

      const codeMap =
        this.configService.get('IRIS_ENV') === 'staging'
          ? {
              consultant: '8438',
              partner: '8439',
              reseller: '8440',
              isv: '8441',
            }
          : {
              consultant: '8046',
              partner: '8047',
              reseller: '8048',
              isv: '8049',
            };

      this.logger.log(
        JSON.stringify({
          msg: 'lead-assigned-webhook',
          fields: [
            {
              id: codeMap.consultant,
              value: solutionConsultantUser?.name || '',
            },
            {
              id: codeMap.partner,
              value: referralPartnerUser?.name || '',
            },
            {
              id: codeMap.reseller,
              value: resellerUser?.name || '',
            },
            {
              id: codeMap.isv,
              value: isvUser?.name || '',
            },
          ],
        })
      );

      await this.client.patch(`/api/v1/leads/${lead.id}`, {
        fields: [
          {
            id: codeMap.consultant,
            value: solutionConsultantUser?.name || '',
          },
          {
            id: codeMap.partner,
            value: referralPartnerUser?.name || '',
          },
          {
            id: codeMap.reseller,
            value: resellerUser?.name || '',
          },
          {
            id: codeMap.isv,
            value: isvUser?.name || '',
          },
        ],
      });
      return { success: true };
    } catch (error) {
      Logger.error(error);

      if (error instanceof Error) {
        throw new HttpException(
          `Failed to update lead: ${error.message}.`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          `Failed to get lead: ${error.message}.`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException(
        `Failed to get lead: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
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
