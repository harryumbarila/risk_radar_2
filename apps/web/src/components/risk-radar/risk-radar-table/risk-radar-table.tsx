import { useAuth } from '@frontegg/nextjs';
import React from 'react';
import { toast } from 'react-toastify';

import { useExceptionData } from '@/hooks/risk-radar/use-exception-data';
import type { CommonStatus, PaginatedAPIResponse } from '@/shared/common';
import type {
  RiskRadarExceptionsListRow,
  RiskRadarFilterState,
} from '@/shared/response';
import { useAssignExceptionToUser } from '@/web/src/hooks/risk-radar/use-assign-exception-to-user';
import { useReviewExceptionByUsername } from '@/web/src/hooks/risk-radar/use-review-exception-by-username';

import { TableBody } from './table/table-body';
import { TableHeader } from './table/table-header';
import { TablePagination } from './table/table-pagination';
import { useRiskRadarTableColumns } from './table/use-risk-radar-columns';

type RiskRadarTableProps = {
  exceptionList: PaginatedAPIResponse<RiskRadarExceptionsListRow> | null;
  status: number;
  filters: RiskRadarFilterState;
  fetchData: (filters: RiskRadarFilterState) => void;
  dataStatus?: CommonStatus;
};

export const RiskRadarTable: React.FC<RiskRadarTableProps> = ({
  exceptionList,
  filters,
  fetchData,
  dataStatus,
}): JSX.Element => {
  const { data: exceptionData } = useExceptionData();
  const { user } = useAuth();

  const { reviewException, isLoading: isReviewLoading } =
    useReviewExceptionByUsername();
  const { assignException, isLoading: isAssignLoading } =
    useAssignExceptionToUser();

  const handleSubmit = async (
    ids: number[],
    assignedUser: string,
    assignToUserId?: number
  ): Promise<void> => {
    switch (String(filters.status)) {
      case '1': // Not Reviewed
        await reviewException(ids, assignedUser);
        fetchData({ ...filters, page: 1 });
        break;
      case '3': // Manager Queued
        if (!assignToUserId) {
          toast.error('Assign to user is required');
          return;
        }

        if (!user?.name) {
          toast.error('User is required');
          return;
        }

        await assignException(ids, assignToUserId, user.name);
        fetchData({ ...filters, page: 1 });
        break;
      default:
        break;
    }
  };

  // Pagination
  const handlePageSizeChange = (pageSize: number): void => {
    fetchData({ ...filters, pageSize, page: 1 });
  };

  const handlePageChange = (page: number): void => {
    fetchData({ ...filters, page });
  };

  const columns = useRiskRadarTableColumns({
    data: exceptionList?.data ?? [],
    filters,
    riskRadarUsers: exceptionData?.risk_user ?? [],
    onSubmit: handleSubmit,
    isLoading: isReviewLoading || isAssignLoading,
  });

  return (
    <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <section className="data-table-common data-table-two rounded-sm border border-stroke bg-white py-4 text-xs shadow-default dark:border-strokedark dark:bg-boxdark">
        <TableHeader
          pageSize={filters.pageSize}
          onEntriesPerPageChange={handlePageSizeChange}
        />

        <TableBody
          columns={columns}
          pageSize={filters.pageSize}
          currentPage={filters.page}
          exceptionList={exceptionList?.data ?? []}
          totalRecords={exceptionList?.totalRecords ?? 0}
          dataStatus={dataStatus}
        />

        <TablePagination
          page={filters.page}
          pageSize={filters.pageSize}
          totalRecords={exceptionList?.totalRecords ?? 0}
          onPageChange={handlePageChange}
        />
      </section>
    </div>
  );
};
