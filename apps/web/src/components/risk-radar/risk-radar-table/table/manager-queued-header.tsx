import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import type { RiskUser } from '@/shared/response/legacy-dashboard-proxy/dto/exception-data';

type ManagerQueuedHeaderProps = {
  riskUsers: RiskUser[];
  onAssign: (user: string, riskRadarUser: RiskUser) => void;
  checked: boolean;
  onChange: (checked: boolean) => void;
  isLoading?: boolean;
};

export const ManagerQueuedHeader: FC<ManagerQueuedHeaderProps> = ({
  riskUsers,
  onAssign,
  checked,
  onChange,
  isLoading,
}) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedUser(e.target.value);
  };

  const handleAssign = (): void => {
    if (selectedUser) {
      const selectedUserObject = riskUsers.find(
        (user) => user.sNTUserID === selectedUser
      );
      if (!selectedUserObject?.pkRiskRadarUser) {
        toast.error('User not found');
        return;
      }
      onAssign(selectedUser, selectedUserObject);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <select
          onChange={handleUserChange}
          disabled={isLoading}
          className="w-full rounded border-[1.5px] p-2 !min-w-32 border-stroke bg-transparent font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary disabled:opacity-50"
        >
          <option value="">Select User</option>
          {riskUsers?.map((user: RiskUser) => (
            <option key={user.sNTUserID} value={String(user.sNTUserID)}>
              {user.sName}
            </option>
          ))}
        </select>

        <button
          className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={handleAssign}
          disabled={isLoading}
        >
          Assign
        </button>
      </div>
      <input
        className="rounded !w-4 !h-4"
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
        disabled={isLoading}
      />
    </div>
  );
};
