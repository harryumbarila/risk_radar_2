import {
  formatDateToString,
  getCurrentLocalDate,
  getLocalDateParts,
  getStartOfDay,
} from '@/shared/utils/date-utils';

describe('date-utils', () => {
  describe('formatDateToString', () => {
    it('should format date parts correctly', () => {
      const dateParts = {
        year: 2025,
        month: 4,
        day: 10,
      } as const;

      expect(formatDateToString(dateParts)).toBe('2025-04-10');
    });

    it('should pad single digit month and day with zeros', () => {
      const dateParts = {
        year: 2025,
        month: 4,
        day: 1,
      } as const;

      expect(formatDateToString(dateParts)).toBe('2025-04-01');
    });
  });

  describe('getLocalDateParts', () => {
    it('should extract correct date parts from Date object', () => {
      const testDate = new Date(2025, 3, 10);
      const result = getLocalDateParts(testDate);

      expect(result).toEqual({
        year: 2025,
        month: 4,
        day: 10,
      });
    });
  });

  describe('getStartOfDay', () => {
    it('should set time to start of day', () => {
      const testDate = new Date(2025, 3, 10, 23, 59, 59, 999);
      const result: Date = getStartOfDay(testDate);

      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(3);
      expect(result.getDate()).toBe(10);
    });

    it('should not modify original date object', () => {
      const originalDate = new Date(2025, 3, 10, 23, 59, 59, 999);
      const originalTime = originalDate.getTime();
      getStartOfDay(originalDate);

      expect(originalDate.getTime()).toBe(originalTime);
    });
  });

  describe('getCurrentLocalDate', () => {
    let dateSpy: jest.SpyInstance;

    beforeEach(() => {
      const RealDate = Date;
      dateSpy = jest
        .spyOn(global, 'Date')
        .mockImplementation((...args: ConstructorParameters<typeof Date>) => {
          if (!args.length) {
            return new RealDate(2025, 3, 10, 12, 0, 0);
          }
          return new RealDate(...args);
        });
    });

    afterEach(() => {
      dateSpy.mockRestore();
    });

    it('should return current date regardless of time of day', () => {
      // Test at different times of the day
      const times = [
        new Date(2025, 3, 10, 0, 0, 1), // Just after midnight
        new Date(2025, 3, 10, 12, 0, 0), // Noon
        new Date(2025, 3, 10, 23, 59, 59), // Just before midnight
      ];

      times.forEach((mockDate) => {
        dateSpy.mockImplementation(() => mockDate);
        expect(getCurrentLocalDate()).toBe('2025-04-10');
      });
    });

    it('should handle timezone edge cases near midnight', () => {
      // Test edge cases around midnight
      const edgeCases = [
        new Date(2025, 3, 10, 23, 59, 59, 999), // Last millisecond of the day
        new Date(2025, 3, 10, 0, 0, 0, 0), // First millisecond of the day
      ];

      edgeCases.forEach((mockDate) => {
        dateSpy.mockImplementation(() => mockDate);
        expect(getCurrentLocalDate()).toBe('2025-04-10');
      });
    });

    it('should not show next day when time is near midnight', () => {
      const mockDate = new Date(2025, 3, 10, 23, 59, 59, 999);
      dateSpy.mockImplementation(() => mockDate);

      expect(getCurrentLocalDate()).toBe('2025-04-10');
      expect(getCurrentLocalDate()).not.toBe('2025-04-11');
    });
  });
});
