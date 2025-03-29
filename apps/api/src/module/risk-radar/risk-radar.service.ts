import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { RiskRadarEmailTemplateRepository } from '@/finance-db/repositories/risk-radar-email-template.repository';
import { RiskRadarUserRepository } from '@/finance-db/repositories/risk-radar-user.repository';
import { LeadRepository } from '@/iris-db/repositories';
import { LeadsBusinessInformationRepository } from '@/iris-db/repositories/leads-business-information.repository';

import type { SendExceptionMemoEmailDto } from './dtos/send-exception-memo-email.dto';

@Injectable()
export class RiskRadarService {
  public constructor(
    private readonly riskRadarUserRepository: RiskRadarUserRepository,
    private readonly riskRadarEmailTemplateRepository: RiskRadarEmailTemplateRepository,
    private readonly leadsBusinessInfoRepository: LeadsBusinessInformationRepository,
    private readonly leadsRepository: LeadRepository,
    // private readonly riskRadarNotesRepository: RiskRadarNotesRepository,

    @InjectPinoLogger(RiskRadarService.name) private readonly logger: Logger
  ) {}

  public async sendExceptionMemoEmail(params: SendExceptionMemoEmailDto) {
    const { mid, emailBody, emailTemplateId, emailRecipient, user } = params;

    // Find data
    const lead = await this.leadsRepository.findOneBy({
      id: mid,
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
      ntUserId: user,
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

    // Send email
    const sentMessage = `Sent email to '${emailRecipient}' titled ${subject}`;

    // TODO: Use email service to send email and uncomment
    // await this.riskRadarNotesRepository.insert({
    //   notesTypeId: 1,
    //   mid,
    //   notes: sentMessage,
    //   userCreated: user,
    // });

    this.logger.info(sentMessage);

    return sentMessage;
  }
}
