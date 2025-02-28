import type { UserProfile } from '@auth0/nextjs-auth0/client';

export const ROLE_SALES = 'Sales';

const CUSTOM_ROLES_CLAIM = 'https://taluspay.com/roles';

type RolesReturnType = {
  roles: string[];
  isRole: (role: string) => boolean;
  isSales: () => boolean;
};

export function roles(user: UserProfile | undefined): RolesReturnType {
  // Extract roles from the user object
  const userRoles =
    user && user[CUSTOM_ROLES_CLAIM]
      ? (user[CUSTOM_ROLES_CLAIM] as string[])
      : [];

  const isRole = (role: string): boolean => {
    return userRoles.includes(role);
  };

  const isSales = (): boolean => {
    return userRoles.includes(ROLE_SALES);
  };

  return { roles: userRoles, isRole, isSales };
}
