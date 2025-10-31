import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { RiskRadarFilterState } from '@/shared/response';
import { getCurrentLocalDate } from '@/shared/utils/date-utils';

type RiskRadarFilterStore = {
  filters: RiskRadarFilterState;
  setFilters: (filters: Partial<RiskRadarFilterState>) => void;
  resetFilters: () => void;
};

const defaultRiskRadarFilters: RiskRadarFilterState = {
  startDate: getCurrentLocalDate(),
  endDate: getCurrentLocalDate(),
  processor: 0,
  viewAllExceptions: false,
  categories: [],
  status: 1,
  assignedToUser: undefined,
  merchantId: undefined,
  dbaNameOrSIC: undefined,
  sourceType: undefined,
  page: 1,
  pageSize: 50,
};

export const useRiskRadarFilterStore = create<RiskRadarFilterStore>()(
  persist(
    immer((set) => ({
      filters: defaultRiskRadarFilters,
      setFilters(newFilters: Partial<RiskRadarFilterState>): void {
        set((state) => {
          Object.assign(state.filters, newFilters);
        });
      },
      resetFilters(): void {
        set({ filters: defaultRiskRadarFilters });
      },
    })),
    {
      name: 'risk-radar-filters-store',
    }
  )
);
