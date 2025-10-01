import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

import { Job } from 'bullmq';
import { bufferTime, debounceTime, filter, map, Subject } from 'rxjs';

import {
  LeadUserAssignedInputDto,
  LeadUserAssignedSource,
} from '@/api/module/iris-proxy/dto';
import { AssignedByMapper } from '@/api/module/iris-proxy/mappers';
import { IrisClient } from '@/api/shared/module/iris/iris.client';
import { LeadDetailResponse } from '@/shared/response';

@Processor('assigned-users')
export class AssignedUsersConsumer extends WorkerHost {
  private readonly logger = new Logger(AssignedUsersConsumer.name);
  private update$ = new Subject<LeadUserAssignedInputDto>();
  private windowsMS = 1_000;

  constructor(
    private readonly client: IrisClient,
    private readonly configService: ConfigService
  ) {
    super();

    this.update$
      .pipe(
        bufferTime(this.windowsMS),
        debounceTime(this.windowsMS),
        filter((batch) => batch.length > 0),
        map((batch) => {
          const grouped: Record<string, AssignedByMapper[]> = {};

          for (const curr of batch) {
            const { data } = curr;

            const leadId = data.lead.id;

            if (!grouped[leadId]) {
              grouped[leadId] = [];
            }

            grouped[leadId].push(...data.lead.assignedUsers);
          }

          return grouped;
        })
      )
      .subscribe(async (mergedData) => {
        await this.processLeadAssignment(mergedData);
      });
  }
  async processLeadAssignment(mergedData: Record<string, AssignedByMapper[]>) {
    try {
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

      for (const [leadId, assignedUsers] of Object.entries(mergedData)) {
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
          referralPartnerUser = (await this.getLeadSource(leadId)) || undefined;
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

        await this.client.patch(`/api/v1/leads/${leadId}`, {
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
      }
      return { success: true };
    } catch (error) {
      this.logger.error(error);
      return { success: false };
    }
  }

  async process(job: Job<LeadUserAssignedInputDto>): Promise<void> {
    this.logger.log(job.data);
    this.update$.next(job.data);
  }

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
    leadId: string
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
}
