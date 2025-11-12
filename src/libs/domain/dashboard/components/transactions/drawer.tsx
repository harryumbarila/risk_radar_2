import { MerchantTransaction } from '@/data/interfaces/transaction';
import { statusColor } from '@/libs/utils/utils';
import {
  Button,
  CloseButton,
  Drawer,
  Flex,
  Text,
  Portal,
  VStack,
  Box,
  Badge,
  Tabs,
  SimpleGrid,
  Stack,
  Tag,
  Table,
  HStack,
} from '@chakra-ui/react';
import { MdCheck } from 'react-icons/md';
import { MdOutlineArrowBack } from 'react-icons/md';
import { RiExpandDiagonalFill } from 'react-icons/ri';

interface ExceptionDrawerProps {
  tx: MerchantTransaction;
}

export default function ExceptionDrawer(
  props: React.PropsWithChildren<ExceptionDrawerProps>
) {
  const { tx } = props;

  const data = [
    {
      date: '2025-04-08',
      authAmount: '$12,250.00',
      transAmount: '$12,500.00',
      pos: 'E-Commerce',
      avs: 'Y',
      authCode: 'A44687',
      cardNumber: '**** **** **** 7391',
      pin: 'Verified',
      eligibleExceptions: ['E001', 'E003'],
    },
    {
      date: '2025-04-08',
      authAmount: '$6,250.00',
      transAmount: '$6,250.00',
      pos: 'E-Commerce',
      avs: 'N',
      authCode: 'A50478',
      cardNumber: '**** **** **** 9736',
      pin: 'Not Required',
      eligibleExceptions: ['E002'],
    },
    {
      date: '2025-04-08',
      authAmount: '$6,250.00',
      transAmount: '$6,250.00',
      pos: 'E-Commerce',
      avs: 'N',
      authCode: 'A50478',
      cardNumber: '**** **** **** 9736',
      pin: 'Not Required',
      eligibleExceptions: ['E002'],
    },
    {
      date: '2025-04-08',
      authAmount: '$6,250.00',
      transAmount: '$6,250.00',
      pos: 'E-Commerce',
      avs: 'N',
      authCode: 'A50478',
      cardNumber: '**** **** **** 9736',
      pin: 'Not Required',
      eligibleExceptions: ['E002'],
    },
  ];

  return (
    <Drawer.Root
      placement={{ mdDown: 'bottom', md: 'end' }}
      size={{
        mdDown: 'sm',
        md: 'lg',
      }}
    >
      <Drawer.Trigger asChild>{props.children}</Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner padding="4" onClick={(e) => e.stopPropagation()}>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Transaction Details</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Flex gap={4} direction="column">
                <Box>
                  <Flex gap={1} direction="column">
                    <Flex gap={4}>
                      <VStack
                        justifyContent="flex-start"
                        gap={1}
                        alignItems="flex-start"
                      >
                        <Text as="span" fontWeight="bold" fontSize="md">
                          {tx.merchant}
                        </Text>
                        <Text as="span" textAlign="start">
                          {tx.date}
                        </Text>
                      </VStack>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Text as="span">Amount</Text>
                      <Text as="span" fontWeight="bold">
                        {tx.amount}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Text as="span">Status</Text>
                      <Badge
                        colorPalette={statusColor[tx.status]}
                        variant="subtle"
                        px={3}
                        py={1}
                        borderRadius="md"
                        fontWeight="bold"
                      >
                        {tx.status}
                      </Badge>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Text as="span">Transaction ID</Text>
                      <Text as="span" fontWeight="bold">
                        {tx.id}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
                <Box>
                  <Tabs.Root defaultValue="details" variant="plain">
                    <Tabs.List bg="bg.muted" rounded="l3" p="1">
                      <Tabs.Trigger value="details">Details</Tabs.Trigger>
                      <Tabs.Trigger value="merchant">Merchant</Tabs.Trigger>
                      <Tabs.Trigger value="exceptions">Exceptions</Tabs.Trigger>
                      <Tabs.Trigger value="volume">Volume</Tabs.Trigger>
                      <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
                      <Tabs.Trigger value="match">Match</Tabs.Trigger>
                      <Tabs.Trigger value="chargebacks">
                        Chargebacks
                      </Tabs.Trigger>
                      <Tabs.Indicator rounded="l2" />
                    </Tabs.List>
                    <Tabs.Content value="details">
                      <Stack>
                        <Flex
                          gap={4}
                          p={4}
                          flexDirection="column"
                          bg="bg"
                          borderWidth="1px"
                          borderRadius={10}
                        >
                          <Text fontWeight="bold" fontSize="md">
                            Transaction Information
                          </Text>
                          <SimpleGrid columns={2} gap={2}>
                            <Text>Processor</Text>
                            <Text>{tx.processor}</Text>

                            <Text>MID</Text>
                            <Text>{tx.mid}</Text>

                            <Text>DBA</Text>
                            <Text>{tx.merchant}</Text>

                            <Text>Date</Text>
                            <Text>{tx.date}</Text>

                            <Text>Time</Text>
                            <Text>{tx.date}</Text>
                          </SimpleGrid>
                        </Flex>
                        <Flex
                          gap={4}
                          p={4}
                          flexDirection="column"
                          bg="bg"
                          borderWidth="1px"
                          borderRadius={10}
                        >
                          <Text fontWeight="bold" fontSize="md">
                            Transaction Information
                          </Text>
                          <Text>
                            Transaction originated from a high-risk jurisdiction
                            with an amount significantly above the
                            merchant&apos;s average transaction value. Multiple
                            rapid transactions observed from same IP address
                            within a 24-hour period.
                          </Text>
                        </Flex>
                      </Stack>
                    </Tabs.Content>
                    <Tabs.Content value="merchant">
                      <Stack>
                        <Flex
                          gap={4}
                          p={4}
                          flexDirection="column"
                          bg="bg"
                          borderWidth="1px"
                          borderRadius={10}
                        >
                          <Text fontWeight="bold" fontSize="md">
                            Merchant Information
                          </Text>
                          <SimpleGrid columns={2} gap={2}>
                            <Text>Merchant Name</Text>
                            <Text>{tx.merchant}</Text>

                            <Text>DBA</Text>
                            <Text>{tx.merchant}</Text>

                            <Text>MID</Text>
                            <Text>{tx.mid}</Text>

                            <Text>Processor</Text>
                            <Text>{tx.processor}</Text>

                            <Text>Risk Category</Text>
                            <Text>{tx.exception}</Text>
                          </SimpleGrid>
                        </Flex>
                        <Flex
                          gap={4}
                          p={4}
                          flexDirection="column"
                          bg="bg"
                          borderWidth="1px"
                          borderRadius={10}
                        >
                          <Text fontWeight="bold" fontSize="md">
                            Transaction History
                          </Text>
                          <Text>
                            Recent transaction history will appear here.
                          </Text>
                        </Flex>
                      </Stack>
                    </Tabs.Content>
                    <Tabs.Content value="exceptions">
                      <Stack>
                        <Flex
                          gap={4}
                          p={4}
                          flexDirection="column"
                          bg="bg"
                          borderWidth="1px"
                          borderRadius={10}
                        >
                          <Text fontWeight="bold" fontSize="sm">
                            Exception Details
                          </Text>
                          <Box p="4" bg="red.100" borderRadius="md">
                            <Text fontWeight="medium" mb="2" color="red.800">
                              Exception Summary
                            </Text>
                            <Text fontSize="sm" color="red.700">
                              High-risk country, Unusual amount for merchant
                              category
                            </Text>
                          </Box>
                          <Stack>
                            <Text fontWeight="bold" fontSize="sm">
                              Exception Types
                            </Text>
                            <Flex gap={2}>
                              <Tag.Root size="md" colorPalette="red" px={2}>
                                <Tag.Label fontWeight="bold">
                                  High-risk country
                                </Tag.Label>
                              </Tag.Root>
                              <Tag.Root size="md" colorPalette="red" px={2}>
                                <Tag.Label fontWeight="bold">
                                  Unusual amount for merchant category
                                </Tag.Label>
                              </Tag.Root>
                            </Flex>
                          </Stack>
                          <Stack>
                            <Text fontWeight="bold" fontSize="sm">
                              Detailed Analysis
                            </Text>
                            <Text fontSize="sm">
                              Transaction originated from a high-risk
                              jurisdiction with an amount significantly above
                              the merchant&apos;s average transaction value.
                              Multiple rapid transactions observed from same IP
                              address within a 24-hour period.
                            </Text>
                          </Stack>
                          <Stack>
                            <Flex
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Box>
                                <Text fontWeight="bold" fontSize="sm">
                                  Transaction Exceptions
                                </Text>
                              </Box>
                              <Box></Box>
                              <Button
                                variant="ghost"
                                color="brand"
                                borderWidth="1px"
                                borderColor="bg.inverted"
                                size="sm"
                              >
                                <RiExpandDiagonalFill />
                                Expand Table
                              </Button>
                            </Flex>
                            <Table.ScrollArea borderWidth="1px" maxW="xl">
                              <Table.Root size="sm" stickyHeader>
                                <Table.Header>
                                  <Table.Row bg="bg.subtle">
                                    <Table.ColumnHeader>
                                      Transaction Date
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader>
                                      Auth Amount
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader>
                                      Trans Amount
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader>POS</Table.ColumnHeader>
                                    <Table.ColumnHeader>AVS</Table.ColumnHeader>
                                    <Table.ColumnHeader>
                                      Auth Code
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader>
                                      Card Number
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader>PIN</Table.ColumnHeader>
                                    <Table.ColumnHeader>
                                      Eligible Exceptions
                                    </Table.ColumnHeader>
                                  </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                  {data.map((item, index) => (
                                    <Table.Row key={index}>
                                      <Table.Cell>{item.date}</Table.Cell>
                                      <Table.Cell>{item.authAmount}</Table.Cell>
                                      <Table.Cell>
                                        {item.transAmount}
                                      </Table.Cell>
                                      <Table.Cell>{item.pos}</Table.Cell>
                                      <Table.Cell>{item.avs}</Table.Cell>
                                      <Table.Cell>{item.authCode}</Table.Cell>
                                      <Table.Cell>{item.cardNumber}</Table.Cell>
                                      <Table.Cell>{item.pin}</Table.Cell>
                                      <Table.Cell>
                                        <HStack align="start" gap={1}>
                                          {item.eligibleExceptions.map(
                                            (code) => (
                                              <Badge
                                                key={code}
                                                colorPalette="blue"
                                                borderRadius="md"
                                                px={2}
                                                py={1}
                                                fontSize="sm"
                                              >
                                                {code}
                                              </Badge>
                                            )
                                          )}
                                        </HStack>
                                      </Table.Cell>
                                    </Table.Row>
                                  ))}
                                </Table.Body>
                              </Table.Root>
                            </Table.ScrollArea>
                          </Stack>
                        </Flex>
                      </Stack>
                    </Tabs.Content>
                  </Tabs.Root>
                </Box>
              </Flex>
            </Drawer.Body>
            <Drawer.Footer>
              <Box display="flex" flexDirection="column" w="100%" gap={4}>
                <Button flexGrow={1}>
                  <MdCheck size={14} />
                  Mark as Reviewed
                </Button>
                <Drawer.ActionTrigger asChild>
                  <Button variant="outline" flexGrow={1}>
                    <MdOutlineArrowBack />
                    Back to Queue
                  </Button>
                </Drawer.ActionTrigger>
              </Box>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
