import type { FC } from 'react';

import type { RiskUser } from '@/shared/response/legacy-dashboard-proxy/dto/exception-data';

type ManagerQueuedHeaderProps = {
  riskUsers: RiskUser[];
  setAssignedUser: (user: string) => void;
  handleClickOnAssignButton: () => void;
};

export const ManagerQueuedHeader: FC<ManagerQueuedHeaderProps> = ({
  riskUsers,
  setAssignedUser,
  handleClickOnAssignButton,
}) => {
  return (
    <div>
      <select
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setAssignedUser(e.target.value)}
        className="bg-transparent pl-2"
      >
        {riskUsers?.map((user: RiskUser) => (
          <option key={user.sNTUserID} value={String(user.sNTUserID)}>
            {user.sName}
          </option>
        ))}
      </select>
      <button
        className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
        type="button"
        onClick={handleClickOnAssignButton}
      >
        Assign
      </button>
    </div>
  );
};
