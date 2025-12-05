'use client';
import React from 'react';
import { Box, VStack, Text, Table, Badge, HStack, Tooltip, Portal } from '@chakra-ui/react';
import { CreditCard, Info } from 'lucide-react';
import { MerchantTransaction } from '@/data/interfaces/transaction';

interface TransactionsTabProps {
  transactions: MerchantTransaction[];
}

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
  
  const cardF6 = String(Math.floor(Math.random() * 900000) + 100000);
  const cardL4 = String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0');
  const cardType = cardTypes[index % cardTypes.length] || cardTypes[0];
  const posEntryMode = posEntryModes[index % posEntryModes.length] || posEntryModes[0];
  const calcEntryType = posEntryMode.includes('Manual') ? 'Keyed' : posEntryMode.includes('Chip') ? 'Chip' : 'Contactless';
  const calcCNP = posEntryMode.includes('Manual') || posEntryMode.includes('Mail') ? 'Yes' : 'No';
  const posConditionCode = posConditionCodes[index % posConditionCodes.length] || posConditionCodes[0];
  const processingCode = processingCodes[0] || '';
  const authResponse = authResponses[0] || '';
  const messageType = messageTypes[0] || '';
  const avsCode = avsCodes[index % avsCodes.length] || avsCodes[0];
  const fundingSource = fundingSources[index % fundingSources.length] || fundingSources[0];
  const apprCode = String(Math.floor(Math.random() * 900000) + 100000);
  
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
  
  const cardF6 = String(Math.floor(Math.random() * 900000) + 100000);
  const cardL4 = String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0');
  const cardType = cardTypes[index % cardTypes.length] || cardTypes[0];
  const posEntryMode = posEntryModes[index % posEntryModes.length] || posEntryModes[0];
  const calcEntryType = posEntryMode.includes('Manual') ? 'Keyed' : posEntryMode.includes('Chip') ? 'Chip' : 'Contactless';
  const cardNotPresent = posEntryMode.includes('Manual') ? 'Yes' : 'No';
  const authCode = String(Math.floor(Math.random() * 900000) + 100000);
  
  // Use transaction date for both transmission and transaction date
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
  const chargebackCount = Math.floor(Math.random() * 50) + 10;
  const chargebackVol = (Math.random() * 10000 + 5000).toFixed(2);
  const salesCount = Math.floor(Math.random() * 500) + 200;
  const salesVol = (Math.random() * 50000 + 20000).toFixed(2);
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
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() - (index % 5));
  
  const returnAmt = (Math.random() * 10 + 0.01).toFixed(2);
  
  return {
    mid: tx.mid,
    achReturnDate: returnDate.toLocaleDateString('en-US'),
    achReturnAmt: `$${parseFloat(returnAmt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    achReturnCode: returnCodes[index % returnCodes.length] || returnCodes[0],
    crDb: crDb[index % crDb.length] || crDb[0],
  };
};

export default function TransactionsTab({ transactions }: TransactionsTabProps) {
  // Determine data source from first transaction (all transactions in a batch should have same source)
  const dataSource = transactions[0]?.source || 'Auth';
  
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
            <Table.ColumnHeader>Card F6</Table.ColumnHeader>
            <Table.ColumnHeader>Card L4</Table.ColumnHeader>
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
                <Text fontSize="xs" fontFamily="mono">{row.cardF6}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="xs" fontFamily="mono">{row.cardL4}</Text>
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
            <Table.ColumnHeader>Card # F6</Table.ColumnHeader>
            <Table.ColumnHeader>Card # L4</Table.ColumnHeader>
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
                <Text fontSize="sm" fontFamily="mono">{row.cardF6}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" fontFamily="mono">{row.cardL4}</Text>
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
                <Text fontSize="sm" fontWeight="semibold">{row.mcc}</Text>
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
    </VStack>
  );
}
