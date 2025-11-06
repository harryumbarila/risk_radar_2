import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AttributionUrlService } from './attribution-url.service';
import {
  GenerateAttributionTokenDto,
  GenerateAttributionTokenResponseDto,
} from './dto/generate-attribution-token.dto';

@ApiTags('Attribution URL')
@Controller('attribution-url')
@ApiBearerAuth('session-token')
export class AttributionUrlController {
  private readonly logger = new Logger(AttributionUrlController.name);

  public constructor(
    private readonly attributionUrlService: AttributionUrlService
  ) {}

  @Post('generate-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'GenerateAttributionToken',
    summary: 'Generate JWT token for attribution URL',
    description:
      'Generates a signed JWT token containing attribution data for creating attribution URLs',
  })
  @ApiResponse({
    status: 200,
    description: 'JWT token generated successfully',
    type: GenerateAttributionTokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  public generateAttributionToken(
    @Body() payload: GenerateAttributionTokenDto
  ): GenerateAttributionTokenResponseDto {
    this.logger.log(
      `Generating attribution token for user_id: ${payload.user_id}`
    );

    return this.attributionUrlService.generateAttributionToken(payload);
  }
}
