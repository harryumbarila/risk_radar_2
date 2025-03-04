import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import MainPage from '@/app/page';

// Mock the Auth0 hooks
jest.mock('@frontegg/nextjs', () => ({
  useAuth: jest.fn(() => ({
    user: { name: 'Test User', email: 'test@example.com', roles: ['Sales'] },
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

describe('MainPage Component', () => {
  it('renders the main page', () => {
    render(<MainPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
