import { IrisFilteredUsersResponseDto } from '@denali/web/src/hooks/attribution-url/response/irisUsersResponseDto';
import { IrisUsersResponseDto } from '../../../../../src/module/iris-proxy/response/iris-users.response.dto';
import { FilteredUsersFactory } from '../../../../../src/module/iris-proxy/response/iris-filtered-users.response.dto';

describe('FilteredUsersFactory', () => {
  describe('create', () => {
    it('should transform IrisUsersResponseDto to IrisFilteredUsersResponseDto', () => {
      const input: IrisUsersResponseDto = {
        data: [
          {
            id: 1,
            full_name: 'John Doe',
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
              },
            ],
            manages: [
              {
                user_id: 3,
                username: 'bob.johnson',
                full_name: 'bob.johnson',
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
            rsl: [{ id: 2, name: 'jane.smith' }],
            channels: [{ id: 201, name: 'Sales' }],
            manages: [{ user_id: 3, username: 'bob.johnson' }],
          },
        ],
      };

      const result = FilteredUsersFactory.create(input);

      expect(result).toEqual(expectedOutput);
    });
  });
});
