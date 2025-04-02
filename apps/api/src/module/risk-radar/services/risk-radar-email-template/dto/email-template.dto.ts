import { ApiProperty } from '@nestjs/swagger';

export class EmailTemplateDto {
  @ApiProperty({
    description: 'Email template ID',
    example: 1,
  })
  public id: number;

  @ApiProperty({
    description: 'Email template name',
    example: 'Risk Alert Template',
  })
  public templateName: string;
}

export class EmailTemplatesResponseDto {
  @ApiProperty({
    description: 'List of active email templates',
    type: [EmailTemplateDto],
    isArray: true,
  })
  public templates: EmailTemplateDto[];
}
