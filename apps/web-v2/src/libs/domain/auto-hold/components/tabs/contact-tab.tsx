'use client';
import React from 'react';
import { Box, VStack, Text, SimpleGrid, HStack } from '@chakra-ui/react';
import { User, Mail, Phone, Briefcase } from 'lucide-react';

interface ContactTabProps {
  merchantId: string;
  merchantName: string;
}

export default function ContactTab({ merchantId, merchantName }: ContactTabProps) {
  // Mock data - Multiple owners
  const owners = [
    {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      title: 'CEO',
      role: 'Primary Owner',
    },
    {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1 (555) 987-6543',
      title: 'CFO',
      role: 'Secondary Owner',
    },
  ];

  return (
    <VStack align="stretch" gap={4}>
      <Text fontSize="lg" fontWeight="semibold" color="gray.900">
        Owner Information
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {owners.map((owner, index) => (
          <Box
            key={index}
            p={4}
            bg="white"
            borderRadius="xl"
            boxShadow="0 2px 8px rgba(0,0,0,0.05)"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <HStack gap={2} mb={3}>
              <Box color="purple.500">
                <User size={18} />
              </Box>
              <VStack align="start" gap={0}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                  {owner.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {owner.role}
                </Text>
              </VStack>
            </HStack>
            
            <VStack align="start" gap={3}>
              <HStack gap={2} align="start">
                <Box color="gray.500" mt={0.5}>
                  <Briefcase size={14} />
                </Box>
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" color="gray.600" textTransform="uppercase">
                    Title
                  </Text>
                  <Text fontSize="sm" color="gray.900">
                    {owner.title}
                  </Text>
                </VStack>
              </HStack>
              
              <HStack gap={2} align="start">
                <Box color="gray.500" mt={0.5}>
                  <Mail size={14} />
                </Box>
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" color="gray.600" textTransform="uppercase">
                    Email
                  </Text>
                  <Text fontSize="sm" color="gray.900">
                    {owner.email}
                  </Text>
                </VStack>
              </HStack>
              
              <HStack gap={2} align="start">
                <Box color="gray.500" mt={0.5}>
                  <Phone size={14} />
                </Box>
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" color="gray.600" textTransform="uppercase">
                    Phone
                  </Text>
                  <Text fontSize="sm" color="gray.900">
                    {owner.phone}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
}
