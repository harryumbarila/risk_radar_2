'use client';
import React from 'react';
import {
  Badge,
  Box,
  Button,
  HStack,
  VStack,
  Text,
  SimpleGrid,
  Select,
  Portal,
  Tooltip,
  createListCollection,
} from '@chakra-ui/react';
import { Check, Circle } from 'lucide-react';
import {
  MdOutlineArrowUpward,
  MdCheck,
  MdOutlineRemoveRedEye,
} from 'react-icons/md';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MerchantTransaction } from '@/data/interfaces/transaction';
import { statusColor } from '@/libs/utils/utils';
import { DataTable } from '@/ui/components/common/organisms/data-table';
import { CollapsibleBodyProps } from '@/ui/components/common/organisms/data-table/data-table.model';
import BatchDrawer from '@/libs/domain/auto-hold/components/batch-drawer/batch-drawer';
import { AutoHoldFilterState } from '@/libs/domain/auto-hold/components/filter-bar/filter-bar';

const columnHelper = createColumnHelper<MerchantTransaction>();

// Helper: Get severity color for rules (lighter tones)
function getSeverityColor(ruleId: string): 'red' | 'yellow' | 'blue' | 'gray' {
  const num = parseInt(ruleId.replace('AH', ''));
  if (num <= 5) return 'red';
  if (num <= 8) return 'yellow';
  return 'blue';
}

// Helper: Get lighter severity color tokens
function getSeverityColorToken(ruleId: string): { bg: string; text: string } {
  const num = parseInt(ruleId.replace('AH', ''));
  if (num <= 5) return { bg: 'red.50', text: 'red.600' };
  if (num <= 8) return { bg: 'yellow.50', text: 'yellow.600' };
  return { bg: 'blue.50', text: 'blue.600' };
}

// Helper: Boolean Icon Component with Tooltip
function BooleanIcon({ 
  value, 
  label 
}: { 
  value?: boolean;
  label: string;
}) {
  if (value === true) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Box
            as="span"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            cursor="help"
            color="green.600"
            width="16px"
            height="16px"
          >
            <Check size={14} strokeWidth={2.5} style={{ color: 'currentColor' }} />
          </Box>
        </Tooltip.Trigger>
        <Portal>
          <Tooltip.Positioner>
            <Tooltip.Content
              maxW="200px"
              zIndex={2000}
              bg="gray.900"
              color="white"
              px={3}
              py={2}
              borderRadius="md"
              fontSize="sm"
              boxShadow="lg"
            >
              <Tooltip.Arrow />
              {label}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Portal>
      </Tooltip.Root>
    );
  }

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      color="gray.300"
      width="16px"
      height="16px"
    >
      <Circle size={12} strokeWidth={2} fill="none" style={{ color: 'currentColor' }} />
    </Box>
  );
}

// Helper: Origin/Partner Column Component (refined)
function OriginPartnerCell({ 
  channel, 
  reseller, 
  referralPartner, 
  solutionConsultant 
}: { 
  channel?: string;
  reseller?: string;
  referralPartner?: string;
  solutionConsultant?: string;
}) {
  const secondaryValue = reseller || referralPartner || solutionConsultant;
  
  return (
    <VStack align="start" gap={0}>
      <Text fontSize="sm" fontWeight="semibold">
        {channel || '—'}
      </Text>
      {secondaryValue && (
        <Badge
          variant="subtle"
          bg="gray.100"
          color="gray.600"
          fontSize="xs"
          fontWeight="normal"
          px={1.5}
          py={0.5}
          borderRadius="sm"
          mt={0.5}
        >
          {secondaryValue}
        </Badge>
      )}
    </VStack>
  );
}

// Helper: Funding Info Cell Component (refined)
function FundingInfoCell({ 
  nextDayFunding, 
  netDivertBalance 
}: { 
  nextDayFunding?: string;
  netDivertBalance?: string;
}) {
  return (
    <VStack align="start" gap={0}>
      <Text fontSize="sm" fontWeight="semibold">
        {nextDayFunding || '—'}
      </Text>
      {netDivertBalance && (
        <Text fontSize="xs" color="gray.500" mt={0.5}>
          {netDivertBalance}
        </Text>
      )}
    </VStack>
  );
}

// Helper: Rule Chips Component (refined with lighter colors and collapse)
function RuleChips({ 
  rules, 
  maxVisible = 3 
}: { 
  rules?: string[];
  maxVisible?: number;
}) {
  if (!rules || rules.length === 0) {
    return <Text fontSize="sm" color="gray.400">—</Text>;
  }

  const visibleRules = rules.slice(0, maxVisible);
  const remainingCount = rules.length - maxVisible;
  const allRulesText = rules.join(', ');

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <HStack gap={0.5} flexWrap="wrap" alignItems="center" justifyContent="flex-start">
          {visibleRules.map((rule) => {
            const colorToken = getSeverityColorToken(rule);
            return (
              <Badge
                key={rule}
                bg={colorToken.bg}
                color={colorToken.text}
                fontSize="xs"
                fontWeight="medium"
                px={1.5}
                py={0.5}
                borderRadius="sm"
                borderWidth="0"
              >
                {rule}
              </Badge>
            );
          })}
          {remainingCount > 0 && (
            <Badge
              bg="gray.100"
              color="gray.600"
              fontSize="xs"
              fontWeight="medium"
              px={1.5}
              py={0.5}
              borderRadius="sm"
              borderWidth="0"
            >
              +{remainingCount}
            </Badge>
          )}
        </HStack>
      </Tooltip.Trigger>
      {remainingCount > 0 && (
        <Portal>
          <Tooltip.Positioner>
            <Tooltip.Content
              maxW="300px"
              zIndex={2000}
              bg="gray.900"
              color="white"
              px={3}
              py={2}
              borderRadius="md"
              fontSize="sm"
              boxShadow="lg"
            >
              <Tooltip.Arrow />
              All rules: {allRulesText}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Portal>
      )}
    </Tooltip.Root>
  );
}

// Helper: Batch Trigger Tag Component
function BatchTriggerTag({ value }: { value?: string }) {
  if (!value) return <Text fontSize="sm" color="gray.400">—</Text>;
  
  return (
    <Badge
      variant="subtle"
      bg="gray.50"
      color="gray.600"
      fontSize="xs"
      fontWeight="normal"
      px={2}
      py={0.5}
      borderRadius="sm"
      borderWidth="0"
    >
      {value}
    </Badge>
  );
}

function CollapsibleContent(props: CollapsibleBodyProps<MerchantTransaction>) {
  return (
    <Box
      p={6}
      display="flex"
      flexDirection="column"
      gap={4}
      bg="bg"
      borderWidth="1px"
      borderRadius={10}
    >
      {/* Header */}
      <Box>
        <Text fontWeight="bold" fontSize="lg">
          Transaction Details
        </Text>
      </Box>

      {/* Transaction Info Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }}>
        <VStack align="start" gap={1}>
          <Text fontWeight="normal" color="gray.500">
            Transaction ID
          </Text>
          <Text fontWeight="bold">{props.row.original.id}</Text>
        </VStack>

        <VStack align="start" gap={1}>
          <Text fontWeight="normal" color="gray.500">
            Processor
          </Text>
          <Text fontWeight="bold">{props.row.original.processor}</Text>
        </VStack>

        <VStack align="start" gap={1}>
          <Text fontWeight="normal" color="gray.500">
            Date & Time
          </Text>
          <Text fontWeight="bold">{props.row.original.date}</Text>
        </VStack>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 3 }}>
        <VStack align="start" gap={1}>
          <Text fontWeight="normal" color="gray.500">
            MID
          </Text>
          <Text fontWeight="bold">{props.row.original.mid}</Text>
        </VStack>

        <VStack align="start" gap={1}>
          <Text fontWeight="normal" color="gray.500">
            DBA
          </Text>
          <Text fontWeight="bold">{props.row.original.dbaName || props.row.original.merchant}</Text>
        </VStack>
      </SimpleGrid>

      {/* Risk Assessment */}
      <VStack align="start" gap={1}>
        <Text fontWeight="semibold" color="gray.500">
          Risk Assessment
        </Text>
        <Text>
          {props.row.original.exception}
        </Text>
      </VStack>

      {/* Action Buttons */}
      <HStack justify="flex-end" w="full" gap={4} pt={2}>
        <Button variant="outline">
          <MdOutlineArrowUpward />
          Escalate
        </Button>
        <Button>
          <MdCheck />
          Mark as Reviewed
        </Button>
      </HStack>
    </Box>
  );
}

interface CustomTableProps {
  filters?: AutoHoldFilterState;
}

// Helper function to generate dates within the last 7 days
function getDateInLast7Days(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toISOString();
}

function formatDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${month} ${day}, ${displayHours}:${displayMinutes} ${ampm}`;
}

function formatUWDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

// Generate transactions with new fields
const generateTransactions = (): (MerchantTransaction & { ruleId?: string })[] => {
  const baseDate = new Date();
  const channels = ['Direct', 'Partner', 'Reseller', 'Online'];
  const resellers = ['Reseller A', 'Reseller B', null];
  const referralPartners = ['Partner X', 'Partner Y', null];
  const solutionConsultants = ['SC Alpha', 'SC Beta', null];
  const sources = ['Talus Pay', 'Global365', 'SIT', 'SC Flow'];
  
  return [
    {
      id: '1',
      merchant: 'Global Tech Solutions',
      dbaName: 'GTS Inc.',
      amount: '$12,500.00',
      exception: 'High-risk country, Unusual amount',
      processor: 'TSYS',
      mid: '8675309001',
      date: formatDate(new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000)),
      uwDate: formatUWDate(new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000)),
      status: 'Unreviewed',
      createdAt: getDateInLast7Days(1),
      updatedAt: getDateInLast7Days(1),
      ruleId: 'AH001',
      channel: channels[0],
      reseller: resellers[0] || undefined,
      riskWatch: true,
      newAccount: false,
      divert: true,
      nextDayFunding: 'Yes',
      netDivertBalance: '$12,500.00',
      source: sources[0],
      dataSourceIdentifier: 'DS-001',
      ahRuleApplied: ['AH001', 'AH002', 'AH003', 'AH004'],
      autoHoldRuleApplied: ['AH001'],
      createdBatchTrigger: 'Daily Batch',
    } as MerchantTransaction & { ruleId?: string },
    {
      id: '2',
      merchant: 'Oceanview Logistics',
      dbaName: 'Oceanview LLC',
      amount: '$8,750.50',
      exception: 'New merchant, Pattern match anomaly',
      processor: 'FSP',
      mid: '8675309002',
      date: formatDate(new Date(baseDate.getTime() - 0.5 * 24 * 60 * 60 * 1000)),
      uwDate: formatUWDate(new Date(baseDate.getTime() - 25 * 24 * 60 * 60 * 1000)),
      status: 'In Progress',
      createdAt: getDateInLast7Days(0),
      updatedAt: getDateInLast7Days(0),
      ruleId: 'AH002',
      channel: channels[1],
      referralPartner: referralPartners[0] || undefined,
      riskWatch: false,
      newAccount: true,
      divert: false,
      nextDayFunding: 'No',
      netDivertBalance: '$0.00',
      source: sources[1],
      dataSourceIdentifier: 'DS-002',
      ahRuleApplied: ['AH002'],
      autoHoldRuleApplied: ['AH002', 'AH003'],
      createdBatchTrigger: 'Manual',
    } as MerchantTransaction & { ruleId?: string },
    {
      id: '3',
      merchant: 'Sunshine Pharmacy',
      dbaName: 'Sunshine Pharma',
      amount: '$456.78',
      exception: 'Frequency anomaly',
      processor: 'TSYS',
      mid: '8675309003',
      date: formatDate(new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000)),
      uwDate: formatUWDate(new Date(baseDate.getTime() - 20 * 24 * 60 * 60 * 1000)),
      status: 'Unreviewed',
      createdAt: getDateInLast7Days(1),
      updatedAt: getDateInLast7Days(1),
      ruleId: 'AH003',
      channel: channels[2],
      solutionConsultant: solutionConsultants[0] || undefined,
      riskWatch: true,
      newAccount: false,
      divert: true,
      nextDayFunding: 'Yes',
      netDivertBalance: '$456.78',
      source: sources[2],
      dataSourceIdentifier: 'DS-003',
      ahRuleApplied: ['AH003', 'AH004'],
      autoHoldRuleApplied: ['AH003'],
      createdBatchTrigger: 'Daily Batch',
    } as MerchantTransaction & { ruleId?: string },
    {
      id: '4',
      merchant: 'Digital Assets Exchange',
      dbaName: 'DAE Corp',
      amount: '$25,000.00',
      exception: 'High-risk merchant category',
      processor: 'FSP',
      mid: '8675309004',
      date: formatDate(new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000)),
      uwDate: formatUWDate(new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000)),
      status: 'Unreviewed',
      createdAt: getDateInLast7Days(1),
      updatedAt: getDateInLast7Days(1),
      ruleId: 'AH004',
      channel: channels[0],
      riskWatch: false,
      newAccount: true,
      divert: false,
      nextDayFunding: 'No',
      netDivertBalance: '$0.00',
      source: sources[3],
      dataSourceIdentifier: 'DS-004',
      ahRuleApplied: ['AH004', 'AH005'],
      autoHoldRuleApplied: ['AH004'],
      createdBatchTrigger: 'Weekly Batch',
    } as MerchantTransaction & { ruleId?: string },
    {
      id: '5',
      merchant: 'City Supermarket',
      dbaName: 'City Market',
      amount: '$125.45',
      exception: 'Manual review flag',
      processor: 'TSYS',
      mid: '8675309005',
      date: formatDate(new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000)),
      uwDate: formatUWDate(new Date(baseDate.getTime() - 10 * 24 * 60 * 60 * 1000)),
      status: 'Reviewed',
      createdAt: getDateInLast7Days(2),
      updatedAt: getDateInLast7Days(2),
      ruleId: 'AH005',
      channel: channels[3],
      reseller: resellers[1] || undefined,
      riskWatch: true,
      newAccount: false,
      divert: true,
      nextDayFunding: 'Yes',
      netDivertBalance: '$125.45',
      source: sources[0],
      dataSourceIdentifier: 'DS-005',
      ahRuleApplied: ['AH005'],
      autoHoldRuleApplied: ['AH005'],
      createdBatchTrigger: 'Daily Batch',
    } as MerchantTransaction & { ruleId?: string },
  ];
};

const ALL_TRANSACTIONS: (MerchantTransaction & { ruleId?: string })[] = generateTransactions();

export default function CustomTable({ filters }: CustomTableProps) {
  // Filter transactions based on filters
  const transactions = React.useMemo(() => {
    if (!filters) return ALL_TRANSACTIONS;

    let filtered = [...ALL_TRANSACTIONS];

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((tx) => tx.status === filters.status);
    }

    // Filter by processor
    if (filters.processor && filters.processor !== 'all') {
      filtered = filtered.filter((tx) => tx.processor === filters.processor);
    }

    // Filter by source
    if (filters.source && filters.source !== 'all') {
      filtered = filtered.filter((tx) => tx.source === filters.source);
    }

    // Filter by merchant (case-insensitive search)
    if (filters.merchant) {
      const merchantLower = filters.merchant.toLowerCase();
      filtered = filtered.filter((tx) =>
        (tx.merchant?.toLowerCase().includes(merchantLower) || 
         tx.dbaName?.toLowerCase().includes(merchantLower))
      );
    }

    // Filter by MID (case-insensitive search)
    if (filters.mid) {
      const midLower = filters.mid.toLowerCase();
      filtered = filtered.filter((tx) =>
        tx.mid.toLowerCase().includes(midLower)
      );
    }

    // Filter by rule ID
    if (filters.ruleId && filters.ruleId !== 'all') {
      const ruleIds = Array.isArray(filters.ruleId) ? filters.ruleId : [filters.ruleId];
      filtered = filtered.filter((tx) => {
        const txRuleId = (tx as MerchantTransaction & { ruleId?: string }).ruleId;
        const ahRules = tx.ahRuleApplied || [];
        const autoHoldRules = tx.autoHoldRuleApplied || [];
        return (txRuleId && ruleIds.includes(txRuleId)) ||
               ahRules.some(r => ruleIds.includes(r)) ||
               autoHoldRules.some(r => ruleIds.includes(r));
      });
    }

    // Filter by date range
    if (filters.dateRange) {
      const now = new Date();
      let startDate: Date;

      if (filters.dateRange === 'custom') {
        if (filters.customStartDate) {
          startDate = new Date(filters.customStartDate);
        } else {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }
      } else {
        const days = parseInt(filters.dateRange);
        startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      }

      const endDate = filters.dateRange === 'custom' && filters.customEndDate
        ? new Date(filters.customEndDate)
        : now;

      filtered = filtered.filter((tx) => {
        if (!tx.createdAt) return false;
        const txDate = new Date(tx.createdAt);
        return txDate >= startDate && txDate <= endDate;
      });
    }

    return filtered;
  }, [filters]);

  // Define columns with refined structure
  const columns = React.useMemo(() => [
    columnHelper.accessor('dbaName', {
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          DBA Name
        </Text>
      ),
      cell: (info) => (
        <Text fontSize="sm" fontWeight="medium" py={0.5}>
          {info.getValue() || info.row.original.merchant || '—'}
        </Text>
      ),
      enableSorting: true,
      meta: { align: 'left' },
    }),
    columnHelper.accessor('mid', {
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          MID
        </Text>
      ),
      cell: (info) => (
        <Text fontSize="sm" fontFamily="mono" py={0.5}>
          {info.getValue()}
        </Text>
      ),
      enableSorting: true,
      meta: { align: 'left' },
    }),
    columnHelper.accessor('uwDate', {
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          UW Date
        </Text>
      ),
      cell: (info) => (
        <Text fontSize="sm" py={0.5}>
          {info.getValue() || '—'}
        </Text>
      ),
      enableSorting: true,
      meta: { align: 'left' },
    }),
    columnHelper.display({
      id: 'originPartner',
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          Origin / Partner
        </Text>
      ),
      cell: (info) => (
        <Box py={0.5}>
          <OriginPartnerCell
            channel={info.row.original.channel}
            reseller={info.row.original.reseller}
            referralPartner={info.row.original.referralPartner}
            solutionConsultant={info.row.original.solutionConsultant}
          />
        </Box>
      ),
      meta: { align: 'left' },
    }),
    columnHelper.accessor('riskWatch', {
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600" textAlign="center">
          Risk Watch
        </Text>
      ),
      cell: (info) => {
        const value = info.getValue();
        return (
          <Box display="flex" justifyContent="center" alignItems="center" py={0.5} minH="20px">
            <BooleanIcon value={value === true} label="Risk Watch Enabled" />
          </Box>
        );
      },
      enableSorting: true,
      meta: { align: 'center' },
    }),
    columnHelper.accessor('newAccount', {
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600" textAlign="center">
          New Account
        </Text>
      ),
      cell: (info) => {
        const value = info.getValue();
        return (
          <Box display="flex" justifyContent="center" alignItems="center" py={0.5} minH="20px">
            <BooleanIcon value={value === true} label="New Account" />
          </Box>
        );
      },
      enableSorting: true,
      meta: { align: 'center' },
    }),
    columnHelper.accessor('divert', {
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600" textAlign="center">
          Divert
        </Text>
      ),
      cell: (info) => {
        const value = info.getValue();
        return (
          <Box display="flex" justifyContent="center" alignItems="center" py={0.5} minH="20px">
            <BooleanIcon value={value === true} label="Divert Enabled" />
          </Box>
        );
      },
      enableSorting: true,
      meta: { align: 'center' },
    }),
    columnHelper.display({
      id: 'fundingInfo',
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          Funding Info
        </Text>
      ),
      cell: (info) => (
        <Box py={0.5}>
          <FundingInfoCell
            nextDayFunding={info.row.original.nextDayFunding}
            netDivertBalance={info.row.original.netDivertBalance}
          />
        </Box>
      ),
      meta: { align: 'left' },
    }),
    columnHelper.accessor('source', {
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          Source
        </Text>
      ),
      cell: (info) => (
        <Text fontSize="sm" py={0.5}>
          {info.getValue() || '—'}
        </Text>
      ),
      enableSorting: true,
      meta: { align: 'left' },
    }),
    columnHelper.accessor('dataSourceIdentifier', {
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          Data Source Identifier
        </Text>
      ),
      cell: (info) => (
        <Text fontSize="sm" fontFamily="mono" py={0.5}>
          {info.getValue() || '—'}
        </Text>
      ),
      enableSorting: true,
      meta: { align: 'left' },
    }),
    columnHelper.display({
      id: 'ahRuleApplied',
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          AH Rule Applied
        </Text>
      ),
      cell: (info) => (
        <Box py={0.5} display="flex" alignItems="center">
          <RuleChips rules={info.row.original.ahRuleApplied} maxVisible={3} />
        </Box>
      ),
      meta: { align: 'left' },
    }),
    columnHelper.display({
      id: 'autoHoldRuleApplied',
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          Auto Hold Rule Applied
        </Text>
      ),
      cell: (info) => (
        <Box py={0.5} display="flex" alignItems="center">
          <RuleChips rules={info.row.original.autoHoldRuleApplied} maxVisible={3} />
        </Box>
      ),
      meta: { align: 'left' },
    }),
    columnHelper.accessor('createdBatchTrigger', {
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          Created Batch Trigger
        </Text>
      ),
      cell: (info) => (
        <Box py={0.5}>
          <BatchTriggerTag value={info.getValue()} />
        </Box>
      ),
      enableSorting: true,
      meta: { align: 'left' },
    }),
  ] as ColumnDef<MerchantTransaction>[], []);

  const frameworks = createListCollection({
    items: [
      { label: '10', value: '10' },
      { label: '25', value: '25' },
      { label: '50', value: '50' },
    ],
  });

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} bg="white" shadow="sm">
      {/* Header */}
      <VStack align="start" gap={1} mb={3}>
        <Text fontWeight="bold" fontSize="lg">
          Transaction Review
        </Text>
        <Text color="gray.600" fontSize="sm">
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} flagged for review
          {filters?.dateRange && filters.dateRange !== 'custom' && (
            <> in the last <b>{filters.dateRange} days</b></>
          )}
          {filters?.dateRange === 'custom' && filters.customStartDate && filters.customEndDate && (
            <> between <b>{new Date(filters.customStartDate).toLocaleDateString()}</b> and{' '}
            <b>{new Date(filters.customEndDate).toLocaleDateString()}</b></>
          )}
        </Text>
      </VStack>

      {/* Table with custom styling */}
      <Box position="relative">
        <style>
          {`
            [data-part="table-row"] {
              transition: background-color 0.15s ease;
            }
            [data-part="table-row"]:hover {
              background-color: var(--chakra-colors-gray-50);
              cursor: pointer;
            }
            [data-part="column-header"]:not(:last-child) {
              border-right-width: 1px;
              border-right-color: var(--chakra-colors-gray-200);
            }
            [data-part="cell"] {
              padding-top: 0.125rem;
              padding-bottom: 0.125rem;
            }
          `}
        </style>
        <DataTable
          data={{
            data: transactions,
            count: transactions.length,
            page: 1,
            pageCount: transactions.length,
            total: transactions.length,
          }}
          isLoading={false}
          columns={columns}
          CollapsibleBody={CollapsibleContent}
        />
      </Box>

      {/* Footer */}
      <HStack justify="space-between" mt={3} pt={3} borderTopWidth="1px" borderColor="gray.200">
        <HStack>
          <Text fontSize="sm">Show</Text>

          <Select.Root collection={frameworks} size="sm" width="80px">
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="10" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {frameworks.items.map((framework) => (
                    <Select.Item item={framework} key={framework.value}>
                      {framework.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Text fontSize="sm">records per page</Text>
        </HStack>

        <Text fontSize="sm" color="gray.600">
          Showing 1 to {transactions.length} of {transactions.length} entries
        </Text>

        <HStack gap={2}>
          <Button size="xs" variant="outline" suppressHydrationWarning>
            1
          </Button>
          <Button size="xs" variant="ghost" disabled suppressHydrationWarning>
            &gt;
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
