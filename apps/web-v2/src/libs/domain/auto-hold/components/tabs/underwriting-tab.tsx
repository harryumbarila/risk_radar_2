'use client';
import React from 'react';
import {
  Box,
  VStack,
  Text,
  HStack,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface UnderwritingTabProps {
  merchantId: string;
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

  return (
    <VStack align="stretch" gap={6}>
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
  );
}




