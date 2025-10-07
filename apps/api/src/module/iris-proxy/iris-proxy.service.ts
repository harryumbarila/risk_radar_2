import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import axios from 'axios';
import { Queue } from 'bullmq';

import { IrisClient } from '@/api/shared/module/iris/iris.client';
import type { LeadDetailResponse } from '@/shared/response';
import type { IrisBasicInfoResponseDto } from '@/shared/response/iris-proxy';

import type {
  LeadUserAssignedInputDto,
  LeadUserAssignedOutputDto,
} from './dto';
import { LeadStatusUpdatedInputDto } from './dto/lead-status-updated.dto';
import { extractMappedValues } from '@/api/utils/extract-iris-field';
import {
  EquipmentFormFields,
  EquipmentFormTab,
} from './enums/equipment-form.enum';
import { IrisEnv } from '@/api/shared/constanst/iris';
import { ConfigService } from '@nestjs/config';
import { parseCurrency } from '@/api/utils/number';

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

      const currentEnv = this.configService.get<IrisEnv>('IRIS_ENV', 'prod');

      const req = await this.client.get<LeadDetailResponse>(
        `/api/v1/leads/${leadId}`
      );
      const equipmentFieldIds = EquipmentFormTab[currentEnv];

      const equipmentFormTab = req.data.details.find(
        (d) => d.id === equipmentFieldIds[EquipmentFormFields.ID]
      );

      if (!equipmentFormTab) return;
      const {
        FDEquipment1,
        TSYSEquipment1,
        PurchasePrice1,
        QuantityP1,
        RentalPrice1,
        QuantityR1,
        FDEquipment2,
        TSYSEquipment2,
        PurchasePrice2,
        QuantityP2,
        RentalPrice2,
        QuantityR2,
        FDEquipment3,
        TSYSEquipment3,
        PurchasePrice3,
        QuantityP3,
        RentalPrice3,
        QuantityR3,
      } = extractMappedValues(
        equipmentFormTab.fields,
        'id',
        [
          equipmentFieldIds[EquipmentFormFields.FDEquipment1],
          equipmentFieldIds[EquipmentFormFields.TSYSEquipment1],
          equipmentFieldIds[EquipmentFormFields.PurchasePrice1],
          equipmentFieldIds[EquipmentFormFields.QuantityP1],
          equipmentFieldIds[EquipmentFormFields.RentalPrice1],
          equipmentFieldIds[EquipmentFormFields.QuantityR1],
          equipmentFieldIds[EquipmentFormFields.FDEquipment2],
          equipmentFieldIds[EquipmentFormFields.TSYSEquipment2],
          equipmentFieldIds[EquipmentFormFields.PurchasePrice2],
          equipmentFieldIds[EquipmentFormFields.QuantityP2],
          equipmentFieldIds[EquipmentFormFields.RentalPrice2],
          equipmentFieldIds[EquipmentFormFields.QuantityR2],
          equipmentFieldIds[EquipmentFormFields.FDEquipment3],
          equipmentFieldIds[EquipmentFormFields.TSYSEquipment3],
          equipmentFieldIds[EquipmentFormFields.PurchasePrice3],
          equipmentFieldIds[EquipmentFormFields.QuantityP3],
          equipmentFieldIds[EquipmentFormFields.RentalPrice3],
          equipmentFieldIds[EquipmentFormFields.QuantityR3],
        ],
        [
          'FDEquipment1',
          'TSYSEquipment1',
          'PurchasePrice1',
          'QuantityP1',
          'RentalPrice1',
          'QuantityR1',
          'FDEquipment2',
          'TSYSEquipment2',
          'PurchasePrice2',
          'QuantityP2',
          'RentalPrice2',
          'QuantityR2',
          'FDEquipment3',
          'TSYSEquipment3',
          'PurchasePrice3',
          'QuantityP3',
          'RentalPrice3',
          'QuantityR3',
        ]
      );

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
          FDEquipment2,
          TSYSEquipment2,
          PurchasePrice2,
          QuantityP2,
          RentalPrice2,
          QuantityR2,
          FDEquipment3,
          TSYSEquipment3,
          PurchasePrice3,
          QuantityP3,
          RentalPrice3,
          QuantityR3,
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

        if (rentalTotal1) {
          updatedFields.push(
            ...[
              {
                id: equipmentFieldIds[EquipmentFormFields.QuantityR1],
                value: quantityR1.toString(),
              },
              {
                id: equipmentFieldIds[EquipmentFormFields.RentalTotal1],
                value: rentalTotal1.toString(),
              },
            ]
          );
        }

        if (purchaseTotal1) {
          updatedFields.push(
            ...[
              {
                id: equipmentFieldIds[EquipmentFormFields.QuantityP1],
                value: quantityP1.toString(),
              },
              {
                id: equipmentFieldIds[EquipmentFormFields.PurchaseTotal1],
                value: purchaseTotal1.toString(),
              },
            ]
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

        if (rentalTotal2) {
          updatedFields.push(
            ...[
              {
                id: equipmentFieldIds[EquipmentFormFields.QuantityR2],
                value: quantityR2.toString(),
              },
              {
                id: equipmentFieldIds[EquipmentFormFields.RentalTotal2],
                value: rentalTotal2.toString(),
              },
            ]
          );
        }
        if (purchaseTotal2) {
          updatedFields.push(
            ...[
              {
                id: equipmentFieldIds[EquipmentFormFields.QuantityP2],
                value: quantityP2.toString(),
              },
              {
                id: equipmentFieldIds[EquipmentFormFields.PurchaseTotal2],
                value: purchaseTotal2.toString(),
              },
            ]
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

        if (rentalTotal3) {
          updatedFields.push(
            ...[
              {
                id: equipmentFieldIds[EquipmentFormFields.QuantityR3],
                value: quantityR3.toString(),
              },
              {
                id: equipmentFieldIds[EquipmentFormFields.RentalTotal3],
                value: rentalTotal3.toString(),
              },
            ]
          );
        }

        if (purchaseTotal3) {
          updatedFields.push(
            ...[
              {
                id: equipmentFieldIds[EquipmentFormFields.QuantityP3],
                value: quantityP3.toString(),
              },
              {
                id: equipmentFieldIds[EquipmentFormFields.PurchaseTotal3],
                value: purchaseTotal3.toString(),
              },
            ]
          );
        }

        purchaseTotalSum += purchaseTotal3;
        monthlyRentalTotalSum += rentalTotal3;
      }

      this.logger.log(
        JSON.stringify({
          msg: 'lead-equipment-webhook',
          updatedFields,
        })
      );

      await this.client.patch(`/api/v1/leads/${leadId}`, {
        fields: [
          ...updatedFields,
          {
            id: equipmentFieldIds[EquipmentFormFields.PurchaseTotal],
            value: purchaseTotalSum.toString(),
          },
          {
            id: equipmentFieldIds[EquipmentFormFields.MonthlyRentalTotal],
            value: monthlyRentalTotalSum.toString(),
          },
        ],
      });

      this.logger.log(
        JSON.stringify({
          msg: 'lead-equipment-webhook',
          status: `ended for lead ${leadId}`,
        })
      );

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
