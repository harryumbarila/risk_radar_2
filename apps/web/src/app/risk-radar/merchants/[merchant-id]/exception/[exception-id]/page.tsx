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
import { Pagination } from '@/components/risk-radar/pagination';
import type { TransactionExceptionResponseDto } from '@/shared/response';
import { Tooltip } from '@/ui/common/tool-tips/risk-tooltip';
import { Popup } from '@/web/src/components/risk-radar/popups/popups';
import { useEmailTemplates } from '@/web/src/hooks/risk-radar/use-email-templates';
import type { CardHistory } from '@/web/src/hooks/risk-radar/use-get-card-history';
import { useCardHistory } from '@/web/src/hooks/risk-radar/use-get-card-history';
import { useMerchant } from '@/web/src/hooks/risk-radar/use-merchant';
import { useMerchantChargebacks } from '@/web/src/hooks/risk-radar/use-merchant-chargebacks';
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

type MerchantContactResponse = {
  businessInfo: {
    dbaName: string;
    dbaAddress: string;
    dbaCity: string;
    dbaState: string;
    dbaZip: string;
    contactPhoneNumber: string;
    dbaFax: string;
    contactEmail: string;
    website: string;
    legalName: string;
    legalAddress: string;
    legalCity: string;
    legalState: string;
    legalZip: string;
    ownershipType: string;
    mccCode: string;
    selfGenerated: string;
    businessType: string;
    activatedDate: string | null;
    monthlyVolume: number;
    averageTicket: number;
    swipedPercentage: number;
    chargebackCount: number;
    irrCount: number;
    isDivert: boolean;
    preferredContact: string;
    exceptionStatusId: number;
    hasCashAdvance: string;
    isRiskWatch: boolean;
    netSettlementBalance: number;
    swipedPercentageTransCount: number;
    channel: string;
    isa: string;
    averageMonthlySalesVolume: number;
    storeFrontSwiped: number;
    isAutoHoldWhiteLabel: boolean;
    highestTicket: number;
    uwNewAccountHoldAllowRiskToEdit: boolean;
    reseller: string;
    referralPartner: string;
    talusPayAccountIndicator: string;
    isv: string;
  };
  owners: Array<{
    name: string;
    ssn4: string;
    dob: string;
    ownerCode: string;
  }>;
  processingSummaries: Array<{
    year: number;
    month: string;
    volume: number;
    averageTicket: number;
    swipedPercentage: number;
    highestTicket: number;
    chargebackAmount: number;
    totalChargebacks: number;
    visaChargebackPercentage: number;
    mastercardChargebackPercentage: number;
    discoverChargebackPercentage: number;
    amexChargebackPercentage: number;
  }>;
  exceptionTypes: Array<{
    id: number;
    description: string;
  }>;
};

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

type EmailTemplate = {
  pkRiskRadarEMailTemplate: string;
  sTemplateName: string;
  sTemplateEMailBody: string;
};

const ITEMS_PER_PAGE = 8;

const RiskRadarMerchantPage: FC<Props> = ({ params }) => {
  const { 'merchant-id': merchantId, 'exception-id': exceptionId } = params;
  const { user } = useAuth();
  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [currentTransException, setCurrentTransException] =
    useState<TransactionExceptionResponseDto | null>(null);
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
  ) as {
    data: MerchantContactResponse | undefined;
    error: unknown;
    isLoading: boolean;
    refetch: () => void;
  };

  // No longer need to make a separate call to useMerchantContactInfo since data is now in the same format
  const { data: transactionExceptionsData } =
    useTransactionExceptions(exceptionId);
  const { data: merchantNotesData, refetch: notesRefetch } =
    useMerchantNotes(merchantId);
  const { data: merchantChargebacksData } = useMerchantChargebacks(merchantId);
  const { data: merchantNetSettlementData, refetch: netsettlementRefresh } =
    useMerchantNetSettlement(merchantId);
  const { data: cardNumberData } = useCardHistory(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    currentTransException?.cardNumber
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

  // Add pagination states
  const [exceptionsPage, setExceptionsPage] = useState(1);
  const [notesPage, setNotesPage] = useState(1);
  const [chargebacksPage, setChargebacksPage] = useState(1);
  const [netSettlementPage, setNetSettlementPage] = useState(1);
  const [volumePage, setVolumePage] = useState(1);

  // Calculate paginated data
  const paginatedExceptions = transactionExceptionsData?.slice(
    (exceptionsPage - 1) * ITEMS_PER_PAGE,
    exceptionsPage * ITEMS_PER_PAGE
  );
  const paginatedNotes = merchantNotesData?.slice(
    (notesPage - 1) * ITEMS_PER_PAGE,
    notesPage * ITEMS_PER_PAGE
  );
  const paginatedChargebacks = merchantChargebacksData?.slice(
    (chargebacksPage - 1) * ITEMS_PER_PAGE,
    chargebacksPage * ITEMS_PER_PAGE
  );
  const paginatedNetSettlements =
    merchantNetSettlementData?.net_settlement?.slice(
      (netSettlementPage - 1) * ITEMS_PER_PAGE,
      netSettlementPage * ITEMS_PER_PAGE
    );
  const paginatedVolume = data?.processingSummaries?.slice(
    (volumePage - 1) * ITEMS_PER_PAGE,
    volumePage * ITEMS_PER_PAGE
  );

  // Calculate total pages
  const totalExceptionsPages = Math.ceil(
    (transactionExceptionsData?.length || 0) / ITEMS_PER_PAGE
  );
  const totalNotesPages = Math.ceil(
    (merchantNotesData?.length || 0) / ITEMS_PER_PAGE
  );
  const totalChargebacksPages = Math.ceil(
    (merchantChargebacksData?.length || 0) / ITEMS_PER_PAGE
  );
  const totalNetSettlementPages = Math.ceil(
    (merchantNetSettlementData?.net_settlement?.length || 0) / ITEMS_PER_PAGE
  );
  const totalVolumePages = Math.ceil(
    (data?.processingSummaries?.length || 0) / ITEMS_PER_PAGE
  );

  // Calculate pagination values
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = cardNumberData?.slice(startIndex, endIndex) || [];

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
      currentTransException.transactionDate
    );

    newTemplate = newTemplate.replaceAll(
      '@dAuthAmt',
      currentTransException.authAmount.toString()
    );

    newTemplate = newTemplate.replaceAll(
      '@dTransAmt',
      currentTransException.transactionAmount.toString()
    );

    newTemplate = newTemplate.replaceAll(
      '@sPOSEntryMode',
      currentTransException.posEntryMode
    );

    newTemplate = newTemplate.replaceAll(
      '@sAVSRespCode',
      currentTransException.avsResponseCode
    );

    newTemplate = newTemplate.replaceAll(
      '@sAuthCode',
      currentTransException.authCode
    );

    newTemplate = newTemplate.replaceAll(
      '@sCardLast4',
      currentTransException.cardNumber.slice(-4)
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
        preferredContact: data?.businessInfo?.preferredContact ?? '',
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

  const merchantProfile = {
    sMId: merchantId,
    sDBAName: data?.businessInfo?.dbaName || '',
    sDBAAddress: data?.businessInfo?.dbaAddress || '',
    sDBACity: data?.businessInfo?.dbaCity || '',
    sDBAState: data?.businessInfo?.dbaState || '',
    sDBAZip: data?.businessInfo?.dbaZip || '',
    sActivationDate: data?.businessInfo?.activatedDate || '',
    sOwnershipType: data?.businessInfo?.ownershipType || '',
    sSIC: data?.businessInfo?.mccCode?.split(' ')[0] || '',
    sSICDesc:
      data?.businessInfo?.mccCode?.split(' ')[1]?.replace(/[()]/g, '') || '',
    sReseller: data?.businessInfo?.reseller || '',
    sMerchantType: data?.businessInfo?.businessType || '',
    bIsTalusPayMerchant: data?.businessInfo?.talusPayAccountIndicator === 'Yes',
    sChannel: data?.businessInfo?.channel || '',
    sReferralPartner: data?.businessInfo?.referralPartner || '',
    sSolutionConsultant: data?.businessInfo?.isv || '',
    iMV$: data?.businessInfo?.monthlyVolume || 0,
    iAT$: data?.businessInfo?.averageTicket || 0,
    iHT$: data?.businessInfo?.highestTicket || 0,
    iSwipeVolPerc: data?.businessInfo?.swipedPercentage || 0,
    iUWApprMV: 0,
    iUWApprAT: 0,
    iUWApprHT: 0,
    iUWApprSwipeVolPerc: 0,
    iSwipedPercBasedOnTransCntCurrMonth:
      data?.businessInfo?.swipedPercentageTransCount || 0,
    sPreferredContact: data?.businessInfo?.preferredContact || '',
  };

  const merchantContactInfo = data?.businessInfo || null;
  const riskException = {
    bDivert: data?.businessInfo?.isDivert || false,
    bRiskWatch: data?.businessInfo?.isRiskWatch || false,
    bAutoHoldWhite: data?.businessInfo?.isAutoHoldWhiteLabel || false,
    fkRiskExceptionStatus: data?.businessInfo?.exceptionStatusId || 0,
  };

  const cardHistory = cardNumberData || [];

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
            <div className="max-w-full overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="max-h-[600px] overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[100px] p-4 font-medium text-black dark:text-white">
                        MID
                      </th>
                      <th className="min-w-[120px] p-4 font-medium text-black dark:text-white">
                        Trans Date
                      </th>
                      <th className="min-w-[100px] p-4 font-medium text-black dark:text-white">
                        Amount
                      </th>
                      <th className="min-w-[80px] p-4 font-medium text-black dark:text-white">
                        POS
                      </th>
                      <th className="min-w-[60px] p-4 font-medium text-black dark:text-white">
                        AVS
                      </th>
                      <th className="min-w-[100px] p-4 font-medium text-black dark:text-white">
                        Auth Code
                      </th>
                      <th className="min-w-[120px] p-4 font-medium text-black dark:text-white">
                        Card #
                      </th>
                      <th className="min-w-[100px] p-4 font-medium text-black dark:text-white">
                        DB Net
                      </th>
                      <th className="min-w-[120px] p-4 font-medium text-black dark:text-white">
                        Trans. Date
                      </th>
                      <th className="min-w-[100px] p-4 font-medium text-black dark:text-white">
                        Net Amt
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((card: CardHistory) => (
                      <tr key={`${card.mid}-${card.transactionDate}`}>
                        <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                          {card.mid}
                        </td>
                        <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                          {new Date(card.transactionDate).toLocaleDateString()}
                        </td>
                        <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                          ${card.amount.toFixed(2)}
                        </td>
                        <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                          {card.posEntryMode}
                        </td>
                        <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                          {card.avsResponseCode}
                        </td>
                        <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                          {card.authCode}
                        </td>
                        <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                          {card.cardNumber}
                        </td>
                        <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                          {card.debitNetworkIdentifier || '-'}
                        </td>
                        <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                          {new Date(card.transmissionDate).toLocaleDateString()}
                        </td>
                        <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                          ${card.netDepositAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-stroke p-4 dark:border-strokedark">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {startIndex + 1} to {endIndex} of {cardHistory.length}{' '}
                  entries
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black disabled:opacity-50 dark:border-strokedark dark:text-white"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={endIndex === cardHistory.length}
                    className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black disabled:opacity-50 dark:border-strokedark dark:text-white"
                  >
                    Next
                  </button>
                </div>
              </div>
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
            <strong>DBA Name:</strong> {merchantContactInfo?.dbaName}
          </p>
          <p className="text-black dark:text-white">
            <strong>Address:</strong>{' '}
            {merchantProfile?.sDBAAddress || merchantContactInfo?.dbaAddress}
          </p>
          <p className="text-black dark:text-white">
            <strong>City:</strong>{' '}
            {merchantProfile?.sDBACity || merchantContactInfo?.dbaCity}
          </p>
          <p className="text-black dark:text-white">
            <strong>State:</strong>{' '}
            {merchantProfile?.sDBAState || merchantContactInfo?.dbaState}
          </p>
          <p className="text-black dark:text-white">
            <strong>ZIP:</strong>{' '}
            {merchantProfile?.sDBAZip || merchantContactInfo?.dbaZip}
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
                  {data?.owners?.[0]?.name || 'N/A'}
                </p>
              </div>

              {/* Contact Email */}
              <div className="flex items-center min-h-[50px]">
                <p className="text-black dark:text-white">
                  <strong>Contact Email address:</strong>{' '}
                  {merchantContactInfo?.contactEmail || 'N/A'}
                </p>
              </div>

              {/* Contact Phone Number */}
              <div className="flex items-center min-h-[50px]">
                <p className="text-black dark:text-white">
                  <strong>Contact phone number:</strong>{' '}
                  {merchantContactInfo?.contactPhoneNumber || 'N/A'}
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
                    {paginatedExceptions?.map((exception) => (
                      <tr
                        key={`${exception.transactionId}`}
                        className="text-center"
                      >
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.transactionDate}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          ${exception.authAmount}
                        </td>
                        <td
                          className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                          onClick={() => {
                            setIsPopupActive(true);
                            setActivePopup(PopupType.Email);
                            setCurrentTransException(exception);
                          }}
                        >
                          ${exception.transactionAmount}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.posEntryMode}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.avsResponseCode}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.authCode}
                        </td>
                        <td
                          className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                          onClick={() => {
                            setIsPopupActive(true);
                            setCurrentTransException(exception);
                            setActivePopup(PopupType.CardHistory);
                          }}
                        >
                          {exception.cardNumber}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.debitNetworkIdentifier}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.exceptionList &&
                            exception.exceptionList
                              .split(' ')
                              .filter(Boolean)
                              .map((exceptionNumber) => (
                                <Tooltip
                                  key={exceptionNumber}
                                  text={
                                    data?.exceptionTypes?.filter(
                                      (exceptionType) =>
                                        exceptionType.id ===
                                        parseInt(exceptionNumber, 10)
                                    )[0]?.description ?? ''
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
                <Pagination
                  currentPage={exceptionsPage}
                  totalPages={totalExceptionsPages}
                  onPageChange={setExceptionsPage}
                />
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
                    {paginatedNotes?.map((note) => (
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
                <Pagination
                  currentPage={notesPage}
                  totalPages={totalNotesPages}
                  onPageChange={setNotesPage}
                />
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
                        Case #
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
                      <th className="p-4 font-medium text-black dark:text-white">
                        P2 Chargeback
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedChargebacks?.map((chargeback) => (
                      <tr
                        key={`${chargeback.sCaseNumber}`}
                        className="text-center"
                      >
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.sCaseNumber}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {new Date(chargeback.dtTrans).toLocaleDateString()}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          ${chargeback.dAmt.toFixed(2)}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.sCardNum}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.sPaymentType}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {new Date(chargeback.dtReceived).toLocaleDateString()}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.sReferenceNum}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.ReasonCodeDescription}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {new Date(chargeback.dtCreated).toLocaleDateString()}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.bP2ChargebacksExists ? 'Yes' : 'No'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  currentPage={chargebacksPage}
                  totalPages={totalChargebacksPages}
                  onPageChange={setChargebacksPage}
                />
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
                    {paginatedNetSettlements?.map((settlement) => (
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
                <Pagination
                  currentPage={netSettlementPage}
                  totalPages={totalNetSettlementPages}
                  onPageChange={setNetSettlementPage}
                />
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
                {paginatedVolume?.map((vol) => (
                  <tr key={`${vol.year}-${vol.month}`} className="text-center">
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.month} {vol.year}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      ${vol.volume.toLocaleString()}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      ${vol.averageTicket.toLocaleString()}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.swipedPercentage.toFixed(2)}%
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      ${vol.highestTicket.toLocaleString()}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      ${vol.totalChargebacks.toLocaleString()}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.visaChargebackPercentage.toFixed(2)}%
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.mastercardChargebackPercentage.toFixed(2)}%
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.discoverChargebackPercentage.toFixed(2)}%
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {vol.amexChargebackPercentage.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={volumePage}
              totalPages={totalVolumePages}
              onPageChange={setVolumePage}
            />
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
                    {(data?.exceptionTypes ?? [])
                      .filter((_, index: number) => index % 4 === colIndex)
                      .map((legend) => (
                        <tr key={legend.id} className="text-center">
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            {legend.id}
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            {legend.description}
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
