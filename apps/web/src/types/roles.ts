export const ROLE_SALES = "Sales";

import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";

const CUSTOM_ROLES_CLAIM = "https://taluspay.com/roles";

export function roles(user: UserProfile | undefined) {
  // Extract roles from the user object
  const roles =
    user && user[CUSTOM_ROLES_CLAIM]
      ? (user[CUSTOM_ROLES_CLAIM] as string[])
      : [];

  const isRole = (role: string): boolean => {
    return roles.includes(role);
  };

  const isSales = (): boolean => {
    return roles.includes(ROLE_SALES);
  };

  return { roles, isRole, isSales };
}
