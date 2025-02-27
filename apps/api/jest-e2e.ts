import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';

import { readFileSync } from 'fs';
import { join } from 'path';

const tsConfigPath = join(__dirname, 'tsconfig.json');
const tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf-8'));

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  collectCoverage: false,
  coveragePathIgnorePatterns: ['.*snap$', '/node_modules/', '/dist/'],
  testEnvironment: 'node',
  testMatch: ['**/test/*.e2e.spec.ts', '**/test/**/*.e2e.spec.ts'],
  collectCoverageFrom: ['!src/types/**/*.ts', 'src/**/*'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  setupFilesAfterEnv: ['./test/setup-tests.e2e.ts'],
  setupFiles: ['./test/setup-env.e2e.ts'],
};

export default config;
