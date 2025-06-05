import type { PaginationResponse } from '@/shared/common/pagination';

export type TsysFiuFile = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fileName: string;
  variants: TsysFiuFileVariant[];
};

export type TsysFiuFileVariant = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fileId: string;
  variantType: string;
  s3DirectoryPath: string;
  contentsHash: string;
  validHash: boolean;
  uploaderIp?: string;
  downloadedAt?: string;
  downloaderIp?: string;
  modifiedAt?: string;
  uploaderUserName?: string;
  downloaderUserName?: string;
};

export type TsysFiuFileResponse = PaginationResponse<TsysFiuFile>;
