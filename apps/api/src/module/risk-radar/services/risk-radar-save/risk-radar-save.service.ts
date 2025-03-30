import { BadRequestException, Injectable } from '@nestjs/common';

import type { RiskRadarMerchantAdjParamEntity } from '@/finance-db/entities';
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

import type { RiskRadarSaveInputDto } from './dto/risk-radar-save-input.dto';

@Injectable()
export class RiskRadarSaveService {
  public constructor(
    private readonly merchAdjRepository: RiskRadarMerchAdjParamRepository,
    private readonly exceptionsJeffRepository: RiskRadarExceptionsJeffRepository,
    private readonly notesRepository: RiskRadarNotesRepository,
    private readonly flagUpdateRepository: TSYSDivertFlagUpdateRepository,
    private readonly divertQueueRepository: DivertQueueRepository,
    private readonly divertQueueFspRepository: DivertQueueFSPRepository
  ) {}

  public async saveRiskRadar(data: RiskRadarSaveInputDto) {
    const {
      merchantId,
      exceptionId,
      bbb,
      monthlyVolume,
      averageTicket,
      swipePercentage,
      isDiverted,
      // website,
      preferredContact,
      notes,
      isPinnedNote,
      clickedStatus,
      isRiskWatch,
      isAutoHoldEnabled,
      createdBy,
    } = data;

    // Get current data
    const merchAdj = await this.merchAdjRepository.findOne({
      select: [
        'bbb',
        'monthlyVolumeCalcMonthly',
        'averageTicketCalcMonthly',
        'swipePercentCalcMonthly',
        'isDiverted',
        'isAutoHoldWhiteLabel',
      ],
      where: { mid: merchantId },
    });

    const exceptionJeff = await this.exceptionsJeffRepository.findOne({
      select: ['exceptionStatusId'],
      where: {
        id: exceptionId,
      },
    });

    if (!merchAdj) {
      throw new BadRequestException('Merchant Adj not found.');
    }

    if (!exceptionJeff) {
      throw new BadRequestException('Exception Jeff not found.');
    }

    // Update with input data,
    await this.merchAdjRepository.update(
      { mid: merchantId },
      {
        bbb,
        monthlyVolumeCalcMonthly: monthlyVolume,
        averageTicketCalcMonthly: averageTicket,
        swipePercentCalcMonthly: swipePercentage,
        isDiverted,
        preferredContact,
        isRiskWatch,
        isAutoHoldWhiteLabel: isAutoHoldEnabled,
      }
    );

    await this.checkAndCreateChangedNotes(data, merchAdj);

    // Divert
    if (isDiverted !== merchAdj.isDiverted) {
      if (isDiverted) {
        await this.handleIsDiverted(data);
      } else {
        await this.handleIsNotDiverted(data);
      }
    }

    // Create notes depending on received status
    if (clickedStatus === 'rev') {
      exceptionJeff.exceptionStatusId = 2;
      exceptionJeff.userReviewed = createdBy;

      await this.notesRepository.createReviewNotes(merchantId, createdBy);
    } else if (clickedStatus === 'mgrq') {
      exceptionJeff.exceptionStatusId = 3;

      await this.notesRepository.createManagerQueuedNotes(
        merchantId,
        createdBy
      );
    }

    //  Save notes
    if (notes) {
      await this.notesRepository.insert({
        mid: merchantId,
        notes,
        notesTypeId: isPinnedNote ? 6 : 1,
        userCreated: createdBy,
      });
    }

    await this.exceptionsJeffRepository.save(exceptionJeff);
  }

  private async checkAndCreateChangedNotes(
    input: RiskRadarSaveInputDto,
    merchAdj: RiskRadarMerchantAdjParamEntity
  ) {
    const {
      merchantId,
      monthlyVolume,
      averageTicket,
      swipePercentage,
      isAutoHoldEnabled,
      isDiverted,
      createdBy,
    } = input;

    // Monthly value changed
    if (monthlyVolume !== merchAdj.monthlyVolumeCalcMonthly) {
      await this.notesRepository.createMonthlyValueChangedNotes(
        merchantId,
        merchAdj.monthlyVolumeCalcMonthly,
        monthlyVolume,
        createdBy
      );
    }

    // Average ticket value changed
    if (averageTicket !== merchAdj.averageTicketCalcMonthly) {
      await this.notesRepository.createAverageTicketChangedNotes(
        merchantId,
        merchAdj.averageTicketCalcMonthly,
        averageTicket,
        createdBy
      );
    }

    // Swipe % changed
    if (swipePercentage !== merchAdj.swipePercentCalcMonthly) {
      await this.notesRepository.createSwipePercentChangedNotes(
        merchantId,
        merchAdj.swipePercentCalcMonthly,
        swipePercentage,
        createdBy
      );
    }

    // Auto hold whitelabel
    if (isAutoHoldEnabled !== merchAdj.isAutoHoldWhiteLabel) {
      await this.notesRepository.createAutoHoldChangedNotes(
        merchantId,
        merchAdj.isAutoHoldWhiteLabel,
        isAutoHoldEnabled,
        createdBy
      );
    }

    if (isDiverted !== merchAdj.isDiverted) {
      await this.notesRepository.createDivertChangedNotes(
        merchantId,
        isDiverted,
        createdBy
      );
    }
  }

  private async handleIsDiverted(data: RiskRadarSaveInputDto) {
    const { merchantId, createdBy } = data;

    // Add TSYS Flag
    const existing = await this.flagUpdateRepository.findOne({
      select: ['mid'],
      where: { mid: merchantId, isHidden: false },
    });

    const prefixes = ['5611', '7905'];
    const isValidPrefix = prefixes.includes(merchantId.slice(0, 4));

    if (!existing && isValidPrefix) {
      await this.flagUpdateRepository.insert({
        mid: merchantId,
        addDate: new Date(),
      });
    }

    // Divert Queue
    const inQueue = await this.divertQueueRepository.findOne({
      where: { merchantId: Number(merchantId) },
      order: { id: 'DESC' }, // Get the latest record by descending ID
    });

    const isDivertFlagSet = inQueue ? inQueue.isDiverted : false;

    if (!isDivertFlagSet && isValidPrefix) {
      await this.divertQueueRepository.insert({
        merchantId: Number(merchantId),
        isDiverted: true,
        divertFlagNotes: 'Manual put on divert via Risk Radar',
        createDate: new Date(),
        createdBy,
      });
    }

    // Diver Queue FSP
    const inFSPQueue = await this.divertQueueFspRepository.findOne({
      where: { merchantId: Number(merchantId) },
      order: { id: 'DESC' }, // Get the latest record by descending ID
    });

    const fspPrefixes = ['8152'];
    const isValidFspPrefix = fspPrefixes.includes(merchantId.slice(0, 4));
    const isDivertFSPFlagSet = inFSPQueue ? inFSPQueue.isDiverted : false;

    if (!isDivertFSPFlagSet && isValidFspPrefix) {
      await this.divertQueueFspRepository.insert({
        merchantId: Number(merchantId),
        isDiverted: true,
        divertFlagNotes: 'Manual put on divert via Risk Radar',
        createDate: new Date(),
        createdBy,
      });
    }
  }

  private async handleIsNotDiverted(data: RiskRadarSaveInputDto) {
    const { merchantId, createdBy } = data;

    // Add TSYS Flag
    const existing = await this.flagUpdateRepository.findOne({
      select: ['mid'],
      where: { mid: merchantId, isHidden: false },
    });

    const prefixes = ['5611', '7905'];
    const isValidPrefix = prefixes.includes(merchantId.slice(0, 4));

    if (!existing && isValidPrefix) {
      await this.flagUpdateRepository.update(
        { mid: merchantId, isHidden: false },
        {
          isHidden: true,
          removeDate: new Date(),
        }
      );
    }

    // Divert Queue
    const inQueue = await this.divertQueueRepository.findOne({
      where: { merchantId: Number(merchantId) },
      order: { id: 'DESC' }, // Get the latest record by descending ID
    });

    const isDivertFlagSet = inQueue ? inQueue.isDiverted : false;

    if (!isDivertFlagSet && isValidPrefix) {
      await this.divertQueueRepository.insert({
        merchantId: Number(merchantId),
        isDiverted: false,
        divertFlagNotes: 'Manual remove from divert via Risk Radar',
        createDate: new Date(),
        createdBy,
      });
    }

    // Diver Queue FSP
    const inFSPQueue = await this.divertQueueFspRepository.findOne({
      where: { merchantId: Number(merchantId) },
      order: { id: 'DESC' }, // Get the latest record by descending ID
    });

    const fspPrefixes = ['8152'];
    const isValidFspPrefix = fspPrefixes.includes(merchantId.slice(0, 4));
    const isDivertFSPFlagSet = inFSPQueue ? inFSPQueue.isDiverted : false;

    if (!isDivertFSPFlagSet && isValidFspPrefix) {
      await this.divertQueueFspRepository.insert({
        merchantId: Number(merchantId),
        isDiverted: false,
        divertFlagNotes: 'Manual remove from divert via Risk Radar',
        createDate: new Date(),
        createdBy,
      });
    }
  }
}
