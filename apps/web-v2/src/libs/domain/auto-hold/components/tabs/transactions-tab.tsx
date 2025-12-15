'use client';
import React from 'react';
import { Box, VStack, Text, Table, Badge, HStack, Tooltip, Portal, Dialog, Button, CloseButton, Select, Input, createListCollection } from '@chakra-ui/react';
import { CreditCard, Info, AlertCircle, Copy, Check, Download } from 'lucide-react';
import { format } from 'date-fns';
import { MerchantTransaction } from '@/data/interfaces/transaction';

interface TransactionsTabProps {
  transactions: MerchantTransaction[];
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

// MCC definitions mapping
const getMCCDefinition = (mcc: string): string => {
  const mccDefinitions: Record<string, string> = {
    '5655': 'Clothing Stores',
    '5411': 'Grocery Stores, Supermarkets',
    '5812': 'Eating Places, Restaurants',
    '5999': 'Miscellaneous and Specialty Retail Stores',
    '5311': 'Department Stores',
    '5541': 'Service Stations (with or without ancillary services)',
    '5734': 'Computer Software Stores',
    '5814': 'Fast Food Restaurants',
    '5942': 'Book Stores',
    '5970': 'Arts and Crafts Stores',
    '5995': 'Pet Shops, Pet Food, and Supplies Stores',
    '7230': 'Beauty and Barber Shops',
    '7299': 'Miscellaneous Personal Services',
    '7372': 'Computer Programming, Data Processing, and Integrated Systems Design Services',
    '7399': 'Business Services, Not Elsewhere Classified',
    '7512': 'Automobile Rental Agency',
    '7519': 'Motor Home and Recreational Vehicle Rental',
    '7531': 'Automotive Body Repair and Paint Shops',
    '7534': 'Tire Retreading and Repair Shops',
    '7535': 'Automotive Paint Shops',
    '7538': 'Automotive Service Shops (Non-Dealer)',
    '7542': 'Car Washes',
    '7549': 'Towing Services',
    '7622': 'Radio Repair Shops',
    '7623': 'Air Conditioning and Refrigeration Repair Shops',
    '7629': 'Electrical and Small Appliance Repair Shops',
    '7631': 'Watch, Clock, and Jewelry Repair',
    '7641': 'Furniture Repair, Refinishing, and Reupholstery',
    '7692': 'Welding Repair',
    '7699': 'Miscellaneous Repair Shops and Related Services',
    '7832': 'Motion Picture Theaters',
    '7841': 'Video Tape Rental Stores',
    '7911': 'Dance Halls, Studios, and Schools',
    '7922': 'Theatrical Ticket Agencies',
    '7929': 'Bands, Orchestras, and Miscellaneous Entertainers',
    '7932': 'Billiard and Pool Establishments',
    '7933': 'Bowling Alleys',
    '7941': 'Commercial Sports, Athletic Fields, Recreation Facilities, and Public Golf Courses',
    '7991': 'Tourist Attractions and Exhibits',
    '7992': 'Public Golf Courses',
    '7993': 'Video Amusement Game Supplies',
    '7994': 'Video Game Arcades',
    '7995': 'Betting, Including Lottery Tickets, Casino Gaming Chips, Off-Track Betting, and Wagers',
    '7996': 'Amusement Parks, Circuses, Carnivals, and Fortune Tellers',
    '7997': 'Membership Clubs (Sports, Recreation, Athletic), Country Clubs, and Private Golf Courses',
    '7998': 'Aquariums, Seaquariums, Dolphinariums',
    '7999': 'Recreation Services, Not Elsewhere Classified',
    '8011': 'Doctors',
    '8021': 'Dentists and Orthodontists',
    '8031': 'Osteopathic Physicians',
    '8041': 'Chiropractors',
    '8042': 'Optometrists and Ophthalmologists',
    '8043': 'Opticians, Opticians Goods and Eyeglasses',
    '8049': 'Podiatrists and Chiropodists',
    '8050': 'Nursing and Personal Care Facilities',
    '8062': 'Hospitals',
    '8071': 'Medical and Dental Laboratories',
    '8099': 'Medical Services and Health Practitioners, Not Elsewhere Classified',
    '8111': 'Legal Services and Attorneys',
    '8211': 'Elementary and Secondary Schools',
    '8220': 'Colleges, Universities, Professional Schools, and Junior Colleges',
    '8241': 'Correspondence Schools',
    '8244': 'Business and Secretarial Schools',
    '8249': 'Vocational and Trade Schools',
    '8299': 'Schools and Educational Services, Not Elsewhere Classified',
    '8351': 'Child Care Services',
    '8398': 'Charitable and Social Service Organizations',
    '8641': 'Civic, Social, and Fraternal Associations',
    '8651': 'Political Organizations',
    '8661': 'Religious Organizations',
    '8675': 'Automobile Associations',
    '8699': 'Membership Organizations, Not Elsewhere Classified',
    '8734': 'Testing Laboratories (Non-Medical)',
    '8911': 'Architectural, Engineering, and Surveying Services',
    '8931': 'Accounting, Auditing, and Bookkeeping Services',
    '8999': 'Professional Services, Not Elsewhere Classified',
    '9211': 'Court Costs, Including Alimony and Child Support',
    '9222': 'Fines',
    '9223': 'Bail and Bond Payments',
    '9311': 'Tax Payments',
    '9399': 'Government Services, Not Elsewhere Classified',
    '9402': 'Postal Services - Government Only',
    '9405': 'Intra-Government Purchases - Government Only',
    '9700': 'Visa Credential Service',
    '9701': 'Visa T&E E-Commerce Transaction',
    '9702': 'GCAS Emergency Services',
    '9751': 'UK Supermarkets, Electronic',
    '9752': 'UK Petrol Stations',
    '9950': 'Intra-Company Purchases',
  };
  
  return mccDefinitions[mcc] || `MCC ${mcc} - Merchant Category Code`;
};

// Helper function to generate mock data based on transaction
const generateAuthData = (tx: MerchantTransaction, index: number) => {
  const cardTypes = ['5 - Mastercard', '4 - Visa', '3 - American Express'];
  const posEntryModes = ['01 - Manual (key entry)', '05 - Chip read', '07 - Contactless'];
  const posConditionCodes = [
    '08 - Mail/telephone order',
    '00 - Normal presentment',
    '59 - E-commerce',
  ];
  const processingCodes = ['00 - Goods/Service Purchase POS transaction only'];
  const authResponses = ['00 - Successful approval/completion'];
  const messageTypes = ['0100 - Authorization Request'];
  const avsCodes = ['Y - Street and 5-digit postal match', 'Z - Postal matches, street does not', 'N - No match'];
  const fundingSources = ['D - Debit', 'P - Prepaid', ''];
  
  // Use transaction ID and index as seed for deterministic values
  const seed1 = (tx.id?.charCodeAt(0) || 0) + index * 1000;
  const seed2 = (tx.id?.charCodeAt(1) || 0) + index * 2000;
  const seed3 = (tx.id?.charCodeAt(2) || 0) + index * 3000;
  
  const cardF6 = String(Math.floor(seededRandom(seed1) * 900000) + 100000);
  const cardL4 = String(Math.floor(seededRandom(seed2) * 9000) + 1000).padStart(4, '0');
  const cardType: string = cardTypes[index % cardTypes.length] || cardTypes[0] || '';
  const posEntryMode: string = posEntryModes[index % posEntryModes.length] || posEntryModes[0] || '';
  const calcEntryType = posEntryMode.includes('Manual') ? 'Keyed' : posEntryMode.includes('Chip') ? 'Chip' : 'Contactless';
  const calcCNP = posEntryMode.includes('Manual') || posEntryMode.includes('Mail') ? 'Yes' : 'No';
  const posConditionCode = posConditionCodes[index % posConditionCodes.length] || posConditionCodes[0];
  const processingCode = processingCodes[0] || '';
  const authResponse = authResponses[0] || '';
  const messageType = messageTypes[0] || '';
  const avsCode = avsCodes[index % avsCodes.length] || avsCodes[0];
  const fundingSource = fundingSources[index % fundingSources.length] || fundingSources[0];
  const apprCode = String(Math.floor(seededRandom(seed3) * 900000) + 100000);
  
  return {
    transDate: tx.date,
    authAmt: tx.amount,
    apprCode,
    cardF6,
    cardL4,
    cardType,
    posEntryMode1: posEntryMode,
    calcEntryType,
    calcCNP,
    posConditionCode,
    processingCode1: processingCode,
    authResponse,
    messageType,
    messageReasonCode: '',
    avsResultCode: avsCode,
    acctFundingSource: fundingSource,
    issuerCountryCode: 'USA',
  };
};

const generateCaptureData = (tx: MerchantTransaction, index: number) => {
  const cardTypes = ['American Express', 'Visa', 'Mastercard'];
  const posEntryModes = ['01 - Manual key entry', '05 - Chip read', '07 - Contactless'];
  
  // Use transaction ID and index as seed for deterministic values
  const seed1 = (tx.id?.charCodeAt(0) || 0) + index * 1000;
  const seed2 = (tx.id?.charCodeAt(1) || 0) + index * 2000;
  const seed3 = (tx.id?.charCodeAt(2) || 0) + index * 3000;
  
  const cardF6 = String(Math.floor(seededRandom(seed1) * 900000) + 100000);
  const cardL4 = String(Math.floor(seededRandom(seed2) * 9000) + 1000).padStart(4, '0');
  const cardType: string = cardTypes[index % cardTypes.length] || cardTypes[0] || '';
  const posEntryMode: string = posEntryModes[index % posEntryModes.length] || posEntryModes[0] || '';
  const calcEntryType = posEntryMode.includes('Manual') ? 'Keyed' : posEntryMode.includes('Chip') ? 'Chip' : 'Contactless';
  const cardNotPresent = posEntryMode.includes('Manual') ? 'Yes' : 'No';
  const authCode = String(Math.floor(seededRandom(seed3) * 900000) + 100000);
  
  // Use transaction date for both transmission and transaction date (deterministic based on index)
  const txDate = new Date();
  txDate.setDate(txDate.getDate() - (index % 3));
  
  return {
    transmissionDate: txDate.toLocaleDateString('en-US'),
    transactionDate: txDate.toLocaleDateString('en-US'),
    transactionAmt: tx.amount,
    authCode,
    cardF6,
    cardL4,
    cardType,
    posEntryMode,
    posEntryModeCalculated: calcEntryType,
    cardNotPresent,
  };
};

const generateSettledData = (tx: MerchantTransaction, index: number) => {
  const mccs = ['5655', '5411', '5812', '5999', '5311'];
  const mcc = mccs[index % mccs.length] || mccs[0];
  
  // Use transaction ID and index as seed for deterministic values
  const seed1 = (tx.id?.charCodeAt(0) || 0) + index * 1000;
  const seed2 = (tx.id?.charCodeAt(1) || 0) + index * 2000;
  const seed3 = (tx.id?.charCodeAt(2) || 0) + index * 3000;
  const seed4 = (tx.id?.charCodeAt(3) || 0) + index * 4000;
  
  const chargebackCount = Math.floor(seededRandom(seed1) * 50) + 10;
  const chargebackVol = (seededRandom(seed2) * 10000 + 5000).toFixed(2);
  const salesCount = Math.floor(seededRandom(seed3) * 500) + 200;
  const salesVol = (seededRandom(seed4) * 50000 + 20000).toFixed(2);
  const percentageVol = ((parseFloat(chargebackVol) / parseFloat(salesVol)) * 100).toFixed(2);
  const percentageCount = ((chargebackCount / salesCount) * 100).toFixed(2);
  
  return {
    mid: tx.mid,
    mcc,
    chargebackCountLast30Days: chargebackCount,
    chargebackVolLast30Days: `$${parseFloat(chargebackVol).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    salesCountLast30Days: salesCount,
    salesVolLast30Days: `$${parseFloat(salesVol).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    percentageVol,
    percentageCount,
  };
};

const generateReturnsData = (tx: MerchantTransaction, index: number) => {
  const returnCodes = ['R01', 'R02', 'R03', 'R04', 'R05'];
  const crDb = ['D', 'C'];
  
  // Use transaction ID and index as seed for deterministic date
  const seed = (tx.id?.charCodeAt(0) || 0) + index * 1000;
  const daysOffset = Math.floor(seededRandom(seed) * 5);
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() - daysOffset);
  
  // Use seed for deterministic amount
  const returnAmt = (seededRandom(seed + 1000) * 10 + 0.01).toFixed(2);
  
  return {
    mid: tx.mid,
    achReturnDate: returnDate.toLocaleDateString('en-US'),
    achReturnAmt: `$${parseFloat(returnAmt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    achReturnCode: returnCodes[index % returnCodes.length] || returnCodes[0],
    crDb: crDb[index % crDb.length] || crDb[0],
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
  isHighRisk: boolean;
  timestamp: Date;
}

// Generate mock card history data with multiple MIDs
const generateCardHistory = (cardF6: string, cardL4: string, baseMid: string): CardHistoryTransaction[] => {
  const transactions: CardHistoryTransaction[] = [];
  const baseDate = new Date();
  
  // Generate 30-40 transactions for pagination testing with multiple MIDs
  const count = 30 + Math.floor(Math.random() * 10);
  
  // Generate list of MIDs (mix of baseMid and some variations)
  const midVariations = [
    baseMid,
    baseMid.slice(0, -2) + (parseInt(baseMid.slice(-2)) + 1).toString().padStart(2, '0'),
    baseMid.slice(0, -2) + (parseInt(baseMid.slice(-2)) + 2).toString().padStart(2, '0'),
    baseMid.slice(0, -3) + (parseInt(baseMid.slice(-3)) + 10).toString().padStart(3, '0'),
  ];
  
  for (let i = 0; i < count; i++) {
    const txDate = new Date(baseDate);
    // Distribute dates across last 60 days
    txDate.setDate(txDate.getDate() - Math.floor(Math.random() * 60));
    txDate.setHours(9 + (i % 12), 15 + (i * 5) % 45, 0, 0);
    
    const transDate = txDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const transTime = txDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const transmissionDate = txDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const amount = (Math.random() * 5000 + 100).toFixed(2);
    const netDeposit = (parseFloat(amount) * 0.97).toFixed(2);
    const dbNet = (Math.random() * 100 - 50).toFixed(2);
    
    const posAvsResults = ['Y - Match', 'Z - Partial', 'N - No Match', 'A - Address Match'];
    const authCodes = ['000000', '123456', '789012', '345678'];
    
    // Select MID from variations (70% baseMid, 30% others)
    const selectedMid = Math.random() < 0.7 
      ? midVariations[0] 
      : midVariations[Math.floor(Math.random() * (midVariations.length - 1)) + 1];
    
    // Mark some transactions as high risk (about 20%)
    const isHighRisk = Math.random() < 0.2;
    
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
      isHighRisk,
      timestamp: new Date(txDate),
    });
  }
  
  return transactions;
};

export default function TransactionsTab({ transactions }: TransactionsTabProps) {
  // Determine data source from first transaction (all transactions in a batch should have same source)
  const dataSource = transactions[0]?.source || 'Auth';
  
  // Card History modal state
  const [isCardHistoryOpen, setIsCardHistoryOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<{ cardF6: string; cardL4: string } | null>(null);
  const [cardHistoryPage, setCardHistoryPage] = React.useState(1);
  const [cardHistoryDateRange, setCardHistoryDateRange] = React.useState<'today' | '7' | '30' | 'custom'>('30');
  const [cardHistoryCustomStartDate, setCardHistoryCustomStartDate] = React.useState<string>('');
  const [cardHistoryCustomEndDate, setCardHistoryCustomEndDate] = React.useState<string>('');
  const [cardHistoryMidFilter, setCardHistoryMidFilter] = React.useState<string>('');
  const itemsPerPage = 10;
  
  // Generate appropriate data based on data source
  const tableData = React.useMemo(() => {
    if (dataSource === 'Auth') {
      return transactions.map((tx, i) => generateAuthData(tx, i));
    } else if (dataSource === 'Capture') {
      return transactions.map((tx, i) => generateCaptureData(tx, i));
    } else if (dataSource === 'Settled') {
      return transactions.map((tx, i) => generateSettledData(tx, i));
    } else if (dataSource === 'Returns') {
      return transactions.map((tx, i) => generateReturnsData(tx, i));
    }
    return [];
  }, [transactions, dataSource]);

  const getTableTitle = () => {
    switch (dataSource) {
      case 'Auth':
        return 'TSYS auth file';
      case 'Capture':
        return 'TSYS capture file';
      case 'Settled':
        return 'TSYS settle file';
      case 'Returns':
        return 'ACH returns';
      default:
        return 'Transaction Details';
    }
  };

  // Render Auth table (most complex, needs compact design)
  const renderAuthTable = () => (
    <Table.ScrollArea>
      <Table.Root size="sm" stickyHeader>
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>Trans date</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Auth amt</Table.ColumnHeader>
            <Table.ColumnHeader>Appr code</Table.ColumnHeader>
            <Table.ColumnHeader>Card F6 / L4</Table.ColumnHeader>
            <Table.ColumnHeader>
              <HStack gap={1} align="center">
                <Text>Card Type</Text>
                <Tooltip.Root openDelay={300}>
                  <Tooltip.Trigger asChild>
                    <Box as="span" display="inline-flex" alignItems="center" cursor="help">
                      <Info size={12} color="gray.400" />
                    </Box>
                  </Tooltip.Trigger>
                  <Portal>
                    <Tooltip.Positioner>
                      <Tooltip.Content maxW="200px" zIndex={2000} bg="gray.900" color="white" px={2} py={1} borderRadius="md" fontSize="xs">
                        <Tooltip.Arrow />
                        Card brand (5=Mastercard, 4=Visa, 3=Amex)
                      </Tooltip.Content>
                    </Tooltip.Positioner>
                  </Portal>
                </Tooltip.Root>
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <HStack gap={1} align="center">
                <Text fontSize="xs">POS Entry</Text>
                <Tooltip.Root openDelay={300}>
                  <Tooltip.Trigger asChild>
                    <Box as="span" display="inline-flex" alignItems="center" cursor="help">
                      <Info size={12} color="gray.400" />
                    </Box>
                  </Tooltip.Trigger>
                  <Portal>
                    <Tooltip.Positioner>
                      <Tooltip.Content maxW="200px" zIndex={2000} bg="gray.900" color="white" px={2} py={1} borderRadius="md" fontSize="xs">
                        <Tooltip.Arrow />
                        Point of Sale entry method
                      </Tooltip.Content>
                    </Tooltip.Positioner>
                  </Portal>
                </Tooltip.Root>
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader fontSize="xs">CNP</Table.ColumnHeader>
            <Table.ColumnHeader>
              <HStack gap={1} align="center">
                <Text fontSize="xs">AVS</Text>
                <Tooltip.Root openDelay={300}>
                  <Tooltip.Trigger asChild>
                    <Box as="span" display="inline-flex" alignItems="center" cursor="help">
                      <Info size={12} color="gray.400" />
                    </Box>
                  </Tooltip.Trigger>
                  <Portal>
                    <Tooltip.Positioner>
                      <Tooltip.Content maxW="250px" zIndex={2000} bg="gray.900" color="white" px={2} py={1} borderRadius="md" fontSize="xs">
                        <Tooltip.Arrow />
                        Address Verification System result
                      </Tooltip.Content>
                    </Tooltip.Positioner>
                  </Portal>
                </Tooltip.Root>
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader fontSize="xs">Response</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tableData.map((row: any, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Text fontSize="xs">{row.transDate}</Text>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Text fontSize="xs" fontWeight="semibold">{row.authAmt}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="xs" fontFamily="mono">{row.apprCode}</Text>
              </Table.Cell>
              <Table.Cell>
                <Tooltip.Root openDelay={300}>
                  <Tooltip.Trigger asChild>
                    <Box
                      as="button"
                      onClick={() => {
                        setSelectedCard({ cardF6: row.cardF6, cardL4: row.cardL4 });
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
                      suppressHydrationWarning
                    >
                      <CreditCard size={12} />
                      <Text fontSize="xs" fontFamily="mono">
                        {row.cardF6} •••• {row.cardL4}
                      </Text>
                    </Box>
                  </Tooltip.Trigger>
                  <Portal>
                    <Tooltip.Positioner>
                      <Tooltip.Content maxW="200px" zIndex={2000} bg="gray.900" color="white" px={2} py={1} borderRadius="md" fontSize="xs">
                        <Tooltip.Arrow />
                        View card history
                      </Tooltip.Content>
                    </Tooltip.Positioner>
                  </Portal>
                </Tooltip.Root>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="xs">{row.cardType}</Text>
              </Table.Cell>
              <Table.Cell>
                <VStack align="start" gap={0}>
                  <Text fontSize="xs">{row.posEntryMode1}</Text>
                  <Text fontSize="xs" color="gray.500">{row.calcEntryType}</Text>
                </VStack>
              </Table.Cell>
              <Table.Cell>
                <Badge colorPalette={row.calcCNP === 'Yes' ? 'orange' : 'green'} variant="subtle" fontSize="xs">
                  {row.calcCNP}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Tooltip.Root openDelay={300}>
                  <Tooltip.Trigger asChild>
                    <Box as="span" cursor="help">
                      <Badge colorPalette={row.avsResultCode.includes('Y') ? 'green' : row.avsResultCode.includes('Z') ? 'yellow' : 'red'} variant="subtle" fontSize="xs">
                        {row.avsResultCode.split(' - ')[0]}
                      </Badge>
                    </Box>
                  </Tooltip.Trigger>
                  <Portal>
                    <Tooltip.Positioner>
                      <Tooltip.Content maxW="300px" zIndex={2000} bg="gray.900" color="white" px={2} py={1} borderRadius="md" fontSize="xs">
                        <Tooltip.Arrow />
                        {row.avsResultCode}
                      </Tooltip.Content>
                    </Tooltip.Positioner>
                  </Portal>
                </Tooltip.Root>
              </Table.Cell>
              <Table.Cell>
                <Tooltip.Root openDelay={300}>
                  <Tooltip.Trigger asChild>
                    <Box as="span" cursor="help">
                      <Badge colorPalette="green" variant="subtle" fontSize="xs">
                        {row.authResponse.split(' - ')[0]}
                      </Badge>
                    </Box>
                  </Tooltip.Trigger>
                  <Portal>
                    <Tooltip.Positioner>
                      <Tooltip.Content maxW="300px" zIndex={2000} bg="gray.900" color="white" px={2} py={1} borderRadius="md" fontSize="xs">
                        <Tooltip.Arrow />
                        {row.authResponse}
                      </Tooltip.Content>
                    </Tooltip.Positioner>
                  </Portal>
                </Tooltip.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );

  // Render Capture table
  const renderCaptureTable = () => (
    <Table.ScrollArea>
      <Table.Root size="sm" stickyHeader>
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>Transmission date</Table.ColumnHeader>
            <Table.ColumnHeader>Transaction date</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Transaction Amt</Table.ColumnHeader>
            <Table.ColumnHeader>Auth code</Table.ColumnHeader>
            <Table.ColumnHeader>Card # F6 / L4</Table.ColumnHeader>
            <Table.ColumnHeader>Card type</Table.ColumnHeader>
            <Table.ColumnHeader>POS entry mode</Table.ColumnHeader>
            <Table.ColumnHeader>POS entry mode Calculated</Table.ColumnHeader>
            <Table.ColumnHeader>Card Not Present</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tableData.map((row: any, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Text fontSize="sm">{row.transmissionDate}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm">{row.transactionDate}</Text>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Text fontSize="sm" fontWeight="semibold">{row.transactionAmt}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" fontFamily="mono">{row.authCode}</Text>
              </Table.Cell>
              <Table.Cell>
                <Tooltip.Root openDelay={300}>
                  <Tooltip.Trigger asChild>
                    <Box
                      as="button"
                      onClick={() => {
                        setSelectedCard({ cardF6: row.cardF6, cardL4: row.cardL4 });
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
                      suppressHydrationWarning
                    >
                      <CreditCard size={12} />
                      <Text fontSize="sm" fontFamily="mono">
                        {row.cardF6} •••• {row.cardL4}
                      </Text>
                    </Box>
                  </Tooltip.Trigger>
                  <Portal>
                    <Tooltip.Positioner>
                      <Tooltip.Content maxW="200px" zIndex={2000} bg="gray.900" color="white" px={2} py={1} borderRadius="md" fontSize="xs">
                        <Tooltip.Arrow />
                        View card history
                      </Tooltip.Content>
                    </Tooltip.Positioner>
                  </Portal>
                </Tooltip.Root>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm">{row.cardType}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm">{row.posEntryMode}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm">{row.posEntryModeCalculated}</Text>
              </Table.Cell>
              <Table.Cell>
                <Badge colorPalette={row.cardNotPresent === 'Yes' ? 'orange' : 'green'} variant="subtle">
                  {row.cardNotPresent}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );

  // Render Settled table
  const renderSettledTable = () => (
    <Table.ScrollArea>
      <Table.Root size="sm" stickyHeader>
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>Mid</Table.ColumnHeader>
            <Table.ColumnHeader>MCC</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Chargeback count in last 30 days</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Chargeback vol in last 30 days</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Sales count last 30 days</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Sales vol last 30 days</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Percentage vol</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Percentage count</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tableData.map((row: any, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Text fontSize="sm" fontFamily="mono">{row.mid}</Text>
              </Table.Cell>
              <Table.Cell>
                <Tooltip.Root openDelay={300}>
                  <Tooltip.Trigger asChild>
                    <Box as="span" display="inline-flex" alignItems="center" cursor="help">
                      <Text fontSize="sm" fontWeight="semibold">{row.mcc}</Text>
                    </Box>
                  </Tooltip.Trigger>
                  <Portal>
                    <Tooltip.Positioner>
                      <Tooltip.Content maxW="300px" zIndex={2000} bg="gray.900" color="white" px={3} py={2} borderRadius="md" fontSize="sm">
                        <Tooltip.Arrow />
                        <Text fontWeight="semibold" mb={1}>MCC {row.mcc}</Text>
                        <Text>{getMCCDefinition(row.mcc)}</Text>
                      </Tooltip.Content>
                    </Tooltip.Positioner>
                  </Portal>
                </Tooltip.Root>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Text fontSize="sm">{row.chargebackCountLast30Days}</Text>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Text fontSize="sm" fontWeight="semibold">{row.chargebackVolLast30Days}</Text>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Text fontSize="sm">{row.salesCountLast30Days}</Text>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Text fontSize="sm" fontWeight="semibold">{row.salesVolLast30Days}</Text>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Text fontSize="sm">{row.percentageVol}%</Text>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Text fontSize="sm">{row.percentageCount}%</Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );

  // Render Returns table
  const renderReturnsTable = () => (
    <Table.ScrollArea>
      <Table.Root size="sm" stickyHeader>
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>MId</Table.ColumnHeader>
            <Table.ColumnHeader>ACH return date</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">ACH return Amt</Table.ColumnHeader>
            <Table.ColumnHeader>ACH return code</Table.ColumnHeader>
            <Table.ColumnHeader>Cr/Db</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tableData.map((row: any, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Text fontSize="sm" fontFamily="mono">{row.mid}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm">{row.achReturnDate}</Text>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Text fontSize="sm" fontWeight="semibold">{row.achReturnAmt}</Text>
              </Table.Cell>
              <Table.Cell>
                <Badge colorPalette="red" variant="subtle">
                  {row.achReturnCode}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge colorPalette={row.crDb === 'D' ? 'red' : 'green'} variant="subtle">
                  {row.crDb}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );

  const renderTable = () => {
    switch (dataSource) {
      case 'Auth':
        return renderAuthTable();
      case 'Capture':
        return renderCaptureTable();
      case 'Settled':
        return renderSettledTable();
      case 'Returns':
        return renderReturnsTable();
      default:
        return renderAuthTable();
    }
  };

  return (
    <VStack align="stretch" gap={4}>
      <HStack gap={2} mb={2} justify="space-between">
        <HStack gap={2}>
          <Box color="blue.500">
            <CreditCard size={20} />
          </Box>
          <Text fontSize="lg" fontWeight="semibold" color="gray.900">
            {getTableTitle()}
          </Text>
          <Badge colorPalette="blue" variant="subtle">
            {dataSource}
          </Badge>
        </HStack>
        <Text fontSize="sm" color="gray.500">
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </Text>
      </HStack>

      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        borderWidth="1px"
        borderColor="gray.200"
        overflowX="auto"
      >
        {renderTable()}
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
                    setCardHistoryDateRange('30');
                    setCardHistoryCustomStartDate('');
                    setCardHistoryCustomEndDate('');
                    setCardHistoryMidFilter('');
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
                      {transactions[0]?.mid && (
                        <HStack gap={2} align="center">
                          <Text fontSize="xs" color="gray.500">
                            Merchant ID:
                          </Text>
                          <MIDCell mid={transactions[0].mid} />
                        </HStack>
                      )}
                    </VStack>
                  )}
                </VStack>
                
                {/* Filters */}
                {selectedCard && (() => {
                  const dateRangeCollection = createListCollection({
                    items: [
                      { label: 'Today', value: 'today' },
                      { label: 'Last 7 days', value: '7' },
                      { label: 'Last 30 days', value: '30' },
                      { label: 'Custom', value: 'custom' },
                    ],
                  });

                  return (
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
                              value={[cardHistoryDateRange]}
                              onValueChange={(e) => {
                                const value = (e.value[0] || '30') as 'today' | '7' | '30' | 'custom';
                                setCardHistoryDateRange(value);
                                if (value !== 'custom') {
                                  setCardHistoryCustomStartDate('');
                                  setCardHistoryCustomEndDate('');
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

                        {cardHistoryDateRange === 'custom' && (
                          <HStack gap={2} align="end">
                            <VStack align="start" gap={1}>
                              <Text fontSize="xs" color="gray.600">
                                Start Date
                              </Text>
                              <Input
                                type="date"
                                size="sm"
                                width="150px"
                                value={cardHistoryCustomStartDate}
                                onChange={(e) => {
                                  setCardHistoryCustomStartDate(e.target.value);
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
                                value={cardHistoryCustomEndDate}
                                onChange={(e) => {
                                  setCardHistoryCustomEndDate(e.target.value);
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
                  );
                })()}
                
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
                  const allHistory = generateCardHistory(selectedCard.cardF6, selectedCard.cardL4, transactions[0]?.mid || '');
                  
                  // Apply filters
                  let filteredHistory = [...allHistory];
                  const now = new Date();
                  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  today.setHours(0, 0, 0, 0);

                  // Date range filter
                  if (cardHistoryDateRange === 'custom') {
                    if (cardHistoryCustomStartDate && cardHistoryCustomEndDate) {
                      const startDate = new Date(cardHistoryCustomStartDate + 'T00:00:00');
                      const endDate = new Date(cardHistoryCustomEndDate + 'T23:59:59');
                      filteredHistory = filteredHistory.filter((tx) => {
                        const txTime = tx.timestamp.getTime();
                        return txTime >= startDate.getTime() && txTime <= endDate.getTime();
                      });
                    }
                  } else if (cardHistoryDateRange === 'today') {
                    const startDate = new Date(today);
                    startDate.setHours(0, 0, 0, 0);
                    const endDate = new Date(today);
                    endDate.setHours(23, 59, 59, 999);
                    filteredHistory = filteredHistory.filter((tx) => {
                      const txTime = tx.timestamp.getTime();
                      return txTime >= startDate.getTime() && txTime <= endDate.getTime();
                    });
                  } else {
                    const days = parseInt(cardHistoryDateRange);
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

                  // Sort by most recent first
                  filteredHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

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
                              <Table.ColumnHeader>MID</Table.ColumnHeader>
                              <Table.ColumnHeader>Transaction Date</Table.ColumnHeader>
                              <Table.ColumnHeader textAlign="right">Amount</Table.ColumnHeader>
                              <Table.ColumnHeader>POS/AVS Result</Table.ColumnHeader>
                              <Table.ColumnHeader>Auth Code</Table.ColumnHeader>
                              <Table.ColumnHeader>Card #</Table.ColumnHeader>
                              <Table.ColumnHeader textAlign="right">DB Net</Table.ColumnHeader>
                              <Table.ColumnHeader>Transmission Date</Table.ColumnHeader>
                              <Table.ColumnHeader textAlign="right">Net Deposit Amount</Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {paginatedHistory.map((tx, index) => (
                              <Table.Row key={index} bg={tx.isHighRisk ? 'red.50' : 'white'}>
                                <Table.Cell>
                                  <HStack gap={2}>
                                    {tx.isHighRisk && (
                                      <Box
                                        w={2}
                                        h={2}
                                        borderRadius="full"
                                        bg="red.500"
                                        flexShrink={0}
                                      />
                                    )}
                                    <MIDCell mid={tx.mid} />
                                  </HStack>
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
                                  'High Risk',
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
                                  tx.isHighRisk ? 'Yes' : 'No',
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
