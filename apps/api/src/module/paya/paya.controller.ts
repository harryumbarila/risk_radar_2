import { File, FileInterceptor } from '@nest-lab/fastify-multer';
import {
  Body,
  Controller,
  Get,
  Ip,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '@/api/shared/auth/decorator/public.decorator';

import { TsysFiuFileUploadDto } from './services/tsys-fiu/dto/file-upload.dto';
import {
  ListTsysPaginationInput,
  ListTsysPaginationOutput,
} from './services/tsys-fiu/dto/list-tsys-fiu.dto';
import { PayaService } from './services/tsys-fiu/tsys-fiu.service';

@ApiTags('paya')
@Controller('v1/paya')
export class PayaController {
  public constructor(private readonly payaService: PayaService) {}

  @ApiResponse({
    status: 200,
    type: ListTsysPaginationOutput,
    description: 'The tsys fiu files and variants',
  })
  @ApiOperation({
    operationId: 'paya',
    summary: 'Retrieve tsys fiu files and variants',
  })
  @Get('tsys-fiu')
  @Public()
  public async listFiles(
    @Query() query: ListTsysPaginationInput
  ): Promise<ListTsysPaginationOutput> {
    return this.payaService.listFiles(query);
  }

  @ApiResponse({
    status: 200,
    description: 'The invoices from aws',
  })
  @ApiOperation({
    operationId: 'paya-tsys-fiu-url',
    summary: 'Retrieve tsys fiu files variant url from s3',
  })
  @Get('download-url')
  public async getDownloadUrl(@Query('id') id: string, @Ip() ip: string) {
    return this.payaService.getDownloadUrl(id, ip);
  }

  @Patch('file')
  @ApiResponse({
    status: 200,
    description: 'Uploads a single file',
  })
  @ApiOperation({ summary: 'Uploads a single file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile() file: File,
    @Body() body: TsysFiuFileUploadDto,
    @Ip() ip: string
  ) {
    return this.payaService.uploadFile({ ...body, file, ip });
  }
}
