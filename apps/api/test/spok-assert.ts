/* eslint-disable @typescript-eslint/no-explicit-any */
// We allow any type here because we are trying to replicate the spok assert

import { expect } from '@jest/globals';
import type { Assert } from 'spok';

const createSpokAssert = (): Assert => ({
  equal(actual: any, expected: any, msg?: string) {
    try {
      expect(actual).toBe(expected);
    } catch (error) {
      throw new Error(msg || `Expected ${actual} to be ${expected} ${error}`);
    }
  },
  deepEqual(actual: any, expected: any, msg?: string) {
    try {
      expect(actual).toEqual(expected);
    } catch (error) {
      throw new Error(
        msg || `Expected ${actual} to deeply equal ${expected} ${error}`
      );
    }
  },
});

export const SpokAssert = createSpokAssert();
