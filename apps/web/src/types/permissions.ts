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
  MSP_INVOICE: {
    READ: 'talus:read:invoice',
    WRITE: 'talus:write:invoice',
  },
  TSYS_FIU: {
    READ: 'talus:read:TSYS-FIU',
    WRITE: 'talus:read:TSYS-FIU',
  },
  RESIDUAL: {
    READ: 'talus:write:residual',
    WRITE: 'talus:read:residual',
  },
  NET_SETTLEMENT: {
    READ: 'talus:write:net-settlement',
    WRITE: 'talus:read:net-settlement',
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
      (p: ITeamUserPermission) => p.key === permission
    );
  };

   
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
