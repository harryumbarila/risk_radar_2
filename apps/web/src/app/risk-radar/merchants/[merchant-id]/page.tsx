/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */

'use client';

import { Breadcrumb, Loader } from '@denali/ui';
import { useAuth } from '@frontegg/nextjs';
import classNames from 'classnames';
import { format } from 'date-fns';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { DefaultLayout } from '@/components/layouts/default-layout';
import { Pagination } from '@/components/risk-radar/pagination';
import type {
  EmailTemplate,
  TransactionExceptionResponseDto,
} from '@/shared/response';
import { Tooltip } from '@/ui/common/tool-tips/risk-tooltip';
import { Popup } from '@/web/src/components/risk-radar/popups/popups';
import {
  formatCurrency,
  formatDate,
  formatDateWithoutTime,
} from '@/web/src/components/risk-radar/risk-radar-table/table/formatters';
import { VolumeTable } from '@/web/src/components/risk-radar/volumen-table/volumen-table';
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
import { useSendExceptionMemoEmail } from '@/web/src/hooks/risk-radar/use-send-exception-memo-email';
import { useTransactionExceptions } from '@/web/src/hooks/risk-radar/use-transaction-exceptions';
import type { VolumenType } from '@/web/src/types/exception';

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
  processingSummaries: VolumenType[];
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
  const { 'merchant-id': merchantId } = params;
  const router = useRouter();

  const searchParams = useSearchParams();

  const exceptionId = searchParams?.get('exceptionId') || '';

  const { user } = useAuth();
  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [currentTransException, setCurrentTransException] =
    useState<TransactionExceptionResponseDto | null>(null);
  const [isPopupActive, setIsPopupActive] = useState<boolean>(false);
  const [activePopup, setActivePopup] = useState<PopupType>(PopupType.Email);

  const [email, setEmail] = useState<string>('');
  const [templateData, setTemplateData] = useState<{
    templateId: number | null;
    body: string;
  }>({
    templateId: null,
    body: '',
  });

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

  // Move activeTab state declaration to before it's used
  const [activeTab, setActiveTab] = useState<string>(
    exceptionId ? 'exceptions' : 'contact'
  );

  // Add tab-specific loading states
  const [isExceptionsLoading, setIsExceptionsLoading] =
    useState<boolean>(false);
  const [isNotesLoading, setIsNotesLoading] = useState<boolean>(false);
  const [isChargebacksLoading, setIsChargebacksLoading] =
    useState<boolean>(false);
  const [isSameTaxIdLoading, setIsSameTaxIdLoading] = useState<boolean>(false);

  // Main merchant data - always load this
  const { data, error, isLoading, refetch } = useMerchant(
    merchantId,
    exceptionId
  ) as {
    data: MerchantContactResponse | undefined;
    error: unknown;
    isLoading: boolean;
    refetch: () => void;
  };

  // Always call hooks but with conditional parameters
  const { data: transactionExceptionsData } = useTransactionExceptions(
    activeTab === 'exceptions' && exceptionId ? exceptionId : null
  );

  const { data: merchantNotesData, refetch: notesRefetch } = useMerchantNotes(
    activeTab === 'notes' ? merchantId : null
  );

  const { data: merchantChargebacksData } = useMerchantChargebacks(
    activeTab === 'chargebacks' ? merchantId : null
  );

  // Card history data is only needed when the card history popup is active
  const { data: cardNumberData } = useCardHistory(
    // Only load card history data when popup is active with card history
    isPopupActive &&
      activePopup === PopupType.CardHistory &&
      currentTransException
      ? currentTransException.cardNumber
      : null
  );

  const { data: emailTemplatesData } = useEmailTemplates();

  const { data: merchantsWithSameTaxIdData } = useMerchantsWithSameTaxId(
    activeTab === 'sameTaxId' ? merchantId : null
  );

  // Monitor data loading states
  useEffect(() => {
    if (activeTab === 'exceptions') {
      setIsExceptionsLoading(!transactionExceptionsData);
    } else if (activeTab === 'notes') {
      setIsNotesLoading(!merchantNotesData);
    } else if (activeTab === 'chargebacks') {
      setIsChargebacksLoading(!merchantChargebacksData);
    } else if (activeTab === 'sameTaxId') {
      setIsSameTaxIdLoading(!merchantsWithSameTaxIdData);
    }
  }, [
    activeTab,
    transactionExceptionsData,
    merchantNotesData,
    merchantChargebacksData,
    merchantsWithSameTaxIdData,
  ]);

  const { pushNote } = usePushNoteToIris();
  const { saveMerchantdata } = useSaveMerchantData();
  const { sendExceptionMemoEmail } = useSendExceptionMemoEmail();

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

  // Add new state for Same Tax ID pagination
  const [sameTaxIdPage, setSameTaxIdPage] = useState(1);

  // Add isSaving state
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Add isSendingEmail state
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);

  // Add new state for tracking loading states
  const [isCardHistoryLoading, setIsCardHistoryLoading] =
    useState<boolean>(false);
  const [isEmailTemplateLoading, setIsEmailTemplateLoading] =
    useState<boolean>(false);

  // Add a state for tracking review status
  const [reviewStatus, setReviewStatus] = useState<
    'none' | 'reviewing' | 'reviewed'
  >('none');

  // Add an effect to clear the card history loading state when data is received
  useEffect(() => {
    if (isCardHistoryLoading && cardNumberData) {
      setIsCardHistoryLoading(false);
    }
  }, [cardNumberData, isCardHistoryLoading]);

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

      setEmail(data.businessInfo.contactEmail || '');

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
  const paginatedVolume = data?.processingSummaries;

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

  // Calculate pagination values with strict enforcement
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    cardNumberData?.length || 0
  );
  const currentItems = cardNumberData?.slice(startIndex, endIndex) || [];

  // Calculate total pages
  const totalPages = Math.ceil((cardNumberData?.length || 0) / itemsPerPage);

  // Ensure currentPage stays within bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

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

  const handlePushNoteToIris = async (noteId: number): Promise<void> => {
    await pushNote(noteId, merchantId);
    refetch();
    notesRefetch();
  };

  // Update the saveChangedFields function to properly throw errors
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
        const response = await saveMerchantdata({
          merchantId,
          exceptionId: parseInt(exceptionId, 10),
          createdBy: user.name,
          ...singleFieldUpdate,
        });
        // If the API returns an error message, throw it
        if (response && typeof response === 'object' && 'message' in response) {
          const message = response.message as string;
          if (message && message.includes('already reviewed')) {
            throw new Error(message);
          }
        }
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

        const response = await saveMerchantdata(payload);

        // If the API returns an error message, throw it
        if (response && typeof response === 'object' && 'message' in response) {
          const message = response.message as string;
          if (message && message.includes('already reviewed')) {
            throw new Error(message);
          }
        }
      }

      // Reset changed fields after successful save
      setChangedFields({});

      refetch();
      notesRefetch();
    } finally {
      setIsSaving(false);
    }
  };

  // Modified handleClickOnReviewButton to handle the review process
  const handleClickOnReviewButton = async (): Promise<void> => {
    if (user?.name) {
      if (reviewStatus === 'reviewed') {
        // If already reviewed, don't do anything
        return;
      }

      try {
        // Set to reviewing state immediately
        setReviewStatus('reviewing');

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

        // If successful, set to reviewed
        if (newStatus === 'rev') {
          setReviewStatus('reviewed');
        } else {
          setReviewStatus('none');
        }

        router.push('/risk-radar');
      } catch (error) {
        // The error message is now properly exposed by the enhanced hook
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        if (errorMessage.includes('already reviewed')) {
          // Mark as reviewed if already reviewed
          setReviewStatus('reviewed');
          // Also update merchant state
          setMerchantStateData((prev) => ({
            ...prev,
            clickedStatus: 'rev',
          }));
          toast.info('This exception was already reviewed by someone else.');
        } else {
          // Reset to normal state if other error
          setReviewStatus('none');
          // Display the error message directly - it's now properly formatted
          toast.error(`${errorMessage}`);
        }
      }
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
      router.push('/risk-radar');
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
      toast.error(`Error saving merchant data`);
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
      format(currentTransException.transactionDate, 'MM/dd/yyyy')
    );

    newTemplate = newTemplate.replaceAll(
      '@dAuthAmt',
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(currentTransException.authAmount)
    );

    newTemplate = newTemplate.replaceAll(
      '@dTransAmt',
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(currentTransException.transactionAmount)
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

    setTemplateData((prev) => ({
      ...prev,
      body: newTemplate,
    }));
  };

  const handleSendEmail = async (): Promise<void> => {
    if (
      !currentTransException ||
      !email ||
      !templateData.body ||
      templateData.templateId === null
    ) {
      return;
    }

    try {
      setIsSendingEmail(true);
      await sendExceptionMemoEmail({
        mid: parseInt(merchantId, 10),
        emailTemplateId: templateData.templateId,
        emailRecipient: email,
        emailBody: templateData.body,
        user: user?.name ?? '',
      });

      // Clear form after successful send
      setEmail('');
      setTemplateData({
        templateId: null,
        body: '',
      });
      setIsPopupActive(false);
    } catch (error) {
      // console.error('Error sending email:', error);
    } finally {
      setIsSendingEmail(false);
    }
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
    netBalance: data?.businessInfo?.netSettlementBalance || 0,
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
      <Breadcrumb
        pageName="Merchant profile"
        extra={`MID: ${merchantId}`}
        enableBackButton
      />
      <Popup
        isOpen={isPopupActive}
        onClose={() => setIsPopupActive(false)}
        title={activePopup == PopupType.Email ? 'Send Email' : ''}
      >
        {activePopup == PopupType.CardHistory ? (
          <div className="h-full">
            <div className="max-w-full h-full flex flex-col bg-white dark:bg-boxdark">
              {/* Issuer Information */}
              {isCardHistoryLoading ? (
                <div className="flex-1 flex justify-center items-center">
                  <Loader />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4 p-4 border-b border-stroke dark:border-strokedark">
                    <div>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        Issuer Bank:
                      </p>
                      <p className="text-sm text-black dark:text-white">
                        {cardHistory[0]?.issuerBank || ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        Issuer Country:
                      </p>
                      <p className="text-sm text-black dark:text-white">
                        {cardHistory[0]?.issuerCountry || ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        Issuer Phone:
                      </p>
                      <p className="text-sm text-black dark:text-white">
                        {cardHistory[0]?.issuerPhone || ''}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 border-b border-stroke dark:border-strokedark">
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                      Card # History
                    </h3>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto">
                      <table className="w-full table-auto">
                        <thead className="sticky top-0 bg-gray-100 dark:bg-meta-4">
                          <tr>
                            <th className="p-4 py-1 font-medium text-black dark:text-white text-center">
                              MID
                            </th>
                            <th className="p-4 py-1 font-medium text-black dark:text-white text-center">
                              Trans Date
                            </th>
                            <th className="p-4 py-1 font-medium text-black dark:text-white text-right">
                              Trans Amt
                            </th>
                            <th className="p-4 py-1 font-medium text-black dark:text-white text-center">
                              POS
                            </th>
                            <th className="p-4 py-1 font-medium text-black dark:text-white text-center">
                              AVS
                            </th>
                            <th className="p-4 py-1 font-medium text-black dark:text-white text-center">
                              Auth Code
                            </th>
                            <th className="p-4 py-1 font-medium text-black dark:text-white text-center">
                              Card #
                            </th>
                            <th className="p-4 py-1 font-medium text-black dark:text-white text-center">
                              DB Net
                            </th>
                            <th className="p-4 py-1 font-medium text-black dark:text-white text-center">
                              Transmission Date
                            </th>
                            <th className="p-4 py-1 font-medium text-black dark:text-white text-right">
                              Net Dep. Amt
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map(
                            (card: CardHistory, index: number) => {
                              // Create a unique identifier using multiple fields and index
                              const uniqueId = `${card.mid}-${card.transactionDate}-${card.cardNumber}-${card.amount}-${index}`;
                              return (
                                <tr key={uniqueId} className="text-center">
                                  <td className="border-b border-[#eee] p-4 dark:border-strokedark text-center text-black dark:text-white">
                                    {card.mid}
                                  </td>
                                  <td className="border-b border-[#eee] p-4 dark:border-strokedark text-center text-black dark:text-white">
                                    {formatDateWithoutTime(
                                      card.transactionDate
                                    )}
                                  </td>
                                  <td className="border-b border-[#eee] p-4 dark:border-strokedark text-right text-black dark:text-white">
                                    ${card.amount.toFixed(2)}
                                  </td>
                                  <td className="border-b border-[#eee] p-4 dark:border-strokedark text-center text-black dark:text-white">
                                    {card.posEntryMode}
                                  </td>
                                  <td className="border-b border-[#eee] p-4 dark:border-strokedark text-center text-black dark:text-white">
                                    {card.avsResponseCode}
                                  </td>
                                  <td className="border-b border-[#eee] p-4 dark:border-strokedark text-center text-black dark:text-white">
                                    {card.authCode || ''}
                                  </td>
                                  <td className="border-b border-[#eee] p-4 dark:border-strokedark text-center text-black dark:text-white">
                                    {card.cardNumber}
                                  </td>
                                  <td className="border-b border-[#eee] p-4 dark:border-strokedark text-center text-black dark:text-white">
                                    {card.debitNetworkIdentifier || ''}
                                  </td>
                                  <td className="border-b border-[#eee] p-4 dark:border-strokedark text-center text-black dark:text-white">
                                    {formatDateWithoutTime(
                                      card.transmissionDate
                                    )}
                                  </td>
                                  <td className="border-b border-[#eee] p-4 dark:border-strokedark text-right text-black dark:text-white">
                                    ${card.netDepositAmount.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Pagination */}
                  <div className="flex items-center justify-between p-4 border-t border-stroke dark:border-strokedark">
                    <div className="text-sm text-black dark:text-white">
                      Showing{' '}
                      {Math.min(cardHistory?.length || 0, startIndex + 1)} to{' '}
                      {Math.min(cardHistory?.length || 0, endIndex)} of{' '}
                      {cardHistory?.length || 0} entries
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black disabled:opacity-50 dark:border-strokedark dark:text-white"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage >= totalPages}
                        className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-black disabled:opacity-50 dark:border-strokedark dark:text-white"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : activePopup == PopupType.Email ? (
          <div className="max-w bg-white p-6 rounded-lg shadow-lg">
            {isEmailTemplateLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader />
              </div>
            ) : (
              <>
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
                    value={templateData.templateId?.toString() || ''}
                    onChange={(e) => {
                      const templateId = e.target.value
                        ? parseInt(e.target.value, 10)
                        : null;
                      setTemplateData((prev) => ({
                        ...prev,
                        templateId,
                      }));
                      const selectedTemplate = emailTemplates?.find(
                        (template: EmailTemplate) => template.id === templateId
                      )?.templateEmailBody;
                      if (selectedTemplate) {
                        replaceEmailTemplateParameters(selectedTemplate);
                      }
                    }}
                  >
                    <option value="">Select a template</option>
                    {emailTemplates.map((template: EmailTemplate) => (
                      <option key={template.id} value={template.id}>
                        {template.templateName}
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
                    value={templateData.body}
                    onChange={(e) =>
                      setTemplateData((prev) => ({
                        ...prev,
                        body: e.target.value,
                      }))
                    }
                    placeholder="Enter email content..."
                  />
                </div>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={
                    isSendingEmail ||
                    !email ||
                    !templateData.body ||
                    templateData.templateId === null
                  }
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingEmail ? 'Sending...' : 'Send Email'}
                </button>
              </>
            )}
          </div>
        ) : null}
      </Popup>

      <section className="mb-4 grid grid-cols-6 gap-4">
        {/* Column 1 */}
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark col-span-2">
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 font-mono">
            {/* DBA Name */}
            <p className="text-black dark:text-white text-[15px]">
              <strong>DBA Name:</strong>
            </p>
            <p className="text-black dark:text-white text-[15px]">
              {merchantContactInfo?.dbaName}
            </p>

            {/* Address */}
            <p className="text-black dark:text-white text-[15px]">
              <strong>Address:</strong>
            </p>
            <p className="text-black dark:text-white text-[15px]">
              {merchantProfile?.sDBAAddress || merchantContactInfo?.dbaAddress}
            </p>

            <p className="text-black dark:text-white">
              <strong>City:</strong>{' '}
            </p>
            <div className="flex justify-between gap-2 text-black dark:text-white">
              <p className="text-black dark:text-white text-[15px]">
                {merchantProfile?.sDBACity || merchantContactInfo?.dbaCity}
              </p>

              <p className="text-black dark:text-white text-[15px]">
                <strong>ST:</strong>{' '}
                {merchantProfile?.sDBAState || merchantContactInfo?.dbaState}
              </p>

              <p className="text-black dark:text-white text-[15px]">
                <strong>ZIP:</strong>{' '}
                {merchantProfile?.sDBAZip || merchantContactInfo?.dbaZip}
              </p>
            </div>

            <p className="text-black dark:text-white text-[15px]">
              <strong>Activated:</strong>
            </p>
            <p className="text-black dark:text-white text-[15px]">
              {formatDate(merchantProfile?.sActivationDate)}
            </p>

            <p className="text-black dark:text-white text-[15px]">
              <strong>Net Balance:</strong>
            </p>
            <p>
              <span
                className={`${
                  merchantContactInfo!.netSettlementBalance >= 0
                    ? 'text-black dark:text-white font-bold text-[15px]'
                    : 'text-red-500 dark:text-red-400 font-bold text-[15px]'
                }`}
              >
                {formatCurrency(
                  merchantContactInfo?.netSettlementBalance || 0,
                  2,
                  true
                )}
              </span>
            </p>
          </div>
        </div>
        {/* Column 2 */}
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark col-span-2">
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 font-mono">
            <p className="text-black dark:text-white text-[15px]">
              <strong>Ownership:</strong>
            </p>
            <p className="text-black dark:text-white text-[15px]">
              {merchantProfile?.sOwnershipType}
            </p>

            <p className="text-black dark:text-white text-[15px]">
              <strong>SIC:</strong>
            </p>
            <p className="text-black dark:text-white text-[15px]">
              {merchantProfile?.sSIC}
            </p>

            <p className="text-black dark:text-white text-[15px]">
              <strong>Merchant Type:</strong>
            </p>
            <p className="text-black dark:text-white text-[15px]">
              {merchantProfile?.sMerchantType}
            </p>
            <p className="text-black dark:text-white text-[15px]">
              <strong>Talus Pay:</strong>
            </p>
            {merchantProfile?.bIsTalusPayMerchant ? (
              <p className="text-red-500 dark:text-red-400 font-bold">Yes</p>
            ) : null}
          </div>
        </div>
        {/* Column 3 */}
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark col-span-2">
          <div className="flex flex-row gap-x-1">
            <div className="grid grid-cols-[max-content_1fr] gap-x-4 font-mono">
              <p className="text-black dark:text-white text-[15px]">
                <strong>Risk Watch:</strong>
              </p>
              <input
                type="checkbox"
                className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={merchantStateData.isRiskWatch}
                onChange={() =>
                  handleRiskWatchTrigger(!merchantStateData.isRiskWatch, true)
                }
              />

              <p className="text-black dark:text-white text-[15px]">
                <strong>Auto Hold White List:</strong>
              </p>
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

              {/* Divert */}
              <p className="text-red-500 dark:text-red-400">
                <strong>Divert:</strong>
              </p>
              <input
                type="checkbox"
                className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                disabled={!data?.businessInfo?.uwNewAccountHoldAllowRiskToEdit}
                checked={merchantStateData.isDiverted}
                onChange={() =>
                  handleDivertTrigger(!merchantStateData.isDiverted, true)
                }
              />

              <p className="text-black dark:text-white text-[15px]">
                <strong>Curr. Month Swipe Cnt (%):</strong>{' '}
              </p>
              <p className="text-black dark:text-white text-[15px]">
                {merchantProfile?.iSwipedPercBasedOnTransCntCurrMonth || ''}
              </p>
            </div>

            {/* Separator */}
            <div className="w-px bg-gray-300 mx-4 self-stretch" />

            {/* Buttons */}
            <div className="flex flex-col justify-center gap-2 h-full">
              <button
                className={`inline-flex items-center justify-center rounded-lg border px-4 py-1 text-white transition-colors
              ${
                reviewStatus === 'reviewing' ||
                merchantStateData.clickedStatus === 'rev' ||
                reviewStatus === 'reviewed' ||
                riskException?.fkRiskExceptionStatus === 2
                  ? 'border-gray-400 bg-gray-400 cursor-not-allowed'
                  : 'border-primary bg-primary hover:bg-opacity-90'
              }`}
                type="button"
                disabled={
                  riskException?.fkRiskExceptionStatus === 2 ||
                  reviewStatus == 'reviewed' ||
                  reviewStatus == 'reviewing'
                }
                onClick={() => {
                  handleClickOnReviewButton().catch(() => {});
                }}
              >
                {reviewStatus === 'reviewing'
                  ? 'Reviewing...'
                  : reviewStatus === 'reviewed' ||
                      merchantStateData.clickedStatus === 'rev'
                    ? 'Reviewed'
                    : 'Review'}
              </button>

              {riskException?.fkRiskExceptionStatus === 1 && (
                <button
                  className={`inline-flex items-center justify-center rounded-lg border px-4 py-1 text-white transition-colors
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
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="grid grid-cols-4 text-black dark:text-white text-center">
            <p className="text-black dark:text-white text-[15px]">
              <strong>Channel:</strong> {merchantProfile?.sChannel}
            </p>
            <p className="text-black dark:text-white text-[15px]">
              <strong>Reseller:</strong> {merchantProfile?.sReseller}
            </p>
            <p className="text-black dark:text-white text-[15px]">
              <strong>Referral Partner:</strong>{' '}
              {merchantProfile?.sReferralPartner}
            </p>
            <p className="text-black dark:text-white text-[15px]">
              <strong>Solution Consultant:</strong>{' '}
              {merchantProfile?.sSolutionConsultant || ''}
            </p>
          </div>
          <hr className="my-2 border-t border-gray-300" />
          <div className="grid grid-cols-4 text-black dark:text-white text-center">
            <p className="text-black dark:text-white text-[15px]">
              <strong>MV:</strong> {formatCurrency(merchantProfile?.iMV$, 0)}
              <span className="text-gray-500 dark:text-gray-400 text-black dark:text-white">
                {' '}
                (UW Appr.- {formatCurrency(merchantProfile?.iUWApprMV, 0)})
              </span>
            </p>
            <p className="text-black dark:text-white text-[15px]">
              <strong>AT:</strong> {formatCurrency(merchantProfile?.iAT$, 0)}
              <span className="text-gray-500 dark:text-gray-400 text-black dark:text-white">
                {' '}
                (UW Appr.- {formatCurrency(merchantProfile?.iUWApprAT, 0)})
              </span>
            </p>
            <p className="text-black dark:text-white text-[15px]">
              <strong>HT:</strong> {formatCurrency(merchantProfile?.iHT$, 0)}
              <span className="text-gray-500 dark:text-gray-400 text-black dark:text-white">
                {' '}
                (UW Appr.- {formatCurrency(merchantProfile?.iUWApprHT, 0)})
              </span>
            </p>
            <p className="text-black dark:text-white text-[15px]">
              <strong>Swipe Vol:</strong>{' '}
              {`${merchantProfile?.iSwipeVolPerc}%` || ''}
              <span className="text-gray-500 dark:text-gray-400 text-black dark:text-white">
                {' '}
                (UW Appr.- {`${merchantProfile?.iUWApprSwipeVolPerc}%` || ''})
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="flex gap-1 px-1">
        <button
          className={classNames(
            'inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-1 text-white hover:bg-opacity-90 opacity-60 rounded-b-none',
            {
              '!opacity-100': activeTab === 'contact',
            }
          )}
          type="button"
          onClick={() => {
            setActiveTab('contact');
          }}
        >
          Contact
        </button>
        <button
          className={classNames(
            'inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-1 text-white hover:bg-opacity-90 opacity-60 rounded-b-none',
            {
              '!opacity-100': activeTab === 'exceptions',
              '!cursor-not-allowed': !exceptionId,
            }
          )}
          disabled={!exceptionId}
          type="button"
          onClick={() => {
            setActiveTab('exceptions');
          }}
        >
          Exceptions
        </button>

        <button
          className={classNames(
            'inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-1 text-white hover:bg-opacity-90 opacity-60 rounded-b-none',
            {
              '!opacity-100': activeTab === 'notes',
            }
          )}
          type="button"
          onClick={() => {
            setActiveTab('notes');
          }}
        >
          Notes
        </button>
        <button
          className={classNames(
            'inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-1 text-white hover:bg-opacity-90 opacity-60 rounded-b-none',
            {
              '!opacity-100': activeTab === 'chargebacks',
            }
          )}
          type="button"
          onClick={() => {
            setActiveTab('chargebacks');
          }}
        >
          Chargebacks
        </button>
        <button
          className={classNames(
            'inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-1 text-white hover:bg-opacity-90 opacity-60 rounded-b-none',
            {
              '!opacity-100': activeTab === 'netsettlement',
            }
          )}
          type="button"
          onClick={() => {
            setActiveTab('netsettlement');
          }}
        >
          NetSettlement
        </button>
        <button
          className={classNames(
            'inline-flex items-center justify-center rounded-lg border border-primary bg-primary px-4 py-1 text-white hover:bg-opacity-90 opacity-60 rounded-b-none',
            {
              '!opacity-100': activeTab === 'sameTaxId',
            }
          )}
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
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column - Contact Info */}
              <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark flex flex-row gap-y-2">
                <div className="flex flex-col justify-between w-full gap-y-2">
                  {/* Contact Info */}
                  <div className="grid grid-cols-[max-content_1fr] gap-x-4 font-mono">
                    <p className="text-black dark:text-white">
                      <strong>Contact Name:</strong>
                    </p>
                    <p className="text-black dark:text-white">
                      {data?.owners?.[0]?.name || ''}
                    </p>

                    <p className="text-black dark:text-white">
                      <strong>Phone #:</strong>
                    </p>
                    <p className="text-black dark:text-white">
                      {merchantContactInfo?.contactPhoneNumber || ''}
                    </p>

                    <p className="text-black dark:text-white">
                      <strong>Fax #:</strong>
                    </p>
                    <p className="text-black dark:text-white">
                      {merchantContactInfo?.dbaFax || ''}
                    </p>

                    <p className="text-black dark:text-white">
                      <strong>Mobile #:</strong>
                    </p>
                    <p className="text-black dark:text-white">
                      {merchantContactInfo?.contactPhoneNumber || ''}
                    </p>

                    <p className="text-black dark:text-white">
                      <strong>Email:</strong>{' '}
                    </p>
                    <p className="text-black dark:text-white">
                      {merchantContactInfo?.contactEmail || ''}
                    </p>

                    <p className="text-black dark:text-white">
                      <strong>Web Site:</strong>{' '}
                    </p>
                    <p className="text-black dark:text-white">
                      {merchantContactInfo?.website || ''}
                    </p>
                  </div>

                  <div className="flex flex-row items-center">
                    <p className="text-black dark:text-white">
                      <strong className="inline-block mr-2">
                        Preferred Contact:
                      </strong>
                    </p>

                    <div className="flex flex-row items-center gap-x-2">
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
                        className="rounded border-[1.5px] border-stroke bg-transparent px-3 py-1 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />

                      <button
                        className="inline-flex w-[100px] items-center justify-center rounded-lg border border-primary bg-primary px-4 py-1 text-white hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
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
              </div>

              {/* Right Column - Billing Address */}
              <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
                  Billing Address
                </h3>
                <div className="grid grid-cols-[max-content_1fr] gap-x-4 font-mono">
                  <p className="mb-1 text-black dark:text-white">
                    <strong>Name:</strong>
                  </p>
                  <p className="text-black dark:text-white">
                    {data?.owners?.[0]?.name || ''}
                  </p>

                  <p className="mb-1 text-black dark:text-white">
                    <strong>Addr:</strong>
                  </p>
                  <p className="text-black dark:text-white">
                    {data?.businessInfo?.legalAddress || ''}
                  </p>
                  <p className="mb-1 text-black dark:text-white">
                    <strong>City:</strong>
                  </p>
                  <p className="text-black dark:text-white">
                    {data?.businessInfo?.legalCity || ''}
                  </p>

                  <p className="mb-1 text-black dark:text-white">
                    <strong>ST:</strong>
                  </p>
                  <p className="text-black dark:text-white">
                    {data?.businessInfo?.legalState || ''}
                  </p>

                  <p className="mb-1 text-black dark:text-white">
                    <strong>Zip:</strong>
                  </p>
                  <p className="text-black dark:text-white">
                    {data?.businessInfo?.legalZip || ''}
                  </p>
                </div>
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
                        <td className="border-b border-[#eee] p-2 dark:border-strokedark text-black dark:text-white">
                          {owner.name}
                        </td>
                        <td className="border-b border-[#eee] p-2 dark:border-strokedark text-black dark:text-white">
                          {owner.ssn4}
                        </td>
                        <td className="border-b border-[#eee] p-2 dark:border-strokedark text-black dark:text-white">
                          {owner.dob}
                        </td>
                        <td className="border-b border-[#eee] p-2 dark:border-strokedark text-black dark:text-white">
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
          <div className="grid grid-cols-1 gap-4">
            {isExceptionsLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader />
              </div>
            ) : (
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 dark:bg-meta-4 text-center">
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Trans Date
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Auth Amt
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Trans Amt
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        POS
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        AVS
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Auth Code
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Card #
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        PIN
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
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
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          <span className="block text-left">
                            {formatDate(
                              exception.transactionDate,
                              'MM/dd/yyyy kk:mm:ss'
                            )}
                          </span>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-right text-black dark:text-white">
                          <span className="block text-right">
                            {formatCurrency(exception.authAmount)}
                          </span>
                        </td>
                        <td
                          className="border-b border-[#eee] px-4 py-2 dark:border-strokedark cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
                          onClick={() => {
                            setIsEmailTemplateLoading(true);
                            setIsPopupActive(true);
                            setActivePopup(PopupType.Email);
                            setCurrentTransException(exception);
                            // Clear the loading state after a short delay to ensure the popup is visible
                            setTimeout(
                              () => setIsEmailTemplateLoading(false),
                              500
                            );
                          }}
                        >
                          <span
                            className={`block text-right ${exception.transactionAmount >= 0 ? 'text-blue-600' : 'text-red-600'}`}
                          >
                            {exception.transactionAmount >= 0
                              ? formatCurrency(exception.transactionAmount)
                              : `(${formatCurrency(Math.abs(exception.transactionAmount))})`}
                          </span>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          {exception.posEntryMode}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          {exception.avsResponseCode}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          {exception.authCode || ''}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          <span className="block text-center">
                            <button
                              type="button"
                              className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
                              onClick={() => {
                                setIsCardHistoryLoading(true);
                                setIsPopupActive(true);
                                setCurrentTransException(exception);
                                setActivePopup(PopupType.CardHistory);
                              }}
                            >
                              {exception.cardNumber}
                            </button>
                            {` ${exception.transactionId?.slice(-4)}`}
                          </span>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          {exception.debitNetworkIdentifier}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          {exception.exceptionList &&
                            exception.exceptionList
                              .split(' ')
                              .filter((r) => !!r && r !== '-')
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
            )}
          </div>
        )}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 gap-4">
            {isNotesLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader />
              </div>
            ) : (
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 dark:bg-meta-4 text-center">
                      <th className="p-4 py-1 font-medium text-black dark:text-white text-left">
                        Note
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Date Created
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white text-left">
                        Created By
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Push to Iris
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedNotes?.map((note) => (
                      <tr key={`${note.pkNotes}`}>
                        <td
                          className={`border-b border-[#eee] px-4 py-2 dark:border-strokedark text-left ${
                            note.bPinnedNotes === '*'
                              ? 'text-red-500 font-bold'
                              : 'text-black dark:text-white'
                          }`}
                        >
                          {note.bPinnedNotes === '*'
                            ? `*${note.sNotes}`
                            : note.sNotes}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-center">
                          <p className="text-black dark:text-white">
                            {formatDate(note.dtCreated)}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-left">
                          <p className="text-black dark:text-white">
                            {note.sUserCreated}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-center">
                          <div className="">
                            <input
                              type="checkbox"
                              id={`pushToIris-${note.pkNotes}`}
                              aria-label={`Push note ${note.pkNotes} to Iris`}
                              className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!!note.dtIrisMemoRequest}
                              checked={!!note.dtIrisMemoRequest}
                              onChange={() => {
                                handlePushNoteToIris(note.pkRiskRadarNotes)
                                  .then(() => {
                                    toast.success(`Note pushed to Iris`);
                                  })
                                  .catch((e: Error) => {
                                    toast.error(
                                      `Failed to push note to Iris: ${e?.message ?? 'Unknown error'}`
                                    );
                                  });
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
                <div className="flex items-center gap-4 mt-4 px-2">
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
                    className="flex-1 min-w-[200px] rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <div className="flex items-center gap-4 shrink-0">
                    <label className="flex items-center gap-2 whitespace-nowrap">
                      <span className="text-red-500 font-bold">* Pinned</span>
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
                    </label>
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
            )}
          </div>
        )}
        {activeTab === 'chargebacks' && (
          <div className="grid grid-cols-1 gap-4">
            {isChargebacksLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader />
              </div>
            ) : (
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 dark:bg-meta-4 text-center">
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Case #
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Trans Date
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Amount
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Card #
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Payment Type
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Received Date
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Reference #
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
                        Reason Code
                      </th>
                      <th className="p-4 py-1 font-medium text-black dark:text-white">
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
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          {chargeback.sCaseNumber}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          {formatDateWithoutTime(chargeback.dtTrans)}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-right text-black dark:text-white">
                          ${chargeback.dAmt.toFixed(2)}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          {chargeback.sCardNum}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          {chargeback.sPaymentType}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          {formatDateWithoutTime(chargeback.dtReceived)}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          {chargeback.sReferenceNum}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
                          {chargeback.ReasonCodeDescription}
                        </td>
                        <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark text-black dark:text-white">
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
            )}
          </div>
        )}
        {activeTab === 'netsettlement' && (
          <h2 className="mb-2 text-xl font-semibold text-red-500 dark:text-red-400">
            Coming soon…
          </h2>
        )}
        {activeTab === 'sameTaxId' && (
          <>
            <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">
              Merchants with Same Tax ID
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {isSameTaxIdLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader />
                </div>
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
                  <p className="text-gray-600 text-black dark:text-white">
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
        <div className="rounded-sm border border-stroke bg-white px-2 py-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-2">
          <div className="max-w-full flex flex-col lg:flex-row gap-3 overflow-x-auto">
            <VolumeTable data={paginatedVolume?.slice(0, 6) || []} />
            <VolumeTable data={paginatedVolume?.slice(6) || []} />
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
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-black dark:text-white">
                            {legend.id}
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-black dark:text-white">
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
