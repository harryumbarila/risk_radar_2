import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { IrisClient } from '@/api/module/iris-proxy/webservice/iris.client';
import { RiskRadarNotesRepository } from '@/finance-db/repositories/risk-radar-notes.repository';

import type { PushNoteToIrisInputDto } from './dto/push-note-to-iris-input.dto';

@Injectable()
export class PushNoteToIrisService {
  public constructor(
    @InjectPinoLogger(PushNoteToIrisService.name)
    private readonly logger: Logger,
    private readonly irisClient: IrisClient,
    private readonly riskRadarNotesRepository: RiskRadarNotesRepository
  ) {}

  public async pushNoteToIris(input: PushNoteToIrisInputDto): Promise<void> {
    const { note, merchantId } = input;

    // Format the date using the 109 format from SQL Server
    const stringFormattedDate = format(
      new Date(),
      'MMM dd yyyy hh:mm:ss.SSSaa'
    );
    const formattedNote = `Risk Radar Note: ${note} - ${merchantId} - ${stringFormattedDate}`;

    await this.irisClient.post(`api/v1/merchants/${merchantId}/memos`, {
      text: formattedNote,
      is_visible: true,
    });

    // await this.riskRadarNotesRepository.update(
    //   {
    //     pkRiskRadarNotes: id,
    //   },
    //   {
    //     note: formattedNote,
    //     createdBy: 'Risk Radar',
    //     createdAt: new Date(),
    //   }
    // );
  }
}
