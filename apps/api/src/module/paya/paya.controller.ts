import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@/api/shared/auth/decorator/public.decorator';

import { PayaService } from './services/tsys-fiu/tsys-fiu.service';

@ApiTags('paya')
@Controller('v1/paya')
export class PayaController {
  public constructor(private readonly payaService: PayaService) {}

  @Get('/test')
  @Public()
  async listFiles() {
    return this.payaService.listFiles();
  }
}
