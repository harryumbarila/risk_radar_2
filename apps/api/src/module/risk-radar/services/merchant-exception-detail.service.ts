import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';
import { DataSource, Not, IsNull } from 'typeorm';

import { LeadRepository, LeadsBusinessInformationRepository, LeadsServicesRepository, LeadsUnderwritingRepository, LeadsFinancialProfileRepository, SourceRepository, LeadsOwnerRepository, PartnerAndSalesAgentIdentificationRepository } from '@/iris-db/repositories';
import { MerchantExceptionDetailRepository, RiskRadarExceptionsJeffRepository, RiskRadarMerchAdjParamRepository } from '@/finance-db/repositories';
import { MonthlyProcessingSummary, MerchantInfo } from '@/finance-db/repositories/merchant-exception-detail.repository';

import {
  MerchantExceptionDetailRequestDto,
  MerchantExceptionDetailResponseDto,
  MerchantBusinessInfoDto,
  MerchantOwnerDto,
  MerchantProcessingSummaryDto,
  ExceptionTypeDto,
} from '../dtos/merchant-exception-detail.dto';

@Injectable()
export class MerchantExceptionDetailService {
  public constructor(
    private readonly leadRepository: LeadRepository,
    private readonly leadsBusinessInfoRepository: LeadsBusinessInformationRepository,
    private readonly leadsServicesRepository: LeadsServicesRepository,
    private readonly leadsUnderwritingRepository: LeadsUnderwritingRepository,
    private readonly leadsFinancialProfileRepository: LeadsFinancialProfileRepository,
    private readonly sourceRepository: SourceRepository,
    private readonly leadsOwnerRepository: LeadsOwnerRepository,
    private readonly partnerRepository: PartnerAndSalesAgentIdentificationRepository,
    private readonly merchantExceptionDetailRepository: MerchantExceptionDetailRepository,
    private readonly riskRadarExceptionsRepository: RiskRadarExceptionsJeffRepository,
    private readonly riskRadarMerchAdjParamRepository: RiskRadarMerchAdjParamRepository,
    
    @InjectDataSource('iris') 
    private readonly irisDataSource: DataSource,
    
    @InjectDataSource('finance') 
    private readonly financeDataSource: DataSource,

    @InjectPinoLogger(MerchantExceptionDetailService.name)
    private readonly logger: Logger
  ) {}

  public async getMerchantExceptionDetail(
    request: MerchantExceptionDetailRequestDto
  ): Promise<MerchantExceptionDetailResponseDto> {
    const { pkRiskRadarExceptions, sMID, sUser } = request;

    // Log the request
    this.logger.info(
      {
        exceptionId: pkRiskRadarExceptions,
        mid: sMID,
        user: sUser,
      },
      'Getting merchant exception details'
    );

    // Find the exception
    const exception = await this.riskRadarExceptionsRepository.findOne({
      where: { id: pkRiskRadarExceptions },
    });

    this.logger.info(
        {
          exceptionId: pkRiskRadarExceptions,
          mid: sMID,
          user: sUser,
        },
        'Getting chargebacks count'
      );
    // Get chargebacks count
    const chargebacks = await this.merchantExceptionDetailRepository.getChargebacksCount(sMID);

    this.logger.info(
        {
          exceptionId: pkRiskRadarExceptions,
          mid: sMID,
          user: sUser,
        },
        'Getting UW New Account Hold allow risk to edit'
      );
    const uwNewAccountHoldQuery = await this.irisDataSource.query(`
      SELECT 1 
      FROM Iris.dbo.SubscriptionQueueRequestEventJsonSource 
      WHERE irisMId = @0
        AND dtUW_NewAccountHold_OnDivertCapturedInTalusDB IS NOT NULL
        AND dtUW_NewAccountHold_OffDivertCapturedInTalusDB IS NULL
    `, [sMID]);
    const uwNewAccountHoldAllowRiskToEdit = !uwNewAccountHoldQuery.length;

    // Get lead information
    const lead = await this.leadRepository.findOne({
      where: { irisMId: sMID, isArchived: false },
    });

    if (!lead) {
      throw new Error(`Lead not found for MID: ${sMID}`);
    }

    // Get business information
    const businessInfo = await this.leadsBusinessInfoRepository.findOne({
      where: { leadId: lead.id },
    });

    // Get partner and sales agent identification
    const partnerAndSalesAgent = await this.partnerRepository.findOne({
      where: { mid: sMID },
    });

    // Get lead services
    const services = await this.leadsServicesRepository.findOne({
      where: { leadId: lead.id },
    });

    // Get underwriting information
    const underwriting = await this.leadsUnderwritingRepository.findOne({
      where: { leadId: lead.id },
    });

    // Get financial profile
    const financialProfile = await this.leadsFinancialProfileRepository.findOne({
      where: { leadId: lead.id },
    });

    // Get source
    const source = await this.sourceRepository.findOne({
      where: { id: lead.sourceId },
    });

    // Get merchant adjust parameters
    const merchAdjParam = await this.riskRadarMerchAdjParamRepository.findOne({
      where: { mid: sMID },
    });

    // Get owners
    const owners = await this.leadsOwnerRepository.find({
      where: { leadId: lead.id },
      order: {
        authorizedSigner: 'DESC',
        managerController: 'DESC',
      },
    });

    // Get processing summaries
    const processingSummaries = await this.merchantExceptionDetailRepository.getMonthlyProcessingSummary(sMID);

    // Get exception types
    const exceptionTypes = await this.merchantExceptionDetailRepository.getExceptionTypes();

    // Build response
    const response: MerchantExceptionDetailResponseDto = {
      businessInfo: this.buildBusinessInfo(
        businessInfo,
        partnerAndSalesAgent,
        services,
        underwriting,
        financialProfile,
        source,
        merchAdjParam,
        chargebacks,
        exception,
        uwNewAccountHoldAllowRiskToEdit
      ),
      owners: this.buildOwners(owners),
      processingSummaries: this.mapProcessingSummaries(processingSummaries),
      exceptionTypes: exceptionTypes.map((et) => ({
        id: et.id,
        description: et.description || '',
      })),
    };

    return response;
  }

  /**
   * Maps the MonthlyProcessingSummary to the expected DTO format
   */
  private mapProcessingSummaries(summaries: MonthlyProcessingSummary[]): MerchantProcessingSummaryDto[] {
    return summaries.map(summary => ({
      year: summary.year,
      month: summary.month,
      volume: summary.volume,
      averageTicket: summary.averageTicket,
      swipedPercentage: summary.swipedPercentageBasedOnTransCount,
      highestTicket: summary.highestTicket,
      chargebackAmount: summary.totalChargebacks,
      totalChargebacks: summary.totalChargebacks,
      visaChargebackPercentage: summary.visaChargebackPercentage,
      mastercardChargebackPercentage: summary.mastercardChargebackPercentage,
      discoverChargebackPercentage: summary.discoverChargebackPercentage,
      amexChargebackPercentage: summary.amexChargebackPercentage,
    }));
  }

  private buildBusinessInfo(
    businessInfo: any,
    partnerAndSalesAgent: any,
    services: any,
    underwriting: any,
    financialProfile: any,
    source: any,
    merchAdjParam: any,
    chargebacks: { chg: number; irr: number },
    exception: any,
    uwNewAccountHoldAllowRiskToEdit: boolean
  ): MerchantBusinessInfoDto {
    const businessInfoDto: MerchantBusinessInfoDto = {
      dbaName: businessInfo?.dbaName || '',
      dbaAddress: businessInfo?.dbaAddress || '',
      dbaCity: businessInfo?.dbaCity || '',
      dbaState: businessInfo?.dbaState || '',
      dbaZip: businessInfo?.dbaZip || '',
      contactPhoneNumber: businessInfo?.contactPhoneNumber || '',
      dbaFax: businessInfo?.dbaLocationFax || '',
      contactEmail: businessInfo?.contactEmailAddress || '',
      website: businessInfo?.website || '',
      legalName: businessInfo?.legalName || '',
      legalAddress: businessInfo?.legalAddress || '',
      legalCity: businessInfo?.legalCity || '',
      legalState: businessInfo?.legalState || '',
      legalZip: businessInfo?.legalZip || '',
      ownershipType: businessInfo?.ownershipType || '',
      mccCode: businessInfo?.mccCode
        ? `${businessInfo.mccCode}${
            businessInfo.mccDescription
              ? ` (${businessInfo.mccDescription})`
              : ''
          }`
        : '',
      selfGenerated:
        source?.sourceName === 'Self-Sourced' ? 'Yes' : 'No',
      businessType: businessInfo?.businessType || '',
      activatedDate: null,
      monthlyVolume: merchAdjParam?.monthlyVolumeCalcMonthly || 0,
      averageTicket: merchAdjParam?.averageTicketCalcMonthly || 0,
      swipedPercentage: merchAdjParam?.swipePercentCalcMonthly || 0,
      chargebackCount: chargebacks.chg || 0,
      irrCount: chargebacks.irr || 0,
      isDivert: merchAdjParam?.isDiverted || false,
      preferredContact: merchAdjParam?.preferredContact || '',
      exceptionStatusId: exception?.exceptionStatusId || 0,
      hasCashAdvance: services?.merchantCashAdvance === 'No' ? 'No' : 'Yes',
      isRiskWatch: merchAdjParam?.isRiskWatch || false,
      netSettlementBalance: 0, // This would come from a cross-database query
      swipedPercentageTransCount: 0, // This would be calculated from transaction data
      channel: partnerAndSalesAgent?.channel || '',
      isa: partnerAndSalesAgent?.solutionConsultant || '',
      averageMonthlySalesVolume: underwriting?.averageMonthlySalesVolume || 0,
      storeFrontSwiped: financialProfile?.storeFrontSwiped || 0,
      isAutoHoldWhiteLabel: merchAdjParam?.isAutoHoldWhiteLabel || false,
      highestTicket: underwriting?.highestTicketSizeAmount || 0,
      uwNewAccountHoldAllowRiskToEdit,
      reseller: partnerAndSalesAgent?.reseller || '',
      referralPartner: partnerAndSalesAgent?.referralPartner || '',
      talusPayAccountIndicator: services?.talusPayApp ? 'Yes' : '',
      isv: partnerAndSalesAgent?.isv || '',
    };

    return businessInfoDto;
  }

  private buildOwners(owners: any[]): MerchantOwnerDto[] {
    return owners.map((owner) => ({
      name: `${owner.firstName || ''} ${owner.lastName || ''}`.trim(),
      ssn4: owner.socialSecurityNumber 
        ? owner.socialSecurityNumber.slice(-4) 
        : '',
      dob: owner.dob 
        ? this.formatDate(owner.dob) 
        : '',
      ownerCode: '99999999999', // Default owner code as per stored procedure
    }));
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  }
} 