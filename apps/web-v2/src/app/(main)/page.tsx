import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export default function Homepage(): React.JSX.Element {
  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold">
        Dashboard Loading...
      </Text>
      <Text mt={4}>
        If you see this, the page is working. The Home component will load next.
      </Text>
    </Box>
  );
}
