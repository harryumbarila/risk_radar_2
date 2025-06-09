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
  uploaderIp?: string;
  downloadedAt?: string;
  downloaderIp?: string;
  modifiedAt?: string;
  uploaderUserName?: string;
  downloaderUserName?: string;
};

export type CommissionFile = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fileId: number;
  fileMonth: Date;
  originalS3Key: string;
  summaryExcelS3Key?: string;
  contentHash: string;
  fileSizeBytes: number;
  recordCount: number;
  revenueTotal: number;
  expenseTotal: number;
  downloaderUserName?: string;
  uploaderUserName?: string;
  variantType?: string;
  s3DirectoryPath?: string;
  contentsHash?: string;
  uploaderIp?: string;
  downloadedAt?: Date;
  downloaderIp?: string;
  modifiedAt?: Date;
};

export type TsysFiuFileResponse = PaginationResponse<TsysFiuFile>;
export type CommissionFileResponse = PaginationResponse<CommissionFile>;
