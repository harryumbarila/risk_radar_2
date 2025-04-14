import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { IrisClient } from '@/api/shared/module/iris/iris.client';
import { RiskRadarNotesRepository } from '@/finance-db/repositories/risk-radar-notes.repository';

import type { PushNoteToIrisInputDto } from './dto/push-note-to-iris-input.dto';

export enum IrisMemoVisibility {
  Yes = 'Yes',
  No = 'No',
}
@Injectable()
export class PushNoteToIrisService {
  public constructor(
    @InjectPinoLogger(PushNoteToIrisService.name)
    private readonly logger: Logger,
    private readonly irisClient: IrisClient,
    private readonly riskRadarNotesRepository: RiskRadarNotesRepository
  ) {}

  public async pushNoteToIris(input: PushNoteToIrisInputDto): Promise<unknown> {
    const { merchantId, noteId } = input;

    // Get & format note
    const note = await this.riskRadarNotesRepository.findOne({
      where: { id: noteId, irisMemoRequestDate: null },
    });

    if (!note) {
      throw new NotFoundException(`Note not found`);
    }

    // Format the date using the 109 format from SQL Server
    const stringFormattedDate = format(
      new Date(),
      'MMM dd yyyy hh:mm:ss.SSSaa'
    );

    const formattedNote = `Risk Radar Note: ${note.notes} - ${merchantId} - ${stringFormattedDate}`;

    try {
      // Push to Iris
      await this.irisClient.post(`/api/v1/merchants/${merchantId}/memos`, {
        memos: [
          {
            text: formattedNote,
            is_visible: IrisMemoVisibility.No,
          },
        ],
      });

      // Save to DB
      await this.riskRadarNotesRepository.update(
        {
          id: Number(noteId),
        },
        { irisMemoRequestDate: new Date() }
      );
    } catch (error) {
      // TODO: Find a reusable way to handle this
      if (error instanceof AxiosError) {
        if (error.response.status === 404) {
          throw new NotFoundException(`Merchant not found`);
        }

        if (error.response.status === 400) {
          throw new BadRequestException(`Bad Request `);
        }

        if (error.response.status === 401) {
          throw new UnauthorizedException(`Unauthorized`);
        }

        if (error.response.status === 403) {
          throw new ForbiddenException(`Forbidden`);
        }
      }

      // Unknown error
      this.logger.error(error);
      throw new InternalServerErrorException(`Unknown error`);
    }

    return { success: true };
  }
}
