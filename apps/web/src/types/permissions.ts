import type { User } from '@frontegg/redux-store/auth/interfaces';
import type { ITeamUserPermission } from '@frontegg/rest-api/teams/interfaces';

export const PERMISSIONS = {
  RISK_RADAR: {
    READ: 'talus:read:risk-radar',
    WRITE: 'talus:write:risk-radar',
  },
  ATTRIBUTION_LINK: {
    READ: 'talus:read:attribution-link-generator',
    WRITE: 'talus:write:attribution-link-generator',
  },
};

// Create a type for available resources from PERMISSIONS
export type ResourceKey = keyof typeof PERMISSIONS;

type PermissionsReturnType = {
  hasPermission: (permission: string) => boolean;
  forResource: (resource: ResourceKey) => {
    canRead: boolean;
    canWrite: boolean;
    canAccess: boolean;
  };
};

export function permissions(
  user: User | null | undefined
): PermissionsReturnType {
  // Extract permissions from the user object
  const userPermissions: ITeamUserPermission[] =
    user && user.permissions.length >= 0 ? user.permissions : [];

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    // Check if the permission string exists in the user's permissions
    return userPermissions.some(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (p: ITeamUserPermission) => p.key === permission
    );
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const forResource = (resource: ResourceKey) => {
    return {
      canRead: hasPermission(PERMISSIONS[resource].READ),
      canWrite: hasPermission(PERMISSIONS[resource].WRITE),
      canAccess:
        hasPermission(PERMISSIONS[resource].READ) ||
        hasPermission(PERMISSIONS[resource].WRITE),
    };
  };

  return {
    hasPermission,
    forResource,
  };
}
