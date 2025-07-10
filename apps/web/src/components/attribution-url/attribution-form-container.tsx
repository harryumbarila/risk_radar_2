import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { useUsersData } from '@/hooks/attribution-url/use-users-data';
import type { IrisBasicInfoResponseDto } from '@/shared/response/iris-proxy';
import type { FormValues } from '@/types/attribution-url';
import { GenerationFormMode } from '@/types/attribution-url';

import type { AutoSelectOption } from './auto-select-field';
import { AutoSelectField } from './auto-select-field';
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
    control,
    clearErrors,
  } = useFormContext<FormValues>();

  const { data: usersData, isLoading: usersLoading } = useUsersData();

  // State for dropdown options
  const [channels, setChannels] = React.useState<AutoSelectOption[]>([]);
  const [rslOptions, setRslOptions] = React.useState<AutoSelectOption[]>([]);
  const [partnerOptions, setPartnerOptions] = React.useState<
    AutoSelectOption[]
  >([]);

  // Handle IRIS user selection and dependent fields
  const handleIrisUserChange = async (value: string): Promise<void> => {
    setValue('irisUser', value);
    setValue('channel', '');
    setValue('rsl', '');
    setValue('referralPartner', '');

    if (value) {
      const selectedUser = usersData?.data?.find(
        (filteredUser) => filteredUser.value === parseInt(value, 10)
      );
      if (selectedUser) {
        // Channels
        const userChannels = (selectedUser.channels ?? []).map((c) => ({
          value: c.id.toString(),
          label: c.name,
        }));
        setChannels(userChannels);
        if (userChannels.length === 1) {
          setValue('channel', userChannels[0]?.value ?? '');
          await trigger('channel');
        }

        // RSL
        const rslUsers = (selectedUser.rsl ?? []).map((r) => ({
          value: r.id.toString(),
          label: r.name,
        }));
        setRslOptions(rslUsers);
        if (rslUsers.length === 1) {
          setValue('rsl', rslUsers[0]?.value ?? '');
          await trigger('rsl');
        }

        // Referral Partners
        const managedUsers = (selectedUser.manages ?? []).map((p) => ({
          value: p.user_id.toString(),
          label: p.username,
        }));
        setPartnerOptions(managedUsers);
        if (managedUsers.length === 1) {
          setValue('referralPartner', managedUsers[0]?.value ?? '');
          updateSelectedPartnerName(managedUsers[0]?.label ?? '');
          await trigger('referralPartner');
        }
      } else {
        setChannels([]);
        setRslOptions([]);
        setPartnerOptions([]);
      }
    } else {
      setChannels([]);
      setRslOptions([]);
      setPartnerOptions([]);
    }
    await trigger('irisUser');
  };

  // Handle Referral Partner selection (for updating partner name)
  const handlePartnerChange = async (value: string): Promise<void> => {
    setValue('referralPartner', value);
    const selectedPartner = partnerOptions.find((p) => p.value === value);
    if (selectedPartner) {
      updateSelectedPartnerName(selectedPartner.label);
    }
    await trigger('referralPartner');
  };

  // Prepare options for IRIS User
  const irisUserOptions: AutoSelectOption[] = Array.isArray(usersData?.data)
    ? (usersData.data ?? []).map((u) => ({
        value: u.value.toString(),
        label: u.label,
      }))
    : [];

  // Clear existingLeadId error when not in EXISTING_LEAD mode
  useEffect(() => {
    if (generationMode !== GenerationFormMode.EXISTING_LEAD) {
      clearErrors('existingLeadId');
    }
  }, [generationMode, clearErrors]);

  return (
    <>
      {/* IRIS User (Controller) */}
      <Controller
        name="irisUser"
        control={control}
        rules={{ required: 'IRIS User is required' }}
        render={({ field, fieldState }) => (
          <AutoSelectField
            id="irisUser"
            label="IRIS User"
            options={irisUserOptions}
            required
            error={fieldState.error?.message}
            value={field.value || ''}
            onChange={async (v) => {
              field.onChange(v);
              await handleIrisUserChange(v);
            }}
            loading={usersLoading}
            disabled={usersLoading || irisUserOptions.length <= 1}
          />
        )}
      />

      {/* Channel (Controller) */}
      <Controller
        name="channel"
        control={control}
        rules={{ required: 'Channel is required' }}
        render={({ field, fieldState }) => (
          <AutoSelectField
            id="channel"
            label="Channel"
            options={channels ?? []}
            required
            error={fieldState.error?.message}
            value={field.value || ''}
            onChange={(v) => field.onChange(v)}
            loading={usersLoading}
            disabled={usersLoading || (channels?.length ?? 0) <= 1}
          />
        )}
      />

      {/* RSL (Controller, optional) */}
      <Controller
        name="rsl"
        control={control}
        render={({ field, fieldState }) => (
          <AutoSelectField
            id="rsl"
            label="RSL"
            options={rslOptions ?? []}
            error={fieldState.error?.message}
            value={field.value || ''}
            onChange={(v) => field.onChange(v)}
            loading={usersLoading}
            disabled={usersLoading || (rslOptions?.length ?? 0) <= 1}
          />
        )}
      />

      {/* Referral Partner (Controller, optional) */}
      <Controller
        name="referralPartner"
        control={control}
        render={({ field, fieldState }) => (
          <AutoSelectField
            id="referralPartner"
            label="Referral Partner"
            options={partnerOptions ?? []}
            error={fieldState.error?.message}
            value={field.value || ''}
            onChange={async (v) => {
              field.onChange(v);
              await handlePartnerChange(v);
            }}
            loading={usersLoading}
            disabled={usersLoading || (partnerOptions?.length ?? 0) <= 1}
          />
        )}
      />

      {/* Lead ID field */}
      {generationMode === GenerationFormMode.EXISTING_LEAD && (
        <div className="mb-4.5">
          <label
            className="mb-2.5 block text-black dark:text-white"
            htmlFor="existingLeadId"
          >
            Lead ID
            <span className="text-meta-1">*</span>
          </label>
          <input
            id="existingLeadId"
            {...register('existingLeadId', {
              required: 'Lead ID is required',
            })}
            placeholder="Enter lead ID"
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
