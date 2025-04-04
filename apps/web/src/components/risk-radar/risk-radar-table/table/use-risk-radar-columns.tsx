import { useAuth } from '@frontegg/nextjs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { RiskUser } from '@/shared/response/legacy-dashboard-proxy/dto/exception-data';
import type { RiskRadarFilterState } from '@/shared/response/risk-radar';
import type { RiskRadarExceptionsListRow } from '@/shared/response/risk-radar/exception-list/exception-list-row';

import type { RiskRadarTableColumn } from './base-columns';
import { baseColumns, columnHelper } from './base-columns';
import { ExceptionReviewCheckbox } from './exception-review-checkbox';
import { ManagerQueuedHeader } from './manager-queued-header';
import { NotReviewedHeader } from './not-reviewed-header';

type UseRiskRadarTableColumnsProps = {
  filters: RiskRadarFilterState;
  data: RiskRadarExceptionsListRow[];
  riskRadarUsers: RiskUser[];
  onSubmit: (
    ids: number[],
    assignedUser: string,
    exceptionStatusId?: number
  ) => void;
  isLoading: boolean;
};

export const useRiskRadarTableColumns = ({
  data,
  filters,
  riskRadarUsers,
  onSubmit,
  isLoading,
}: UseRiskRadarTableColumnsProps): RiskRadarTableColumn[] => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { user } = useAuth();

  const onSelectAllIds = useCallback(
    (selected: boolean): void => {
      if (selected) {
        setSelectedIds(data.map((item) => item.pkRiskRadarExceptions));
      } else {
        setSelectedIds([]);
      }
    },
    [data]
  );

  const onSelectedIdChange = useCallback((id: number): void => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const isReviewed = useCallback(
    (row: RiskRadarExceptionsListRow): boolean => {
      return (
        !!row.sUserReviewed || selectedIds.includes(row.pkRiskRadarExceptions)
      );
    },
    [selectedIds]
  );

  const handleAssignSubmit = useCallback(
    (assignTo: string, riskRadarUser: RiskUser): void => {
      onSubmit(selectedIds, assignTo, riskRadarUser.pkRiskRadarUser);
    },
    [onSubmit, selectedIds]
  );

  const handleReviewSubmit = useCallback(() => {
    if (!user?.name) return;

    onSubmit(selectedIds, user.name);
  }, [onSubmit, selectedIds, user?.name]);

  useEffect(() => {
    setSelectedIds([]);
  }, [filters.status]);

  const columns = useMemo<RiskRadarTableColumn[]>(() => {
    const idColumn = columnHelper.accessor('id', {
      header: '#',
      cell: ({ row }) => {
        // Calculate the offset based on page number and page size
        const pageOffset = (filters.page - 1) * filters.pageSize;
        // Add 1 to zero-based index to get human-readable row number
        const rowNumber = pageOffset + row.index + 1;
        return String(rowNumber);
      },
    });

    // Reviewed column
    let reviewedColumn = null;

    const isAllSelected = data.length === selectedIds.length;

    switch (String(filters.status)) {
      case '1': // Not Reviewed
        reviewedColumn = columnHelper.accessor('pkRiskRadarExceptions', {
          header: () => (
            <NotReviewedHeader
              checked={isAllSelected}
              onChange={onSelectAllIds}
              onReview={handleReviewSubmit}
              isLoading={isLoading}
            />
          ),
          cell: ({ row }) => {
            const reviewed = isReviewed(row.original);
            const exceptionId = row.original.pkRiskRadarExceptions;

            return (
              <ExceptionReviewCheckbox
                reviewed={reviewed}
                exceptionId={exceptionId}
                onChange={() => {
                  onSelectedIdChange(exceptionId);
                }}
              />
            );
          },
        });
        break;

      case '3': // Manager Queued
        reviewedColumn = columnHelper.accessor('pkRiskRadarExceptions', {
          header: () => (
            <ManagerQueuedHeader
              riskUsers={riskRadarUsers}
              onAssign={handleAssignSubmit}
              checked={isAllSelected}
              onChange={onSelectAllIds}
              isLoading={isLoading}
            />
          ),
          cell: ({ row }) => {
            const reviewed = isReviewed(row.original);
            const exceptionId = row.original.pkRiskRadarExceptions;

            return (
              <ExceptionReviewCheckbox
                reviewed={reviewed}
                exceptionId={exceptionId}
                onChange={() => {
                  onSelectedIdChange(exceptionId);
                }}
              />
            );
          },
        });
        break;

      case '4': // Assigned
        reviewedColumn = columnHelper.accessor('sNTUserID', {
          header: 'Assigned to',
          cell: ({ row }) => row.original.sNTUserID,
        });
        break;

      default: // Reviewed
        reviewedColumn = columnHelper.accessor('sUserReviewed', {
          header: 'Reviewed',
        });
        break;
    }

    const completedColumns = [idColumn, ...baseColumns, reviewedColumn];
    return completedColumns;
  }, [
    data.length,
    selectedIds.length,
    filters.status,
    filters.page,
    filters.pageSize,
    onSelectAllIds,
    handleReviewSubmit,
    isLoading,
    isReviewed,
    onSelectedIdChange,
    riskRadarUsers,
    handleAssignSubmit,
  ]);

  return columns;
};
