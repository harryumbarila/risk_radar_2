'use client';
import React from 'react';
import { Box, VStack, Text, HStack, Table, Badge, Button } from '@chakra-ui/react';
import { FileText, Download, Eye, Paperclip } from 'lucide-react';
import { format } from 'date-fns';

interface SharedAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedDate: Date;
  uploadedBy: string;
  processType: string; // e.g., 'Talus Agreement', 'Compliance Document', etc.
  description?: string;
}

interface SharedAttachmentsTabProps {
  merchantId: string;
}

export default function SharedAttachmentsTab({ merchantId }: SharedAttachmentsTabProps) {
  // Mock data for shared attachments
  const sharedAttachments: SharedAttachment[] = React.useMemo(() => {
    const baseDate = new Date();
    return [
      {
        id: '1',
        fileName: 'Talus_Agreement_2024.pdf',
        fileType: 'PDF',
        fileSize: '2.4 MB',
        uploadedDate: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        uploadedBy: 'John Smith',
        processType: 'Talus Agreement',
        description: 'Signed Talus Agreement for merchant onboarding',
      },
      {
        id: '2',
        fileName: 'Compliance_Checklist_Q4_2024.pdf',
        fileType: 'PDF',
        fileSize: '1.8 MB',
        uploadedDate: new Date(baseDate.getTime() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        uploadedBy: 'Sarah Johnson',
        processType: 'Compliance Document',
        description: 'Q4 2024 compliance checklist and verification',
      },
      {
        id: '3',
        fileName: 'Merchant_Application_Form.pdf',
        fileType: 'PDF',
        fileSize: '3.2 MB',
        uploadedDate: new Date(baseDate.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        uploadedBy: 'Michael Chen',
        processType: 'Application',
        description: 'Original merchant application form',
      },
      {
        id: '4',
        fileName: 'Bank_Verification_Letter.pdf',
        fileType: 'PDF',
        fileSize: '1.1 MB',
        uploadedDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        uploadedBy: 'Emily Davis',
        processType: 'Verification',
        description: 'Bank account verification letter',
      },
      {
        id: '5',
        fileName: 'Talus_Agreement_Amendment_2024.pdf',
        fileType: 'PDF',
        fileSize: '1.5 MB',
        uploadedDate: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        uploadedBy: 'John Smith',
        processType: 'Talus Agreement',
        description: 'Amendment to original Talus Agreement',
      },
    ];
  }, []);

  const handleDownload = (attachment: SharedAttachment) => {
    // Mock download functionality
    console.log('Downloading:', attachment.fileName);
    // In a real scenario, this would trigger a download
  };

  const handleView = (attachment: SharedAttachment) => {
    // Mock view functionality
    console.log('Viewing:', attachment.fileName);
    // In a real scenario, this would open a preview or viewer
  };


  return (
    <Box>
      <VStack align="stretch" gap={4}>
        {/* Header */}
        <HStack justify="space-between" align="center">
          <HStack gap={2}>
            <Box color="blue.600">
              <Paperclip size={20} />
            </Box>
            <Text fontSize="lg" fontWeight="semibold" color="gray.900">
              Shared Attachments
            </Text>
            <Badge
              colorPalette="blue"
              variant="subtle"
              px={2}
              py={0.5}
              borderRadius="full"
              fontSize="xs"
            >
              {sharedAttachments.length}
            </Badge>
          </HStack>
        </HStack>

        {/* Table */}
        {sharedAttachments.length === 0 ? (
          <Box textAlign="center" py={12}>
            <Box color="gray.400" mb={4} display="inline-block">
              <FileText size={48} />
            </Box>
            <Text fontSize="md" color="gray.500" mb={2}>
              No shared attachments
            </Text>
            <Text fontSize="sm" color="gray.400">
              Attachments uploaded by the client will appear here
            </Text>
          </Box>
        ) : (
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>File Name</Table.ColumnHeader>
                <Table.ColumnHeader>File Size</Table.ColumnHeader>
                <Table.ColumnHeader>Uploaded Date</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sharedAttachments.map((attachment) => (
                <Table.Row key={attachment.id}>
                  <Table.Cell>
                    <HStack gap={2}>
                      <Box color="blue.600">
                        <FileText size={16} />
                      </Box>
                      <VStack align="start" gap={0}>
                        <Text fontSize="sm" fontWeight="medium" color="gray.900">
                          {attachment.fileName}
                        </Text>
                        {attachment.description && (
                          <Text fontSize="xs" color="gray.500">
                            {attachment.description}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="gray.700">
                      {attachment.fileSize}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="gray.700">
                      {format(attachment.uploadedDate, 'MMM dd, yyyy')}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {format(attachment.uploadedDate, 'HH:mm')}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <HStack gap={2}>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleView(attachment)}
                        title="View"
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleDownload(attachment)}
                        title="Download"
                      >
                        <Download size={14} />
                      </Button>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </VStack>
    </Box>
  );
}

