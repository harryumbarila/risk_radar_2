'use client';
import React from 'react';
import {
  Box,
  VStack,
  Text,
  HStack,
  Button,
  SimpleGrid,
  Table,
  Badge,
  Separator,
} from '@chakra-ui/react';
import { FileText, Download, ExternalLink, MessageSquare, User } from 'lucide-react';
import { format } from 'date-fns';

interface UnderwritingTabProps {
  merchantId: string;
}

interface UWMemo {
  id: string;
  memo: string;
  dateCreated: string;
  createdBy: string;
  team: 'UW Team';
}

interface AttachmentFile {
  id: string;
  name: string;
  provider: 'Experian' | 'Match Pro' | 'Lexis Nexis';
  date: string;
  size: string;
  url?: string;
}

export default function UnderwritingTab({ merchantId }: UnderwritingTabProps) {
  // Mock UW memos
  const [uwMemos, setUwMemos] = React.useState<UWMemo[]>([
    {
      id: '1',
      memo: 'Initial underwriting review completed. All documentation verified. Merchant meets standard requirements.',
      dateCreated: '2025-01-15T10:30:00',
      createdBy: 'Sarah Johnson',
      team: 'UW Team',
    },
    {
      id: '2',
      memo: 'Additional verification required for business license. Follow-up scheduled for next week.',
      dateCreated: '2025-01-14T14:20:00',
      createdBy: 'Michael Chen',
      team: 'UW Team',
    },
    {
      id: '3',
      memo: 'Risk assessment completed. Low risk profile confirmed. Account approved for standard processing.',
      dateCreated: '2025-01-13T09:15:00',
      createdBy: 'Emily Rodriguez',
      team: 'UW Team',
    },
    {
      id: '4',
      memo: 'Background check cleared. No adverse findings. Merchant verified through all channels.',
      dateCreated: '2025-01-12T16:45:00',
      createdBy: 'David Kim',
      team: 'UW Team',
    },
  ]);

  // Mock attachment files
  const attachments: AttachmentFile[] = [
    {
      id: '1',
      name: 'Experian_Check_Report.pdf',
      provider: 'Experian',
      date: '2025-01-15',
      size: '2.4 MB',
    },
    {
      id: '2',
      name: 'Experian_Credit_Summary.pdf',
      provider: 'Experian',
      date: '2025-01-15',
      size: '1.8 MB',
    },
    {
      id: '3',
      name: 'MatchPro_Verification_Report.pdf',
      provider: 'Match Pro',
      date: '2025-01-14',
      size: '3.1 MB',
    },
    {
      id: '4',
      name: 'MatchPro_Identity_Check.pdf',
      provider: 'Match Pro',
      date: '2025-01-14',
      size: '2.9 MB',
    },
    {
      id: '5',
      name: 'LexisNexis_Risk_Assessment.pdf',
      provider: 'Lexis Nexis',
      date: '2025-01-13',
      size: '4.2 MB',
    },
    {
      id: '6',
      name: 'LexisNexis_Background_Check.pdf',
      provider: 'Lexis Nexis',
      date: '2025-01-13',
      size: '3.7 MB',
    },
  ];

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'Experian':
        return 'blue';
      case 'Match Pro':
        return 'purple';
      case 'Lexis Nexis':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const handleDownload = (file: AttachmentFile) => {
    // Mock download functionality
    console.log('Downloading:', file.name);
  };

  const handleView = (file: AttachmentFile) => {
    // Mock view functionality
    console.log('Viewing:', file.name);
  };

  // Sort memos by date (newest first)
  const sortedMemos = React.useMemo(() => {
    return [...uwMemos].sort((a, b) => {
      return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
    });
  }, [uwMemos]);

  return (
    <VStack align="stretch" gap={6}>
      {/* UW Memos Section */}
      <Box>
        <VStack align="stretch" gap={4}>
          <HStack justify="space-between" align="center">
            <HStack gap={2}>
              <Box color="blue.500">
                <MessageSquare size={20} />
              </Box>
              <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                UW Team Memos
              </Text>
            </HStack>
            <Badge colorPalette="blue" variant="subtle">
              {uwMemos.length} memo{uwMemos.length !== 1 ? 's' : ''}
            </Badge>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            Memos and notes from the Underwriting team regarding this merchant.
          </Text>

          {sortedMemos.length === 0 ? (
            <Box
              bg="gray.50"
              p={8}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
              textAlign="center"
            >
              <Text fontSize="sm" color="gray.500">
                No memos from the UW team yet.
              </Text>
            </Box>
          ) : (
            <Box
              bg="white"
              borderRadius="lg"
              boxShadow="0 2px 8px rgba(0,0,0,0.05)"
              borderWidth="1px"
              borderColor="gray.200"
              overflow="hidden"
            >
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row bg="gray.50">
                    <Table.ColumnHeader>Date & Time</Table.ColumnHeader>
                    <Table.ColumnHeader>Created By</Table.ColumnHeader>
                    <Table.ColumnHeader>Memo</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sortedMemos.map((memo) => (
                    <Table.Row key={memo.id}>
                      <Table.Cell>
                        <VStack align="start" gap={0}>
                          <Text fontSize="sm" fontWeight="medium" color="gray.900">
                            {format(new Date(memo.dateCreated), 'MMM dd, yyyy')}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {format(new Date(memo.dateCreated), 'hh:mm a')}
                          </Text>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell>
                        <HStack gap={2}>
                          <Box color="gray.400">
                            <User size={16} />
                          </Box>
                          <Text fontSize="sm" color="gray.700">
                            {memo.createdBy}
                          </Text>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.800">
                          {memo.memo}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </VStack>
      </Box>

      <Separator />

      {/* Documents Section */}
      <Box>
        <VStack align="stretch" gap={4}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.900">
            Underwriting Documents
          </Text>
          <Text fontSize="sm" color="gray.600">
            Review attached documents from various verification checks and background services.
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {attachments.map((file) => (
              <Box
                key={file.id}
                p={4}
                bg="white"
                borderRadius="lg"
                boxShadow="0 2px 8px rgba(0,0,0,0.05)"
                borderWidth="1px"
                borderColor="gray.200"
                _hover={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderColor: 'gray.300',
                }}
                transition="all 0.2s"
              >
                <VStack align="stretch" gap={3}>
                  <HStack justify="space-between" align="start">
                    <HStack gap={2} flex={1}>
                      <Box color={`${getProviderColor(file.provider)}.500`}>
                        <FileText size={24} />
                      </Box>
                      <VStack align="start" gap={0} flex={1} minW={0}>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.900"
                          lineClamp={2}
                          title={file.name}
                        >
                          {file.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {file.provider}
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>

                  <HStack justify="space-between" fontSize="xs" color="gray.600">
                    <Text>{file.date}</Text>
                    <Text>{file.size}</Text>
                  </HStack>

                  <HStack gap={2} pt={2} borderTopWidth="1px" borderColor="gray.100">
                    <Button
                      size="xs"
                      variant="outline"
                      flex={1}
                      onClick={() => handleView(file)}
                    >
                      <ExternalLink size={14} />
                      View
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      colorPalette={getProviderColor(file.provider)}
                      onClick={() => handleDownload(file)}
                    >
                      <Download size={14} />
                      Download
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
    </VStack>
  );
}




