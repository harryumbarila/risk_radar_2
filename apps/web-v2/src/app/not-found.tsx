'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Code,
  HStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();
  const pathSegments =
    pathname?.split('/').filter((segment) => segment !== '') || [];

  return (
    <Container
      maxW="container.md"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap={6} textAlign="center">
        <Heading as="h1" size="2xl" color="gray.700">
          404 - Page Not Found
        </Heading>

        <Text fontSize="xl" color="gray.600">
          The page you&apos;re looking for doesn&apos;t exist.
        </Text>

        <VStack gap={4} align="start" width="100%">
          <Heading size="md">Invalid Path Analysis</Heading>

          <Box width="100%">
            <Text mb={2} fontWeight="medium">
              Full Path:
            </Text>
            <Code
              p={3}
              borderRadius="md"
              bg="red.50"
              color="red.800"
              border="1px"
              borderColor="red.200"
              width="100%"
              fontSize="md"
            >
              {pathname}
            </Code>
          </Box>

          {pathSegments.length > 0 && (
            <Box width="100%">
              <Text mb={2} fontWeight="medium">
                Path Segments:
              </Text>
              <HStack gap={2} wrap="wrap">
                {pathSegments.map((segment, index) => (
                  <Code key={index} colorScheme="gray" p={2}>
                    {segment}
                  </Code>
                ))}
              </HStack>
            </Box>
          )}
        </VStack>

        <Link href="/" prefetch={false}>
          <Button colorScheme="blue" size="lg" mt={4}>
            Return Home
          </Button>
        </Link>
      </VStack>
    </Container>
  );
}
