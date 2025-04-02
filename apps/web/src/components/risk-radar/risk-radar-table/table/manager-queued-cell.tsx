import type { FC } from 'react';
import type { Row } from 'react-table';

import type { RiskRadarExceptionsListRow } from '@/shared/response/risk-radar';

type ManagerQueuedCellProps = {
  assignedExceptionIds: string[];
  handleAssignedCheckboxChange: (id: string) => void;
  row: Row<RiskRadarExceptionsListRow>;
};

export const ManagerQueuedCell: FC<ManagerQueuedCellProps> = ({
  assignedExceptionIds,
  handleAssignedCheckboxChange,
  row,
}) => {
  return (
    <input
      type="checkbox"
      onClick={(e) => e.stopPropagation()}
      checked={assignedExceptionIds.includes(
        String(row.original.pkRiskRadarExceptions)
      )}
      onChange={() =>
        handleAssignedCheckboxChange(String(row.original.pkRiskRadarExceptions))
      }
      className="border p-1 rounded"
    />
  );
};
