'use client';

import { Breadcrumb, showNotification } from '@denali/ui';
import { useAuth } from '@frontegg/nextjs';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { AttributionFormContainer } from '@/components/attribution-url/attribution-form-container';
import { AttributionResult } from '@/components/attribution-url/attribution-result';
import { DefaultLayout } from '@/components/layouts/default-layout';
import { clientConfig } from '@/config/client';
import { useLeadBasicInfo } from '@/hooks/attribution-url/use-lead-basic-info';
import { useLeadSources } from '@/hooks/attribution-url/use-lead-sources';
import { useSourceMatcher } from '@/hooks/attribution-url/use-source-matcher';
import type {
  AttributionDataPayload,
  FormValues,
} from '@/types/attribution-url';
import { permissions } from '@/types/permissions';

const AttributionUrl: React.FC = () => {
  const { user } = useAuth();
  const { forResource } = permissions(user);
  const { findMatchingSourceNameForReferralPartner } = useSourceMatcher();
  const { data: leadSourcesData } = useLeadSources();

  const methods = useForm<FormValues>({
    defaultValues: {
      existingLeadId: '',
      irisUser: '',
      channel: '',
      rsl: '',
      referralPartner: '',
    },
    mode: 'onChange',
  });

  const { watch, handleSubmit } = methods;

  // Get lead basic info to validate
  const leadId = watch('existingLeadId');
  const [debouncedLeadId] = useDebounce(leadId, 800);

  const { data: leadBasicInfoData, isLoading: isLeadBasicInfoLoading } =
    useLeadBasicInfo(debouncedLeadId);

  const isValidLead =
    leadBasicInfoData?.dbaName && leadBasicInfoData.contactPhone;

  const [generatedLink, setGeneratedLink] = React.useState('');
  const [selectedPartnerName, setSelectedPartnerName] =
    React.useState<string>('');

  const createAttributionDataPayload = (
    data: FormValues
  ): AttributionDataPayload => {
    const attributionData: AttributionDataPayload = {
      user_id: data.irisUser,
      channel_id: data.channel,
      pb_key: clientConfig.api.talusPbKey,
    };

    if (data.rsl) {
      attributionData.rsl_user_id = data.rsl;
    }

    if (data.referralPartner) {
      attributionData.referral_partner_user_id = data.referralPartner;

      // Find correct source id by checking source name with selected partner name
      const selectedSource = findMatchingSourceNameForReferralPartner(
        selectedPartnerName,
        leadSourcesData?.data
      );

      if (selectedSource) {
        attributionData.source_id = selectedSource.id.toString();
      }
    }

    attributionData.lead_id = data.existingLeadId;

    return attributionData;
  };

  const onSubmit = (data: FormValues): void => {
    // 1. Permission Validation
    if (!forResource('ATTRIBUTION_LINK').canWrite) {
      showNotification({
        title: 'Permission Denied',
        message: 'You do not have permission to generate attribution links',
        type: 'error',
        bgColor: '#FF0000',
      });
      return;
    }

    // Convert to Base64 and generate link
    const attributionData = createAttributionDataPayload(data);
    const encodedData = btoa(JSON.stringify(attributionData));

    const link = `${clientConfig.merchant.app.url}/attr/${encodedData}`;
    setGeneratedLink(link);

    showNotification({
      title: 'Success',
      message: 'Attribution link generated successfully',
      type: 'success',
      bgColor: '#4CAF50',
    });
  };

  const updateSelectedPartnerName = (partnerName: string): void => {
    setSelectedPartnerName(partnerName);
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
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AttributionFormContainer
                canWrite={forResource('ATTRIBUTION_LINK').canWrite}
                updateSelectedPartnerName={updateSelectedPartnerName}
                leadData={leadBasicInfoData}
                isLoading={isLeadBasicInfoLoading}
                isDisabled={!isValidLead}
              />
              {generatedLink && (
                <AttributionResult generatedLink={generatedLink} />
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AttributionUrl;
