import { OmitType } from '@nestjs/swagger';

import { S3PaginationInput } from '@/api/shared/aws/dto/s3.dto';

export class ListInvoiceInputDto extends OmitType(S3PaginationInput, [
  'bucketName',
]) {}
