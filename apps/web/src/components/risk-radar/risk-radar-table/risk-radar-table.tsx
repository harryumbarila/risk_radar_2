import React, { useCallback, useMemo } from 'react';

import type { PaginatedAPIResponse } from '@/shared/common';
import type {
  RiskRadarExceptionsListRow,
  RiskRadarFilterState,
} from '@/shared/response';

import type { RiskRadarTableColumn } from './table/base-columns';
import { baseColumns, columnHelper } from './table/base-columns';
import { TableBody } from './table/table-body';
import { TableHeader } from './table/table-header';
import { TablePagination } from './table/table-pagination';

type RiskRadarTableProps = {
  exceptionList: PaginatedAPIResponse<RiskRadarExceptionsListRow>;
  // Status is used in the commented code, keeping prop for future use
  // eslint-disable-next-line react/no-unused-prop-types
  status: number;
  filters: RiskRadarFilterState;
  fetchData: (filters: RiskRadarFilterState) => void;
};

export const RiskRadarTable: React.FC<RiskRadarTableProps> = ({
  exceptionList,
  filters,
  fetchData,
}): JSX.Element => {
  // const [reviewIds, setReviewIds] = useState<string[]>([]);
  // const [assignedExceptionIds, setAssignedExceptionIds] = useState<string[]>(
  //   []
  // );

  // const { data: exceptionData } = useExceptionData();
  // const riskUsers = exceptionData?.risk_user;

  // const [assignedUser, setAssignedUser] = useState(
  //   String(riskUsers?.[0]?.sNTUserID ?? '')
  // );
  // const { user } = useAuth();

  // const { reviewException } = useReviewExceptionByUsername();
  // const { assignException } = useAssignExceptionToUser();

  // const handleClickOnReviewButton = useCallback(async (): Promise<void> => {
  //   if (reviewIds.length > 0 && user?.name) {
  //     await reviewException(
  //       reviewIds.map((id) => parseInt(id, 10)),
  //       user.name
  //     );
  //   }
  // }, [reviewException, reviewIds, user?.name]);

  // const handleClickOnAssignButton = useCallback(async (): Promise<void> => {
  //   if (assignedExceptionIds.length > 0 && assignedUser) {
  //     await assignException(
  //       assignedExceptionIds.map((id) => parseInt(id, 10)),
  //       assignedUser
  //     );
  //   }
  // }, [assignException, assignedExceptionIds, assignedUser]);

  // const handleReviewCheckboxChange = useCallback((id: string): void => {
  //   setReviewIds((prev) =>
  //     prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  //   );
  // }, []);

  // const handleAssignedCheckboxChange = useCallback((id: string): void => {
  //   setAssignedExceptionIds((prev) =>
  //     prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  //   );
  // }, []);

  const handlePageSizeChange = useCallback(
    (pageSize: number): void => {
      fetchData({ ...filters, pageSize, page: 1 });
    },
    [fetchData, filters]
  );

  const columns = useMemo<RiskRadarTableColumn[]>(() => {
    const idColumn = columnHelper.accessor('iNumOfKeyedTransAboveLimit', {
      header: 'Keyed %',
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
    switch (filters.status) {
      case 1: // Not Reviewed
        reviewedColumn = columnHelper.accessor('sUserReviewed', {
          header: 'Reviewed',
          cell: ({ row }) => row.original.sUserReviewed,
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
  }, [filters.page, filters.pageSize, filters.status]);

  // TODO: Handle reviewed column properly to avoid re render issues
  // This would use the status prop when uncommented

  // switch (status) {
  //   case 1:
  //     completedColumns = [
  //       ...completedColumns,
  //       {
  //         accessorKey: 'sUserReviewed',
  //         header: () => (
  //           <NotReviewedHeader
  //             handleClickOnReviewButton={handleClickOnReviewButton}
  //           />
  //         ),
  //         cell: ({ row }) => (
  //           <NotReviewedCell
  //             reviewIds={reviewIds}
  //             handleReviewCheckboxChange={handleReviewCheckboxChange}
  //             row={row}
  //           />
  //         ),
  //       },
  //     ];
  //     break;
  //   case 2:
  //     completedColumns = [
  //       ...completedColumns,
  //       {
  //         header: 'Reviewed',
  //         accessorKey: 'sUserReviewed',
  //         cell: ({ getValue }) => getValue<string>() ?? DEFAULT_BLANK_VALUE,
  //       },
  //     ];
  //     break;
  //   case 3:
  //     completedColumns = [
  //       ...completedColumns,
  //       {
  //         header: () => (
  //           <ManagerQueuedHeader
  //             riskUsers={riskUsers ?? []}
  //             setAssignedUser={setAssignedUser}
  //             handleClickOnAssignButton={handleClickOnAssignButton}
  //           />
  //         ),
  //         accessorKey: 'sUserReviewed',
  //         cell: ({ row }) => (
  //           <ManagerQueuedCell
  //             assignedExceptionIds={assignedExceptionIds}
  //             handleAssignedCheckboxChange={handleAssignedCheckboxChange}
  //             row={row}
  //           />
  //         ),
  //       },
  //     ];
  //     break;
  //   case 4:
  //     completedColumns = [
  //       ...completedColumns,
  //       {
  //         header: 'Assigned to',
  //         accessorFn: (row) => row.sNTUserID,
  //         cell: ({ row }) =>
  //           riskUsers?.find((u) => u.sNTUserID === row.original.sNTUserID)
  //             ?.sName ?? DEFAULT_BLANK_VALUE,
  //       },
  //     ];
  //     break;
  //   default:
  //     break;
  // }

  // Display a message if no data is available
  if (exceptionList?.data?.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white py-6 px-8 shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="text-center">No data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <section className="data-table-common data-table-two rounded-sm border border-stroke bg-white py-4 text-xs shadow-default dark:border-strokedark dark:bg-boxdark">
        <TableHeader
          pageSize={filters.pageSize}
          onEntriesPerPageChange={handlePageSizeChange}
        />

        <TableBody
          columns={columns}
          exceptionList={exceptionList.data}
          pageSize={filters.pageSize}
          currentPage={filters.page}
          totalRecords={exceptionList.totalRecords ?? 0}
        />

        <TablePagination
          page={exceptionList.page}
          pageSize={exceptionList.pageSize}
          totalRecords={exceptionList.totalRecords ?? 0}
          fetchData={fetchData}
          filters={filters}
        />
      </section>
    </div>
  );
};
