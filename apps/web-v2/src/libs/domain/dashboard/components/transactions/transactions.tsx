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
import { Check, Circle, Copy } from 'lucide-react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MerchantTransaction } from '@/data/interfaces/transaction';
import { statusColor } from '@/libs/utils/utils';
import { DataTable } from '@/ui/components/common/organisms/data-table';
import BatchDrawer from '@/libs/domain/auto-hold/components/batch-drawer/batch-drawer';
import { AutoHoldFilterState } from '@/libs/domain/auto-hold/components/filter-bar/filter-bar';

const columnHelper = createColumnHelper<MerchantTransaction>();

// MID Cell Component with Copy Functionality
function MIDCell({ mid }: { mid: string }) {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    try {
      await navigator.clipboard.writeText(mid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy MID:', err);
    }
  };
  
  return (
    <HStack 
      gap={2} 
      py={0.5}
      cursor="pointer"
      onClick={handleCopy}
      _hover={{ opacity: 0.8 }}
      role="button"
      aria-label={`Copy MID ${mid}`}
    >
      <Text fontSize="sm" fontFamily="mono">
        {mid}
      </Text>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Box
            as="span"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            color={copied ? 'green.600' : 'gray.400'}
            _hover={{ color: copied ? 'green.600' : 'gray.600' }}
            transition="color 0.2s"
          >
            {copied ? (
              <Check size={14} />
            ) : (
              <Copy size={14} />
            )}
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
              {copied ? 'Copied!' : 'Click to copy MID'}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Portal>
      </Tooltip.Root>
    </HStack>
  );
}

// Data Source Cell Component with Click to Copy Functionality
function DataSourceCell({ source, identifier }: { source: string; identifier: string }) {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    try {
      await navigator.clipboard.writeText(identifier);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy identifier:', err);
    }
  };
  
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Box 
          as="span" 
          cursor="pointer"
          onClick={handleCopy}
          display="inline-flex"
          alignItems="center"
          gap={1}
          _hover={{ opacity: 0.8 }}
          transition="opacity 0.2s"
        >
          <Text fontSize="sm" py={0.5}>
            {source}
          </Text>
          {copied ? (
            <Check size={14} color="green" />
          ) : (
            <Copy size={14} color="gray" />
          )}
        </Box>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content
            bg="gray.900"
            color="white"
            px={3}
            py={2}
            borderRadius="md"
            fontSize="sm"
            boxShadow="lg"
            maxW="300px"
          >
            <Tooltip.Arrow />
            <VStack align="stretch" gap={1}>
              <Text fontWeight="semibold">Data Source Identifier:</Text>
              <Text fontFamily="mono" fontSize="sm" color="gray.200">
                {identifier}
              </Text>
              <Text fontSize="xs" color="gray.400" mt={1}>
                Click to copy
              </Text>
            </VStack>
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
}

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

// Real data source identifiers
export const REAL_DATA_SOURCE_IDENTIFIERS = {
  Returns: [
    'ACH Returns 20251125',
    'ACH Returns 20251126',
  ],
  Auth: [
    'TSYS ADF Auth 11252025_20251125_061057',
    'TSYS ADF Auth 11252025_20251125_081124',
  ],
  Capture: [
    'TSYS DFT256 Capture 20251125_031528_24',
    'TSYS DFT256 Capture 20251125_051906_02',
  ],
  Settled: [
    'TSYS TDDF Settle 20251124_193646',
    'TSYS TDDF Settle 20251125_193453',
  ],
};

// Generate MID: 16 digits starting with 5555 or 7777
export function generateMID(index: number = 0): string {
  // Use index to deterministically choose prefix (alternate between 5555 and 7777)
  const prefix = index % 2 === 0 ? '5555' : '7777';
  // Generate remaining 12 digits based on index for consistency
  let seed = index * 9301 + 49297;
  const generateDigit = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return Math.floor((seed / 233280) * 10);
  };
  const remainingDigits = Array.from({ length: 12 }, generateDigit).join('');
  return `${prefix}${remainingDigits}`;
}

// Generate realistic data source identifiers using real data
export function generateDataSourceIdentifier(source: string, date: Date): string {
  // Map source to identifier category
  let category: keyof typeof REAL_DATA_SOURCE_IDENTIFIERS;
  
  switch (source) {
    case 'Returns':
      category = 'Returns';
      break;
    case 'Auth':
      category = 'Auth';
      break;
    case 'Capture':
      category = 'Capture';
      break;
    case 'Settled':
      category = 'Settled';
      break;
    default:
      category = 'Auth'; // Default to Auth
  }
  
  // Select a random identifier from the appropriate category
  const identifiers = REAL_DATA_SOURCE_IDENTIFIERS[category];
  const randomIndex = Math.floor(Math.random() * identifiers.length);
  return identifiers[randomIndex] || identifiers[0] || 'TSYS ADF Auth 11252025_20251125_061057';
}

// Generate transactions with new fields
const generateTransactions = (): (MerchantTransaction & { ruleId?: string })[] => {
  const baseDate = new Date();
  const channels = ['Direct', 'Partner', 'Reseller', 'Online'];
  const resellers = ['Reseller A', 'Reseller B', null];
  const referralPartners = ['Partner X', 'Partner Y', null];
  const solutionConsultants = ['SC Alpha', 'SC Beta', null];
  const dataSources = ['Auth', 'Capture', 'Settled', 'Returns'];
  
  const tx1Date = new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000);
  const tx2Date = new Date(baseDate.getTime() - 0.5 * 24 * 60 * 60 * 1000);
  const tx3Date = new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000);
  const tx4Date = new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000);
  const tx5Date = new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000);
  
  return [
    {
      id: '1',
      merchant: 'Global Tech Solutions',
      dbaName: 'GTS Inc.',
      amount: '$12,500.00',
      exception: 'High-risk country, Unusual amount',
      processor: 'TSYS',
      mid: generateMID(0),
      date: formatDate(tx1Date),
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
      source: dataSources[0],
      dataSourceIdentifier: generateDataSourceIdentifier(dataSources[0], tx1Date),
      ahRuleApplied: ['AH001', 'AH002', 'AH003', 'AH004'],
      autoHoldRuleApplied: ['AH001'],
      createdBatchTrigger: 'Daily Batch',
      createdBatchDate: getDateInLast7Days(1),
    } as MerchantTransaction & { ruleId?: string },
    {
      id: '2',
      merchant: 'Oceanview Logistics',
      dbaName: 'Oceanview LLC',
      amount: '$8,750.50',
      exception: 'New merchant, Pattern match anomaly',
      processor: 'FSP',
      mid: generateMID(1),
      date: formatDate(tx2Date),
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
      source: dataSources[1],
      dataSourceIdentifier: generateDataSourceIdentifier(dataSources[1], tx2Date),
      ahRuleApplied: ['AH002'],
      autoHoldRuleApplied: ['AH002', 'AH003'],
      createdBatchTrigger: 'Manual',
      createdBatchDate: getDateInLast7Days(0),
    } as MerchantTransaction & { ruleId?: string },
    {
      id: '3',
      merchant: 'Sunshine Pharmacy',
      dbaName: 'Sunshine Pharma',
      amount: '$456.78',
      exception: 'Frequency anomaly',
      processor: 'TSYS',
      mid: generateMID(2),
      date: formatDate(tx3Date),
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
      source: dataSources[2],
      dataSourceIdentifier: generateDataSourceIdentifier(dataSources[2], tx3Date),
      ahRuleApplied: ['AH003', 'AH004'],
      autoHoldRuleApplied: ['AH003'],
      createdBatchTrigger: 'Daily Batch',
      createdBatchDate: getDateInLast7Days(1),
    } as MerchantTransaction & { ruleId?: string },
    {
      id: '4',
      merchant: 'Digital Assets Exchange',
      dbaName: 'DAE Corp',
      amount: '$25,000.00',
      exception: 'High-risk merchant category',
      processor: 'FSP',
      mid: generateMID(3),
      date: formatDate(tx4Date),
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
      source: dataSources[3],
      dataSourceIdentifier: generateDataSourceIdentifier(dataSources[3], tx4Date),
      ahRuleApplied: ['AH004', 'AH005'],
      autoHoldRuleApplied: ['AH004'],
      createdBatchTrigger: 'Weekly Batch',
      createdBatchDate: getDateInLast7Days(1),
    } as MerchantTransaction & { ruleId?: string },
    {
      id: '5',
      merchant: 'City Supermarket',
      dbaName: 'City Market',
      amount: '$125.45',
      exception: 'Manual review flag',
      processor: 'TSYS',
      mid: generateMID(4),
      date: formatDate(tx5Date),
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
      source: dataSources[0],
      dataSourceIdentifier: generateDataSourceIdentifier(dataSources[0], tx5Date),
      ahRuleApplied: ['AH005'],
      autoHoldRuleApplied: ['AH005'],
      createdBatchTrigger: 'Daily Batch',
      createdBatchDate: getDateInLast7Days(2),
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

    // Filter by data source
    if (filters.dataSource && filters.dataSource !== 'all') {
      filtered = filtered.filter((tx) => tx.source === filters.dataSource);
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
        <MIDCell mid={info.getValue()} />
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
        const netDivertBalance = info.row.original.netDivertBalance;
        const isFlagged = value === true;
        
        return (
          <VStack align="center" gap={0.5} py={0.5} minH="20px">
            <Box display="flex" justifyContent="center" alignItems="center">
              <BooleanIcon value={isFlagged} label="Divert Enabled" />
            </Box>
            {isFlagged && netDivertBalance && (
              <Text fontSize="xs" color="gray.600" fontWeight="medium">
                {netDivertBalance}
              </Text>
            )}
          </VStack>
        );
      },
      enableSorting: true,
      meta: { align: 'center' },
    }),
    columnHelper.display({
      id: 'nextDayFunding',
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600" textAlign="center">
          Next Day Funding
        </Text>
      ),
      cell: (info) => {
        // Convert "Yes" to true, "No" to false for BooleanIcon
        const value = info.row.original.nextDayFunding === 'Yes' || info.row.original.nextDayFunding === 'NDF';
        return (
          <Box display="flex" justifyContent="center" alignItems="center" py={0.5} minH="20px">
            <BooleanIcon value={value === true} label="Next Day Funding Enabled" />
          </Box>
        );
      },
      meta: { align: 'center' },
    }),
    columnHelper.accessor('source', {
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          Data Source
        </Text>
      ),
      cell: (info) => {
        const source = info.getValue() || '—';
        const identifier = info.row.original.dataSourceIdentifier;
        
        if (!identifier) {
          return (
            <Text fontSize="sm" py={0.5}>
              {source}
            </Text>
          );
        }
        
        return (
          <DataSourceCell source={source} identifier={identifier} />
        );
      },
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
      id: 'autoHoldCount',
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          Auto Hold Count
        </Text>
      ),
      cell: (info) => {
        // Count based on AH Rule Applied (not Auto Hold Rule Applied)
        const rules = info.row.original.ahRuleApplied || [];
        const count = rules.length;
        return (
          <Box py={0.5} display="flex" alignItems="center">
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              {count > 0 ? count : '—'}
            </Text>
          </Box>
        );
      },
      meta: { align: 'left' },
    }),
    columnHelper.accessor('createdBatchDate', {
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
          Created Batch Date
        </Text>
      ),
      cell: (info) => {
        const dateValue = info.getValue();
        if (!dateValue) return <Text fontSize="sm" color="gray.400">—</Text>;
        
        // Format date if it's a string
        let formattedDate = dateValue;
        try {
          const date = new Date(dateValue);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            });
          }
        } catch (e) {
          // If parsing fails, use the original value
        }
        
        return (
          <Text fontSize="sm" py={0.5}>
            {formattedDate}
          </Text>
        );
      },
      enableSorting: true,
      meta: { align: 'left' },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => (
        <Text fontSize="xs" fontWeight="semibold" color="gray.600" textAlign="center">
          Actions
        </Text>
      ),
      cell: (info) => {
        const transaction = info.row.original;
        // Group transactions by batch (using createdBatchDate as batch identifier)
        // For now, we'll use the single transaction as the batch
        // In a real scenario, you'd group by batch ID or date
        const batchTransactions = [transaction];
        
        return (
          <Box py={0.5} display="flex" justifyContent="center" alignItems="center">
            <BatchDrawer
              batch={batchTransactions}
              trigger={
                <Button size="xs" variant="outline" colorPalette="blue">
                  View Batch
                </Button>
              }
            />
          </Box>
        );
      },
      meta: { align: 'center' },
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
          Batch Review
        </Text>
        <Text color="gray.600" fontSize="sm">
          {transactions.length} batch{transactions.length !== 1 ? 'es' : ''} flagged for review
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
