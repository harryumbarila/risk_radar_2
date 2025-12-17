'use client';
import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Box,
  Button,
  Table,
  Badge,
  Select,
  createListCollection,
  Portal,
  Input,
  Skeleton,
  Tooltip,
  Dialog,
  CloseButton,
} from '@chakra-ui/react';
import { Download, CreditCard, Copy, Check, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ActivityEntry } from '../../types';
import { format } from 'date-fns';

interface ActivityTabProps {
  holdId: string;
  mid: string;
}

type DateRangePreset = 'today' | '7' | '30' | 'custom';

interface DateRangeState {
  preset: DateRangePreset;
  customStartDate?: string;
  customEndDate?: string;
}

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

// Deterministic random number generator based on seed
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate Capture format transaction data
const generateCaptureTransaction = (
  mid: string,
  index: number,
  txDate: Date
): ActivityEntry => {
  const cardTypes = ['American Express', 'Visa', 'Mastercard', 'Discover'];
  const posEntryModes = ['01 - Manual key entry', '05 - Chip read', '07 - Contactless', '02 - Swipe'];
  
  // Use MID and index as seed for deterministic values
  const seed1 = (mid.charCodeAt(0) || 0) + index * 1000;
  const seed2 = (mid.charCodeAt(1) || 0) + index * 2000;
  const seed3 = (mid.charCodeAt(2) || 0) + index * 3000;
  const seed4 = (mid.charCodeAt(3) || 0) + index * 4000;
  
  const cardF6 = String(Math.floor(seededRandom(seed1) * 900000) + 100000);
  const cardL4 = String(Math.floor(seededRandom(seed2) * 9000) + 1000).padStart(4, '0');
  const cardType = cardTypes[index % cardTypes.length] || cardTypes[0] || 'Visa';
  const posEntryMode = posEntryModes[index % posEntryModes.length] || posEntryModes[0] || 'Chip';
  const calcEntryType = posEntryMode.includes('Manual') 
    ? 'Keyed' 
    : posEntryMode.includes('Chip') 
    ? 'Chip' 
    : posEntryMode.includes('Contactless')
    ? 'Contactless'
    : 'Swipe';
  const cardNotPresent = posEntryMode.includes('Manual') ? 'Yes' : 'No';
  const authCode = String(Math.floor(seededRandom(seed3) * 900000) + 100000);
  
  // Generate transaction amount
  const amount = (seededRandom(seed4) * 5000 + 10).toFixed(2);
  const transactionAmt = `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  const transmissionDate = txDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
  const transactionDate = txDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
  
  return {
    id: `txn-${mid}-${index}`,
    transmissionDate,
    transactionDate,
    transactionAmt,
    authCode,
    cardF6,
    cardL4,
    cardType,
    posEntryMode,
    posEntryModeCalculated: calcEntryType,
    cardNotPresent: cardNotPresent as 'Yes' | 'No',
    timestamp: new Date(txDate), // Ensure we create a new Date object
  };
};

// Interface for card history transaction
interface CardHistoryTransaction {
  mid: string;
  transactionDate: string;
  amount: string;
  posAvsResult: string;
  authCode: string;
  cardNumber: string;
  dbNet: string;
  transmissionDate: string;
  netDepositAmount: string;
  timestamp: Date;
}

// Generate mock card history data with multiple MIDs
const generateCardHistory = (cardF6: string, cardL4: string, baseMid: string): CardHistoryTransaction[] => {
  const transactions: CardHistoryTransaction[] = [];
  const baseDate = new Date();
  
  // Generate 30-40 transactions for pagination testing with multiple MIDs
  const count = 30 + Math.floor(seededRandom(cardF6.charCodeAt(0) || 0) * 10);
  
  // Generate list of MIDs (mix of baseMid and some variations)
  const midVariations = [
    baseMid,
    baseMid.slice(0, -2) + (parseInt(baseMid.slice(-2)) + 1).toString().padStart(2, '0'),
    baseMid.slice(0, -2) + (parseInt(baseMid.slice(-2)) + 2).toString().padStart(2, '0'),
    baseMid.slice(0, -3) + (parseInt(baseMid.slice(-3)) + 10).toString().padStart(3, '0'),
  ];
  
  for (let i = 0; i < count; i++) {
    const seed = (cardF6.charCodeAt(0) || 0) + i * 1000;
    const txDate = new Date(baseDate);
    // Distribute dates across last 60 days
    txDate.setDate(txDate.getDate() - Math.floor(seededRandom(seed) * 60));
    txDate.setHours(9 + (i % 12), 15 + (i * 5) % 45, 0, 0);
    
    const transDate = txDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const transTime = txDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const transmissionDate = txDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const amount = (seededRandom(seed) * 5000 + 100).toFixed(2);
    const netDeposit = (parseFloat(amount) * 0.97).toFixed(2);
    const dbNet = (seededRandom(seed + 1000) * 100 - 50).toFixed(2);
    
    const posAvsResults = ['Y - Match', 'Z - Partial', 'N - No Match', 'A - Address Match'];
    const authCodes = ['000000', '123456', '789012', '345678'];
    
    // Select MID from variations (70% baseMid, 30% others)
    let selectedMid: string;
    if (seededRandom(seed + 3000) < 0.7) {
      selectedMid = midVariations[0] || baseMid;
    } else {
      const randomIndex = Math.floor(seededRandom(seed + 4000) * (midVariations.length - 1)) + 1;
      selectedMid = midVariations[randomIndex] || baseMid;
    }
    
    transactions.push({
      mid: selectedMid,
      transactionDate: `${transDate} ${transTime}`,
      amount: `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      posAvsResult: posAvsResults[i % posAvsResults.length] || 'N - No Match',
      authCode: authCodes[i % authCodes.length] || '000000',
      cardNumber: `${cardF6} •••• ${cardL4}`,
      dbNet: `$${parseFloat(dbNet).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      transmissionDate,
      netDepositAmount: `$${parseFloat(netDeposit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      timestamp: txDate, // Add timestamp for date filtering
    });
  }
  
  return transactions;
};

export default function ActivityTab({ holdId, mid }: ActivityTabProps) {
  const [dateRange, setDateRange] = React.useState<DateRangeState>({ preset: '30' });
  const [isLoading, setIsLoading] = React.useState(true);
  const [activities, setActivities] = React.useState<ActivityEntry[]>([]);
  
  // Card History modal state
  const [isCardHistoryOpen, setIsCardHistoryOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<{ cardF6: string; cardL4: string } | null>(null);
  const [cardHistoryPage, setCardHistoryPage] = React.useState(1);
  const [cardHistoryDateRange, setCardHistoryDateRange] = React.useState<DateRangeState>({ preset: '30' });
  const [cardHistoryMidFilter, setCardHistoryMidFilter] = React.useState<string>('');
  const [cardHistorySortColumn, setCardHistorySortColumn] = React.useState<'mid' | 'transactionDate' | 'transmissionDate' | null>(null);
  const [cardHistorySortDirection, setCardHistorySortDirection] = React.useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  // Generate mock transactions based on MID
  const generateMockTransactions = (mid: string): ActivityEntry[] => {
    const now = new Date();
    const transactions: ActivityEntry[] = [];
    
    // Different transaction counts for different MIDs
    let transactionCount = 15; // Default
    
    if (mid === '5555757803895166') {
      transactionCount = 20; // More transactions for MID 1
    } else if (mid === '7777539719775762') {
      transactionCount = 25; // Most transactions for MID 2
    } else if (mid === '5555311714555377') {
      transactionCount = 12; // Fewer transactions for MID 3
    }
    
    // Generate transactions distributed across different date ranges
    // Ensure we have some transactions for today, last 7 days, and last 30 days
    for (let i = 0; i < transactionCount; i++) {
      // Distribute transactions: some today, some in last 7 days, some in last 30 days
      let daysOffset = 0;
      if (i < Math.floor(transactionCount * 0.2)) {
        // 20% today (0-1 days ago)
        daysOffset = Math.floor(seededRandom((mid.charCodeAt(0) || 0) + i * 1000) * 1);
      } else if (i < Math.floor(transactionCount * 0.5)) {
        // 30% in last 7 days (1-7 days ago)
        daysOffset = Math.floor(seededRandom((mid.charCodeAt(1) || 0) + i * 2000) * 6) + 1;
      } else {
        // 50% in last 30 days (7-30 days ago)
        daysOffset = Math.floor(seededRandom((mid.charCodeAt(2) || 0) + i * 3000) * 23) + 7;
      }
      
      const txDate = new Date(now);
      txDate.setDate(txDate.getDate() - daysOffset);
      // Add some random hours and minutes for more realistic timestamps
      txDate.setHours(Math.floor(seededRandom((mid.charCodeAt(3) || 0) + i * 4000) * 24));
      txDate.setMinutes(Math.floor(seededRandom((mid.charCodeAt(4) || 0) + i * 5000) * 60));
      
      transactions.push(generateCaptureTransaction(mid, i, txDate));
    }
    
    return transactions;
  };

  // Mock data - in production, this would come from an API
  React.useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockTransactions = generateMockTransactions(mid);
      setActivities(mockTransactions);
      setIsLoading(false);
    }, 800);
  }, [holdId, mid]);

  const dateRangeCollection = createListCollection({
    items: [
      { label: 'Today', value: 'today' },
      { label: 'Last 7 days', value: '7' },
      { label: 'Last 30 days', value: '30' },
      { label: 'Custom', value: 'custom' },
    ],
  });

  const filteredActivities = React.useMemo(() => {
    if (activities.length === 0) return [];
    
    let filtered = [...activities];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    today.setHours(0, 0, 0, 0);

    if (dateRange.preset === 'custom') {
      if (dateRange.customStartDate && dateRange.customEndDate) {
        const startDate = new Date(dateRange.customStartDate + 'T00:00:00');
        const endDate = new Date(dateRange.customEndDate + 'T23:59:59');
        
        filtered = filtered.filter((a) => {
          const activityDate = new Date(a.timestamp);
          activityDate.setHours(0, 0, 0, 0);
          const activityTime = a.timestamp.getTime();
          return activityTime >= startDate.getTime() && activityTime <= endDate.getTime();
        });
      } else {
        // If custom dates are not set, return all activities
        return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      }
    } else if (dateRange.preset === 'today') {
      const startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter((a) => {
        const activityTime = a.timestamp.getTime();
        return activityTime >= startDate.getTime() && activityTime <= endDate.getTime();
      });
    } else {
      const days = parseInt(dateRange.preset);
      if (!isNaN(days) && days > 0) {
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - (days - 1));
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter((a) => {
          const activityTime = a.timestamp.getTime();
          return activityTime >= startDate.getTime() && activityTime <= endDate.getTime();
        });
      }
    }

    // Sort by most recent first
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [activities, dateRange]);

  const handleExportCSV = () => {
    const headers = [
      'Transmission date',
      'Transaction date',
      'Transaction Amt',
      'Auth code',
      'Card # F6',
      'Card # L4',
      'Card type',
      'POS entry mode',
      'POS entry mode Calculated',
      'Card Not Present',
    ];
    const rows = filteredActivities.map((activity) => [
      activity.transmissionDate,
      activity.transactionDate,
      activity.transactionAmt,
      activity.authCode,
      activity.cardF6,
      activity.cardL4,
      activity.cardType,
      activity.posEntryMode,
      activity.posEntryModeCalculated,
      activity.cardNotPresent,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `merchant-hold-activity-${mid}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <VStack align="stretch" gap={4}>
      {/* Header with Date Range Filter and Export */}
      <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
        <HStack gap={3} flexWrap="wrap">
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600" fontWeight="medium">
              Date Range
            </Text>
            <Box minW="150px">
              <Select.Root
                collection={dateRangeCollection}
                value={[dateRange.preset]}
                onValueChange={(e) => {
                  const value = (e.value[0] || '30') as DateRangePreset;
                  if (value !== 'custom') {
                    setDateRange({ preset: value });
                  } else {
                    setDateRange({ preset: value, customStartDate: undefined, customEndDate: undefined });
                  }
                }}
                size="sm"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner zIndex={10000}>
                    <Select.Content zIndex={10000}>
                      {dateRangeCollection.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>
          </VStack>

          {dateRange.preset === 'custom' && (
            <HStack gap={2} align="end">
              <VStack align="start" gap={1}>
                <Text fontSize="xs" color="gray.600">
                  Start Date
                </Text>
                <Input
                  type="date"
                  size="sm"
                  width="150px"
                  value={dateRange.customStartDate || ''}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, customStartDate: e.target.value })
                  }
                />
              </VStack>
              <VStack align="start" gap={1}>
                <Text fontSize="xs" color="gray.600">
                  End Date
                </Text>
                <Input
                  type="date"
                  size="sm"
                  width="150px"
                  value={dateRange.customEndDate || ''}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, customEndDate: e.target.value })
                  }
                />
              </VStack>
            </HStack>
          )}
        </HStack>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          disabled={filteredActivities.length === 0}
        >
          <Download size={16} />
          Export CSV
        </Button>
      </HStack>

      {/* Capture Format Transaction Table */}
      <Box
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="lg"
        overflow="hidden"
        bg="white"
      >
        {isLoading ? (
          <Box p={4}>
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Transmission date</Table.ColumnHeader>
                  <Table.ColumnHeader>Transaction date</Table.ColumnHeader>
                  <Table.ColumnHeader>Transaction Amt</Table.ColumnHeader>
                  <Table.ColumnHeader>Auth code</Table.ColumnHeader>
                  <Table.ColumnHeader>Card # F6 / L4</Table.ColumnHeader>
                  <Table.ColumnHeader>Card type</Table.ColumnHeader>
                  <Table.ColumnHeader>POS entry mode</Table.ColumnHeader>
                  <Table.ColumnHeader>POS entry mode Calculated</Table.ColumnHeader>
                  <Table.ColumnHeader>Card Not Present</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Table.Row key={i}>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        ) : filteredActivities.length === 0 ? (
          <Box p={8} textAlign="center">
            <VStack gap={2}>
              <Text fontSize="sm" color="gray.600">
                No transactions recorded for this period.
              </Text>
              <Text fontSize="xs" color="gray.500">
                Try adjusting the date range to see more transactions.
              </Text>
            </VStack>
          </Box>
        ) : (
          <Table.ScrollArea>
            <Table.Root size="sm" stickyHeader variant="outline">
              <Table.Header bg="gray.50">
                <Table.Row>
                  <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.700" py={3} px={4}>
                    Transmission date
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.700" py={3} px={4}>
                    Transaction date
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.700" py={3} px={4} textAlign="right">
                    Transaction Amt
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.700" py={3} px={4}>
                    Auth code
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.700" py={3} px={4}>
                    Card # F6 / L4
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.700" py={3} px={4}>
                    Card type
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.700" py={3} px={4}>
                    POS entry mode
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.700" py={3} px={4}>
                    POS entry mode Calculated
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="gray.700" py={3} px={4}>
                    Card Not Present
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredActivities.map((activity) => (
                  <Table.Row
                    key={activity.id}
                    _hover={{ bg: 'gray.50' }}
                    transition="background-color 0.15s ease"
                  >
                    <Table.Cell py={3} px={4} fontSize="xs" color="gray.700">
                      {activity.transmissionDate}
                    </Table.Cell>
                    <Table.Cell py={3} px={4} fontSize="xs" color="gray.700">
                      {activity.transactionDate}
                    </Table.Cell>
                    <Table.Cell py={3} px={4} textAlign="right">
                      <Text fontSize="xs" fontWeight="semibold" color="gray.900">
                        {activity.transactionAmt}
                      </Text>
                    </Table.Cell>
                    <Table.Cell py={3} px={4}>
                      <Text fontSize="xs" fontFamily="mono" color="gray.700">
                        {activity.authCode}
                      </Text>
                    </Table.Cell>
                    <Table.Cell py={3} px={4}>
                      <Tooltip.Root openDelay={300}>
                        <Tooltip.Trigger asChild>
                          <Box
                            as="button"
                            onClick={() => {
                              setSelectedCard({ cardF6: activity.cardF6, cardL4: activity.cardL4 });
                              setIsCardHistoryOpen(true);
                              setCardHistoryPage(1);
                            }}
                            px={2}
                            py={1}
                            borderRadius="full"
                            bg="gray.100"
                            _hover={{ bg: 'gray.200' }}
                            transition="all 0.2s"
                            cursor="pointer"
                            display="inline-flex"
                            alignItems="center"
                            gap={1}
                          >
                            <CreditCard size={12} />
                            <Text fontSize="xs" fontFamily="mono">
                              {activity.cardF6} •••• {activity.cardL4}
                            </Text>
                          </Box>
                        </Tooltip.Trigger>
                        <Portal>
                          <Tooltip.Positioner>
                            <Tooltip.Content
                              maxW="200px"
                              zIndex={2000}
                              bg="gray.900"
                              color="white"
                              px={2}
                              py={1}
                              borderRadius="md"
                              fontSize="xs"
                            >
                              <Tooltip.Arrow />
                              View card history
                            </Tooltip.Content>
                          </Tooltip.Positioner>
                        </Portal>
                      </Tooltip.Root>
                    </Table.Cell>
                    <Table.Cell py={3} px={4} fontSize="xs" color="gray.700">
                      {activity.cardType}
                    </Table.Cell>
                    <Table.Cell py={3} px={4} fontSize="xs" color="gray.700">
                      {activity.posEntryMode}
                    </Table.Cell>
                    <Table.Cell py={3} px={4} fontSize="xs" color="gray.700">
                      {activity.posEntryModeCalculated}
                    </Table.Cell>
                    <Table.Cell py={3} px={4}>
                      <Badge
                        colorPalette={activity.cardNotPresent === 'Yes' ? 'orange' : 'green'}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {activity.cardNotPresent}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        )}
      </Box>

      {/* Card History Modal */}
      <Dialog.Root
        open={isCardHistoryOpen}
        onOpenChange={(e) => {
          if (!e.open) {
            setIsCardHistoryOpen(false);
            setSelectedCard(null);
            setCardHistoryPage(1);
          }
        }}
        size="xl"
      >
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <Dialog.Positioner>
            <Dialog.Content
              maxW="90vw"
              w="1200px"
              maxH="90vh"
              display="flex"
              flexDirection="column"
              bg="white"
              boxShadow="xl"
            >
              <Dialog.Header borderBottomWidth="1px" borderColor="gray.200" pb={4} position="relative">
                <Box position="absolute" top={4} right={4} zIndex={10}>
                  <CloseButton onClick={() => {
                    setIsCardHistoryOpen(false);
                    setSelectedCard(null);
                    setCardHistoryPage(1);
                    setCardHistoryDateRange({ preset: '30' });
                    setCardHistoryMidFilter('');
                    setCardHistorySortColumn(null);
                    setCardHistorySortDirection('desc');
                  }} />
                </Box>
                <VStack align="start" gap={1} pr={10}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                    Card History
                  </Text>
                  {selectedCard && (
                    <VStack align="start" gap={0.5}>
                      <Text fontSize="sm" color="gray.600" fontFamily="mono">
                        {selectedCard.cardF6} •••• {selectedCard.cardL4}
                      </Text>
                      <HStack gap={2} align="center">
                        <Text fontSize="xs" color="gray.500">
                          Merchant ID:
                        </Text>
                        <MIDCell mid={mid} />
                      </HStack>
                    </VStack>
                  )}
                </VStack>
                
                {/* Filters */}
                {selectedCard && (
                  <VStack align="stretch" gap={3} mt={4} pt={4} borderTopWidth="1px" borderColor="gray.200">
                    <HStack gap={4} flexWrap="wrap" align="end">
                      {/* Date Range Filter */}
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" color="gray.600" fontWeight="medium">
                          Date Range
                        </Text>
                        <Box minW="150px">
                          <Select.Root
                            collection={dateRangeCollection}
                            value={[cardHistoryDateRange.preset]}
                            onValueChange={(e) => {
                              const value = (e.value[0] || '30') as DateRangePreset;
                              if (value !== 'custom') {
                                setCardHistoryDateRange({ preset: value });
                              } else {
                                setCardHistoryDateRange({ preset: value, customStartDate: undefined, customEndDate: undefined });
                              }
                              setCardHistoryPage(1);
                            }}
                            size="sm"
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                              <Select.Positioner zIndex={10000}>
                                <Select.Content zIndex={10000}>
                                  {dateRangeCollection.items.map((item) => (
                                    <Select.Item item={item} key={item.value}>
                                      {item.label}
                                      <Select.ItemIndicator />
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.Root>
                        </Box>
                      </VStack>

                      {cardHistoryDateRange.preset === 'custom' && (
                        <HStack gap={2} align="end">
                          <VStack align="start" gap={1}>
                            <Text fontSize="xs" color="gray.600">
                              Start Date
                            </Text>
                            <Input
                              type="date"
                              size="sm"
                              width="150px"
                              value={cardHistoryDateRange.customStartDate || ''}
                              onChange={(e) => {
                                setCardHistoryDateRange({ ...cardHistoryDateRange, customStartDate: e.target.value });
                                setCardHistoryPage(1);
                              }}
                            />
                          </VStack>
                          <VStack align="start" gap={1}>
                            <Text fontSize="xs" color="gray.600">
                              End Date
                            </Text>
                            <Input
                              type="date"
                              size="sm"
                              width="150px"
                              value={cardHistoryDateRange.customEndDate || ''}
                              onChange={(e) => {
                                setCardHistoryDateRange({ ...cardHistoryDateRange, customEndDate: e.target.value });
                                setCardHistoryPage(1);
                              }}
                            />
                          </VStack>
                        </HStack>
                      )}

                      {/* MID Filter */}
                      <VStack align="start" gap={1} flex={1} minW="200px">
                        <Text fontSize="xs" color="gray.600" fontWeight="medium">
                          MID
                        </Text>
                        <Input
                          type="text"
                          size="sm"
                          placeholder="Filter by MID..."
                          value={cardHistoryMidFilter}
                          onChange={(e) => {
                            setCardHistoryMidFilter(e.target.value);
                            setCardHistoryPage(1);
                          }}
                        />
                      </VStack>
                    </HStack>
                  </VStack>
                )}

                {/* Issuer Information */}
                {selectedCard && (
                  <HStack gap={6} mt={4} pt={4} borderTopWidth="1px" borderColor="gray.200">
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" color="gray.500" fontWeight="medium">
                        Issuer Bank
                      </Text>
                      <Text fontSize="sm" color="gray.900">
                        {selectedCard.cardF6.startsWith('4') ? 'Chase Bank' : selectedCard.cardF6.startsWith('5') ? 'Bank of America' : 'American Express'}
                      </Text>
                    </VStack>
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" color="gray.500" fontWeight="medium">
                        Issuer Country
                      </Text>
                      <Text fontSize="sm" color="gray.900">
                        USA
                      </Text>
                    </VStack>
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" color="gray.500" fontWeight="medium">
                        Issuer Phone
                      </Text>
                      <Text fontSize="sm" color="gray.900">
                        {selectedCard.cardF6.startsWith('4') ? '1-800-935-9935' : selectedCard.cardF6.startsWith('5') ? '1-800-432-1000' : '1-800-528-4800'}
                      </Text>
                    </VStack>
                  </HStack>
                )}
              </Dialog.Header>

              <Dialog.Body flex={1} overflowY="auto" p={0}>
                {selectedCard && (() => {
                  const allHistory = generateCardHistory(selectedCard.cardF6, selectedCard.cardL4, mid);
                  
                  // Apply filters
                  let filteredHistory = [...allHistory];
                  const now = new Date();
                  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  today.setHours(0, 0, 0, 0);

                  // Date range filter
                  if (cardHistoryDateRange.preset === 'custom') {
                    if (cardHistoryDateRange.customStartDate && cardHistoryDateRange.customEndDate) {
                      const startDate = new Date(cardHistoryDateRange.customStartDate + 'T00:00:00');
                      const endDate = new Date(cardHistoryDateRange.customEndDate + 'T23:59:59');
                      filteredHistory = filteredHistory.filter((tx) => {
                        const txTime = tx.timestamp.getTime();
                        return txTime >= startDate.getTime() && txTime <= endDate.getTime();
                      });
                    }
                  } else if (cardHistoryDateRange.preset === 'today') {
                    const startDate = new Date(today);
                    startDate.setHours(0, 0, 0, 0);
                    const endDate = new Date(today);
                    endDate.setHours(23, 59, 59, 999);
                    filteredHistory = filteredHistory.filter((tx) => {
                      const txTime = tx.timestamp.getTime();
                      return txTime >= startDate.getTime() && txTime <= endDate.getTime();
                    });
                  } else {
                    const days = parseInt(cardHistoryDateRange.preset);
                    if (!isNaN(days) && days > 0) {
                      const startDate = new Date(today);
                      startDate.setDate(today.getDate() - (days - 1));
                      startDate.setHours(0, 0, 0, 0);
                      const endDate = new Date(today);
                      endDate.setHours(23, 59, 59, 999);
                      filteredHistory = filteredHistory.filter((tx) => {
                        const txTime = tx.timestamp.getTime();
                        return txTime >= startDate.getTime() && txTime <= endDate.getTime();
                      });
                    }
                  }

                  // MID filter
                  if (cardHistoryMidFilter.trim()) {
                    const midFilterLower = cardHistoryMidFilter.toLowerCase().trim();
                    filteredHistory = filteredHistory.filter((tx) =>
                      tx.mid.toLowerCase().includes(midFilterLower)
                    );
                  }

                  // Apply sorting
                  if (cardHistorySortColumn === 'mid') {
                    filteredHistory.sort((a, b) => {
                      const midA = a.mid.toLowerCase();
                      const midB = b.mid.toLowerCase();
                      if (cardHistorySortDirection === 'asc') {
                        return midA.localeCompare(midB);
                      } else {
                        return midB.localeCompare(midA);
                      }
                    });
                  } else if (cardHistorySortColumn === 'transactionDate') {
                    filteredHistory.sort((a, b) => {
                      // Use timestamp for accurate sorting
                      const dateA = a.timestamp.getTime();
                      const dateB = b.timestamp.getTime();
                      return cardHistorySortDirection === 'asc' ? dateA - dateB : dateB - dateA;
                    });
                  } else if (cardHistorySortColumn === 'transmissionDate') {
                    filteredHistory.sort((a, b) => {
                      // Use timestamp for accurate sorting
                      const dateA = a.timestamp.getTime();
                      const dateB = b.timestamp.getTime();
                      return cardHistorySortDirection === 'asc' ? dateA - dateB : dateB - dateA;
                    });
                  } else {
                    // Default: sort by MID (current MID first), then by timestamp (most recent first)
                    filteredHistory.sort((a, b) => {
                      const aIsCurrentMid = a.mid === mid;
                      const bIsCurrentMid = b.mid === mid;
                      
                      // If one is current MID and the other isn't, current MID comes first
                      if (aIsCurrentMid && !bIsCurrentMid) return -1;
                      if (!aIsCurrentMid && bIsCurrentMid) return 1;
                      
                      // If both are same type (both current MID or both not), sort by timestamp (most recent first)
                      return b.timestamp.getTime() - a.timestamp.getTime();
                    });
                  }

                  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
                  const startIndex = (cardHistoryPage - 1) * itemsPerPage;
                  const endIndex = startIndex + itemsPerPage;
                  const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

                  return (
                    <VStack align="stretch" gap={0}>
                      <Table.ScrollArea>
                        <Table.Root size="sm" stickyHeader>
                          <Table.Header>
                            <Table.Row bg="gray.50">
                              <Table.ColumnHeader
                                cursor="pointer"
                                onClick={() => {
                                  if (cardHistorySortColumn === 'mid') {
                                    setCardHistorySortDirection(cardHistorySortDirection === 'asc' ? 'desc' : 'asc');
                                  } else {
                                    setCardHistorySortColumn('mid');
                                    setCardHistorySortDirection('asc');
                                  }
                                  setCardHistoryPage(1);
                                }}
                                _hover={{ bg: 'gray.100' }}
                              >
                                <HStack gap={1}>
                                  <Text>MID</Text>
                                  {cardHistorySortColumn === 'mid' ? (
                                    cardHistorySortDirection === 'asc' ? (
                                      <ArrowUp size={14} />
                                    ) : (
                                      <ArrowDown size={14} />
                                    )
                                  ) : (
                                    <ArrowUpDown size={14} color="gray.400" />
                                  )}
                                </HStack>
                              </Table.ColumnHeader>
                              <Table.ColumnHeader
                                cursor="pointer"
                                onClick={() => {
                                  if (cardHistorySortColumn === 'transactionDate') {
                                    setCardHistorySortDirection(cardHistorySortDirection === 'asc' ? 'desc' : 'asc');
                                  } else {
                                    setCardHistorySortColumn('transactionDate');
                                    setCardHistorySortDirection('desc');
                                  }
                                  setCardHistoryPage(1);
                                }}
                                _hover={{ bg: 'gray.100' }}
                              >
                                <HStack gap={1}>
                                  <Text>Transaction Date</Text>
                                  {cardHistorySortColumn === 'transactionDate' ? (
                                    cardHistorySortDirection === 'asc' ? (
                                      <ArrowUp size={14} />
                                    ) : (
                                      <ArrowDown size={14} />
                                    )
                                  ) : (
                                    <ArrowUpDown size={14} color="gray.400" />
                                  )}
                                </HStack>
                              </Table.ColumnHeader>
                              <Table.ColumnHeader textAlign="right">Amount</Table.ColumnHeader>
                              <Table.ColumnHeader>POS/AVS Result</Table.ColumnHeader>
                              <Table.ColumnHeader>Auth Code</Table.ColumnHeader>
                              <Table.ColumnHeader>Card #</Table.ColumnHeader>
                              <Table.ColumnHeader textAlign="right">DB Net</Table.ColumnHeader>
                              <Table.ColumnHeader
                                cursor="pointer"
                                onClick={() => {
                                  if (cardHistorySortColumn === 'transmissionDate') {
                                    setCardHistorySortDirection(cardHistorySortDirection === 'asc' ? 'desc' : 'asc');
                                  } else {
                                    setCardHistorySortColumn('transmissionDate');
                                    setCardHistorySortDirection('desc');
                                  }
                                  setCardHistoryPage(1);
                                }}
                                _hover={{ bg: 'gray.100' }}
                              >
                                <HStack gap={1}>
                                  <Text>Transmission Date</Text>
                                  {cardHistorySortColumn === 'transmissionDate' ? (
                                    cardHistorySortDirection === 'asc' ? (
                                      <ArrowUp size={14} />
                                    ) : (
                                      <ArrowDown size={14} />
                                    )
                                  ) : (
                                    <ArrowUpDown size={14} color="gray.400" />
                                  )}
                                </HStack>
                              </Table.ColumnHeader>
                              <Table.ColumnHeader textAlign="right">Net Deposit Amount</Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {paginatedHistory.map((tx, index) => (
                              <Table.Row key={index}>
                                <Table.Cell>
                                  <MIDCell mid={tx.mid} />
                                </Table.Cell>
                                <Table.Cell>
                                  <Text fontSize="sm">{tx.transactionDate}</Text>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                  <Text fontSize="sm" fontWeight="semibold">{tx.amount}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text fontSize="sm">{tx.posAvsResult}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text fontSize="sm" fontFamily="mono">{tx.authCode}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text fontSize="sm" fontFamily="mono">{tx.cardNumber}</Text>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                  <Text fontSize="sm" color={parseFloat(tx.dbNet) < 0 ? 'red.600' : 'green.600'}>
                                    {tx.dbNet}
                                  </Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <Text fontSize="sm">{tx.transmissionDate}</Text>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                  <Text fontSize="sm" fontWeight="semibold">{tx.netDepositAmount}</Text>
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table.Root>
                      </Table.ScrollArea>

                      {/* Pagination */}
                      <Box
                        borderTopWidth="1px"
                        borderColor="gray.200"
                        px={6}
                        py={4}
                        bg="gray.50"
                      >
                        <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
                          <Text fontSize="sm" color="gray.600">
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredHistory.length)} of {filteredHistory.length} transactions
                          </Text>
                          <HStack gap={3} flexWrap="wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const headers = [
                                  'MID',
                                  'Transaction Date',
                                  'Amount',
                                  'POS/AVS Result',
                                  'Auth Code',
                                  'Card #',
                                  'DB Net',
                                  'Transmission Date',
                                  'Net Deposit Amount',
                                ];
                                const rows = filteredHistory.map((tx) => [
                                  tx.mid,
                                  tx.transactionDate,
                                  tx.amount,
                                  tx.posAvsResult,
                                  tx.authCode,
                                  tx.cardNumber,
                                  tx.dbNet,
                                  tx.transmissionDate,
                                  tx.netDepositAmount,
                                ]);

                                const csvContent = [
                                  headers.join(','),
                                  ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
                                ].join('\n');

                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                const link = document.createElement('a');
                                const url = URL.createObjectURL(blob);
                                link.setAttribute('href', url);
                                link.setAttribute('download', `card-history-${selectedCard.cardF6}-${selectedCard.cardL4}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
                                link.style.visibility = 'hidden';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              disabled={filteredHistory.length === 0}
                            >
                              <Download size={16} />
                              Export CSV
                            </Button>
                            {totalPages > 1 && (
                              <HStack gap={2}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setCardHistoryPage(Math.max(1, cardHistoryPage - 1))}
                                  disabled={cardHistoryPage === 1}
                                >
                                  Previous
                                </Button>
                                <Text fontSize="sm" color="gray.600" minW="80px" textAlign="center">
                                  Page {cardHistoryPage} of {totalPages}
                                </Text>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setCardHistoryPage(Math.min(totalPages, cardHistoryPage + 1))}
                                  disabled={cardHistoryPage === totalPages}
                                >
                                  Next
                                </Button>
                              </HStack>
                            )}
                          </HStack>
                        </HStack>
                      </Box>
                    </VStack>
                  );
                })()}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  );
}
