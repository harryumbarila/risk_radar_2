import createJestConfig from '@denali/jest-config/jest-nextjs';
import { pathsToModuleNameMapper } from 'ts-jest';
import { readFileSync } from 'fs';
import { join } from 'path';

const tsConfigPath = join(process.cwd(), 'tsconfig.json');
const tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf-8'));

const config = createJestConfig({
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  rootDir: './',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
});

export default config;
