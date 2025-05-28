import { Injectable } from '@nestjs/common';

import { TsysFiuFileRepository } from '@/paya-db/repositories';

@Injectable()
export class PayaService {
  public constructor(
    private readonly tsysFiuFileRepository: TsysFiuFileRepository
  ) {}

  async listFiles() {
    return this.tsysFiuFileRepository.find();
  }
}
