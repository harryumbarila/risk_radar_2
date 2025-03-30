import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MerchantExceptionDetailRequestDto {
  @ApiProperty({
    description: 'Risk Radar Exception ID',
    example: 12345,
  })
  @IsNotEmpty()
  @IsNumber()
  public pkRiskRadarExceptions: number;

  @ApiProperty({
    description: 'Merchant ID',
    example: '1234567890123456',
  })
  @IsNotEmpty()
  @IsString()
  public sMID: string;

  @ApiProperty({
    description: 'User making the request',
    example: 'johndoe',
  })
  @IsNotEmpty()
  @IsString()
  public sUser: string;
}

export class MerchantOwnerDto {
  @ApiProperty({
    description: 'Owner name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Last 4 digits of SSN',
    example: '1234',
  })
  ssn4: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '01/01/1980',
  })
  dob: string;

  @ApiProperty({
    description: 'Owner code',
    example: '99999999999',
  })
  ownerCode: string;
}

export class MerchantProcessingSummaryDto {
  @ApiProperty({
    description: 'Year',
    example: 2023,
  })
  year: number;

  @ApiProperty({
    description: 'Month abbreviation',
    example: 'Jan',
  })
  month: string;

  @ApiProperty({
    description: 'Volume',
    example: 10000.00,
  })
  volume: number;

  @ApiProperty({
    description: 'Average ticket',
    example: 150.00,
  })
  averageTicket: number;

  @ApiProperty({
    description: 'Swiped percentage',
    example: 85,
  })
  swipedPercentage: number;

  @ApiProperty({
    description: 'Highest ticket',
    example: 500.00,
  })
  highestTicket: number;

  @ApiProperty({
    description: 'Total chargebacks amount',
    example: 250.00,
  })
  chargebackAmount: number;

  @ApiProperty({
    description: 'Visa chargeback percentage',
    example: 40,
  })
  visaChargebackPercentage: number;

  @ApiProperty({
    description: 'Mastercard chargeback percentage',
    example: 30,
  })
  mastercardChargebackPercentage: number;

  @ApiProperty({
    description: 'Discover chargeback percentage',
    example: 20,
  })
  discoverChargebackPercentage: number;

  @ApiProperty({
    description: 'Amex chargeback percentage',
    example: 10,
  })
  amexChargebackPercentage: number;
}

export class ExceptionTypeDto {
  @ApiProperty({
    description: 'Exception type ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Exception description',
    example: 'High risk transaction',
  })
  description: string;
}

export class MerchantBusinessInfoDto {
  @ApiProperty({
    description: 'DBA Name',
    example: 'Acme Corp',
  })
  dbaName: string;

  @ApiProperty({
    description: 'DBA Address',
    example: '123 Main St',
  })
  dbaAddress: string;

  @ApiProperty({
    description: 'DBA City',
    example: 'New York',
  })
  dbaCity: string;

  @ApiProperty({
    description: 'DBA State',
    example: 'NY',
  })
  dbaState: string;

  @ApiProperty({
    description: 'DBA Zip',
    example: '10001',
  })
  dbaZip: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '555-123-4567',
  })
  contactPhoneNumber: string;

  @ApiProperty({
    description: 'DBA fax',
    example: '555-123-4568',
  })
  dbaFax: string;

  @ApiProperty({
    description: 'Contact email',
    example: 'contact@acme.com',
  })
  contactEmail: string;

  @ApiProperty({
    description: 'Website',
    example: 'www.acme.com',
  })
  website: string;

  @ApiProperty({
    description: 'Legal name',
    example: 'Acme Corporation Inc.',
  })
  legalName: string;

  @ApiProperty({
    description: 'Legal address',
    example: '456 Business Ave',
  })
  legalAddress: string;

  @ApiProperty({
    description: 'Legal city',
    example: 'New York',
  })
  legalCity: string;

  @ApiProperty({
    description: 'Legal state',
    example: 'NY',
  })
  legalState: string;

  @ApiProperty({
    description: 'Legal zip',
    example: '10002',
  })
  legalZip: string;

  @ApiProperty({
    description: 'Ownership type',
    example: 'Corporation',
  })
  ownershipType: string;

  @ApiProperty({
    description: 'MCC code with description',
    example: '5411 (Grocery Stores)',
  })
  mccCode: string;

  @ApiProperty({
    description: 'Self-generated',
    example: 'Yes',
  })
  selfGenerated: string;

  @ApiProperty({
    description: 'Business type',
    example: 'Retail',
  })
  businessType: string;

  @ApiProperty({
    description: 'Activated date',
    example: '2023-01-01T00:00:00.000Z',
  })
  activatedDate: Date | null;

  @ApiProperty({
    description: 'Monthly volume',
    example: 100000,
  })
  monthlyVolume: number;

  @ApiProperty({
    description: 'Average ticket',
    example: 150,
  })
  averageTicket: number;

  @ApiProperty({
    description: 'Swiped percentage',
    example: 85,
  })
  swipedPercentage: number;

  @ApiProperty({
    description: 'Chargeback count',
    example: 5,
  })
  chargebackCount: number;

  @ApiProperty({
    description: 'IRR count',
    example: 2,
  })
  irrCount: number;

  @ApiProperty({
    description: 'Divert flag',
    example: true,
  })
  isDivert: boolean;

  @ApiProperty({
    description: 'Preferred contact',
    example: 'Email',
  })
  preferredContact: string;

  @ApiProperty({
    description: 'Exception status ID',
    example: 1,
  })
  exceptionStatusId: number;

  @ApiProperty({
    description: 'Has cash advance',
    example: 'Yes',
  })
  hasCashAdvance: string;

  @ApiProperty({
    description: 'Risk watch',
    example: true,
  })
  isRiskWatch: boolean;

  @ApiProperty({
    description: 'Net settlement balance',
    example: 5000.00,
  })
  netSettlementBalance: number;

  @ApiProperty({
    description: 'Swiped percentage based on transaction count for current month',
    example: 83,
  })
  swipedPercentageTransCount: number;

  @ApiProperty({
    description: 'Channel',
    example: 'Retail',
  })
  channel: string;

  @ApiProperty({
    description: 'ISA',
    example: 'John Smith',
  })
  isa: string;

  @ApiProperty({
    description: 'Average monthly sales volume',
    example: 95000,
  })
  averageMonthlySalesVolume: number;

  @ApiProperty({
    description: 'Store front swiped percentage',
    example: 78,
  })
  storeFrontSwiped: number;

  @ApiProperty({
    description: 'Auto hold white label',
    example: false,
  })
  isAutoHoldWhiteLabel: boolean;

  @ApiProperty({
    description: 'Highest ticket amount',
    example: 750,
  })
  highestTicket: number;

  @ApiProperty({
    description: 'Whether risk can edit UW new account hold',
    example: true,
  })
  uwNewAccountHoldAllowRiskToEdit: boolean;

  @ApiProperty({
    description: 'Reseller',
    example: 'ABC Reseller',
  })
  reseller: string;

  @ApiProperty({
    description: 'Referral partner',
    example: 'XYZ Partner',
  })
  referralPartner: string;

  @ApiProperty({
    description: 'TalusPay account indicator',
    example: 'Yes',
  })
  talusPayAccountIndicator: string;

  @ApiProperty({
    description: 'ISV',
    example: 'ISV Provider',
  })
  isv: string;
}

export class MerchantExceptionDetailResponseDto {
  @ApiProperty({
    description: 'Merchant business information',
    type: MerchantBusinessInfoDto,
  })
  businessInfo: MerchantBusinessInfoDto;

  @ApiProperty({
    description: 'Merchant owners',
    type: [MerchantOwnerDto],
  })
  owners: MerchantOwnerDto[];

  @ApiProperty({
    description: 'Monthly processing summaries',
    type: [MerchantProcessingSummaryDto],
  })
  processingSummaries: MerchantProcessingSummaryDto[];

  @ApiProperty({
    description: 'Exception types',
    type: [ExceptionTypeDto],
  })
  exceptionTypes: ExceptionTypeDto[];
} 