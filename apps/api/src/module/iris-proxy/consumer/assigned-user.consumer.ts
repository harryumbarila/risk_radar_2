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

import { LeadUserAssignedInputDto } from '@/api/module/iris-proxy/dto';
import { AssignedByMapper } from '@/api/module/iris-proxy/mappers';
import { IrisClient } from '@/api/shared/module/iris/iris.client';
import {
  AssignedUser,
  LeadDetailResponse,
  LeadUsersAssignedResponse,
} from '@/shared/response';
import { isAxiosError } from 'axios';
import { LeadDataFields, LeadDataTab } from '../enums/lead-data.enum';
import { IrisEnv } from '@/api/shared/constanst/iris';
import { extractMappedValues } from '@/api/utils/extract-iris-field';

@Processor('assigned-users')
export class AssignedUsersConsumer extends WorkerHost {
  private readonly logger = new Logger(AssignedUsersConsumer.name);
  private leadIds$ = new Subject<number>();
  private windowsMS = 60_000;
  private subscription: Subscription; // Track the subscription

  constructor(
    private readonly client: IrisClient,
    private readonly configService: ConfigService
  ) {
    super();

    this.subscription = this.leadIds$
      .pipe(
        bufferTime(this.windowsMS),
        debounceTime(this.windowsMS),
        filter((batch) => batch.length > 0),
        map((jobIds) => [...new Set(jobIds)]),
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
          this.logger.error('Error in leadIds$ observable chain:', error);
        },
      });
  }

  // Add cleanup method
  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Shutting down with signal: ${signal}`);
    this.subscription.unsubscribe();
    this.leadIds$.complete();
  }

  onModuleDestroy() {
    this.logger.log('Module destroying - cleaning up subscriptions');
    this.subscription.unsubscribe();
    this.leadIds$.complete();
  }

  async processLeadAssignment(leadIds: number[]) {
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

      for (const leadId of leadIds) {
        const [assignedUsersReq, leadReq] = await Promise.all([
          this.client.get<LeadUsersAssignedResponse>(
            `/api/v1/leads/${leadId}/users`
          ),
          this.client.get<LeadDetailResponse>(`/api/v1/leads/${leadId}`),
        ]);
        const assignedUsers = assignedUsersReq.data.data;

        // Find the highest priority user for each category
        const solutionConsultantUser = this.findHighestPriorityUserIrisApi(
          assignedUsers || [],
          solutionConsultantPriority
        );
        let referralPartnerUser = this.findHighestPriorityUserIrisApi(
          assignedUsers || [],
          referralPartnerPriority
        );
        const resellerUser = this.findHighestPriorityUserIrisApi(
          assignedUsers || [],
          resellerPriority
        );
        const isvUser = this.findHighestPriorityUserIrisApi(
          assignedUsers || [],
          isvPriority
        );

        // If the referral partner is not found in the assigned users, try to fetch it from the lead details and get from the source
        if (!referralPartnerUser?.full_name) {
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
        const currentEnv = this.configService.get<IrisEnv>(
          'IRIS_ENV',
          'production'
        );

        const leadDataFieldIds = LeadDataTab[currentEnv];

        const leadDataTab = leadReq.data.details.find(
          (d) => d.id === leadDataFieldIds[LeadDataFields.ID]
        );

        const fields = leadDataTab?.fields || [];

        const { SolutionConsultant, ReferralPartner, Reseller, ISV } =
          extractMappedValues(
            fields,
            'id',
            [
              leadDataFieldIds[LeadDataFields.SolutionConsultant],
              leadDataFieldIds[LeadDataFields.ReferralPartner],
              leadDataFieldIds[LeadDataFields.Reseller],
              leadDataFieldIds[LeadDataFields.ISV],
            ],
            ['SolutionConsultant', 'ReferralPartner', 'Reseller', 'ISV']
          );

        // Prepare new values
        const newSolutionConsultant = solutionConsultantUser?.full_name || '';
        const newReferralPartner = referralPartnerUser?.full_name || '';
        const newReseller = resellerUser?.full_name || '';
        const newISV = isvUser?.full_name || '';

        const fieldsToUpdate = [
          {
            id: leadDataFieldIds[LeadDataFields.SolutionConsultant],
            value: newSolutionConsultant,
            changed: SolutionConsultant !== newSolutionConsultant,
          },
          {
            id: leadDataFieldIds[LeadDataFields.ReferralPartner],
            value: newReferralPartner,
            changed: ReferralPartner !== newReferralPartner,
          },
          {
            id: leadDataFieldIds[LeadDataFields.Reseller],
            value: newReseller,
            changed: Reseller !== newReseller,
          },
          {
            id: leadDataFieldIds[LeadDataFields.ISV],
            value: newISV,
            changed: ISV !== newISV,
          },
        ]
          .filter((field) => field.changed)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(({ changed, ...field }) => field);

        // If no fields to update, skip the PATCH request
        if (fieldsToUpdate.length === 0) {
          this.logger.log(
            JSON.stringify({
              msg: 'lead-assigned-webhook',
              status: `no changes detected for lead ${leadId}, skipping update`,
              currentValues: {
                SolutionConsultant,
                ReferralPartner,
                Reseller,
                ISV,
              },
              newValues: {
                SolutionConsultant: newSolutionConsultant,
                ReferralPartner: newReferralPartner,
                Reseller: newReseller,
                ISV: newISV,
              },
            })
          );
          continue;
        }

        this.logger.log(
          JSON.stringify({
            msg: 'lead-assigned-webhook',
            fieldsToUpdate: fieldsToUpdate,
            fieldsCount: fieldsToUpdate.length,
          })
        );

        await this.client.patch(`/api/v1/leads/${leadId}`, {
          fields: fieldsToUpdate,
        });

        this.logger.log(
          JSON.stringify({
            msg: 'lead-assigned-webhook',
            status: `finished for lead ${leadId}`,
            changesApplied: true,
            updatedFieldsCount: fieldsToUpdate.length,
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
    if (!this.leadIds$.closed) {
      this.leadIds$.next(job.data.data.lead.id);
    } else {
      this.logger.error('leadIds$ subject is closed, cannot process job');
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

  public findHighestPriorityUserIrisApi = (
    users: AssignedUser[],
    priorityOrder: string[]
  ): AssignedUser | undefined => {
    return users.reduce<AssignedUser | undefined>(
      (highestPriorityUser, user) => {
        if (!user?.class || !user?.id) return highestPriorityUser;

        const priorityIndex = priorityOrder.indexOf(user.class);
        if (priorityIndex !== -1) {
          const highestPriorityIndex = highestPriorityUser?.class
            ? priorityOrder.indexOf(highestPriorityUser.class)
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

  public async getLeadSource(leadId: number): Promise<AssignedUser | null> {
    try {
      const req = await this.client.get<LeadDetailResponse>(
        `/api/v1/leads/${leadId}`
      );
      const source = req.data?.general?.source?.name;
      const keywords = ['Referral Partner -', 'FI -'];

      return source && keywords.some((keyword) => source.includes(keyword))
        ? { full_name: source }
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
