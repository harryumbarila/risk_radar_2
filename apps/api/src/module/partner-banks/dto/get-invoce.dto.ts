import { S3PaginationInput } from '@/api/shared/aws/dto/s3.dto';
import { OmitType } from '@nestjs/swagger';

export class ListInvoiceInputDto extends OmitType(S3PaginationInput, [
  'bucketName',
]) {}
