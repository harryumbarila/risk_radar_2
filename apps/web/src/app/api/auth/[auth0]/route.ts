import { handleAuth } from '@auth0/nextjs-auth0';

import { auth0Config } from '@/web/auth0-config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const GET = handleAuth(auth0Config);
