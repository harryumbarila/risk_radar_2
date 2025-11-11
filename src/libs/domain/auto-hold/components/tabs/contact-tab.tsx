'use client';
import React from 'react';
import { Box, VStack, Text, SimpleGrid, HStack } from '@chakra-ui/react';
import { User, MapPin, Building } from 'lucide-react';

interface ContactTabProps {
  merchantId: string;
  merchantName: string;
}

export default function ContactTab({ merchantId, merchantName }: ContactTabProps) {
  // Mock data
  const contactData = {
    billingAddress: {
      street: '123 Commerce Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    },
    ownerInfo: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      title: 'CEO',
    },
  };

  return (
    <VStack align="stretch" gap={6}>
      <Text fontSize="lg" fontWeight="semibold" color="gray.900">
        Contact Information
      </Text>

      {/* Billing Address */}
      <Box
        p={6}
        bg="white"
        borderRadius="xl"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <HStack gap={2} mb={4}>
          <Box color="blue.500">
            <MapPin size={20} />
          </Box>
          <Text fontSize="md" fontWeight="semibold" color="gray.900">
            Billing Address
          </Text>
        </HStack>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600" textTransform="uppercase">
              Street
            </Text>
            <Text fontSize="sm" color="gray.800">
              {contactData.billingAddress.street}
            </Text>
          </VStack>
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600" textTransform="uppercase">
              City
            </Text>
            <Text fontSize="sm" color="gray.800">
              {contactData.billingAddress.city}
            </Text>
          </VStack>
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600" textTransform="uppercase">
              State
            </Text>
            <Text fontSize="sm" color="gray.800">
              {contactData.billingAddress.state}
            </Text>
          </VStack>
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600" textTransform="uppercase">
              ZIP Code
            </Text>
            <Text fontSize="sm" color="gray.800">
              {contactData.billingAddress.zip}
            </Text>
          </VStack>
          <VStack align="start" gap={1} gridColumn={{ base: '1', md: 'span 2' }}>
            <Text fontSize="xs" color="gray.600" textTransform="uppercase">
              Country
            </Text>
            <Text fontSize="sm" color="gray.800">
              {contactData.billingAddress.country}
            </Text>
          </VStack>
        </SimpleGrid>
      </Box>

      {/* Owner Information */}
      <Box
        p={6}
        bg="white"
        borderRadius="xl"
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <HStack gap={2} mb={4}>
          <Box color="purple.500">
            <User size={20} />
          </Box>
          <Text fontSize="md" fontWeight="semibold" color="gray.900">
            Owner Information
          </Text>
        </HStack>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600" textTransform="uppercase">
              Name
            </Text>
            <Text fontSize="sm" color="gray.800">
              {contactData.ownerInfo.name}
            </Text>
          </VStack>
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600" textTransform="uppercase">
              Title
            </Text>
            <Text fontSize="sm" color="gray.800">
              {contactData.ownerInfo.title}
            </Text>
          </VStack>
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600" textTransform="uppercase">
              Email
            </Text>
            <Text fontSize="sm" color="gray.800">
              {contactData.ownerInfo.email}
            </Text>
          </VStack>
          <VStack align="start" gap={1}>
            <Text fontSize="xs" color="gray.600" textTransform="uppercase">
              Phone
            </Text>
            <Text fontSize="sm" color="gray.800">
              {contactData.ownerInfo.phone}
            </Text>
          </VStack>
        </SimpleGrid>
      </Box>
    </VStack>
  );
}

