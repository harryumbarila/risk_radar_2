import { Box } from '@chakra-ui/react';
import React from 'react';

interface CheckStatusBadgeProps {
  value?: boolean | null;
}

export default function CheckStatusBadge(
  props: CheckStatusBadgeProps
): React.JSX.Element {
  const { value } = props;
  let bg = 'gray.100';
  let color = 'gray.800';
  let label = 'Not Set';

  if (value === true) {
    bg = 'green.100';
    color = 'green.800';
    label = 'Enabled';
  } else if (value === false) {
    bg = 'red.100';
    color = 'red.800';
    label = 'Disabled';
  }

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      py={1}
      borderRadius="md"
      fontSize="xs"
      fontWeight="semibold"
      bg={bg}
      color={color}
    >
      {label}
    </Box>
  );
}
