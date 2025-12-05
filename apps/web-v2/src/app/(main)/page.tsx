import React from 'react';
import { Box, Text, VStack, Button } from '@chakra-ui/react';
import Home from '@/libs/domain/dashboard/components/home/home';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={6}>
          <VStack gap={4} align="stretch">
            <Text fontSize="lg" fontWeight="bold" color="red.600">
              Error loading dashboard
            </Text>
            <Text fontSize="sm" color="gray.600">
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default function Homepage(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  );
}
