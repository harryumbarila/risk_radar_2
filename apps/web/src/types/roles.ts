import { User } from '@frontegg/redux-store/auth/interfaces';
import { IRole } from '@frontegg/rest-api/roles/interfaces';

export const ROLE_SALES = 'Sales';

type RolesReturnType = {
  roles: IRole[];
  isRole: (role: string) => boolean;
  isSales: () => boolean;
};

export function roles(user: User | null | undefined): RolesReturnType {
  // Extract roles from the user object
  const userRoles = user && user.roles.length >= 0 ? user.roles : [];

  const isRole = (role: string): boolean => {
    return userRoles.some((userRole) => userRole.name === role);
  };

  const isSales = (): boolean => {
    return userRoles.some((userRole) => userRole.name === ROLE_SALES);
  };

  return { roles: userRoles, isRole, isSales };
}
