import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../models';

@Entity({ name: 'paya_monthly_residual_metadata' })
export class PayaMonthlyResidualMetadata extends BaseEntity {
  @Column({ name: 'file_id' })
  public fileId: number;

  @Column({ name: 'file_month', type: 'date' })
  public fileMonth: Date;

  @Column({ name: 'original_s3_key' })
  public originalS3Key: string;

  @Column({ name: 'summary_excel_s3_key', nullable: true })
  public summaryExcelS3Key?: string;

  @Column({ name: 'content_hash' })
  public contentHash: string;

  @Column({ name: 'file_size_bytes', type: 'bigint' })
  public fileSizeBytes: number;

  @Column({ name: 'record_count', type: 'int' })
  public recordCount: number;

  @Column({ name: 'revenue_total', type: 'decimal', precision: 10, scale: 2 })
  public revenueTotal: number;

  @Column({ name: 'expense_total', type: 'decimal', precision: 10, scale: 2 })
  public expenseTotal: number;

  // Download tracking fields (based on the existing pattern)
  @Column({ name: 'downloader_user_name', nullable: true })
  public downloaderUserName?: string;

  @Column({ name: 'uploader_user_name', nullable: true })
  public uploaderUserName?: string;

  @Column({ name: 'variant_type', nullable: true })
  public variantType?: string;

  @Column({ name: 's3_directory_path', nullable: true })
  public s3DirectoryPath?: string;

  @Column({ name: 'contents_hash', nullable: true })
  public contentsHash?: string;

  @Column({ name: 'uploader_ip', type: 'inet', nullable: true })
  public uploaderIp?: string;

  @Column({ name: 'downloaded_at', type: 'timestamptz', nullable: true })
  public downloadedAt?: Date;

  @Column({ name: 'downloader_ip', type: 'inet', nullable: true })
  public downloaderIp?: string;

  @Column({ name: 'modified_at', type: 'timestamptz', nullable: true })
  public modifiedAt?: Date;
} 