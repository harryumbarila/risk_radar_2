import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosError, isAxiosError } from 'axios';
import { format } from 'date-fns';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { IrisClient } from '@/api/shared/module/iris/iris.client';
import { RiskRadarNotesRepository } from '@/finance-db/repositories/risk-radar-notes.repository';

import type { PushNoteToIrisInputDto } from './dto/push-note-to-iris-input.dto';
import { IsNull } from 'typeorm';

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
      where: { id: noteId, irisMemoRequestDate: null } as any,
    });

    if (!note) {
      throw new NotFoundException(`Note not found`);
    }

    // Format the date using the 109 format from SQL Server
    const stringFormattedDate = format(
      note.createdAt,
      'MMM dd yyyy hh:mm:ss.SSSaa'
    );

    const formattedNote = `Risk Radar Note: ${note.notes} - ${note.userCreated} - ${stringFormattedDate}`;

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
        { irisMemoRequestDate: () => 'GETDATE()' }
      );
    } catch (error) {
      // TODO: Find a reusable way to handle this
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new NotFoundException(`Merchant not found`);
        }

        if (error.response?.status === 400) {
          throw new BadRequestException(`Bad Request `);
        }

        if (error.response?.status === 401) {
          throw new UnauthorizedException(`Unauthorized`);
        }

        if (error.response?.status === 403) {
          throw new ForbiddenException(`Forbidden`);
        }
      }

      // Unknown error
      this.logger.error(error);
      throw new InternalServerErrorException(`Unknown error`);
    }

    return { success: true };
  }

  /**
   * Push a divert change note directly to IRIS
   * @param merchantId The merchant ID
   * @param isDiverted Whether the account was put on divert or removed from divert
   * @param username The username who made the change
   * @param noteId The ID of the created note
   * @returns Success object
   */
  public async pushDivertChangeToIris(
    merchantId: string,
    isDiverted: boolean,
    username: string,
    noteId: number
  ): Promise<unknown> {
    try {
      // Format the current date
      const now = new Date();
      const formattedDate = format(now, 'MM/dd/yyyy hh:mm:ss aa');

      // Create the note text with correct format
      const action = isDiverted
        ? 'Check Manual add to divert'
        : 'Uncheck Manual remove from divert';

      const formattedNote = `${action} via Risk Radar by ${username} on ${formattedDate}`;

      // Push to Iris
      await this.irisClient.post(`/api/v1/merchants/${merchantId}/memos`, {
        memos: [
          {
            text: formattedNote,
            is_visible: IrisMemoVisibility.No,
          },
        ],
      });

      // Update the note with IRIS memo request and fulfillment dates
      await this.riskRadarNotesRepository.update(
        { id: noteId },
        {
          irisMemoRequestDate: () => 'GETDATE()',
          irisMemoRequestFulfilledDate: () => 'GETDATE()',
        }
      );

      this.logger.info(
        { noteId, merchantId },
        'Updated divert note with IRIS memo dates'
      );

      this.logger.info(
        { merchantId, isDiverted, username },
        'Successfully pushed divert change note to IRIS'
      );

      return { success: true };
    } catch (error: unknown) {
      // Handle errors
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new NotFoundException(`Merchant not found`);
        }

        if (error.response?.status === 400) {
          throw new BadRequestException(`Bad Request`);
        }

        if (error.response?.status === 401) {
          throw new UnauthorizedException(`Unauthorized`);
        }

        if (error.response?.status === 403) {
          throw new ForbiddenException(`Forbidden`);
        }
      }

      // Unknown error
      this.logger.error(
        { merchantId, isDiverted, username, noteId, error },
        'Error pushing divert change note to IRIS'
      );
      throw new InternalServerErrorException(`Unknown error`);
    }
  }
}
