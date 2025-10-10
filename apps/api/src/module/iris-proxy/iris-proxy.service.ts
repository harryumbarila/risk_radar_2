import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';
import { Queue } from 'bullmq';

import type { LeadDetailResponse } from '@/shared/response';
import type { IrisBasicInfoResponseDto } from '@/shared/response/iris-proxy';

import { IrisClient } from '@/api/shared/module/iris/iris.client';
import { extractMappedValues } from '@/api/utils/extract-iris-field';
import { IrisEnv } from '@/api/shared/constanst/iris';

import { LeadStatusFields, LeadStatusTab } from './enums/lead-status.enum';
import {
  EquipmentFormFields,
  EquipmentFormTab,
} from './enums/equipment-form.enum';

import { parseCurrency } from '@/api/utils/number';

import type {
  LeadUserAssignedInputDto,
  LeadUserAssignedOutputDto,
  LeadStatusUpdatedInputDto,
} from './dto';

@Injectable()
export class IrisProxyService {
  private readonly logger = new Logger(IrisProxyService.name);

  public constructor(
    private readonly client: IrisClient,
    @InjectQueue('assigned-users') private readonly assignedQueue: Queue,
    private readonly configService: ConfigService
  ) {}

  public async leadAssignmentWebhook(
    payload: LeadUserAssignedInputDto
  ): Promise<LeadUserAssignedOutputDto> {
    try {
      await this.assignedQueue.add('assigned-users', payload);
      return { success: true };
    } catch (error) {
      this.logger.error(error);
      return { success: false };
    }
  }

  // Helper function to check if values are different
  shouldUpdateField(newValue: number, existingValue: string | null): boolean {
    const parsedExisting = existingValue ? parseCurrency(existingValue) : 0;
    return Math.abs(newValue - parsedExisting) > 0.001; // Using epsilon for floating point comparison
  }

  public async leadEquipmentWebhook(payload: LeadStatusUpdatedInputDto) {
    try {
      const leadId = payload.data.lead.id;

      this.logger.log(
        JSON.stringify({
          msg: 'lead-equipment-webhook',
          status: `started for lead ${leadId}`,
          payload,
        })
      );

      const currentEnv = this.configService.get<IrisEnv>(
        'IRIS_ENV',
        'production'
      );

      const req = await this.client.get<LeadDetailResponse>(
        `/api/v1/leads/${leadId}`
      );
      const leadStatusTab = LeadStatusTab[currentEnv];

      const status = req.data.general?.status?.id;

      if (status !== leadStatusTab[LeadStatusFields.PROSPECTING]) {
        return { success: true };
      }

      const equipmentFieldIds = EquipmentFormTab[currentEnv];

      const equipmentFormTab = req.data.details.find(
        (d) => d.id === equipmentFieldIds[EquipmentFormFields.ID]
      );

      if (!equipmentFormTab) return;

      // Extract all fields including the existing totals
      const extractedFields = extractMappedValues(
        equipmentFormTab.fields,
        'id',
        [
          equipmentFieldIds[EquipmentFormFields.FDEquipment1],
          equipmentFieldIds[EquipmentFormFields.TSYSEquipment1],
          equipmentFieldIds[EquipmentFormFields.PurchasePrice1],
          equipmentFieldIds[EquipmentFormFields.QuantityP1],
          equipmentFieldIds[EquipmentFormFields.RentalPrice1],
          equipmentFieldIds[EquipmentFormFields.QuantityR1],
          equipmentFieldIds[EquipmentFormFields.PurchaseTotal1],
          equipmentFieldIds[EquipmentFormFields.RentalTotal1],
          equipmentFieldIds[EquipmentFormFields.FDEquipment2],
          equipmentFieldIds[EquipmentFormFields.TSYSEquipment2],
          equipmentFieldIds[EquipmentFormFields.PurchasePrice2],
          equipmentFieldIds[EquipmentFormFields.QuantityP2],
          equipmentFieldIds[EquipmentFormFields.RentalPrice2],
          equipmentFieldIds[EquipmentFormFields.QuantityR2],
          equipmentFieldIds[EquipmentFormFields.PurchaseTotal2],
          equipmentFieldIds[EquipmentFormFields.RentalTotal2],
          equipmentFieldIds[EquipmentFormFields.FDEquipment3],
          equipmentFieldIds[EquipmentFormFields.TSYSEquipment3],
          equipmentFieldIds[EquipmentFormFields.PurchasePrice3],
          equipmentFieldIds[EquipmentFormFields.QuantityP3],
          equipmentFieldIds[EquipmentFormFields.RentalPrice3],
          equipmentFieldIds[EquipmentFormFields.QuantityR3],
          equipmentFieldIds[EquipmentFormFields.PurchaseTotal3],
          equipmentFieldIds[EquipmentFormFields.RentalTotal3],
          equipmentFieldIds[EquipmentFormFields.PurchaseTotal],
          equipmentFieldIds[EquipmentFormFields.MonthlyRentalTotal],
        ],
        [
          'FDEquipment1',
          'TSYSEquipment1',
          'PurchasePrice1',
          'QuantityP1',
          'RentalPrice1',
          'QuantityR1',
          'ExistingPurchaseTotal1',
          'ExistingRentalTotal1',
          'FDEquipment2',
          'TSYSEquipment2',
          'PurchasePrice2',
          'QuantityP2',
          'RentalPrice2',
          'QuantityR2',
          'ExistingPurchaseTotal2',
          'ExistingRentalTotal2',
          'FDEquipment3',
          'TSYSEquipment3',
          'PurchasePrice3',
          'QuantityP3',
          'RentalPrice3',
          'QuantityR3',
          'ExistingPurchaseTotal3',
          'ExistingRentalTotal3',
          'ExistingPurchaseTotal',
          'ExistingMonthlyRentalTotal',
        ]
      );

      const {
        FDEquipment1,
        TSYSEquipment1,
        PurchasePrice1,
        QuantityP1,
        RentalPrice1,
        QuantityR1,
        ExistingPurchaseTotal1,
        ExistingRentalTotal1,
        FDEquipment2,
        TSYSEquipment2,
        PurchasePrice2,
        QuantityP2,
        RentalPrice2,
        QuantityR2,
        ExistingPurchaseTotal2,
        ExistingRentalTotal2,
        FDEquipment3,
        TSYSEquipment3,
        PurchasePrice3,
        QuantityP3,
        RentalPrice3,
        QuantityR3,
        ExistingPurchaseTotal3,
        ExistingRentalTotal3,
        ExistingPurchaseTotal,
        ExistingMonthlyRentalTotal,
      } = extractedFields;

      this.logger.log(
        JSON.stringify({
          msg: 'lead-equipment-webhook',
          leadId,
          FDEquipment1,
          TSYSEquipment1,
          PurchasePrice1,
          QuantityP1,
          RentalPrice1,
          QuantityR1,
          ExistingPurchaseTotal1,
          ExistingRentalTotal1,
          FDEquipment2,
          TSYSEquipment2,
          PurchasePrice2,
          QuantityP2,
          RentalPrice2,
          QuantityR2,
          ExistingPurchaseTotal2,
          ExistingRentalTotal2,
          FDEquipment3,
          TSYSEquipment3,
          PurchasePrice3,
          QuantityP3,
          RentalPrice3,
          QuantityR3,
          ExistingPurchaseTotal3,
          ExistingRentalTotal3,
        })
      );

      let purchaseTotalSum = 0;
      let monthlyRentalTotalSum = 0;
      const updatedFields = [];

      // Terminal 1 calculations
      if (FDEquipment1 || TSYSEquipment1) {
        const quantityP1 = parseCurrency(QuantityP1 || '1') || 1;
        const quantityR1 = parseCurrency(QuantityR1 || '1') || 1;

        const purchaseTotal1 =
          parseCurrency(PurchasePrice1 || '0') * quantityP1;
        const rentalTotal1 = parseCurrency(RentalPrice1 || '0') * quantityR1;

        // Only update if values are different
        if (this.shouldUpdateField(rentalTotal1, ExistingRentalTotal1)) {
          updatedFields.push(
            {
              id: equipmentFieldIds[EquipmentFormFields.QuantityR1],
              value: quantityR1.toString(),
            },
            {
              id: equipmentFieldIds[EquipmentFormFields.RentalTotal1],
              value: rentalTotal1.toString(),
            }
          );
        }

        if (this.shouldUpdateField(purchaseTotal1, ExistingPurchaseTotal1)) {
          updatedFields.push(
            {
              id: equipmentFieldIds[EquipmentFormFields.QuantityP1],
              value: quantityP1.toString(),
            },
            {
              id: equipmentFieldIds[EquipmentFormFields.PurchaseTotal1],
              value: purchaseTotal1.toString(),
            }
          );
        }

        purchaseTotalSum += purchaseTotal1;
        monthlyRentalTotalSum += rentalTotal1;
      }

      // Terminal 2 calculations
      if (FDEquipment2 || TSYSEquipment2) {
        const quantityP2 = parseCurrency(QuantityP2 || '1') || 1;
        const quantityR2 = parseCurrency(QuantityR2 || '1') || 1;

        const purchaseTotal2 =
          parseCurrency(PurchasePrice2 || '0') * quantityP2;
        const rentalTotal2 = parseCurrency(RentalPrice2 || '0') * quantityR2;

        if (this.shouldUpdateField(rentalTotal2, ExistingRentalTotal2)) {
          updatedFields.push(
            {
              id: equipmentFieldIds[EquipmentFormFields.QuantityR2],
              value: quantityR2.toString(),
            },
            {
              id: equipmentFieldIds[EquipmentFormFields.RentalTotal2],
              value: rentalTotal2.toString(),
            }
          );
        }

        if (this.shouldUpdateField(purchaseTotal2, ExistingPurchaseTotal2)) {
          updatedFields.push(
            {
              id: equipmentFieldIds[EquipmentFormFields.QuantityP2],
              value: quantityP2.toString(),
            },
            {
              id: equipmentFieldIds[EquipmentFormFields.PurchaseTotal2],
              value: purchaseTotal2.toString(),
            }
          );
        }

        purchaseTotalSum += purchaseTotal2;
        monthlyRentalTotalSum += rentalTotal2;
      }

      // Terminal 3 calculations
      if (FDEquipment3 || TSYSEquipment3) {
        const quantityP3 = parseCurrency(QuantityP3 || '1') || 1;
        const quantityR3 = parseCurrency(QuantityR3 || '1') || 1;

        const purchaseTotal3 =
          parseCurrency(PurchasePrice3 || '0') * quantityP3;
        const rentalTotal3 = parseCurrency(RentalPrice3 || '0') * quantityR3;

        if (this.shouldUpdateField(rentalTotal3, ExistingRentalTotal3)) {
          updatedFields.push(
            {
              id: equipmentFieldIds[EquipmentFormFields.QuantityR3],
              value: quantityR3.toString(),
            },
            {
              id: equipmentFieldIds[EquipmentFormFields.RentalTotal3],
              value: rentalTotal3.toString(),
            }
          );
        }

        if (this.shouldUpdateField(purchaseTotal3, ExistingPurchaseTotal3)) {
          updatedFields.push(
            {
              id: equipmentFieldIds[EquipmentFormFields.QuantityP3],
              value: quantityP3.toString(),
            },
            {
              id: equipmentFieldIds[EquipmentFormFields.PurchaseTotal3],
              value: purchaseTotal3.toString(),
            }
          );
        }

        purchaseTotalSum += purchaseTotal3;
        monthlyRentalTotalSum += rentalTotal3;
      }

      if (this.shouldUpdateField(purchaseTotalSum, ExistingPurchaseTotal)) {
        updatedFields.push({
          id: equipmentFieldIds[EquipmentFormFields.PurchaseTotal],
          value: purchaseTotalSum.toString(),
        });
      }

      if (
        this.shouldUpdateField(
          monthlyRentalTotalSum,
          ExistingMonthlyRentalTotal
        )
      ) {
        updatedFields.push({
          id: equipmentFieldIds[EquipmentFormFields.MonthlyRentalTotal],
          value: monthlyRentalTotalSum.toString(),
        });
      }

      this.logger.log(
        JSON.stringify({
          msg: 'lead-equipment-webhook',
          updatedFieldsCount: updatedFields.length,
          updatedFields,
        })
      );

      if (updatedFields.length > 0) {
        await this.client.patch(`/api/v1/leads/${leadId}`, {
          fields: updatedFields,
        });

        this.logger.log(
          JSON.stringify({
            msg: 'lead-equipment-webhook',
            status: `updated ${updatedFields.length} fields for lead ${leadId}`,
          })
        );
      } else {
        this.logger.log(
          JSON.stringify({
            msg: 'lead-equipment-webhook',
            status: `no updates needed for lead ${leadId}`,
          })
        );
      }

      return { success: true };
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getLeadBasicInfo(
    leadId: number
  ): Promise<IrisBasicInfoResponseDto> {
    try {
      const { data } = await this.client.get<LeadDetailResponse>(
        `/api/v1/leads/${leadId}`
      );

      const dbaName =
        data.details
          .find((detail) => detail.name === 'Business Information')
          ?.fields.find((field) => field.field === 'DBA Name')?.value || '';

      const contactPhone =
        data.details
          .find((detail) => detail.name === 'Business Information')
          ?.fields.find((field) => field.field === 'Contact Phone Number')
          ?.value || '';

      const contactEmail =
        data.details
          .find((detail) => detail.name === 'Business Information')
          ?.fields.find((field) => field.field === 'Contact Email Address')
          ?.value || '';

      return { dbaName, contactPhone, contactEmail };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          `Failed to get lead: ${error.message}.`,
          error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      this.logger.error(error);

      throw new HttpException(
        `Failed to get lead: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
