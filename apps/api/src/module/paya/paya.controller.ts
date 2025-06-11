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

import { CommissionService } from './services/commission/commission.service';
import { CommissionFileUploadDto } from './services/commission/dto/file-upload.dto';
import { GetCommissionFileDownloadDto } from './services/commission/dto/get-download.dto';
import {
  ListCommissionPaginationInput,
  ListCommissionPaginationOutput,
} from './services/commission/dto/list-commission.dto';
import { TsysFiuFileUploadDto } from './services/tsys-fiu/dto/file-upload.dto';
import { GetTsysFiuFileDownloadDto } from './services/tsys-fiu/dto/get-download.dto';
import {
  ListTsysPaginationInput,
  ListTsysPaginationOutput,
} from './services/tsys-fiu/dto/list-tsys-fiu.dto';
import { PayaService } from './services/tsys-fiu/tsys-fiu.service';

@ApiTags('paya')
@Controller('v1/paya')
export class PayaController {
  public constructor(
    private readonly payaService: PayaService,
    private readonly commissionService: CommissionService
  ) {}

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
    type: ListCommissionPaginationOutput,
    description: 'The commission files and variants',
  })
  @ApiOperation({
    operationId: 'residual',
    summary: 'Retrieve commission files and variants',
  })
  @Get('residual')
  @Public()
  public async listCommissionFiles(
    @Query() query: ListCommissionPaginationInput
  ): Promise<ListCommissionPaginationOutput> {
    return this.commissionService.listFiles(query);
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
  public async getDownloadUrl(@Query() input: GetTsysFiuFileDownloadDto) {
    return this.payaService.getDownloadUrl(input);
  }

  @ApiResponse({
    status: 200,
    description: 'The commission file url from aws',
  })
  @ApiOperation({
    operationId: 'residual-url',
    summary: 'Retrieve commission files variant url from s3',
  })
  @Get('residual-download-url')
  public async getCommissionDownloadUrl(
    @Query() input: GetCommissionFileDownloadDto
  ) {
    return this.commissionService.getDownloadUrl(input);
  }

  @Patch('file')
  @ApiResponse({
    status: 200,
    description: 'Uploads a single file',
  })
  @ApiOperation({ summary: 'Uploads a single file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
      },
    })
  )
  public async uploadFile(
    @UploadedFile() file: File,
    @Body() body: TsysFiuFileUploadDto
  ) {
    return this.payaService.uploadFile({ ...body, file });
  }

  @Patch('residual-file')
  @ApiResponse({
    status: 200,
    description: 'Uploads a single commission file',
  })
  @ApiOperation({ summary: 'Uploads a single commission file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadCommissionFile(
    @UploadedFile() file: File,
    @Body() body: CommissionFileUploadDto,
    @Ip() ip: string
  ) {
    return this.commissionService.uploadFile({ ...body, file, ip });
  }
}
