import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { RiskRadarNotesRepository } from '@/finance-db/repositories';
import { LeadsBusinessInformationRepository } from '@/finance-db/repositories/leads-business-information.repository';
import { RiskRadarEmailTemplateRepository } from '@/finance-db/repositories/risk-radar-email-template.repository';
import { RiskRadarUserRepository } from '@/finance-db/repositories/risk-radar-user.repository';
import { LeadsRepository } from '@/iris-db/repositories';

import type { SendExceptionMemoEmailDto } from './dtos/send-exception-memo-email.dto';

@Injectable()
export class RiskRadarService {
  public constructor(
    private readonly riskRadarUserRepository: RiskRadarUserRepository,
    private readonly riskRadarEmailTemplateRepository: RiskRadarEmailTemplateRepository,
    private readonly leadsBusinessInfoRepository: LeadsBusinessInformationRepository,
    private readonly leadsRepository: LeadsRepository,
    private readonly riskRadarNotesRepository: RiskRadarNotesRepository,

    @InjectPinoLogger(RiskRadarService.name) private readonly logger: Logger
  ) {}

  public async sendExceptionMemoEmail(params: SendExceptionMemoEmailDto) {
    const { mid, emailBody, emailTemplateId, emailRecipient, user } = params;

    // Find data
    const lead = await this.leadsRepository.findOneBy({
      id: +mid,
      isArchived: false,
    });

    const leadBusinessInfo = await this.leadsBusinessInfoRepository.findOneBy({
      leadId: lead.id,
    });

    const riskRadarUser = await this.riskRadarUserRepository.findOneBy({
      ntUserId: user,
      isHidden: false,
    });

    const template = await this.riskRadarEmailTemplateRepository.findOneBy({
      id: emailTemplateId,
    });

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
