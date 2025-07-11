import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { EmailService } from '@/api/shared/email/email.service';
import { EmailTemplateMessage } from '@/api/shared/email/email-template-message';
import { RiskRadarEmailTemplateRepository } from '@/finance-db/repositories/risk-radar-email-template.repository';
import { RiskRadarNotesRepository } from '@/finance-db/repositories/risk-radar-notes.repository';
import { RiskRadarUserRepository } from '@/finance-db/repositories/risk-radar-user.repository';
import { LeadRepository } from '@/iris-db/repositories';
import { LeadsBusinessInformationRepository } from '@/iris-db/repositories/leads-business-information.repository';

import type { SendExceptionMemoEmailDto } from './dtos/send-exception-memo-email.dto';

function convertToHtmlEmailBody(text: string) {
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const paragraphs = escapedText
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`);

  return paragraphs.join('\n');
}

@Injectable()
export class RiskRadarService {
  public constructor(
    private readonly riskRadarUserRepository: RiskRadarUserRepository,
    private readonly riskRadarEmailTemplateRepository: RiskRadarEmailTemplateRepository,
    private readonly leadsBusinessInfoRepository: LeadsBusinessInformationRepository,
    private readonly leadsRepository: LeadRepository,
    private readonly riskRadarNotesRepository: RiskRadarNotesRepository,
    private readonly emailService: EmailService,
    @InjectPinoLogger(RiskRadarService.name) private readonly logger: Logger
  ) {}

  public async sendExceptionMemoEmail(
    params: SendExceptionMemoEmailDto
  ): Promise<string> {
    const { mid, emailBody, emailTemplateId, emailRecipient, user, email } =
      params;
    const midAsVarchar = String(mid);

    // Find data
    const lead = await this.leadsRepository.findOneBy({
      irisMId: midAsVarchar,
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
      const emailTemplate = new EmailTemplateMessage(
        [emailRecipient],
        subject,
        'risk-radar-memo',
        {
          description: convertToHtmlEmailBody(emailBody),
        }
      );
      emailTemplate.cc = [email];
      emailTemplate.sender = 'taluspay_donotreply_rr@taluspay.com';
      await this.emailService.send(emailTemplate);

      // Record the action in notes - using explicit cast for MID
      await this.riskRadarNotesRepository.insert({
        notesTypeId: 1,
        mid: midAsVarchar,
        notes: `Sent an email to ${emailRecipient} titled ${subject}`,
        userCreated: user,
      });

      const sentMessage = `Sent email to '${emailRecipient}' titled ${subject}`;
      this.logger.info({ message: sentMessage } as const);
      return sentMessage;
    } catch (error: unknown) {
      this.logger.error({ error } as const, 'Failed to send email');
      throw new BadRequestException('Failed to send email');
    }
  }
}
