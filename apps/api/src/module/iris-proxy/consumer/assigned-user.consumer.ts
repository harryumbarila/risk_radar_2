import { Logger } from '@nestjs/common';

import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

import { Job } from 'bullmq';
import {
  bufferTime,
  catchError,
  debounceTime,
  filter,
  from,
  map,
  of,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';

import {
  LeadUserAssignedInputDto,
  LeadUserAssignedSource,
} from '@/api/module/iris-proxy/dto';
import { AssignedByMapper } from '@/api/module/iris-proxy/mappers';
import { IrisClient } from '@/api/shared/module/iris/iris.client';
import { LeadDetailResponse } from '@/shared/response';
import { isAxiosError } from 'axios';

@Processor('assigned-users')
export class AssignedUsersConsumer extends WorkerHost {
  private readonly logger = new Logger(AssignedUsersConsumer.name);
  private update$ = new Subject<LeadUserAssignedInputDto>();
  private windowsMS = 60_000;
  private subscription: Subscription; // Track the subscription

  constructor(
    private readonly client: IrisClient,
    private readonly configService: ConfigService
  ) {
    super();

    this.subscription = this.update$
      .pipe(
        bufferTime(this.windowsMS),
        debounceTime(this.windowsMS),
        filter((batch) => batch.length > 0),
        map((batch) => {
          this.logger.log(`Processing batch of ${batch.length} jobs`);

          const grouped: Record<string, AssignedByMapper[]> = {};

          for (const curr of batch) {
            const { data } = curr;
            const leadId = data.lead.id;

            if (!grouped[leadId]) {
              grouped[leadId] = [];
            }

            grouped[leadId].push(...data.lead.assignedUsers);
          }
          this.logger.log(`Grouped into ${Object.keys(grouped).length} leads`);

          return grouped;
        }),
        switchMap((mergedData) =>
          from(this.processLeadAssignment(mergedData)).pipe(
            catchError((error) => {
              this.logger.error('Error in processLeadAssignment:', error);
              return of(null);
            })
          )
        )
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.logger.log('Batch processing completed successfully');
          }
        },
        error: (error) => {
          this.logger.error('Error in update$ observable chain:', error);
        },
      });
  }

  // Add cleanup method
  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Shutting down with signal: ${signal}`);
    this.subscription.unsubscribe();
    this.update$.complete();
  }

  onModuleDestroy() {
    this.logger.log('Module destroying - cleaning up subscriptions');
    this.subscription.unsubscribe();
    this.update$.complete();
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
          JSON.stringify(
            {
              msg: 'lead-assigned-webhook',
              leadId,
              solutionConsultantUser,
              referralPartnerUser,
              resellerUser,
              isvUser,
            },
            null,
            2
          )
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
        this.logger.log(
          JSON.stringify({
            msg: 'lead-assigned-webhook',
            status: `finished for lead ${leadId}`,
          })
        );
      }

      return { success: true };
    } catch (error) {
      this.logger.error(error);
      return { success: false };
    }
  }

  async process(job: Job<LeadUserAssignedInputDto>): Promise<void> {
    this.logger.log(
      JSON.stringify({
        msg: 'lead-assigned-webhook',
        status: `started for lead ${job?.data?.data?.lead?.id}`,
        ...job.data,
      })
    );
    if (!this.update$.closed) {
      this.update$.next(job.data);
    } else {
      this.logger.error('update$ subject is closed, cannot process job');
      throw new Error('Processor is shutting down');
    }
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

  @OnWorkerEvent('failed')
  async onFailed(job: Job<LeadUserAssignedInputDto>, err: Error) {
    const leadId = job?.data?.data?.lead?.id;

    this.logger.error(`❌ ${leadId} ${Object.keys(job.id)} failed:`, {
      error: err?.message,
    });

    if (isAxiosError(err)) {
      this.logger.error(`❌ ${leadId} ${Object.keys(job.id)} failed:`, {
        response: err?.response.data,
      });
    }
  }
}
