import { Assert } from 'spok';
import { expect } from '@jest/globals';

const createSpokAssert = (): Assert => ({
    equal(actual: any, expected: any, msg?: string) {
        try {
            expect(actual).toBe(expected);
        } catch (error) {
            throw new Error(msg || `Expected ${actual} to be ${expected}`);
        }
    },
    deepEqual(actual: any, expected: any, msg?: string) {
        try {
            expect(actual).toEqual(expected);
        } catch (error) {
            throw new Error(msg || `Expected ${actual} to deeply equal ${expected}`);
        }
    },
});

export const SpokAssert = createSpokAssert();
