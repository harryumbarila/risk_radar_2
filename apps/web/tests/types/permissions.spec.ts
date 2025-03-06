import type { User } from '@frontegg/redux-store/auth/interfaces';

import { PERMISSIONS, permissions } from '@/types/permissions';

describe('permissions', () => {
  it('should return false for all permissions if user is null', () => {
    const result = permissions(null);
    expect(result.hasPermission('some_permission')).toBe(false);
    const resourcePermissions = result.forResource('RISK_RADAR');
    expect(resourcePermissions).toEqual({
      canRead: false,
      canWrite: false,
      canAccess: false,
    });
  });

  it('should return false for all permissions if user has no permissions', () => {
    const user = { permissions: [] } as unknown as User;
    const result = permissions(user);
    expect(result.hasPermission('some_permission')).toBe(false);
    const resourcePermissions = result.forResource('RISK_RADAR');
    expect(resourcePermissions).toEqual({
      canRead: false,
      canWrite: false,
      canAccess: false,
    });
  });

  it('should return true for specific permission if user has it', () => {
    const user = {
      permissions: [{ key: 'some_permission' }, { key: 'another_permission' }],
    } as User;
    const result = permissions(user);
    expect(result.hasPermission('some_permission')).toBe(true);
    expect(result.hasPermission('missing_permission')).toBe(false);
  });

  it('should correctly evaluate permissions for a resource', () => {
    const user = {
      permissions: [
        { key: PERMISSIONS.RISK_RADAR.READ },
        { key: PERMISSIONS.ATTRIBUTION_LINK.WRITE },
      ],
    } as User;
    const result = permissions(user);

    const riskRadarPermissions = result.forResource('RISK_RADAR');
    expect(riskRadarPermissions).toEqual({
      canRead: true,
      canWrite: false,
      canAccess: true,
    });

    const attributionLinkPermissions = result.forResource('ATTRIBUTION_LINK');
    expect(attributionLinkPermissions).toEqual({
      canRead: false,
      canWrite: true,
      canAccess: true,
    });
  });

  it('should return false for invalid or undefined resources', () => {
    const user = {
      permissions: [{ key: 'random_permission' }],
    } as User;
    const result = permissions(user);
    const resourcePermissions = result.forResource('RISK_RADAR');
    expect(resourcePermissions).toEqual({
      canRead: false,
      canWrite: false,
      canAccess: false,
    });
  });
});
