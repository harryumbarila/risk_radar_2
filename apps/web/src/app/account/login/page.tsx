'use client';

import { useAuth, useLoginWithRedirect } from '@frontegg/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { NoAuthLayout } from '@/components/layouts/no-auth-layout';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const loginWithRedirect = useLoginWithRedirect();

  if (isAuthenticated) {
    router.replace('/');
  }

  return (
    <NoAuthLayout>
      <div className="flex flex-col items-center">
        <Link className="mb-5.5 inline-block" href="/">
          <Image
            className="hidden dark:block"
            src="/images/talus-only-logo.png"
            alt="Denali Logo"
            width={176}
            height={32}
          />
          <Image
            className="dark:hidden"
            src="/images/talus-only-logo.png"
            alt="Denali Logo"
            width={176}
            height={32}
          />
        </Link>
        <input
          type="submit"
          value="Sign In"
          onClick={() => loginWithRedirect()}
          className="w-32 cursor-pointer rounded-lg border border-primary bg-primary p-2 text-white transition hover:bg-opacity-90"
        />
      </div>
    </NoAuthLayout>
  );
};

export default Login;
