import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { PushNoteToIrisService } from '@/api/module/risk-radar/services/push-note-to-iris/push-note-to-iris.service';
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

  // Add a static map to track in-progress reviews at the class level
  private static inProgressReviews: Map<string, string> = new Map();

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
    private readonly snapSalesConfirmationRepository: SnapPccSalesConfirmationRepository,
    private readonly pushNoteToIrisService: PushNoteToIrisService
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
      if (clickedStatus !== undefined && exceptionId) {
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
            // Create divert notes and get the note ID
            let noteId: number;
            this.logger.log(`Step 8a: Creating divert changed notes`);
            try {
              this.logger.debug(
                { merchantId, isDiverted, createdBy },
                'Calling notesRepository.createDivertChangedNotes'
              );
              
              const startTime = Date.now();
              noteId = await this.notesRepository.createDivertChangedNotes(
                merchantId,
                isDiverted,
                createdBy
              );
              const duration = Date.now() - startTime;
              
              this.logger.debug(
                { merchantId, noteId, duration },
                'Successfully created divert note'
              );

              // Push the divert change note to IRIS with the note ID
              this.logger.log(
                { merchantId, noteId },
                `Step 8b: Pushing divert change note to IRIS`
              );
              
              const irisStartTime = Date.now();
              await this.pushNoteToIrisService.pushDivertChangeToIris(
                merchantId,
                isDiverted,
                createdBy,
                noteId
              );
              const irisDuration = Date.now() - irisStartTime;
              
              this.logger.debug(
                { merchantId, noteId, irisDuration },
                'Successfully pushed divert note to IRIS'
              );

              this.logger.log(
                { merchantId, noteId },
                `Divert changed notes created and pushed to IRIS successfully`
              );
            } catch (error: unknown) {
              const typedError = error as ErrorWithMessage;
              this.logger.error(
                { merchantId, isDiverted, error: typedError },
                `Error in divert note creation or IRIS push: ${typedError.message}`
              );
              throw error;
            }
          } catch (error: unknown) {
            const typedError = error as ErrorWithMessage;
            this.logger.error(
              { merchantId, isDiverted, error: typedError },
              `Error in divert change process: ${typedError.message}`
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
          this.logger.log(`Step 10a: Processing review status for exception ${exceptionId}`);
          
          // Check if this exception was recently reviewed by someone else
          if (exceptionJeff.exceptionStatusId === 2 && exceptionJeff.userReviewed) {
            this.logger.warn(
              `Exception ${exceptionId} was already reviewed by ${exceptionJeff.userReviewed}. 
              Rejecting duplicate review attempt by ${createdBy}.`
            );
            throw new BadRequestException(
              `This exception was already reviewed by ${exceptionJeff.userReviewed}. Only the first review is accepted.`
            );
          }
          
          // Add an in-memory lock to prevent concurrent reviews of the same exception
          const reviewKey = `exception-${exceptionId}`;
          if (RiskRadarSaveService.inProgressReviews.has(reviewKey)) {
            const currentReviewer = RiskRadarSaveService.inProgressReviews.get(reviewKey);
            this.logger.warn(
              `Exception ${exceptionId} is currently being reviewed by ${currentReviewer}. 
              Rejecting concurrent review attempt by ${createdBy}.`
            );
            throw new BadRequestException(
              `This exception is currently being reviewed by ${currentReviewer}. Please try again later.`
            );
          }
          
          try {
            // Set the lock
            RiskRadarSaveService.inProgressReviews.set(reviewKey, createdBy);
            this.logger.debug(`Lock acquired for exception ${exceptionId} by ${createdBy}`);
            
            // Double-check the database for most current state before proceeding
            const freshException = await this.exceptionsJeffRepository.findOne({
              where: { id: exceptionId }
            });
            
            if (freshException && freshException.exceptionStatusId === 2 && freshException.userReviewed) {
              this.logger.warn(
                `Exception ${exceptionId} was already reviewed by ${freshException.userReviewed}. 
                Detected during lock check. Rejecting review attempt by ${createdBy}.`
              );
              throw new BadRequestException(
                `This exception was already reviewed by ${freshException.userReviewed}. Only the first review is accepted.`
              );
            }
            
            exceptionJeff.exceptionStatusId = 2;
            exceptionJeff.userReviewed = createdBy;

            await this.notesRepository.createReviewNotes(merchantId, createdBy);
            this.logger.log(`Review notes created successfully for exception ${exceptionId}`);
            
            // Explicitly save the exception data immediately to prevent race conditions
            this.logger.log(`Saving exception data for ${exceptionId}`);
            await this.exceptionsJeffRepository.save(exceptionJeff);
            this.logger.log(`Exception data saved successfully for ${exceptionId}`);
          } finally {
            // Always release the lock, even if an error occurs
            RiskRadarSaveService.inProgressReviews.delete(reviewKey);
            this.logger.debug(`Lock released for exception ${exceptionId}`);
          }
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

    if (isValidPrefix) {
      if (existing) {
        this.logger.log(`Updating existing TSYS flag for MID: ${merchantId}`);
        try {
          await this.flagUpdateRepository.update(
            { mid: merchantId, isHidden: false },
            {
              isHidden: false,
              addDate: new Date(),
            }
          );
          this.logger.log(`TSYS flag updated successfully`);
        } catch (error: unknown) {
          const typedError = error as ErrorWithMessage;
          this.logger.error(`Error updating TSYS flag: ${typedError.message}`);
          throw error;
        }
      } else {
        this.logger.log(`Adding new TSYS flag for MID: ${merchantId}`);
        try {
          await this.flagUpdateRepository.insert({
            mid: merchantId,
            isHidden: false,
            addDate: new Date(),
          });
          this.logger.log(`TSYS flag added successfully`);
        } catch (error: unknown) {
          const typedError = error as ErrorWithMessage;
          this.logger.error(`Error adding TSYS flag: ${typedError.message}`);
          throw error;
        }
      }
    }

    // Divert Queue
    this.logger.log(`Checking divert queue`);
    /*
     * TODO: FIXME: Create a new entry or update the existing one?
     * Check default values for create also should be set when updated
     * IsProcess should be set to 0 when updated
     */

    if (isValidPrefix) {
      this.logger.log(
        `Adding new entry to divert queue for MID: ${merchantId}`
      );
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

    // Divert Queue FSP
    this.logger.log(`Checking FSP divert queue`);

    const fspPrefixes = ['8152'];
    const isValidFspPrefix = fspPrefixes.includes(merchantId.slice(0, 4));
    this.logger.log(
      `FSP MID prefix check: ${merchantId.slice(0, 4)}, isValidFspPrefix: ${isValidFspPrefix}`
    );

    if (isValidFspPrefix) {
      this.logger.log(
        `Adding new entry to FSP divert queue for MID: ${merchantId}`
      );
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

    if (isValidPrefix) {
      if (existing) {
        this.logger.log(`Updating existing TSYS flag for MID: ${merchantId}`);
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
      } else {
        this.logger.log(`Creating new TSYS flag for MID: ${merchantId}`);
        try {
          await this.flagUpdateRepository.insert({
            mid: merchantId,
            isHidden: true,
            removeDate: new Date(),
          });
          this.logger.log(`TSYS flag created successfully`);
        } catch (error: unknown) {
          const typedError = error as ErrorWithMessage;
          this.logger.error(`Error creating TSYS flag: ${typedError.message}`);
          throw error;
        }
      }
    }
    /*
     * TODO: FIXME: Create a new entry or update the existing one?
     * Check default values for create also should be set when updated
     * IsProcess should be set to 0 when updated
     */
    // Divert Queue
    this.logger.log(`Checking divert queue`);

    if (isValidPrefix) {
      this.logger.log(
        `Adding new entry to divert queue for MID: ${merchantId}`
      );
      try {
        await this.divertQueueRepository.insert({
          merchantId: Number(merchantId),
          isDiverted: false,
          divertFlagNotes: 'Manual remove from divert via Risk Radar',
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

    // Divert Queue FSP
    this.logger.log(`Checking FSP divert queue`);

    const fspPrefixes = ['8152'];
    const isValidFspPrefix = fspPrefixes.includes(merchantId.slice(0, 4));
    this.logger.log(
      `FSP MID prefix check: ${merchantId.slice(0, 4)}, isValidFspPrefix: ${isValidFspPrefix}`
    );

    if (isValidFspPrefix) {
      this.logger.log(
        `Adding new entry to FSP divert queue for MID: ${merchantId}`
      );
      try {
        await this.divertQueueFspRepository.insert({
          merchantId: Number(merchantId),
          isDiverted: false,
          divertFlagNotes: 'Manual remove from divert via Risk Radar',
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

    this.logger.log(`handleIsNotDiverted completed for MID: ${merchantId}`);
  }
}
