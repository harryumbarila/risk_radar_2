import type { FC } from 'react';
import type { Row } from 'react-table';

import type { RiskRadarExceptionsListRow } from '@/shared/response/risk-radar';

type NotReviewedCellProps = {
  reviewIds: string[];
  handleReviewCheckboxChange: (id: string) => void;
  row: Row<RiskRadarExceptionsListRow>;
};

export const NotReviewedCell: FC<NotReviewedCellProps> = ({
  reviewIds,
  handleReviewCheckboxChange,
  row,
}) => {
  return (
    <input
      type="checkbox"
      placeholder="Enter notes"
      onClick={(e) => {
        e.stopPropagation();
      }}
      checked={reviewIds.includes(String(row.original.pkRiskRadarExceptions))}
      onChange={() =>
        handleReviewCheckboxChange(String(row.original.pkRiskRadarExceptions))
      }
      className="border p-1 rounded"
    />
  );
};
