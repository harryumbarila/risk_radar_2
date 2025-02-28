import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

import App from '@/app/page';

// Mock the Auth0 hooks
jest.mock('@auth0/nextjs-auth0/client', () => ({
  UserProvider: ({ children }: PropsWithChildren): React.ReactNode => {
    return children;
  },
  useUser: jest.fn(() => ({
    user: { name: 'Test User', email: 'test@example.com' },
    error: null,
    isLoading: false,
  })),
}));

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  })),
  usePathname: jest.fn(() => '/'),
}));

describe('App Component', () => {
  it('renders the main page', () => {
    render(<App />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
