import { Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import {
  LeadRepository,
  LeadsBusinessInformationRepository,
} from '@/iris-db/repositories';

// Define an interface for the query result
type MerchantIdResult = {
  irisMId: string;
};

@Injectable()
export class MerchantWithSameTaxIdService {
  public constructor(
    private readonly leadRepository: LeadRepository,
    private readonly leadsBusinessInfoRepository: LeadsBusinessInformationRepository,
    @InjectPinoLogger(MerchantWithSameTaxIdService.name)
    private readonly logger: Logger
  ) {}

  /**
   * Get all merchants that have the same Tax ID as the provided merchant ID
   * @param merchantId The merchant ID to check
   * @returns Array of merchant IDs with the same Tax ID
   */
  public async getMerchantsWithSameTaxId(
    merchantId: string
  ): Promise<{ merchantIds: string[] }> {
    this.logger.info(
      `Fetching merchants with same Tax ID for merchant: ${merchantId}`
    );

    try {
      // Step 1: Find the lead by merchantId using the optimized method with explicit varchar casting
      const lead = await this.leadRepository.findByMerchantId(merchantId);

      if (!lead || !lead.id) {
        this.logger.info(`No lead found for merchant ID: ${merchantId}`);
        return { merchantIds: [] };
      }

      // Step 2: Find the business information for this lead to get the tax ID
      const businessInfo = await this.leadsBusinessInfoRepository.findOne({
        where: { leadId: lead.id },
      });

      if (!businessInfo || !businessInfo.federalTaxId) {
        this.logger.info(`No tax ID found for merchant ID: ${merchantId}`);
        return { merchantIds: [] };
      }

      const taxId = businessInfo.federalTaxId;

      this.logger.info(
        `Tax ID found for merchant ID: ${merchantId} - ${taxId}`
      );

      // Use parameterized query with explicit CAST for all string parameters
      const query = `
        SELECT DISTINCT l.IrisMId as irisMId
        FROM Iris.dbo.Leads l
        INNER JOIN Iris.dbo.LeadsBusinessInformation info ON info.LeadId = l.Id
        WHERE info.FederalTaxId = CAST(@0 AS varchar(20))
          AND l.IrisMId != CAST(@1 AS varchar(16))
          AND DATALENGTH(l.IrisMId) > 5
        ORDER BY l.IrisMId
      `;

      // Cast the result to the defined interface, using parameterized query
      const queryResults = (await this.leadRepository.query(query, [
        taxId,
        merchantId,
      ])) as MerchantIdResult[];

      // Extract merchant IDs from the result
      const merchantIds = queryResults.map((result) => result.irisMId);

      return { merchantIds };
    } catch (error) {
      this.logger.error(error, 'Error fetching merchants with same tax ID');
      return { merchantIds: [] };
    }
  }
}
