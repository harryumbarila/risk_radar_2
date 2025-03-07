import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { LeadDetailResponse } from '@/shared/response';

import type {
  LeadUserAssignedInputDto,
  LeadUserAssignedOutputDto,
} from './dto';
import type { IrisProxyControllerConfig } from './iris-proxy.controller';
import type { AssignedByMapper } from './mappers';
import { IrisClient } from './webservice/iris.client';

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
        const priorityIndex = priorityOrder.indexOf(user.userClass);
        if (priorityIndex !== -1) {
          const highestPriorityIndex = highestPriorityUser
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

  public async leadAssignmentWebhook(
    payload: LeadUserAssignedInputDto
  ): Promise<LeadUserAssignedOutputDto> {
    try {
      const { lead } = payload.data;

      if (!lead.id) {
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
        assignedUsers,
        solutionConsultantPriority
      );
      let referralPartnerUser = this.findHighestPriorityUser(
        assignedUsers,
        referralPartnerPriority
      );
      const resellerUser = this.findHighestPriorityUser(
        assignedUsers,
        resellerPriority
      );
      const isvUser = this.findHighestPriorityUser(assignedUsers, isvPriority);

      if (!referralPartnerUser?.name) {
        try {
          const req = await this.client.get<LeadDetailResponse>(
            `/api/v1/leads/${lead.id}`
          );
          const source = req.data?.general?.source?.name;
          referralPartnerUser =
            source &&
            (source.includes('Referral Partner -') || source.includes('FI -'))
              ? { name: source }
              : null;
        } catch (error) {
          this.logger.error(error);
        }
      }

      this.logger.log({
        solutionConsultantUser,
        referralPartnerUser,
        resellerUser,
        isvUser,
      });

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
      throw new Error('Failed to update lead');
    }
  }
}
