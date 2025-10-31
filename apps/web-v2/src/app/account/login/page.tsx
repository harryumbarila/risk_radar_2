'use client';

import React from 'react';

import { Flex, Stack, Heading, Box, Button } from '@chakra-ui/react';
import { useAuth, useLoginWithRedirect } from '@frontegg/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const loginWithRedirect = useLoginWithRedirect();

  if (isAuthenticated) {
    router.replace('/');
  }

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading size="xl">Welcome</Heading>
        <Image
          className="dark:hidden"
          src="/images/talus-only-logo.png"
          alt="Denali Logo"
          width={176}
          height={32}
        />
        <Box minW={{ base: '90%', md: '468px' }}>
          <Stack gap={4} p="1rem">
            <Button
              variant="outline"
              width="full"
              onClick={() => loginWithRedirect()}
            >
              Login
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
