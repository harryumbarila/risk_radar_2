import { readFileSync } from 'fs';
import { join } from 'path';
import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';

const tsConfigPath = join(process.cwd(), 'tsconfig.json');
const tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf-8'));

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  collectCoverage: false,
  coveragePathIgnorePatterns: ['.*snap$', '/node_modules/', '/dist/'],
  testEnvironment: 'node',
  testMatch: ['**/test/*.unit.spec.ts', '**/test/**/*.unit.spec.ts'],
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
};

export default config;
