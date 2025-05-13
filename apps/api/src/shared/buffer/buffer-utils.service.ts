import type { Readable } from 'node:stream';

import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class BufferUtilsService {
  public constructor(
    @InjectPinoLogger(BufferUtilsService.name)
    private readonly logger: PinoLogger
  ) {}

  public async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => {
        this.logger.error('[Buffer]: Failed to convert stream to buffer');
        this.logger.error(err);
        reject(err);
      });
    });
  }
}
