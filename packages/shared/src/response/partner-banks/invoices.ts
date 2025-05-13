export interface InvoiceResponseDto {
  objects: File[];
  folders: string[];
  nextContinuationToken: string;
  isTruncated: boolean;
  currentPrefix: string;
}

export interface File {
  Key: string;
  LastModified: Date;
  ETag: string;
  ChecksumAlgorithm: string[];
  ChecksumType: string;
  Size: number;
  StorageClass: string;
}

export interface InvoiceUrlResponseDto {
  key: string;
  url: string;
  expiresAt: Date;
}

/**
 * Represents a merchant billing record from MSP monthly billing
 */
export interface MSPMerchantBillingRecord {
  /** Primary key */
  pk: number;
  /** Unique merchant identifier in Iris system */
  IrisMId: string;

  /** Merchant name in Iris system */
  DBAName: string;

  /** Merchant Contact name in Iris system */
  ContactName: string;

  /** Merchant Contact email in Iris system */
  ContactEmailAddress: string;

  /** Generated invoice number in format MSP-{number} */
  InvoiceNumber: string;

  /** Legal business name of the merchant */
  LegalName: string;

  /** Full name of the business owner */
  sOwner: string;

  /** Legal business address */
  LegalAddress: string;

  /** City for legal address */
  LegalCity: string;

  /** State for legal address (2-letter code) */
  LegalState: string;

  /** ZIP code for legal address */
  LegalZIP: string;

  /** Monthly sales volume amount */
  dMMFSalesVolume: number;

  /** Billing rate applied (decimal format) */
  dMMFRate: number;

  /** Calculated billed amount (dMMFSalesVolume * dMMFRate) */
  dMMFBilledAmt: number;
}
