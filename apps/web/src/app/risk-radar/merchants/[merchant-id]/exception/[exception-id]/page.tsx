/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */

'use client';

import { Breadcrumb } from '@denali/ui';
import { useAuth } from '@frontegg/nextjs';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';
import type { TransactionException } from '@/shared/response/legacy-dashboard-proxy';
import { Tooltip } from '@/ui/common/tool-tips/risk-tooltip';
import { Popup } from '@/web/src/components/risk-radar/popups/popups';
import { useEmailTemplates } from '@/web/src/hooks/risk-radar/use-email-templates';
import { useCardHistory } from '@/web/src/hooks/risk-radar/use-get-card-history';
import { useMerchant } from '@/web/src/hooks/risk-radar/use-merchant';
import { useMerchantChargebacks } from '@/web/src/hooks/risk-radar/use-merchant-chargebacks';
import { useMerchantContactInfo } from '@/web/src/hooks/risk-radar/use-merchant-contact-info';
import { useMerchantNetSettlement } from '@/web/src/hooks/risk-radar/use-merchant-net-settlement';
import { useMerchantNotes } from '@/web/src/hooks/risk-radar/use-merchant-notes';
import { usePushNoteToIris } from '@/web/src/hooks/risk-radar/use-push-note-to-iris';
import { useReviewExceptionByUsername } from '@/web/src/hooks/risk-radar/use-review-exception-by-username';
import { useSaveMerchantData } from '@/web/src/hooks/risk-radar/use-save-merchant-data';
import { useSaveNewNetSettlement } from '@/web/src/hooks/risk-radar/use-save-new-net-settlement';
import { useSentExceptionToManagersQueue } from '@/web/src/hooks/risk-radar/use-sent-to-managers-queue';
import { useTransactionExceptions } from '@/web/src/hooks/risk-radar/use-transaction-exceptions';
import { useTriggerExceptionAsAutoHold } from '@/web/src/hooks/risk-radar/use-trigger-exception-as-auto-hold';
import { useTriggerExceptionAsDivert } from '@/web/src/hooks/risk-radar/use-trigger-exception-as-divert';
import { useTriggerExceptionAsRiskWatch } from '@/web/src/hooks/risk-radar/use-trigger-exception-asr-risk-watch';

type Props = {
  params: {
    'merchant-id': string;
    'exception-id': string;
  };
};

type NewNoteRequest = {
  sNotes: string | null;
  isPinned: boolean;
  author: string | null;
};

enum PopupType {
  Email = 'email',
  CardHistory = 'cardHistory',
}

type CardHistory = {
  iMID: string;
  dtTransDate: string;
  dTransAmt: number;
  sPOSEntry: string;
  sAVS: string;
  iAuthCode: string;
  sDBNetInd: string;
  dtTransmissionDate: string;
  dNetDepAmt: number;
};

type EmailTemplate = {
  pkRiskRadarEMailTemplate: string;
  sTemplateName: string;
  sTemplateEMailBody: string;
};

type MerchantProfile = {
  sMId: string;
  sDBAName: string;
  sDBAAddress: string;
  sDBACity: string;
  sDBAState: string;
  sDBAZip: string;
  sActivationDate: string;
  sOwnershipType: string;
  sSIC: string;
  sSICDesc: string;
  sReseller: string;
  sMerchantType: string;
  bIsTalusPayMerchant?: boolean;
  sChannel: string;
  sReferralPartner: string;
  sSolutionConsultant?: string;
  iMV$: number;
  iAT$: number;
  iHT$: number;
  ht?: number;
  iSwipeVolPerc: number;
  iUWApprMV: number;
  iUWApprAT: number;
  iUWApprHT: number;
  iUWApprSwipeVolPerc: number;
  iSwipedPercBasedOnTransCntCurrMonth: number;
  sPreferredContact?: string;
};

const RiskRadarMerchantPage: FC<Props> = ({ params }) => {
  const { 'merchant-id': merchantId, 'exception-id': exceptionId } = params;
  const { user } = useAuth();

  const [currentTransException, setCurrentTransException] =
    useState<TransactionException | null>(null);
  const [isPopupActive, setIsPopupActive] = useState<boolean>(false);
  const [activePopup, setActivePopup] = useState<PopupType>(PopupType.Email);

  const [email, setEmail] = useState<string>('');
  const [template, setTemplate] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const [newSettlement, setNewSettlement] = useState<{
    amount: number;
    notes: string;
    action: string;
  }>({
    amount: 0,
    notes: '',
    action: 'Withdraw',
  });

  const { data, error, isLoading, refetch } = useMerchant(
    merchantId,
    exceptionId
  );
  const { data: contactData } = useMerchantContactInfo(merchantId);
  const { data: transactionExceptionsData } =
    useTransactionExceptions(merchantId);
  const { data: merchantNotesData, refetch: notesRefetch } =
    useMerchantNotes(merchantId);
  const { data: merchantChargebacksData } = useMerchantChargebacks(merchantId);
  const { data: merchantNetSettlementData, refetch: netsettlementRefresh } =
    useMerchantNetSettlement(merchantId);
  const { data: cardNumberData } = useCardHistory(
    currentTransException?.sCardNum
  );
  const { data: emailTemplatesData } = useEmailTemplates();

  const { pushNote } = usePushNoteToIris();
  const { triggerAsDivert } = useTriggerExceptionAsDivert();
  const { triggerAsAutoHold } = useTriggerExceptionAsAutoHold();
  const { triggerAsRiskWatch } = useTriggerExceptionAsRiskWatch();
  const { saveMerchantdata } = useSaveMerchantData();
  const { managersQueue } = useSentExceptionToManagersQueue();
  const { saveNetSettlement } = useSaveNewNetSettlement();
  const { reviewException } = useReviewExceptionByUsername();

  const [activeTab, setActiveTab] = useState<string>('contact');
  const [merchantUpdateRequest, setMerchantUpdateRequest] = useState<{
    preferredContact: string;
  }>({
    preferredContact: '',
  });
  const [noteRequest, setNoteRequest] = useState<NewNoteRequest>({
    sNotes: null,
    isPinned: false,
    author: user?.name ?? null,
  });

  const handlePushNoteToIris = async (noteId: string): Promise<void> => {
    await pushNote(noteId);
    notesRefetch();
  };

  const handleDivertTrigger = async (): Promise<void> => {
    if (exceptionId) {
      await triggerAsDivert([parseInt(exceptionId, 10)]);
      refetch();
    }
  };

  const handleRiskWatchTrigger = async (value: boolean): Promise<void> => {
    if (exceptionId) {
      await triggerAsRiskWatch([parseInt(exceptionId, 10)], value);
      refetch();
    }
  };

  const handleAutoHoldTrigger = async (value: boolean): Promise<void> => {
    if (exceptionId) {
      await triggerAsAutoHold([parseInt(exceptionId, 10)], value);
      refetch();
    }
  };

  const handleManagersQueueTrigger = async (): Promise<void> => {
    if (exceptionId) {
      await managersQueue([parseInt(exceptionId, 10)]);
      refetch();
    }
  };

  const handleClickOnReviewButton = async (): Promise<void> => {
    if (user?.name) {
      await reviewException([parseInt(exceptionId, 10)], user.name);
      refetch();
    }
  };

  const handleNewNetSettlement = async (): Promise<void> => {
    const currentDate = new Date().toISOString().split('T')[0];

    try {
      if (!user?.name) {
        // console.error('No user nickname available');
        return;
      }

      let { amount } = newSettlement;

      if (newSettlement.action === 'Release') {
        amount *= -1;
      }

      await saveNetSettlement(
        newSettlement.action,
        currentDate ?? '',
        0,
        amount,
        0,
        0,
        newSettlement.notes,
        user.name,
        merchantId
      );
    } catch (e) {
      // console.error(e);
    }
    netsettlementRefresh();
  };

  const saveMerchantData = async (): Promise<void> => {
    const { sNotes, isPinned, author } = noteRequest;
    const { preferredContact } = merchantUpdateRequest;

    try {
      if (!sNotes) {
        // console.error('no note message provided');
        return;
      }

      if (!user?.name) {
        return;
      }

      if (!author) {
        return;
      }

      await saveMerchantdata(
        merchantId,
        sNotes,
        isPinned,
        user?.name || '',
        author,
        preferredContact
      );
    } catch (err) {
      // console.error(err);
    }
    refetch();
    notesRefetch();
  };

  const replaceEmailTemplateParameters = (templateText: string): void => {
    if (!currentTransException) {
      return;
    }

    let newTemplate = templateText;
    newTemplate = newTemplate.replaceAll(
      '@dtTransDate',
      currentTransException.dtTransDate
    );

    newTemplate = newTemplate.replaceAll(
      '@dAuthAmt',
      currentTransException.dAuthAmt.toString()
    );

    newTemplate = newTemplate.replaceAll(
      '@dTransAmt',
      currentTransException.dTransAmt.toString()
    );

    newTemplate = newTemplate.replaceAll(
      '@sPOSEntryMode',
      currentTransException.sPOS
    );

    newTemplate = newTemplate.replaceAll(
      '@sAVSRespCode',
      currentTransException.sAVS
    );

    newTemplate = newTemplate.replaceAll(
      '@sAuthCode',
      currentTransException.sAuthCode
    );

    newTemplate = newTemplate.replaceAll(
      '@sCardLast4',
      currentTransException.sCardNum.slice(-4)
    );

    setBody(newTemplate);
  };

  const handleSendEmail = (): void => {
    // console.log({ template, email, body });
    // Add email sending logic here
  };

  useEffect(() => {
    if (data) {
      setMerchantUpdateRequest((prev) => ({
        ...prev,
        preferredContact: data?.merchant_profile?.[0]?.sPreferredContact ?? '',
      }));
    }
  }, [data]);

  if (!merchantId) {
    notFound();
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading merchant data</div>;
  }

  const merchantProfile = data?.merchant_profile
    ? data?.merchant_profile[0]
    : ({} as MerchantProfile);
  const merchantContactInfo = contactData?.merchant_profile
    ? contactData?.merchant_profile[0]
    : null;
  const exceptionLegends = data?.exception_type_legend;
  const riskException = data?.risk_exception ? data?.risk_exception[0] : null;
  const transactionExceptions = transactionExceptionsData?.trans_exceptions;
  const merchantNotes = merchantNotesData?.notes;
  const merchantChargebacks = merchantChargebacksData?.chargebacks;
  const merchantNetSettlements = merchantNetSettlementData?.net_settlement;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cardHistory: any[] =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (cardNumberData as any)?.card_numbers?.length > 0
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        ((cardNumberData as any)?.card_numbers as Array<any>)
      : [];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const emailTemplates: any[] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (emailTemplatesData as any)?.email_templates.length > 0
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (emailTemplatesData as any)?.email_templates
      : [];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Merchant profile" />
      <Popup
        isOpen={isPopupActive}
        onClose={() => setIsPopupActive(false)}
        title={activePopup == PopupType.Email ? 'Send Email' : 'Card # History'}
      >
        {activePopup == PopupType.CardHistory ? (
          <div className="grid grid-cols-1 gap-4">
            <div className="max-w-full max-h-90 overflow-x-auto overflow-y-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="p-4 font-medium text-black dark:text-white">
                      MID
                    </th>
                    <th className="p-4 font-medium text-black dark:text-white">
                      Trans Date
                    </th>
                    <th className="p-4 font-medium text-black dark:text-white">
                      Trans Amt
                    </th>
                    <th className="p-4 font-medium text-black dark:text-white">
                      POS Entry
                    </th>
                    <th className="p-4 font-medium text-black dark:text-white">
                      AVS
                    </th>
                    <th className="p-4 font-medium text-black dark:text-white">
                      Auth Code
                    </th>
                    <th className="p-4 font-medium text-black dark:text-white">
                      Card #
                    </th>
                    <th className="p-4 font-medium text-black dark:text-white">
                      DB Net Ind
                    </th>
                    <th className="p-4 font-medium text-black dark:text-white">
                      Transmission Date
                    </th>
                    <th className="p-4 font-medium text-black dark:text-white">
                      Net Dep. Amt
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cardHistory.map((card: CardHistory) => {
                    return (
                      <tr key={`${card.iMID}`}>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {card.iMID}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {card.dtTransDate}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {card.dTransAmt}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {card.sPOSEntry}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {card.sAVS}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {card.iAuthCode}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {card.sDBNetInd}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {card.dtTransmissionDate}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {card.dNetDepAmt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : activePopup == PopupType.Email ? (
          <div className="max-w bg-white p-6 rounded-lg shadow-lg">
            {/* Template Dropdown */}
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email-template"
              >
                Template:
              </label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={template}
                onChange={(e) => {
                  setTemplate(e.target.value);
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  const template = emailTemplates?.find(
                    (template: EmailTemplate) =>
                      template.pkRiskRadarEMailTemplate == e.target.value
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  )?.sTemplateEMailBody;
                  if (template) {
                    replaceEmailTemplateParameters(template as string);
                  }
                }}
              >
                {emailTemplates.map((template: EmailTemplate) => (
                  <option value={template.pkRiskRadarEMailTemplate}>
                    {template.sTemplateName}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Recipient */}
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email-recipient"
              >
                E-Mail Recipient:
              </label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter recipient email"
              />
            </div>

            {/* Email Body */}
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email-body"
              >
                E-Mail Body Content:
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter email content..."
              />
            </div>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSendEmail}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
            >
              Send Email
            </button>
          </div>
        ) : null}
      </Popup>
      {/* Header */}
      <section className="mb-2 grid grid-cols-2 gap-4">
        <h1 className=" text-2xl font-semibold text-black dark:text-white">
          MID: {merchantProfile?.sMId}
        </h1>
        <div className="inline-flex items-center justify-end">
          <button
            className="inline-flex w-[100px] items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
            type="button"
            onClick={() => {
              saveMerchantData().catch(() => {});
            }}
          >
            Save
          </button>
        </div>
      </section>

      <section className="mb-4 grid grid-cols-4 gap-4">
        {/* Column 1 */}
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-black dark:text-white">
            <strong>DBA Name:</strong> {merchantProfile?.sDBAName}
          </p>
          <p className="text-black dark:text-white">
            <strong>Address:</strong> {merchantProfile?.sDBAAddress}
          </p>
          <p className="text-black dark:text-white">
            <strong>City:</strong> {merchantProfile?.sDBACity}
          </p>
          <p className="text-black dark:text-white">
            <strong>State:</strong> {merchantProfile?.sDBAState}
          </p>
          <p className="text-black dark:text-white">
            <strong>ZIP:</strong> {merchantProfile?.sDBAZip}
          </p>
          <p className="text-black dark:text-white">
            <strong>Divert:</strong>
            <input
              type="checkbox"
              className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
              disabled={riskException?.bDivert}
              checked={riskException?.bDivert}
              onChange={() => handleDivertTrigger()}
            />
          </p>
          <p className="text-black dark:text-white">
            <strong>Activated:</strong> {merchantProfile?.sActivationDate}
          </p>

          {riskException?.fkRiskExceptionStatus === 1 ? (
            <p className="text-black dark:text-white">
              <button
                className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
                type="button"
                onClick={() => {
                  handleManagersQueueTrigger().catch(() => {});
                }}
              >
                Managers queue
              </button>
            </p>
          ) : null}
        </div>

        {/* Column 2 */}
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-black dark:text-white">
            <strong>Ownership:</strong> {merchantProfile?.sOwnershipType}
          </p>
          <p className="text-black dark:text-white">
            <strong>SIC:</strong> {merchantProfile?.sSIC} -{' '}
            {merchantProfile?.sSICDesc}
          </p>
        </div>

        {/* Column 3 */}
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-black dark:text-white">
            <strong>Reseller:</strong> {merchantProfile?.sReseller}
          </p>

          <p className="text-black dark:text-white">
            <strong>Merchant Type:</strong> {merchantProfile?.sMerchantType}
          </p>
          <p className="text-black dark:text-white">
            <strong>Talus Pay:</strong>{' '}
            {merchantProfile?.bIsTalusPayMerchant ? 'Yes' : 'No'}
          </p>
        </div>

        {/* Column 4 */}
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-black dark:text-white">
            <strong>Risk Watch:</strong>
            <input
              type="checkbox"
              className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={riskException?.bRiskWatch}
              onChange={() =>
                handleRiskWatchTrigger(!riskException?.bRiskWatch)
              }
            />
          </p>
          <p className="text-black dark:text-white">
            <strong>Auto Hold White List:</strong>
            <input
              type="checkbox"
              className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={riskException?.bAutoHoldWhite}
              onChange={() =>
                handleAutoHoldTrigger(!riskException?.bAutoHoldWhite)
              }
            />
          </p>
          <p className="text-black dark:text-white">
            <strong>Curr. Month Swipe Cnt (%):</strong>{' '}
            {merchantProfile?.iSwipedPercBasedOnTransCntCurrMonth || 'N/A'}
          </p>
          <p className="text-black dark:text-white">
            <button
              className={`inline-flex items-center justify-center rounded-lg border px-4 py-2 text-white
            ${
              riskException?.fkRiskExceptionStatus === 2
                ? 'border-gray-600 bg-gray-600 cursor-not-allowed'
                : 'border-primary bg-primary hover:bg-opacity-90'
            }`}
              type="button"
              disabled={riskException?.fkRiskExceptionStatus === 2}
              onClick={() => {
                handleClickOnReviewButton().catch(() => {});
              }}
            >
              Review
            </button>
          </p>
        </div>
      </section>

      <section className="mb-4">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="grid grid-cols-4 text-black dark:text-white text-center">
            <p className="text-black dark:text-white">
              <strong>Channel:</strong> {merchantProfile?.sChannel}
            </p>
            <p className="text-black dark:text-white">
              <strong>Reseller:</strong> {merchantProfile?.sReseller}
            </p>
            <p className="text-black dark:text-white">
              <strong>Referral Partner:</strong>{' '}
              {merchantProfile?.sReferralPartner}
            </p>
            <p className="text-black dark:text-white">
              <strong>Solution Consultant:</strong>{' '}
              {merchantProfile?.sSolutionConsultant || 'N/A'}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="grid grid-cols-4 text-black dark:text-white text-center">
            <p>
              <strong>MV ($):</strong> {merchantProfile?.iMV$ || 'N/A'}
              <span className="text-gray-500 dark:text-gray-400">
                {' '}
                (UW Appr.- {merchantProfile?.iUWApprMV})
              </span>
            </p>
            <p>
              <strong>AT ($):</strong> {merchantProfile?.iAT$ || 'N/A'}
              <span className="text-gray-500 dark:text-gray-400">
                {' '}
                (UW Appr.- {merchantProfile?.iUWApprAT})
              </span>
            </p>
            <p>
              <strong>HT ($):</strong> {merchantProfile?.iHT$ || 'N/A'}
              <span className="text-gray-500 dark:text-gray-400">
                {' '}
                (UW Appr.- {merchantProfile?.iUWApprHT})
              </span>
            </p>
            <p>
              <strong>Swipe Vol (%):</strong>{' '}
              {merchantProfile?.iSwipeVolPerc || 'N/A'}
              <span className="text-gray-500 dark:text-gray-400">
                {' '}
                (UW Appr.- {merchantProfile?.iUWApprSwipeVolPerc})
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="mb-4 flex gap-2 border-b border-stroke pb-2 dark:border-strokedark">
        <button
          className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          type="button"
          onClick={() => {
            setActiveTab('contact');
          }}
        >
          Contact
        </button>
        <button
          className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          type="button"
          onClick={() => {
            setActiveTab('exceptions');
          }}
        >
          Exceptions
        </button>
        <button
          className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          type="button"
          onClick={() => {
            setActiveTab('notes');
          }}
        >
          Notes
        </button>
        <button
          className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          type="button"
          onClick={() => {
            setActiveTab('chargebacks');
          }}
        >
          Chargebacks
        </button>
        <button
          className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          type="button"
          onClick={() => {
            setActiveTab('netsettlement');
          }}
        >
          NetSettlement
        </button>
      </nav>

      {/* Contact Tab Content */}
      <section className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        {activeTab === 'contact' && (
          <>
            <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
              Contact
            </h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              {/* Contact Name */}
              <div className="flex items-center min-h-[50px]">
                <p className="text-black dark:text-white">
                  <strong>Contact Name:</strong>{' '}
                  {merchantContactInfo?.contact_name}
                </p>
              </div>

              {/* Contact Email */}
              <div className="flex items-center min-h-[50px]">
                <p className="text-black dark:text-white">
                  <strong>Contact Email address:</strong>{' '}
                  {merchantContactInfo?.contact_email_address}
                </p>
              </div>

              {/* Contact Phone Number */}
              <div className="flex items-center min-h-[50px]">
                <p className="text-black dark:text-white">
                  <strong>Contact phone number:</strong>{' '}
                  {merchantContactInfo?.contact_phone_number}
                </p>
              </div>

              {/* Preferred Contact with Input */}
              <div className="flex items-center min-h-[50px]">
                <p className="text-black dark:text-white flex items-center">
                  <strong>Preferred Contact:</strong>
                  <input
                    type="text"
                    value={merchantUpdateRequest?.preferredContact || ''}
                    onChange={(e) =>
                      setMerchantUpdateRequest((prev) => ({
                        ...prev,
                        preferredContact: e.target.value,
                      }))
                    }
                    placeholder="Alter preferred contact information"
                    className="w-80 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 ml-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </p>
              </div>
            </div>
          </>
        )}
        {activeTab === 'exceptions' && (
          <>
            <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
              Exceptions
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4 text-center">
                      <th className="p-4 font-medium text-black dark:text-white">
                        Trans Date
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Auth Amt
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Trans Amt
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        POS
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        AVS
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Auth Code
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Card #
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        PIN
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Eligible Exceptions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionExceptions?.map((exception) => (
                      <tr key={`${exception.pk}`} className="text-center">
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.dtTransDate}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          ${exception.dAuthAmt}
                        </td>
                        <td
                          className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                          onClick={() => {
                            setIsPopupActive(true);
                            setActivePopup(PopupType.Email);
                            setCurrentTransException(exception);
                          }}
                        >
                          ${exception.dTransAmt}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.sPOS}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.sAVS}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.sAuthCode}
                        </td>
                        <td
                          className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                          onClick={() => {
                            setIsPopupActive(true);
                            setCurrentTransException(exception);
                            setActivePopup(PopupType.CardHistory);
                          }}
                        >
                          {exception.sCardNum}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.sPIN}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.sExceptions
                            .split(',')
                            .map((exceptionNumber) => (
                              <Tooltip
                                text={
                                  exceptionLegends?.filter(
                                    (exceptionLegend) =>
                                      exceptionLegend.ID ===
                                      parseInt(exceptionNumber, 10)
                                  )[0]?.Exception ?? ''
                                }
                              >
                                <span className="cursor-pointer m-[4px] text-blue-600 underline">
                                  {exceptionNumber}
                                </span>
                              </Tooltip>
                            ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        {activeTab === 'notes' && (
          <>
            <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
              Notes
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4 text-center">
                      <th className="p-4 font-medium text-black dark:text-white">
                        Note
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Date Created
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Created By
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Push to Iris
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchantNotes?.map((note) => (
                      <tr key={`${note.pkNotes}`} className="text-center">
                        <td
                          className={`border-b border-[#eee] px-4 py-5 dark:border-strokedark ${
                            note.isPinned
                              ? 'text-red-500'
                              : 'text-black dark:text-white'
                          }`}
                        >
                          {note.sNotes}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {note.dtCreated}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {note.sUserCreated}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <div className="">
                            <input
                              type="checkbox"
                              id={`pushToIris-${note.pkNotes}`}
                              aria-label={`Push note ${note.pkNotes} to Iris`}
                              className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={note.bPushedToIris}
                              checked={note.bPushedToIris}
                              onChange={() => {
                                handlePushNoteToIris(
                                  note.pkNotes.toString()
                                ).catch(() => {});
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <input
                  type="text"
                  value={noteRequest.sNotes ?? ''}
                  onChange={(e) =>
                    setNoteRequest((prev) => ({
                      ...prev,
                      sNotes: e.target.value,
                    }))
                  }
                  placeholder="New Note"
                  className="w-80 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 my-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <span className="m-3">pinned</span>
                <input
                  type="checkbox"
                  id="pin"
                  className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                  disabled={false}
                  checked={noteRequest.isPinned}
                  onChange={(e) =>
                    setNoteRequest((prev) => ({
                      ...prev,
                      isPinned: e.target.checked,
                    }))
                  }
                />
                {/* <button
                  className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 m-5 text-white hover:bg-opacity-90"
                  type="button"
                  onClick={()=>{
                  }}
                > Add</button> */}
              </div>
            </div>
          </>
        )}
        {activeTab === 'chargebacks' && (
          <>
            <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
              Chargebacks
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4 text-center">
                      <th className="p-4 font-medium text-black dark:text-white">
                        case #
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Trans Date
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Amount
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Card #
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Payment Type
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Received Date
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Reference #
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Reason Code
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Created Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchantChargebacks?.map((chargeback) => (
                      <tr key={`${chargeback.pk}`} className="text-center">
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.sCaseNumber}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.dTTrans}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          ${chargeback.dAmt}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.sCardNum}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.sPaymentType}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.dtReceived}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.sReferenceNum}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.dtCreated}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        {activeTab === 'netsettlement' && (
          <>
            <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
              Net Settlement
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-center dark:bg-meta-4 text-center">
                      <th className="p-4 font-medium text-black dark:text-white">
                        Trans Category
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Trans Date
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Trans Amt
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Balance Amt
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Pending Amt
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        WriteOff Amt
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Reason
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Created By
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchantNetSettlements?.map((settlement) => (
                      <tr
                        key={`${settlement.pkNetSettlement}`}
                        className="text-center"
                      >
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {settlement.sTransCategory}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {settlement.dtTranDate}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          ${settlement.dTransAmt}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          ${settlement.dBalAmt}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          ${settlement.dPendingAmt}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          ${settlement.dWriteOffAmt}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {settlement.sReason}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {settlement.sCreatedBy}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark" />
                      </tr>
                    ))}
                    <tr key="total" className="text-center">
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark" />
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark" />
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark" />
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        {merchantNetSettlementData?.totalBalAmt}
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark" />
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark" />
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark" />
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark" />
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark" />
                    </tr>
                  </tbody>
                </table>
                <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white">
                  <div className="flex items-center space-x-4">
                    {/* Amount Field */}
                    <label
                      className="text-gray-700 font-semibold"
                      htmlFor="amount"
                    >
                      Amount:
                    </label>
                    <input
                      type="number"
                      value={newSettlement.amount}
                      className="border border-gray-300 rounded px-2 py-1 w-24"
                      onChange={(e) =>
                        setNewSettlement((prev) => ({
                          ...prev,
                          amount: parseFloat(e.target.value),
                        }))
                      }
                    />

                    {/* Notes Field */}
                    <label
                      className="text-gray-700 font-semibold"
                      htmlFor="notes"
                    >
                      Notes:
                    </label>
                    <input
                      type="text"
                      value={newSettlement.notes}
                      onChange={(e) =>
                        setNewSettlement((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      className="border border-gray-300 rounded px-2 py-1 flex-grow"
                      defaultValue="test test test test"
                    />

                    {/* Action Dropdown */}
                    <label
                      className="text-gray-700 font-semibold"
                      htmlFor="action"
                    >
                      Action:
                    </label>
                    <select
                      value={newSettlement?.action}
                      onChange={(e) =>
                        setNewSettlement((prev) => ({
                          ...prev,
                          action: e.target.value as 'Withdraw' | 'Release',
                        }))
                      }
                      className="border border-gray-300 rounded px-2 py-1 bg-white"
                    >
                      <option value="Withdraw">Withdraw</option>
                      <option value="Release">Release</option>
                    </select>

                    {/* Save Button */}
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleNewNetSettlement()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Volume Table */}
      <section className="mb-4">
        <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
          Volume
        </h2>
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4 text-center">
                  <th className="p-4 font-medium text-black dark:text-white">
                    Month/Year
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Volume
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Avg Ticket
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Swiped %
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Highest Ticket
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Total CB
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    V CB %
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    MC CB %
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Disc CB %
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Amex CB %
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.volume?.map((vol) => (
                  <tr
                    key={`${vol.iYear}-${vol.iMonth}`}
                    className="text-center"
                  >
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.sMonth} {vol.iYear}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      ${vol.dVol.toLocaleString()}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      ${vol.dAvgTkt.toLocaleString()}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.dSwipedPercBasedOnTransCnt.toFixed(2)}%
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      ${vol.dHighestTkt.toLocaleString()}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      ${vol.dTotCB.toLocaleString()}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.dVCBPerc.toFixed(2)}%
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.dMCCBPerc.toFixed(2)}%
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.dDCBPerc.toFixed(2)}%
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.dACBPerc.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="mb-4">
        <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
          Exception type legend
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((colIndex) => (
            <div
              key={colIndex}
              className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5"
            >
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4 text-center">
                      <th className="p-4 font-medium text-black dark:text-white">
                        ID
                      </th>
                      <th className="p-4 font-medium text-black dark:text-white">
                        Exception
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(exceptionLegends ?? [])
                      .filter((_, index) => index % 4 === colIndex)
                      .map((legend) => (
                        <tr key={legend.ID} className="text-center">
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            {legend.ID}
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            {legend.Exception}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
};

export default RiskRadarMerchantPage;
