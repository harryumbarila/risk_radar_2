import type {
  IrisFilteredUsersResponseDto,
  IrisUsersResponseDto,
} from '@/shared/response/iris-proxy';
import { FilteredUsersFactory } from '@/shared/response/iris-proxy';

describe('FilteredUsersFactory', () => {
  describe('create', () => {
    it('should transform IrisUsersResponseDto to IrisFilteredUsersResponseDto with production environment', () => {
      const input: IrisUsersResponseDto = {
        data: [
          {
            id: 1,
            full_name: 'John Doe',
            email: 'john.doe@example.com',
            class: {
              id: 101,
              name: 'Manager',
            },
            groups: [
              {
                id: 201,
                name: 'Sales',
              },
            ],
            reports_to: [
              {
                user_id: 2,
                username: 'jane.smith',
                full_name: 'jane.smith',
                class: {
                  id: 25, // Production RSL class ID
                  name: 'RSL Class',
                },
              },
              {
                user_id: 3,
                username: 'bob.jones',
                full_name: 'bob.jones',
                class: {
                  id: 999, // Not a valid RSL class ID
                  name: 'Other Class',
                },
              },
            ],
            manages: [
              {
                user_id: 4,
                username: 'alice.partner',
                full_name: 'alice.partner',
                class: {
                  id: 71, // Production partner class ID
                  name: 'Referral Partners $',
                },
              },
              {
                user_id: 5,
                username: 'charlie.other',
                full_name: 'charlie.other',
                class: {
                  id: 999, // Not a valid partner class ID
                  name: 'Other Class',
                },
              },
            ],
          },
        ],
        meta: {
          current_page: 1,
          from: 1,
          last_page: 5,
          path: '/api/users',
          per_page: 15,
          to: 15,
          total: 75,
        },
      };

      const expectedOutput: IrisFilteredUsersResponseDto = {
        data: [
          {
            label: 'John Doe',
            value: 1,
            rsl: [{ id: 2, name: 'jane.smith' }], // Only the valid RSL class ID
            channels: [{ id: 201, name: 'Sales' }],
            manages: [{ user_id: 4, username: 'alice.partner' }], // Only the valid partner class ID
          },
        ],
      };

      const result = FilteredUsersFactory.create(input, 'production');

      expect(result).toEqual(expectedOutput);
    });

    it('should transform IrisUsersResponseDto to IrisFilteredUsersResponseDto with staging environment', () => {
      const input: IrisUsersResponseDto = {
        data: [
          {
            id: 1,
            full_name: 'John Doe',
            email: 'john.doe@example.com',
            class: {
              id: 101,
              name: 'Manager',
            },
            groups: [
              {
                id: 201,
                name: 'Sales',
              },
            ],
            reports_to: [
              {
                user_id: 2,
                username: 'jane.smith',
                full_name: 'jane.smith',
                class: {
                  id: 53, // Staging RSL class ID
                  name: 'RSL Class',
                },
              },
              {
                user_id: 3,
                username: 'bob.jones',
                full_name: 'bob.jones',
                class: {
                  id: 25, // Not a valid staging RSL class ID
                  name: 'Other Class',
                },
              },
            ],
            manages: [
              {
                user_id: 4,
                username: 'alice.partner',
                full_name: 'alice.partner',
                class: {
                  id: 41, // Staging partner class ID
                  name: 'Referral Partners $',
                },
              },
              {
                user_id: 5,
                username: 'charlie.other',
                full_name: 'charlie.other',
                class: {
                  id: 71, // Not a valid staging partner class ID
                  name: 'Other Class',
                },
              },
            ],
          },
        ],
        meta: {
          current_page: 1,
          from: 1,
          last_page: 5,
          path: '/api/users',
          per_page: 15,
          to: 15,
          total: 75,
        },
      };

      const expectedOutput: IrisFilteredUsersResponseDto = {
        data: [
          {
            label: 'John Doe',
            value: 1,
            rsl: [{ id: 2, name: 'jane.smith' }], // Only the valid staging RSL class ID
            channels: [{ id: 201, name: 'Sales' }],
            manages: [{ user_id: 4, username: 'alice.partner' }], // Only the valid staging partner class ID
          },
        ],
      };

      const result = FilteredUsersFactory.create(input, 'staging');

      expect(result).toEqual(expectedOutput);
    });
  });
});
