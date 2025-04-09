/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */

'use client';

import { Breadcrumb, Loader } from '@denali/ui';
import { useAuth } from '@frontegg/nextjs';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { DefaultLayout } from '@/components/layouts/default-layout';
import { Pagination } from '@/components/risk-radar/pagination';
import type {
  EmailTemplate,
  TransactionExceptionResponseDto,
} from '@/shared/response';
import { Tooltip } from '@/ui/common/tool-tips/risk-tooltip';
import { Popup } from '@/web/src/components/risk-radar/popups/popups';
import {
  formatDate,
  formatDateWithoutTime,
} from '@/web/src/components/risk-radar/risk-radar-table/table/formatters';
import { useEmailTemplates } from '@/web/src/hooks/risk-radar/use-email-templates';
import type { CardHistory } from '@/web/src/hooks/risk-radar/use-get-card-history';
import { useCardHistory } from '@/web/src/hooks/risk-radar/use-get-card-history';
import { useMerchant } from '@/web/src/hooks/risk-radar/use-merchant';
import { useMerchantChargebacks } from '@/web/src/hooks/risk-radar/use-merchant-chargebacks';
import { useMerchantNotes } from '@/web/src/hooks/risk-radar/use-merchant-notes';
import { useMerchantsWithSameTaxId } from '@/web/src/hooks/risk-radar/use-merchants-with-same-tax-id';
import { usePushNoteToIris } from '@/web/src/hooks/risk-radar/use-push-note-to-iris';
import type { SaveMerchantDataParams } from '@/web/src/hooks/risk-radar/use-save-merchant-data';
import { useSaveMerchantData } from '@/web/src/hooks/risk-radar/use-save-merchant-data';
import { useTransactionExceptions } from '@/web/src/hooks/risk-radar/use-transaction-exceptions';

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
    averageTicketSizeAmount: number;
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

const ITEMS_PER_PAGE = 8;

// Add a type for our new state
type MerchantStateData = {
  isDiverted: boolean;
  preferredContact: string;
  notes: string;
  isPinnedNote: boolean;
  clickedStatus?: string;
  isRiskWatch: boolean;
  isAutoHoldEnabled: boolean;
};

// Add this after the MerchantStateData type
type ChangedFields = {
  isDiverted?: boolean;
  preferredContact?: boolean;
  notes?: boolean;
  isPinnedNote?: boolean;
  clickedStatus?: boolean;
  isRiskWatch?: boolean;
  isAutoHoldEnabled?: boolean;
};

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

  // State for merchant save data
  const [merchantStateData, setMerchantStateData] = useState<MerchantStateData>(
    {
      isDiverted: false,
      preferredContact: '',
      notes: '',
      isPinnedNote: false,
      isRiskWatch: false,
      isAutoHoldEnabled: false,
    }
  );

  // Original data from API
  const [originalData, setOriginalData] = useState<{
    isDiverted?: boolean;
    preferredContact?: string;
    isRiskWatch?: boolean;
    isAutoHoldEnabled?: boolean;
  }>({});

  // Track which fields have changed
  const [changedFields, setChangedFields] = useState<ChangedFields>({});

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
  const { data: cardNumberData } = useCardHistory(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    currentTransException?.cardNumber
  );
  const { data: emailTemplatesData } = useEmailTemplates();

  const { pushNote } = usePushNoteToIris();
  const { saveMerchantdata } = useSaveMerchantData();

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
  const [volumePage, setVolumePage] = useState(1);

  // Add new state for Same Tax ID pagination
  const [sameTaxIdPage, setSameTaxIdPage] = useState(1);

  // Add isSaving state
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Update merchantStateData when data changes
  useEffect(() => {
    if (data) {
      // Store original values for comparison
      setOriginalData({
        isDiverted: data?.businessInfo?.isDivert || false,
        preferredContact: data?.businessInfo?.preferredContact || '',
        isRiskWatch: data?.businessInfo?.isRiskWatch || false,
        isAutoHoldEnabled: data?.businessInfo?.isAutoHoldWhiteLabel || false,
      });

      // Update merchantStateData
      setMerchantStateData({
        isDiverted: data?.businessInfo?.isDivert || false,
        preferredContact: data?.businessInfo?.preferredContact || '',
        notes: '',
        isPinnedNote: false,
        isRiskWatch: data?.businessInfo?.isRiskWatch || false,
        isAutoHoldEnabled: data?.businessInfo?.isAutoHoldWhiteLabel || false,
      });

      // Reset changed fields when new data loads
      setChangedFields({});

      // Keep existing behavior for backward compatibility
      setMerchantUpdateRequest((prev) => ({
        ...prev,
        preferredContact: data?.businessInfo?.preferredContact ?? '',
      }));
    }
  }, [data]);

  // Update merchantStateData when noteRequest changes
  useEffect(() => {
    if (noteRequest.sNotes !== null) {
      setMerchantStateData((prev) => ({
        ...prev,
        notes: noteRequest.sNotes || '',
        isPinnedNote: noteRequest.isPinned,
      }));

      // Track that notes have changed
      setChangedFields((prev) => ({
        ...prev,
        notes: true,
        isPinnedNote: true,
      }));
    }
  }, [noteRequest]);

  // Update merchantStateData when merchantUpdateRequest changes
  useEffect(() => {
    setMerchantStateData((prev) => ({
      ...prev,
      preferredContact: merchantUpdateRequest.preferredContact,
    }));
  }, [merchantUpdateRequest]);

  // Update changedFields when preferredContact changes
  useEffect(() => {
    if (
      originalData.preferredContact !== undefined &&
      merchantStateData.preferredContact !== originalData.preferredContact
    ) {
      setChangedFields((prev) => ({
        ...prev,
        preferredContact: true,
      }));
    }
  }, [merchantStateData.preferredContact, originalData.preferredContact]);

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
  const totalVolumePages = Math.ceil(
    (data?.processingSummaries?.length || 0) / ITEMS_PER_PAGE
  );

  // Calculate pagination values
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = cardNumberData?.slice(startIndex, endIndex) || [];

  const { data: merchantsWithSameTaxIdData, isLoading: sameTaxIdLoading } =
    useMerchantsWithSameTaxId(merchantId);

  // Calculate paginated data for same tax ID merchants
  const paginatedSameTaxIdMerchants =
    merchantsWithSameTaxIdData?.merchantIds?.slice(
      (sameTaxIdPage - 1) * ITEMS_PER_PAGE,
      sameTaxIdPage * ITEMS_PER_PAGE
    );

  // Calculate total pages for same tax ID
  const totalSameTaxIdPages = Math.ceil(
    (merchantsWithSameTaxIdData?.merchantIds?.length || 0) / ITEMS_PER_PAGE
  );

  const handlePushNoteToIris = async (note: string): Promise<void> => {
    await pushNote(note, merchantId);
    notesRefetch();
  };

  // Helper function to save only changed fields
  const saveChangedFields = async (
    singleFieldUpdate?: Record<string, unknown>
  ): Promise<void> => {
    try {
      if (!user?.name) {
        return;
      }

      setIsSaving(true);

      // If we're saving a single field immediately, just use that
      if (singleFieldUpdate) {
        await saveMerchantdata({
          merchantId,
          exceptionId: parseInt(exceptionId, 10),
          createdBy: user.name,
          ...singleFieldUpdate,
        });
      } else {
        // Construct payload with only changed fields
        const payload: SaveMerchantDataParams = {
          merchantId,
          exceptionId: parseInt(exceptionId, 10),
          createdBy: user.name,
        };

        if (changedFields.isDiverted) {
          payload.isDiverted = merchantStateData.isDiverted;
        }

        if (changedFields.preferredContact) {
          payload.preferredContact = merchantStateData.preferredContact;
        }

        if (changedFields.notes) {
          payload.notes = merchantStateData.notes;
        }

        if (changedFields.isPinnedNote) {
          payload.isPinnedNote = merchantStateData.isPinnedNote;
        }

        if (changedFields.clickedStatus) {
          payload.clickedStatus = merchantStateData.clickedStatus;
        }

        if (changedFields.isRiskWatch) {
          payload.isRiskWatch = merchantStateData.isRiskWatch;
        }

        if (changedFields.isAutoHoldEnabled) {
          payload.isAutoHoldEnabled = merchantStateData.isAutoHoldEnabled;
        }

        await saveMerchantdata(payload);
      }

      // Reset changed fields after successful save
      setChangedFields({});

      refetch();
      notesRefetch();
    } catch (err) {
      // console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Modified handler to save immediately if saveImmediately is true
  const handleDivertTrigger = async (
    diverted: boolean,
    saveImmediately = false
  ): Promise<void> => {
    setMerchantStateData((prev) => ({
      ...prev,
      isDiverted: diverted,
    }));

    setChangedFields((prev) => ({
      ...prev,
      isDiverted: diverted,
    }));

    if (saveImmediately && user?.name) {
      await saveChangedFields({ isDiverted: diverted });
    }
  };

  const handleRiskWatchTrigger = async (
    value: boolean,
    saveImmediately = false
  ): Promise<void> => {
    setMerchantStateData((prev) => ({
      ...prev,
      isRiskWatch: value,
    }));

    setChangedFields((prev) => ({
      ...prev,
      isRiskWatch: true,
    }));

    if (saveImmediately && user?.name) {
      await saveChangedFields({ isRiskWatch: value });
    }
  };

  const handleAutoHoldTrigger = async (
    value: boolean,
    saveImmediately = false
  ): Promise<void> => {
    setMerchantStateData((prev) => ({
      ...prev,
      isAutoHoldEnabled: value,
    }));

    setChangedFields((prev) => ({
      ...prev,
      isAutoHoldEnabled: true,
    }));

    if (saveImmediately && user?.name) {
      await saveChangedFields({ isAutoHoldEnabled: value });
    }
  };

  const handleManagersQueueTrigger = async (): Promise<void> => {
    const newStatus =
      merchantStateData.clickedStatus === 'mgrq' ? 'none' : 'mgrq';
    setMerchantStateData((prev) => ({
      ...prev,
      clickedStatus: newStatus,
    }));

    setChangedFields((prev) => ({
      ...prev,
      clickedStatus: true,
    }));

    if (user?.name) {
      await saveChangedFields({ clickedStatus: newStatus });
    }
  };

  const handleClickOnReviewButton = async (): Promise<void> => {
    if (user?.name) {
      const newStatus =
        merchantStateData.clickedStatus === 'rev' ? 'none' : 'rev';
      setMerchantStateData((prev) => ({
        ...prev,
        clickedStatus: newStatus,
      }));

      setChangedFields((prev) => ({
        ...prev,
        clickedStatus: true,
      }));

      await saveChangedFields({ clickedStatus: newStatus });
    }
  };

  // Updated save handler that uses our helper function
  const handleSaveMerchantData = async (): Promise<void> => {
    try {
      setIsSaving(true);
      await saveMerchantdata({
        merchantId,
        exceptionId: parseInt(exceptionId, 10),
        createdBy: user?.name ?? '',
        ...merchantStateData,
      });

      // Reset form values after successful save
      setMerchantStateData({
        ...merchantStateData,
        notes: '',
        isPinnedNote: false,
        clickedStatus: 'none',
      });

      setNoteRequest({
        sNotes: null,
        isPinned: false,
        author: user?.name ?? null,
      });
      // Reset changed fields
      setChangedFields({});

      // Refresh data
      refetch();
      notesRefetch();
    } catch (error) {
      // console.error('Error saving merchant data:', error);
    } finally {
      setIsSaving(false);
    }
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

  if (!merchantId) {
    notFound();
  }

  if (isLoading) {
    return (
      <DefaultLayout>
        <Loader />
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-500 text-lg">Error loading merchant data</p>
        </div>
      </DefaultLayout>
    );
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
    sSIC: data?.businessInfo?.mccCode || '',
    sReseller: data?.businessInfo?.reseller || '',
    sMerchantType: data?.businessInfo?.businessType || '',
    bIsTalusPayMerchant: data?.businessInfo?.talusPayAccountIndicator === 'Yes',
    sChannel: data?.businessInfo?.channel || '',
    sReferralPartner: data?.businessInfo?.referralPartner || '',
    sSolutionConsultant: data?.businessInfo?.isa || '',
    iMV$: data?.businessInfo?.monthlyVolume || 0,
    iAT$: data?.businessInfo?.averageTicket || 0,
    iHT$: data?.businessInfo?.highestTicket || 0,
    iSwipeVolPerc: data?.businessInfo?.swipedPercentage || 0,
    iUWApprMV: data?.businessInfo?.averageMonthlySalesVolume || 0,
    iUWApprAT: data?.businessInfo?.averageTicketSizeAmount || 0,
    iUWApprHT: data?.businessInfo?.highestTicket || 0,
    iUWApprSwipeVolPerc: data?.businessInfo?.storeFrontSwiped || 0,
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

  const emailTemplates =
    emailTemplatesData!.templates?.length > 0
      ? emailTemplatesData!.templates
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
                          {formatDate(card.transactionDate)}
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
                          {formatDate(card.transmissionDate)}
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
                      template.id == parseInt(e.target.value, 10)
                  )?.templateEmailBody;
                  if (template) {
                    replaceEmailTemplateParameters(template);
                  }
                }}
              >
                {emailTemplates.map((template: EmailTemplate) => (
                  <option value={template.id}>{template.templateName}</option>
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
              disabled={!data?.businessInfo?.uwNewAccountHoldAllowRiskToEdit}
              checked={merchantStateData.isDiverted}
              onChange={() =>
                handleDivertTrigger(!merchantStateData.isDiverted, true)
              }
            />
          </p>
          <p className="text-black dark:text-white">
            <strong>Activated:</strong>{' '}
            {formatDate(merchantProfile?.sActivationDate)}
          </p>

          {riskException?.fkRiskExceptionStatus === 1 ? (
            <p className="text-black dark:text-white">
              <button
                className={`inline-flex items-center justify-center rounded-lg border px-4 py-2 text-white transition-colors
                ${
                  merchantStateData.clickedStatus === 'mgrq'
                    ? 'border-amber-600 bg-amber-600 hover:bg-amber-700'
                    : 'border-primary bg-primary hover:bg-opacity-90'
                }`}
                type="button"
                onClick={() => {
                  handleManagersQueueTrigger().catch(() => {});
                }}
              >
                {merchantStateData.clickedStatus === 'mgrq'
                  ? "In Manager's Queue"
                  : 'Managers queue'}
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
            <strong>SIC:</strong> {merchantProfile?.sSIC}
          </p>
        </div>

        {/* Column 3 */}
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
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
              checked={merchantStateData.isRiskWatch}
              onChange={() =>
                handleRiskWatchTrigger(!merchantStateData.isRiskWatch, true)
              }
            />
          </p>
          <p className="text-black dark:text-white">
            <strong>Auto Hold White List:</strong>
            <input
              type="checkbox"
              className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={merchantStateData.isAutoHoldEnabled}
              onChange={() =>
                handleAutoHoldTrigger(
                  !merchantStateData.isAutoHoldEnabled,
                  true
                )
              }
            />
          </p>
          <p className="text-black dark:text-white">
            <strong>Curr. Month Swipe Cnt (%):</strong>{' '}
            {merchantProfile?.iSwipedPercBasedOnTransCntCurrMonth || ''}
          </p>
          <p className="text-black dark:text-white">
            <button
              className={`inline-flex items-center justify-center rounded-lg border px-4 py-2 text-white transition-colors
              ${
                merchantStateData.clickedStatus === 'rev'
                  ? 'border-green-600 bg-green-600 hover:bg-green-700'
                  : riskException?.fkRiskExceptionStatus === 2
                    ? 'border-gray-600 bg-gray-600 cursor-not-allowed'
                    : 'border-primary bg-primary hover:bg-opacity-90'
              }`}
              type="button"
              disabled={riskException?.fkRiskExceptionStatus === 2}
              onClick={() => {
                handleClickOnReviewButton().catch(() => {});
              }}
            >
              {merchantStateData.clickedStatus === 'rev'
                ? 'Reviewed'
                : 'Review'}
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
              {merchantProfile?.sSolutionConsultant || ''}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="grid grid-cols-4 text-black dark:text-white text-center">
            <p>
              <strong>MV ($):</strong> {merchantProfile?.iMV$ || ''}
              <span className="text-gray-500 dark:text-gray-400">
                {' '}
                (UW Appr.- {merchantProfile?.iUWApprMV})
              </span>
            </p>
            <p>
              <strong>AT ($):</strong> {merchantProfile?.iAT$ || ''}
              <span className="text-gray-500 dark:text-gray-400">
                {' '}
                (UW Appr.- {merchantProfile?.iUWApprAT})
              </span>
            </p>
            <p>
              <strong>HT ($):</strong>
              <span className="text-gray-500 dark:text-gray-400">
                {' '}
                (UW Appr.- {merchantProfile?.iUWApprHT})
              </span>
            </p>
            <p>
              <strong>Swipe Vol (%):</strong>{' '}
              {merchantProfile?.iSwipeVolPerc || ''}
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
        <button
          className="inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          type="button"
          onClick={() => {
            setActiveTab('sameTaxId');
          }}
        >
          Match
        </button>
      </nav>

      {/* Contact Tab Content */}
      <section className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        {activeTab === 'contact' && (
          <>
            <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
              Contact
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column - Contact Info */}
              <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
                  Contact Info
                </h3>
                <p className="mb-2 text-black dark:text-white">
                  <strong>Contact Name:</strong> {data?.owners?.[0]?.name || ''}
                </p>
                <p className="mb-2 text-black dark:text-white">
                  <strong>Phone #:</strong>{' '}
                  {merchantContactInfo?.contactPhoneNumber || ''}
                </p>
                <p className="mb-2 text-black dark:text-white">
                  <strong>Fax #:</strong> {merchantContactInfo?.dbaFax || ''}
                </p>
                <p className="mb-2 text-black dark:text-white">
                  <strong>Mobile #:</strong>
                </p>
                <p className="mb-2 text-black dark:text-white">
                  <strong>Email:</strong>{' '}
                  {merchantContactInfo?.contactEmail || ''}
                </p>
                <p className="mb-2 text-black dark:text-white">
                  <strong>Web Site:</strong>{' '}
                  {merchantContactInfo?.website || ''}
                </p>
                <div className="mb-2">
                  <p className="text-black dark:text-white flex items-start">
                    <strong className="inline-block mr-2">
                      Preferred Contact:
                    </strong>
                    <input
                      type="text"
                      value={merchantUpdateRequest?.preferredContact || ''}
                      onChange={(e) => {
                        setMerchantUpdateRequest((prev) => ({
                          ...prev,
                          preferredContact: e.target.value,
                        }));

                        // Track that preferredContact has changed
                        setChangedFields((prev) => ({
                          ...prev,
                          preferredContact: true,
                        }));
                      }}
                      placeholder="Enter preferred contact"
                      className="rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </p>
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    className="inline-flex w-[100px] items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      handleSaveMerchantData().catch(() => {});
                    }}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Right Column - Billing Address */}
              <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
                  Billing Address
                </h3>
                <p className="mb-1 text-black dark:text-white">
                  <strong>Name:</strong> {data?.owners?.[0]?.name || ''}
                </p>
                <p className="mb-1 text-black dark:text-white">
                  <strong>Addr:</strong>{' '}
                  {data?.businessInfo?.legalAddress || ''}
                </p>
                <p className="mb-1 text-black dark:text-white">
                  <strong>City:</strong> {data?.businessInfo?.legalCity || ''}
                </p>
                <p className="mb-1 text-black dark:text-white">
                  <strong>ST:</strong> {data?.businessInfo?.legalState || ''}{' '}
                  <strong>Zip:</strong> {data?.businessInfo?.legalZip || ''}
                </p>
              </div>
            </div>

            {/* Owner Info Section */}
            <div className="mt-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
                Owner Info
              </h3>
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-blue-600 text-center text-white">
                      <th className="p-2 font-medium">Name</th>
                      <th className="p-2 font-medium">SSN Last 4</th>
                      <th className="p-2 font-medium">DOB</th>
                      <th className="p-2 font-medium">DL #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.owners?.map((owner) => (
                      <tr key={owner.ownerCode} className="text-center">
                        <td className="border-b border-[#eee] p-2 dark:border-strokedark">
                          {owner.name}
                        </td>
                        <td className="border-b border-[#eee] p-2 dark:border-strokedark">
                          {owner.ssn4}
                        </td>
                        <td className="border-b border-[#eee] p-2 dark:border-strokedark">
                          {owner.dob}
                        </td>
                        <td className="border-b border-[#eee] p-2 dark:border-strokedark">
                          {/* No driver's license data available */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                    <tr className="bg-gray-2 dark:bg-meta-4 text-center">
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
                    {paginatedExceptions?.map((exception, index) => (
                      <tr
                        // eslint-disable-next-line react/no-array-index-key
                        key={`${exception.transactionId}-${index}`}
                        className="text-center"
                      >
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {formatDate(exception.transactionDate)}
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
                          {exception.cardNumber}{' '}
                          {exception.transactionId?.slice(-4)}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.debitNetworkIdentifier}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {exception.exceptionList &&
                            exception.exceptionList
                              .split(' - ')
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
                    <tr className="bg-gray-2 dark:bg-meta-4 text-center">
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
                          {formatDate(note.dtCreated)}
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
                <div className="flex items-center gap-4 justify-center mt-[5px]">
                  <input
                    type="text"
                    value={noteRequest.sNotes ?? ''}
                    onChange={(e) => {
                      setNoteRequest((prev) => ({
                        ...prev,
                        sNotes: e.target.value,
                      }));

                      // Track that notes have changed
                      setChangedFields((prev) => ({
                        ...prev,
                        notes: true,
                      }));
                    }}
                    placeholder="New Note"
                    className="max-w-[400px] rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <div className="flex items-center gap-2">
                    <span>pinned</span>
                    <input
                      type="checkbox"
                      id="pin"
                      className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled={false}
                      checked={noteRequest.isPinned}
                      onChange={(e) => {
                        setNoteRequest((prev) => ({
                          ...prev,
                          isPinned: e.target.checked,
                        }));

                        // Track that isPinnedNote has changed
                        setChangedFields((prev) => ({
                          ...prev,
                          isPinnedNote: true,
                        }));
                      }}
                    />
                  </div>
                  <button
                    className="inline-flex w-[100px] items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      handleSaveMerchantData().catch(() => {});
                    }}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
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
                    <tr className="bg-gray-2 dark:bg-meta-4 text-center">
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
                          {formatDateWithoutTime(chargeback.dtTrans)}
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
                          {formatDateWithoutTime(chargeback.dtReceived)}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.sReferenceNum}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {chargeback.ReasonCodeDescription}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {formatDate(chargeback.dtCreated)}
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
          <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
            Coming soon
          </h2>
        )}
        {activeTab === 'sameTaxId' && (
          <>
            <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
              Merchants with Same Tax ID
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {sameTaxIdLoading ? (
                <p>Loading merchants with the same tax ID...</p>
              ) : merchantsWithSameTaxIdData?.merchantIds?.length ? (
                <div className="max-w-full overflow-x-auto">
                  <div className="mb-3 text-sm">
                    The following merchants share the same Tax ID as the current
                    merchant ({merchantId}). This information can be useful for
                    identifying related businesses or potential fraud.
                  </div>
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-2 dark:bg-meta-4 text-center">
                        <th className="p-4 font-medium text-black dark:text-white">
                          Merchant ID
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedSameTaxIdMerchants?.map((merchantId) => (
                        <tr key={merchantId} className="text-center">
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            {merchantId}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {totalSameTaxIdPages > 1 && (
                    <Pagination
                      currentPage={sameTaxIdPage}
                      totalPages={totalSameTaxIdPages}
                      onPageChange={setSameTaxIdPage}
                    />
                  )}
                </div>
              ) : (
                <div className="p-4 border border-gray-200 rounded-md">
                  <p className="text-gray-600">
                    No other merchants found with the same Tax ID.
                  </p>
                </div>
              )}
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
                <tr className="bg-gray-2 dark:bg-meta-4 text-center">
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
                    <tr className="bg-gray-2 dark:bg-meta-4 text-center">
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
