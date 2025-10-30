'use client';

import { Flex, Stack, Heading, Box, Button } from '@chakra-ui/react';
import React from 'react';

const SignIn: React.FC = () => {
  const handleClick = (): void => {
    if (typeof window !== 'undefined') {
      window.location.assign('/api/auth/login');
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <Stack
            gap={4}
            p="1rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
          >
            <Button
              borderRadius={0}
              type="button"
              variant="solid"
              colorScheme="teal"
              width="full"
              onClick={handleClick}
            >
              Login
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignIn;
