'use client';

import { Breadcrumb, showNotification } from '@denali/ui';
import { useAuth } from '@frontegg/nextjs';
import React, { useState } from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';
import { clientConfig } from '@/config/client';
import { useLeadSources } from '@/hooks/attribution-url/use-lead-sources';
import { useSourceMatcher } from '@/hooks/attribution-url/use-source-matcher';
import { useUsersData } from '@/hooks/attribution-url/use-users-data';
import { permissions } from '@/types/permissions';

const AttributionUrl: React.FC = () => {
  const { user } = useAuth();
  const { forResource } = permissions(user);

  const { findMatchingSourceNameForReferralPartner } = useSourceMatcher();

  const { data: usersData, isLoading: usersLoading } = useUsersData();

  const [irisUser, setIrisUser] = useState('');
  const [channel, setChannel] = useState('');
  const [rsl, setRsl] = useState('');
  const [referralPartner, setReferralPartner] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const { data: leadSourcesData } = useLeadSources();
  const [selectedPartnerName, setSelectedPartnerName] = useState<string>('');

  // New state variables for dropdown options
  const [channels, setChannels] = useState<Array<{ id: number; name: string }>>(
    []
  );
  const [rslOptions, setRslOptions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [partnerOptions, setPartnerOptions] = useState<
    Array<{ user_id: number; username: string }>
  >([]);

  const handleGenerateLink = (): void => {
    // 1. Validation

    if (!forResource('ATTRIBUTION_LINK').canWrite) {
      showNotification({
        title: 'Permission Denied',
        message: 'You do not have permission to generate attribution links',
        type: 'error',
        bgColor: '#FF0000',
      });
      return;
    }

    if (!irisUser || !channel) {
      showNotification({
        title: 'Validation Error',
        message: 'IRIS User, Channel are required fields',
        type: 'error',
        bgColor: '#FF0000',
      });
      return;
    }

    // 2. Construct the attribution object
    const attributionData: Record<string, string> = {
      user_id: irisUser,
      channel_id: channel,
    };

    if (rsl) {
      attributionData.rsl_user_id = rsl;
    }

    if (referralPartner) {
      attributionData.referral_partner_user_id = referralPartner;

      // find correct source id by checking source name with selected partner name
      const selectedSource = findMatchingSourceNameForReferralPartner(
        selectedPartnerName,
        leadSourcesData?.data
      );

      if (selectedSource) {
        attributionData.source_id = selectedSource.id.toString();
      }
    }

    // 3. Convert to Base64
    const encodedData = btoa(JSON.stringify(attributionData));

    // 4. Construct the final URL
    const link = `${clientConfig.merchant.app.url}/attr/${encodedData}`;

    setGeneratedLink(link);

    showNotification({
      title: 'Success',
      message: 'Attribution link generated successfully',
      type: 'success',
      bgColor: '#4CAF50',
    });
  };

  const handleCopyLink = (): void => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink).catch(() => {});
      showNotification({
        title: 'Success',
        message: 'Operation completed successfully',
        type: 'success',
        bgColor: '#4CAF50',
      });
    }
  };

  const handlePartnerChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const selectedValue = e.target.value;
    setReferralPartner(selectedValue);
    // Clear dependent fields
    setGeneratedLink('');
    // Find the selected partner
    const selectedPartner = partnerOptions.find(
      (partner) => partner.user_id.toString() === selectedValue
    );
    if (selectedPartner) {
      // Set the selected partner name
      setSelectedPartnerName(selectedPartner.username);
    }
  };

  const handleIrisUserChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const selectedValue = e.target.value;
    setIrisUser(selectedValue);

    // Clear dependent fields
    setChannel('');
    setRsl('');
    setReferralPartner('');
    setGeneratedLink('');

    // Find the selected user
    const selectedUser = usersData?.data?.find(
      (filteredUser) => filteredUser.value === parseInt(selectedValue, 10)
    );

    if (selectedUser) {
      // Set groups/channels
      const userChannels = selectedUser.channels || [];
      setChannels(userChannels);

      // Set RSL users
      const rslUsers = selectedUser.rsl || [];
      setRslOptions(rslUsers);

      // Set referral partners
      const managedUsers = selectedUser.manages || [];
      setPartnerOptions(managedUsers);
    }
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Attribution URL Generator" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Talus Attribution URL Builder
          </h3>
        </div>
        <div className="p-6.5">
          {/* IRIS User */}
          <div className="mb-4.5">
            <label
              className="mb-2.5 block text-black dark:text-white"
              htmlFor="iris-user"
            >
              Choose IRIS User
            </label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              {usersLoading ? (
                <div className="flex items-center justify-center py-3">
                  <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : (
                <select
                  value={irisUser}
                  onChange={handleIrisUserChange}
                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="">Select IRIS User</option>
                  {usersData?.data?.map((filteredUser) => (
                    <option key={filteredUser.value} value={filteredUser.value}>
                      {filteredUser.label}
                    </option>
                  ))}
                </select>
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
            </label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">Select Channel</option>
                {channels.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
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
                value={rsl}
                onChange={(e) => setRsl(e.target.value)}
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
              htmlFor="referral-partner"
            >
              Referral Partner
            </label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">
              <select
                value={referralPartner}
                onChange={(e) => handlePartnerChange(e)}
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
          <button
            onClick={handleGenerateLink}
            className={`flex w-full justify-center rounded p-3 font-medium text-gray ${
              forResource('ATTRIBUTION_LINK').canWrite
                ? 'bg-primary hover:bg-opacity-90'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!forResource('ATTRIBUTION_LINK').canWrite}
            type="button"
          >
            Generate Link
          </button>

          {generatedLink && (
            <div className="mt-4.5">
              <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor="generated-link"
              >
                Generated Link:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  type="button"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AttributionUrl;
