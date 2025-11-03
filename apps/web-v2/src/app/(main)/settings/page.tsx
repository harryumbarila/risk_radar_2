import React from 'react';
import Link from 'next/link';

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import { MdSecurity, MdCategory, MdStore } from 'react-icons/md';

export default function SettingsPage(): React.JSX.Element {
  const modules = [
    {
      title: 'Risk Rules',
      description: 'Configure risk management rules and parameters',
      icon: MdSecurity,
      path: '/settings/risk-rules',
      color: 'brand.600',
    },
    {
      title: 'MCC Configuration',
      description: 'Manage Merchant Category Code settings',
      icon: MdCategory,
      path: '/settings/mcc-config',
      color: 'brand.600',
    },
    {
      title: 'MID Configuration',
      description: 'Manage Merchant ID configurations',
      icon: MdStore,
      path: '/settings/mid-config',
      color: 'brand.600',
    },
  ];

  return (
      <Box>
        <Heading size="xl" mb={2} color="brand.700">
          Settings
        </Heading>
        <Text color="gray.600" mb={6}>
          Configure application modules and settings
        </Text>

        <SimpleGrid
          columns={{
            base: 2,
            md: 4,
          }}
          gap={6}
        >
          {modules.map((module) => (
            <Link key={module.path} href={module.path} passHref>
              <Box
                bg="white"
                p={6}
                borderRadius="lg"
                shadow="sm"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  shadow: 'md',
                  transform: 'translateY(-2px)',
                }}
              >
                <module.icon size={32} />
                <Heading size="md" mb={2} color="brand.700">
                  {module.title}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {module.description}
                </Text>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
    </Box>
  );
}
