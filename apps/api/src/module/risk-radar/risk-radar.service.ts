import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';
import { DataSource } from 'typeorm';

import { LeadRepository } from '@/iris-db/repositories';
import { LeadsBusinessInformationRepository } from '@/iris-db/repositories/leads-business-information.repository';
import { RiskRadarEmailTemplateRepository } from '@/finance-db/repositories/risk-radar-email-template.repository';
import { RiskRadarNotesRepository } from '@/finance-db/repositories/risk-radar-notes.repository';
import { RiskRadarUserRepository } from '@/finance-db/repositories/risk-radar-user.repository';

import type { SendExceptionMemoEmailDto } from './dtos/send-exception-memo-email.dto';

@Injectable()
export class RiskRadarService {
  public constructor(
    private readonly riskRadarUserRepository: RiskRadarUserRepository,
    private readonly riskRadarEmailTemplateRepository: RiskRadarEmailTemplateRepository,
    private readonly leadsBusinessInfoRepository: LeadsBusinessInformationRepository,
    private readonly leadsRepository: LeadRepository,
    private readonly riskRadarNotesRepository: RiskRadarNotesRepository,
    @InjectDataSource('finance') private readonly financeDataSource: DataSource,
    @InjectPinoLogger(RiskRadarService.name) private readonly logger: Logger
  ) {}

  public async sendExceptionMemoEmail(params: SendExceptionMemoEmailDto): Promise<string> {
    const { mid, emailBody, emailTemplateId, emailRecipient, user } = params;

    // Find data
    const lead = await this.leadsRepository.findOneBy({
      irisMId: String(mid),
      isArchived: false,
    });

    if (!lead) {
      throw new BadRequestException('Lead not found or is archived');
    }

    const leadBusinessInfo = await this.leadsBusinessInfoRepository.findOneBy({
      leadId: lead.id,
    });

    if (!leadBusinessInfo) {
      throw new BadRequestException('Lead Business Information not found');
    }

    const riskRadarUser = await this.riskRadarUserRepository.findOneBy({
      name: user,
      isHidden: false,
    });

    if (!riskRadarUser) {
      throw new BadRequestException('Risk Radar User not found or is hidden');
    }

    const template = await this.riskRadarEmailTemplateRepository.findOneBy({
      id: emailTemplateId,
    });

    if (!template) {
      throw new BadRequestException('Email Template not found');
    }

    // Prepare email
    const subject =
      `${template.templateName}: ${mid} ${leadBusinessInfo.dbaName}`.trim();
    const replyTo = `${riskRadarUser.ntUserId}@taluspay.com`.trim();

    // Validate before sending
    if (!replyTo || !emailRecipient || !subject || !emailBody) {
      throw new BadRequestException('Some fields are missing');
    }

    try {
      // Send email using sp_send_dbmail
      await this.financeDataSource.query(
        `EXEC msdb.dbo.sp_send_dbmail
          @profile_name = 'RISK',
          @recipients = @0,
          @copy_recipients = @1,
          @reply_to = @1,
          @subject = @2,
          @body = @3`,
        [emailRecipient, replyTo, subject, emailBody]
      );

      // Record the action in notes
      await this.riskRadarNotesRepository.insert({
        notesTypeId: 1,
        mid: mid.toString(),
        notes: `Sent an email to ${emailRecipient} titled ${subject}`,
        userCreated: user,
      });

      const sentMessage = `Sent email to '${emailRecipient}' titled ${subject}`;
      this.logger.info(sentMessage);
      return sentMessage;
    } catch (error) {
      this.logger.error({ error }, 'Failed to send email');
      throw new BadRequestException('Failed to send email');
    }
  }
}
