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
  public name: string;

  @ApiProperty({
    description: 'Last 4 digits of SSN',
    example: '1234',
  })
  public ssn4: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '01/01/1980',
  })
  public dob: string;

  @ApiProperty({
    description: 'Owner code',
    example: '99999999999',
  })
  public ownerCode: string;
}

export class MerchantProcessingSummaryDto {
  @ApiProperty({
    description: 'Year',
    example: 2023,
  })
  public year: number;

  @ApiProperty({
    description: 'Month abbreviation',
    example: 'Jan',
  })
  public month: string;

  @ApiProperty({
    description: 'Volume',
    example: 10000.0,
  })
  public volume: number;

  @ApiProperty({
    description: 'Average ticket',
    example: 150.0,
  })
  public averageTicket: number;

  @ApiProperty({
    description: 'Swiped percentage',
    example: 85,
  })
  public swipedPercentage: number;

  @ApiProperty({
    description: 'Highest ticket',
    example: 500.0,
  })
  public highestTicket: number;

  @ApiProperty({
    description: 'Total chargebacks amount',
    example: 250.0,
  })
  public chargebackAmount: number;

  @ApiProperty({
    description: 'Visa chargeback percentage',
    example: 40,
  })
  public visaChargebackPercentage: number;

  @ApiProperty({
    description: 'Mastercard chargeback percentage',
    example: 30,
  })
  public mastercardChargebackPercentage: number;

  @ApiProperty({
    description: 'Discover chargeback percentage',
    example: 20,
  })
  public discoverChargebackPercentage: number;

  @ApiProperty({
    description: 'Amex chargeback percentage',
    example: 10,
  })
  public amexChargebackPercentage: number;
}

export class ExceptionTypeDto {
  @ApiProperty({
    description: 'Exception type ID',
    example: 1,
  })
  public id: number;

  @ApiProperty({
    description: 'Exception description',
    example: 'High risk transaction',
  })
  public description: string;
}

export class MerchantBusinessInfoDto {
  @ApiProperty({
    description: 'DBA Name',
    example: 'Acme Corp',
  })
  public dbaName: string;

  @ApiProperty({
    description: 'DBA Address',
    example: '123 Main St',
  })
  public dbaAddress: string;

  @ApiProperty({
    description: 'DBA City',
    example: 'New York',
  })
  public dbaCity: string;

  @ApiProperty({
    description: 'DBA State',
    example: 'NY',
  })
  public dbaState: string;

  @ApiProperty({
    description: 'DBA Zip',
    example: '10001',
  })
  public dbaZip: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '555-123-4567',
  })
  public contactPhoneNumber: string;

  @ApiProperty({
    description: 'DBA fax',
    example: '555-123-4568',
  })
  public dbaFax: string;

  @ApiProperty({
    description: 'Contact email',
    example: 'contact@acme.com',
  })
  public contactEmail: string;

  @ApiProperty({
    description: 'Website',
    example: 'www.acme.com',
  })
  public website: string;

  @ApiProperty({
    description: 'Legal name',
    example: 'Acme Corporation Inc.',
  })
  public legalName: string;

  @ApiProperty({
    description: 'Legal address',
    example: '456 Business Ave',
  })
  public legalAddress: string;

  @ApiProperty({
    description: 'Legal city',
    example: 'New York',
  })
  public legalCity: string;

  @ApiProperty({
    description: 'Legal state',
    example: 'NY',
  })
  public legalState: string;

  @ApiProperty({
    description: 'Legal zip',
    example: '10002',
  })
  public legalZip: string;

  @ApiProperty({
    description: 'Ownership type',
    example: 'Corporation',
  })
  public ownershipType: string;

  @ApiProperty({
    description: 'MCC code with description',
    example: '5411 (Grocery Stores)',
  })
  public mccCode: string;

  @ApiProperty({
    description: 'Self-generated',
    example: 'Yes',
  })
  public selfGenerated: string;

  @ApiProperty({
    description: 'Business type',
    example: 'Retail',
  })
  public businessType: string;

  @ApiProperty({
    description: 'Activated date',
    example: '2023-01-01T00:00:00.000Z',
  })
  public activatedDate: Date | null;

  @ApiProperty({
    description: 'Monthly volume',
    example: 100000,
  })
  public monthlyVolume: number;

  @ApiProperty({
    description: 'Average ticket',
    example: 150,
  })
  public averageTicket: number;

  @ApiProperty({
    description: 'Swiped percentage',
    example: 85,
  })
  public swipedPercentage: number;

  @ApiProperty({
    description: 'Chargeback count',
    example: 5,
  })
  public chargebackCount: number;

  @ApiProperty({
    description: 'IRR count',
    example: 2,
  })
  public irrCount: number;

  @ApiProperty({
    description: 'Divert flag',
    example: true,
  })
  public isDivert: boolean;

  @ApiProperty({
    description: 'Preferred contact',
    example: 'Email',
  })
  public preferredContact: string;

  @ApiProperty({
    description: 'Exception status ID',
    example: 1,
  })
  public exceptionStatusId: number;

  @ApiProperty({
    description: 'Has cash advance',
    example: 'Yes',
  })
  public hasCashAdvance: string;

  @ApiProperty({
    description: 'Risk watch',
    example: true,
  })
  public isRiskWatch: boolean;

  @ApiProperty({
    description: 'Net settlement balance',
    example: 5000.0,
  })
  public netSettlementBalance: number;

  @ApiProperty({
    description:
      'Swiped percentage based on transaction count for current month',
    example: 83,
  })
  public swipedPercentageTransCount: number;

  @ApiProperty({
    description: 'Channel',
    example: 'Retail',
  })
  public channel: string;

  @ApiProperty({
    description: 'ISA',
    example: 'John Smith',
  })
  public isa: string;

  @ApiProperty({
    description: 'Average monthly sales volume',
    example: 95000,
  })
  public averageMonthlySalesVolume: number;

  @ApiProperty({
    description: 'Store front swiped percentage',
    example: 78,
  })
  public storeFrontSwiped: number;

  @ApiProperty({
    description: 'Auto hold white label',
    example: false,
  })
  public isAutoHoldWhiteLabel: boolean;

  @ApiProperty({
    description: 'Highest ticket amount',
    example: 750,
  })
  public highestTicket: number;

  @ApiProperty({
    description: 'Whether risk can edit UW new account hold',
    example: true,
  })
  public uwNewAccountHoldAllowRiskToEdit: boolean;

  @ApiProperty({
    description: 'Reseller',
    example: 'ABC Reseller',
  })
  public reseller: string;

  @ApiProperty({
    description: 'Referral partner',
    example: 'XYZ Partner',
  })
  public referralPartner: string;

  @ApiProperty({
    description: 'TalusPay account indicator',
    example: 'Yes',
  })
  public talusPayAccountIndicator: string;

  @ApiProperty({
    description: 'ISV',
    example: 'ISV Provider',
  })
  public isv: string;
}

export class MerchantExceptionDetailResponseDto {
  @ApiProperty({
    description: 'Merchant business information',
    type: MerchantBusinessInfoDto,
  })
  public businessInfo: MerchantBusinessInfoDto;

  @ApiProperty({
    description: 'Merchant owners',
    type: [MerchantOwnerDto],
    isArray: true,
  })
  public owners: MerchantOwnerDto[];

  @ApiProperty({
    description: 'Monthly processing summaries',
    type: [MerchantProcessingSummaryDto],
    isArray: true,
  })
  public processingSummaries: MerchantProcessingSummaryDto[];

  @ApiProperty({
    description: 'Exception types',
    type: [ExceptionTypeDto],
    isArray: true,
  })
  public exceptionTypes: ExceptionTypeDto[];
}
