import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { 
  MerchantExceptionDetailRequestDto, 
  MerchantExceptionDetailResponseDto 
} from '../dtos/merchant-exception-detail.dto';
import { MerchantExceptionDetailService } from '../services/merchant-exception-detail.service';

@ApiTags('Risk Radar')
@Controller('risk-radar')
export class MerchantExceptionDetailController {
  public constructor(
    private readonly merchantExceptionDetailService: MerchantExceptionDetailService
  ) {}

  @Post('merchant-exception-detail')
  @ApiOperation({ summary: 'Get merchant exception details' })
  @ApiResponse({
    status: 200,
    description: 'Returns merchant exception details',
    type: MerchantExceptionDetailResponseDto,
  })
  public async getMerchantExceptionDetail(
    @Body() request: MerchantExceptionDetailRequestDto
  ): Promise<MerchantExceptionDetailResponseDto> {
    return this.merchantExceptionDetailService.getMerchantExceptionDetail(request);
  }
} 