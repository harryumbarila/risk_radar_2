import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { DSMSalesConfirmationRepository } from '@/dsm-db/repositories';
import { EZEnrollGenAccountRepository } from '@/ez-enroll-db/repositories';
import { EZEnrollPccGenAccountRepository } from '@/ez-enroll-pcc-db/repositories';
import type {
  RiskRadarExceptionsJeffEntity,
  RiskRadarMerchAdjParamEntity,
} from '@/finance-db/entities';
import {
  RiskRadarExceptionsJeffRepository,
  RiskRadarMerchAdjParamRepository,
  RiskRadarNotesRepository,
  TSYSDivertFlagUpdateRepository,
} from '@/finance-db/repositories';
import {
  DivertQueueFSPRepository,
  DivertQueueRepository,
} from '@/iris-db/repositories';
import { SnapPccSalesConfirmationRepository } from '@/snap-pcc-db/repositories';

import type { RiskRadarSaveInputDto } from './dto/risk-radar-save-input.dto';

// Add a type for errors
type ErrorWithMessage = {
  message: string;
  stack?: string;
};

@Injectable()
export class RiskRadarSaveService {
  private readonly logger = new Logger(RiskRadarSaveService.name);

  public constructor(
    private readonly merchAdjRepository: RiskRadarMerchAdjParamRepository,
    private readonly exceptionsJeffRepository: RiskRadarExceptionsJeffRepository,
    private readonly notesRepository: RiskRadarNotesRepository,
    private readonly flagUpdateRepository: TSYSDivertFlagUpdateRepository,
    private readonly divertQueueRepository: DivertQueueRepository,
    private readonly divertQueueFspRepository: DivertQueueFSPRepository,
    private readonly ezEnrollGenAccountRepository: EZEnrollGenAccountRepository,
    private readonly ezEnrollPccGenAccountRepository: EZEnrollPccGenAccountRepository,
    private readonly dsmSalesConfirmationRepository: DSMSalesConfirmationRepository,
    private readonly snapSalesConfirmationRepository: SnapPccSalesConfirmationRepository
  ) {}

  public async saveRiskRadar(data: RiskRadarSaveInputDto) {
    this.logger.log(
      `Starting saveRiskRadar for merchantId: ${data.merchantId}, exceptionId: ${data.exceptionId}`
    );
    this.logger.debug('Input data:', JSON.stringify(data));

    try {
      const {
        merchantId,
        exceptionId,
        isDiverted,
        preferredContact,
        notes,
        isPinnedNote,
        clickedStatus,
        isRiskWatch,
        isAutoHoldEnabled,
        createdBy,
      } = data;

      // Get current data - we need this to determine what changed
      this.logger.log(
        `Step 1: Fetching current merchant data for MID: ${merchantId}`
      );
      const merchAdj = await this.merchAdjRepository.findOne({
        select: [
          'monthlyVolumeCalcMonthly',
          'avgTicketCalcMonthly',
          'swipePercentCalcMonthly',
          'isDivert',
          'isAutoHoldWhiteLabel',
          'isRiskWatch',
          'preferredContact',
        ],
        where: { mid: merchantId },
      });
      this.logger.debug(
        `Merchant data fetched:`,
        merchAdj ? 'Success' : 'Not found'
      );

      if (!merchAdj) {
        this.logger.error(`Merchant Adj not found for MID: ${merchantId}`);
        throw new BadRequestException('Merchant Adj not found.');
      }

      // Only fetch exception data if we're changing exception status
      let exceptionJeff: RiskRadarExceptionsJeffEntity | null = null;
      if (clickedStatus !== undefined) {
        this.logger.log(
          `Step 2: Fetching exception data for exceptionId: ${exceptionId}`
        );
        exceptionJeff = await this.exceptionsJeffRepository.findOne({
          where: {
            id: exceptionId,
          },
        });
        this.logger.debug(`Exception data fetched:`, exceptionJeff);

        if (!exceptionJeff) {
          this.logger.error(`Exception Jeff not found for ID: ${exceptionId}`);
          throw new BadRequestException('Exception Jeff not found.');
        }
      }

      // Create an object with only the fields that are explicitly provided
      const updateFields: Record<string, unknown> = {};

      // Only include fields that are explicitly defined (not undefined)
      if (isDiverted !== undefined) {
        updateFields.isDivert = isDiverted;
      }

      if (preferredContact !== undefined) {
        updateFields.preferredContact = preferredContact;
      }

      if (isRiskWatch !== undefined) {
        updateFields.isRiskWatch = isRiskWatch;
      }

      if (isAutoHoldEnabled !== undefined) {
        updateFields.isAutoHoldWhiteLabel = isAutoHoldEnabled;
      }

      // Only update if we have fields to update
      if (Object.keys(updateFields).length > 0) {
        // Update with input data
        this.logger.log(
          `Step 3: Updating merchant adjustment data for MID: ${merchantId}`
        );
        await this.merchAdjRepository.update({ mid: merchantId }, updateFields);
        this.logger.log(`Merchant adjustment updated successfully`);
      } else {
        this.logger.log('No merchant adjustment fields to update, skipping');
      }

      // Only update risk watch in other repositories if it's explicitly provided
      if (isRiskWatch !== undefined) {
        // Updates EZ Enroll Gen Account
        this.logger.log(
          `Step 4: Updating EZ Enroll Gen Account for MID: ${merchantId}`
        );
        try {
          await this.ezEnrollGenAccountRepository.update(
            { mid16: merchantId },
            {
              riskWatch: isRiskWatch,
            }
          );
          this.logger.log(`EZ Enroll Gen Account updated successfully`);
        } catch (error: unknown) {
          const typedError = error as ErrorWithMessage;
          this.logger.error(
            `Error updating EZ Enroll Gen Account: ${typedError.message}`
          );
          // Continue with other updates even if this one fails
        }

        // Updates EZ Enroll PCC Gen Account
        this.logger.log(
          `Step 5: Updating EZ Enroll PCC Gen Account for MID: ${merchantId}`
        );
        try {
          await this.ezEnrollPccGenAccountRepository.update(
            { mid16: merchantId },
            {
              riskWatch: isRiskWatch,
            }
          );
          this.logger.log(`EZ Enroll PCC Gen Account updated successfully`);
        } catch (error: unknown) {
          const typedError = error as ErrorWithMessage;
          this.logger.error(
            `Error updating EZ Enroll PCC Gen Account: ${typedError.message}`
          );
          // Continue with other updates even if this one fails
        }

        // Updates DSM Sales Confirmation
        this.logger.log(
          `Step 6: Updating DSM Sales Confirmation for MID: ${merchantId}`
        );
        try {
          await this.dsmSalesConfirmationRepository.update(
            { mid: merchantId },
            {
              riskWatch: isRiskWatch,
            }
          );
          this.logger.log(`DSM Sales Confirmation updated successfully`);
        } catch (error: unknown) {
          const typedError = error as ErrorWithMessage;
          this.logger.error(
            `Error updating DSM Sales Confirmation: ${typedError.message}`
          );
          // Continue with other updates even if this one fails
        }

        // Updates Snap PCC Sales Confirmation
        this.logger.log(
          `Step 7: Updating Snap PCC Sales Confirmation for MID: ${merchantId}`
        );
        try {
          await this.snapSalesConfirmationRepository.update(
            { mid: merchantId },
            {
              riskWatch: isRiskWatch,
            }
          );
          this.logger.log(`Snap PCC Sales Confirmation updated successfully`);
        } catch (error: unknown) {
          const typedError = error as ErrorWithMessage;
          this.logger.error(
            `Error updating Snap PCC Sales Confirmation: ${typedError.message}`
          );
          // Continue with other updates even if this one fails
        }
      } else {
        this.logger.log('Risk Watch not provided, skipping related updates');
      }

      // Create change notes only for fields that are explicitly provided
      if (isAutoHoldEnabled !== undefined || isDiverted !== undefined) {
        this.logger.log(`Step 8: Checking and creating changed notes`);

        // Auto hold whitelabel
        if (
          isAutoHoldEnabled !== undefined &&
          isAutoHoldEnabled !== merchAdj.isAutoHoldWhiteLabel
        ) {
          this.logger.log(
            `Auto Hold Whitelist changed from ${merchAdj.isAutoHoldWhiteLabel} to ${isAutoHoldEnabled}`
          );
          try {
            await this.notesRepository.createAutoHoldChangedNotes(
              merchantId,
              merchAdj.isAutoHoldWhiteLabel,
              isAutoHoldEnabled,
              createdBy
            );
            this.logger.log(`Auto Hold changed notes created successfully`);
          } catch (error: unknown) {
            const typedError = error as ErrorWithMessage;
            this.logger.error(
              `Error creating Auto Hold changed notes: ${typedError.message}`
            );
            throw error;
          }
        }

        // Divert status
        if (isDiverted !== undefined && isDiverted !== merchAdj.isDivert) {
          this.logger.log(
            `Divert status changed from ${merchAdj.isDivert} to ${isDiverted}`
          );
          try {
            await this.notesRepository.createDivertChangedNotes(
              merchantId,
              isDiverted,
              createdBy
            );
            this.logger.log(`Divert changed notes created successfully`);
          } catch (error: unknown) {
            const typedError = error as ErrorWithMessage;
            this.logger.error(
              `Error creating Divert changed notes: ${typedError.message}`
            );
            throw error;
          }
        }

        this.logger.log(`Changed notes processed successfully`);
      } else {
        this.logger.log(
          'No note-worthy field changes, skipping notes creation'
        );
      }

      // Handle divert status changes only if isDiverted is explicitly provided
      if (isDiverted !== undefined && isDiverted !== merchAdj.isDivert) {
        this.logger.log(
          `Step 9: Divert status changed from ${merchAdj.isDivert} to ${isDiverted}`
        );
        if (isDiverted) {
          this.logger.log(`Processing isDiverted=true actions`);
          await this.handleIsDiverted(data);
        } else {
          this.logger.log(`Processing isDiverted=false actions`);
          await this.handleIsNotDiverted(data);
        }
        this.logger.log(`Divert status handling completed`);
      } else {
        this.logger.log(
          `Divert status unchanged or not provided, skipping divert handling`
        );
      }

      // Create notes depending on received status - only if clickedStatus is provided
      if (clickedStatus !== undefined) {
        if (clickedStatus === 'rev') {
          this.logger.log(`Step 10a: Processing review status`);
          exceptionJeff.exceptionStatusId = 2;
          exceptionJeff.userReviewed = createdBy;

          await this.notesRepository.createReviewNotes(merchantId, createdBy);
          this.logger.log(`Review notes created successfully`);
        } else if (clickedStatus === 'mgrq') {
          this.logger.log(`Step 10b: Processing manager queue status`);
          exceptionJeff.exceptionStatusId = 3;

          await this.notesRepository.createManagerQueuedNotes(
            merchantId,
            createdBy
          );
          this.logger.log(`Manager queue notes created successfully`);
        } else if (clickedStatus === '') {
          // Reset status if empty string is provided
          this.logger.log(`Step 10c: Resetting exception status`);
          exceptionJeff.exceptionStatusId = 1; // Reset to default status
          exceptionJeff.userReviewed = null;
        }

        // Save exception data if clickedStatus was provided
        this.logger.log(`Step 12: Saving exception Jeff data`);
        await this.exceptionsJeffRepository.save(exceptionJeff);
        this.logger.log(`Exception data saved successfully`);
      } else {
        this.logger.log(
          'No status change requested, skipping exception update'
        );
      }

      // Save notes only if they are provided
      if (notes) {
        this.logger.log(`Step 11: Saving notes for MID: ${merchantId}`);
        await this.notesRepository.insert({
          mid: merchantId,
          notes,
          notesTypeId: isPinnedNote ? 6 : 1,
          userCreated: createdBy,
        });
        this.logger.log(`Notes saved successfully`);
      } else {
        this.logger.log(`No notes to save, skipping step 11`);
      }

      this.logger.log(
        `RiskRadar save completed successfully for MID: ${merchantId}`
      );
      return { success: true, message: 'Data saved successfully' };
    } catch (error: unknown) {
      const typedError = error as ErrorWithMessage;
      this.logger.error(
        `Error in saveRiskRadar: ${typedError.message}`,
        typedError.stack
      );
      throw error;
    }
  }

  private async checkAndCreateChangedNotes(
    input: RiskRadarSaveInputDto,
    merchAdj: RiskRadarMerchAdjParamEntity
  ) {
    const { merchantId, isAutoHoldEnabled, isDiverted, createdBy } = input;

    this.logger.log(
      `Starting checkAndCreateChangedNotes for MID: ${merchantId}`
    );

    // Auto hold whitelabel
    if (
      isAutoHoldEnabled !== undefined &&
      isAutoHoldEnabled !== merchAdj.isAutoHoldWhiteLabel
    ) {
      this.logger.log(
        `Auto Hold Whitelist changed from ${merchAdj.isAutoHoldWhiteLabel} to ${isAutoHoldEnabled}`
      );
      try {
        await this.notesRepository.createAutoHoldChangedNotes(
          merchantId,
          merchAdj.isAutoHoldWhiteLabel,
          isAutoHoldEnabled,
          createdBy
        );
        this.logger.log(`Auto Hold changed notes created successfully`);
      } catch (error: unknown) {
        const typedError = error as ErrorWithMessage;
        this.logger.error(
          `Error creating Auto Hold changed notes: ${typedError.message}`
        );
        throw error;
      }
    }

    // Divert status
    if (isDiverted !== undefined && isDiverted !== merchAdj.isDivert) {
      this.logger.log(
        `Divert status changed from ${merchAdj.isDivert} to ${isDiverted}`
      );
      try {
        await this.notesRepository.createDivertChangedNotes(
          merchantId,
          isDiverted,
          createdBy
        );
        this.logger.log(`Divert changed notes created successfully`);
      } catch (error: unknown) {
        const typedError = error as ErrorWithMessage;
        this.logger.error(
          `Error creating Divert changed notes: ${typedError.message}`
        );
        throw error;
      }
    }
  }

  private async handleIsDiverted(data: RiskRadarSaveInputDto) {
    const { merchantId, createdBy } = data;
    this.logger.log(`Starting handleIsDiverted for MID: ${merchantId}`);

    // Add TSYS Flag
    this.logger.log(`Checking for existing TSYS flag`);
    const existing = await this.flagUpdateRepository.findOne({
      select: ['mid'],
      where: { mid: merchantId, isHidden: false },
    });
    this.logger.debug(`Existing TSYS flag found: ${!!existing}`);

    const prefixes = ['5611', '7905'];
    const isValidPrefix = prefixes.includes(merchantId.slice(0, 4));
    this.logger.log(
      `MID prefix check: ${merchantId.slice(0, 4)}, isValidPrefix: ${isValidPrefix}`
    );

    if (!existing && isValidPrefix) {
      this.logger.log(`Adding TSYS flag for MID: ${merchantId}`);
      try {
        await this.flagUpdateRepository.insert({
          mid: merchantId,
          addDate: new Date(),
        });
        this.logger.log(`TSYS flag added successfully`);
      } catch (error: unknown) {
        const typedError = error as ErrorWithMessage;
        this.logger.error(`Error adding TSYS flag: ${typedError.message}`);
        throw error;
      }
    }

    // Divert Queue
    this.logger.log(`Checking divert queue`);
    const inQueue = await this.divertQueueRepository.findOne({
      where: { merchantId: Number(merchantId) },
      order: { id: 'DESC' }, // Get the latest record by descending ID
    });
    this.logger.debug(`Divert queue check result: ${!!inQueue}`);

    const isDivertFlagSet = inQueue ? inQueue.isDiverted : false;
    this.logger.log(`Current divert flag status: ${isDivertFlagSet}`);

    if (!isDivertFlagSet && isValidPrefix) {
      this.logger.log(`Adding to divert queue for MID: ${merchantId}`);
      try {
        await this.divertQueueRepository.insert({
          merchantId: Number(merchantId),
          isDiverted: true,
          divertFlagNotes: 'Manual put on divert via Risk Radar',
          createDate: new Date(),
          createdBy,
        });
        this.logger.log(`Added to divert queue successfully`);
      } catch (error: unknown) {
        const typedError = error as ErrorWithMessage;
        this.logger.error(
          `Error adding to divert queue: ${typedError.message}`
        );
        throw error;
      }
    }

    // Diver Queue FSP
    this.logger.log(`Checking FSP divert queue`);
    const inFSPQueue = await this.divertQueueFspRepository.findOne({
      where: { merchantId: Number(merchantId) },
      order: { id: 'DESC' }, // Get the latest record by descending ID
    });
    this.logger.debug(`FSP divert queue check result: ${!!inFSPQueue}`);

    const fspPrefixes = ['8152'];
    const isValidFspPrefix = fspPrefixes.includes(merchantId.slice(0, 4));
    this.logger.log(
      `FSP MID prefix check: ${merchantId.slice(0, 4)}, isValidFspPrefix: ${isValidFspPrefix}`
    );

    const isDivertFSPFlagSet = inFSPQueue ? inFSPQueue.isDiverted : false;
    this.logger.log(`Current FSP divert flag status: ${isDivertFSPFlagSet}`);

    if (!isDivertFSPFlagSet && isValidFspPrefix) {
      this.logger.log(`Adding to FSP divert queue for MID: ${merchantId}`);
      try {
        await this.divertQueueFspRepository.insert({
          merchantId: Number(merchantId),
          isDiverted: true,
          divertFlagNotes: 'Manual put on divert via Risk Radar',
          createDate: new Date(),
          createdBy,
        });
        this.logger.log(`Added to FSP divert queue successfully`);
      } catch (error: unknown) {
        const typedError = error as ErrorWithMessage;
        this.logger.error(
          `Error adding to FSP divert queue: ${typedError.message}`
        );
        throw error;
      }
    }

    this.logger.log(`handleIsDiverted completed for MID: ${merchantId}`);
  }

  private async handleIsNotDiverted(data: RiskRadarSaveInputDto) {
    const { merchantId, createdBy } = data;
    this.logger.log(`Starting handleIsNotDiverted for MID: ${merchantId}`);

    // Add TSYS Flag
    this.logger.log(`Checking for existing TSYS flag`);
    const existing = await this.flagUpdateRepository.findOne({
      select: ['mid'],
      where: { mid: merchantId, isHidden: false },
    });
    this.logger.debug(`Existing TSYS flag found: ${!!existing}`);

    const prefixes = ['5611', '7905'];
    const isValidPrefix = prefixes.includes(merchantId.slice(0, 4));
    this.logger.log(
      `MID prefix check: ${merchantId.slice(0, 4)}, isValidPrefix: ${isValidPrefix}`
    );

    if (!existing && isValidPrefix) {
      this.logger.log(`Updating TSYS flag for MID: ${merchantId}`);
      try {
        await this.flagUpdateRepository.update(
          { mid: merchantId, isHidden: false },
          {
            isHidden: true,
            removeDate: new Date(),
          }
        );
        this.logger.log(`TSYS flag updated successfully`);
      } catch (error: unknown) {
        const typedError = error as ErrorWithMessage;
        this.logger.error(`Error updating TSYS flag: ${typedError.message}`);
        throw error;
      }
    }

    // Divert Queue
    this.logger.log(`Checking divert queue`);
    const inQueue = await this.divertQueueRepository.findOne({
      where: { merchantId: Number(merchantId) },
      order: { id: 'DESC' }, // Get the latest record by descending ID
    });
    this.logger.debug(`Divert queue check result: ${!!inQueue}`);

    const isDivertFlagSet = inQueue ? inQueue.isDiverted : false;
    this.logger.log(`Current divert flag status: ${isDivertFlagSet}`);

    if (!isDivertFlagSet && isValidPrefix) {
      this.logger.log(
        `Adding to divert queue (turn off) for MID: ${merchantId}`
      );
      try {
        await this.divertQueueRepository.insert({
          merchantId: Number(merchantId),
          isDiverted: false,
          divertFlagNotes: 'Manual remove from divert via Risk Radar',
          createDate: new Date(),
          createdBy,
        });
        this.logger.log(`Added to divert queue (turn off) successfully`);
      } catch (error: unknown) {
        const typedError = error as ErrorWithMessage;
        this.logger.error(
          `Error adding to divert queue (turn off): ${typedError.message}`
        );
        throw error;
      }
    }

    // Diver Queue FSP
    this.logger.log(`Checking FSP divert queue`);
    const inFSPQueue = await this.divertQueueFspRepository.findOne({
      where: { merchantId: Number(merchantId) },
      order: { id: 'DESC' }, // Get the latest record by descending ID
    });
    this.logger.debug(`FSP divert queue check result: ${!!inFSPQueue}`);

    const fspPrefixes = ['8152'];
    const isValidFspPrefix = fspPrefixes.includes(merchantId.slice(0, 4));
    this.logger.log(
      `FSP MID prefix check: ${merchantId.slice(0, 4)}, isValidFspPrefix: ${isValidFspPrefix}`
    );

    const isDivertFSPFlagSet = inFSPQueue ? inFSPQueue.isDiverted : false;
    this.logger.log(`Current FSP divert flag status: ${isDivertFSPFlagSet}`);

    if (!isDivertFSPFlagSet && isValidFspPrefix) {
      this.logger.log(
        `Adding to FSP divert queue (turn off) for MID: ${merchantId}`
      );
      try {
        await this.divertQueueFspRepository.insert({
          merchantId: Number(merchantId),
          isDiverted: false,
          divertFlagNotes: 'Manual remove from divert via Risk Radar',
          createDate: new Date(),
          createdBy,
        });
        this.logger.log(`Added to FSP divert queue (turn off) successfully`);
      } catch (error: unknown) {
        const typedError = error as ErrorWithMessage;
        this.logger.error(
          `Error adding to FSP divert queue (turn off): ${typedError.message}`
        );
        throw error;
      }
    }

    this.logger.log(`handleIsNotDiverted completed for MID: ${merchantId}`);
  }
}
