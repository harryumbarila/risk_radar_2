import React from 'react';
import { useFormContext } from 'react-hook-form';

import { useUsersData } from '@/hooks/attribution-url/use-users-data';
import type { IrisBasicInfoResponseDto } from '@/shared/response/iris-proxy';
import type { FormValues } from '@/types/attribution-url';
import { GenerationFormMode } from '@/types/attribution-url';

import { SubmitButton } from './submit-button';

type AttributionFormContainerProps = {
  generationMode: GenerationFormMode;
  canWrite: boolean;
  updateSelectedPartnerName: (partnerName: string) => void;

  leadData?: IrisBasicInfoResponseDto;
  isLoading?: boolean;
  isDisabled?: boolean;
};

export const AttributionFormContainer: React.FC<
  AttributionFormContainerProps
> = ({
  generationMode,
  canWrite,
  leadData,
  isLoading,
  isDisabled,
  updateSelectedPartnerName,
}) => {
  const {
    register,
    setValue,
    formState: { errors, isDirty },
    trigger,
  } = useFormContext<FormValues>();

  const { data: usersData, isLoading: usersLoading } = useUsersData();

  // State for dropdown options
  const [channels, setChannels] = React.useState<
    Array<{ id: number; name: string }>
  >([]);
  const [rslOptions, setRslOptions] = React.useState<
    Array<{ id: number; name: string }>
  >([]);
  const [partnerOptions, setPartnerOptions] = React.useState<
    Array<{ user_id: number; username: string }>
  >([]);

  // Handle IRIS user selection
  const handleIrisUserChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ): Promise<void> => {
    const selectedValue = e.target.value;
    setValue('irisUser', selectedValue);

    // Reset dependent fields
    setValue('channel', '');
    setValue('rsl', '');
    setValue('referralPartner', '');

    // Find the selected user and load related options
    if (selectedValue) {
      const selectedUser = usersData?.data?.find(
        (filteredUser) => filteredUser.value === parseInt(selectedValue, 10)
      );

      if (selectedUser) {
        // Set channels
        const userChannels = selectedUser.channels || [];
        setChannels(userChannels);

        // Set RSL users
        const rslUsers = selectedUser.rsl || [];
        setRslOptions(rslUsers);

        // Set referral partners
        const managedUsers = selectedUser.manages || [];
        setPartnerOptions(managedUsers);
      }
    }

    // Trigger validation
    await trigger('irisUser');
  };

  // Handle referral partner selection
  const handlePartnerChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ): Promise<void> => {
    const selectedValue = e.target.value;
    setValue('referralPartner', selectedValue);

    const selectedPartner = partnerOptions.find(
      (partner) => partner.user_id.toString() === selectedValue
    );

    if (selectedPartner) {
      updateSelectedPartnerName(selectedPartner.username);
    }

    await trigger('referralPartner');
  };

  return (
    <>
      {/* IRIS User */}
      <div className="mb-4.5">
        <label
          className="mb-2.5 block text-black dark:text-white"
          htmlFor="irisUser"
        >
          Choose IRIS User
          <span className="text-meta-1">*</span>
        </label>
        <div className="relative z-20 bg-transparent dark:bg-form-input">
          {usersLoading ? (
            <div className="flex items-center justify-center py-3">
              <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <select
              id="irisUser"
              {...register('irisUser', {
                required: 'IRIS User is required',
              })}
              onChange={handleIrisUserChange}
              className={`relative z-20 w-full appearance-none rounded border ${
                errors.irisUser ? 'border-danger' : 'border-stroke'
              } bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
            >
              <option value="">Select IRIS User</option>
              {usersData?.data?.map((filteredUser) => (
                <option key={filteredUser.value} value={filteredUser.value}>
                  {filteredUser.label}
                </option>
              ))}
            </select>
          )}
          {errors.irisUser && (
            <span className="text-sm text-danger">
              {errors.irisUser.message}
            </span>
          )}
        </div>
      </div>

      {/* Channel */}
      <div className="mb-4.5">
        <label
          className="mb-2.5 block text-black dark:text-white"
          htmlFor="channel"
        >
          Channel
          <span className="text-meta-1">*</span>
        </label>
        <div className="relative z-20 bg-transparent dark:bg-form-input">
          <select
            id="channel"
            {...register('channel', {
              required: 'Channel is required',
            })}
            className={`relative z-20 w-full appearance-none rounded border ${
              errors.channel ? 'border-danger' : 'border-stroke'
            } bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
          >
            <option value="">Select Channel</option>
            {channels.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          {errors.channel && (
            <span className="text-sm text-danger">
              {errors.channel.message}
            </span>
          )}
        </div>
      </div>

      {/* RSL */}
      <div className="mb-4.5">
        <label
          className="mb-2.5 block text-black dark:text-white"
          htmlFor="rsl"
        >
          RSL
        </label>
        <div className="relative z-20 bg-transparent dark:bg-form-input">
          <select
            id="rsl"
            {...register('rsl')}
            className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            <option value="">Select RSL</option>
            {rslOptions.map((rslUser) => (
              <option key={rslUser.id} value={rslUser.id}>
                {rslUser.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Referral Partner */}
      <div className="mb-4.5">
        <label
          className="mb-2.5 block text-black dark:text-white"
          htmlFor="referralPartner"
        >
          Referral Partner
        </label>
        <div className="relative z-20 bg-transparent dark:bg-form-input">
          <select
            id="referralPartner"
            {...register('referralPartner')}
            onChange={handlePartnerChange}
            className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            <option value="">Select Referral Partner</option>
            {partnerOptions.map((partner) => (
              <option key={partner.user_id} value={partner.user_id}>
                {partner.username}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lead ID field */}
      {generationMode === GenerationFormMode.EXISTING_LEAD && (
        <div className="mb-4.5">
          <label
            className="mb-2.5 block text-black dark:text-white"
            htmlFor="existingLeadId"
          >
            Lead ID / IRIS URL
            <span className="text-meta-1">*</span>
          </label>
          <input
            id="existingLeadId"
            {...register('existingLeadId', {
              required: 'Lead ID is required',
            })}
            placeholder="Enter lead ID or IRIS URL"
            className={`w-full rounded border ${
              errors.existingLeadId ? 'border-danger' : 'border-stroke'
            } bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
          />

          {leadData && !isLoading && (
            <div className="mt-2 text-sm text-gray-500 italic">
              <p>
                Creating URL for <b>{leadData.dbaName}</b> with contact
                information: <b>{leadData.contactPhone}</b> /{' '}
                <b>{leadData.contactEmail}</b>
              </p>
            </div>
          )}

          {isDirty && !leadData && !isLoading && (
            <div className="mt-2 text-sm text-danger">
              There is no lead data for the provided lead ID. Please check the
              lead ID and try again.
            </div>
          )}

          {errors.existingLeadId && (
            <span className="text-sm text-danger">
              {errors.existingLeadId.message}
            </span>
          )}
        </div>
      )}

      <SubmitButton
        isLoading={isLoading}
        isDisabled={isDisabled || Object.keys(errors).length > 0 || !canWrite}
      />
    </>
  );
};
