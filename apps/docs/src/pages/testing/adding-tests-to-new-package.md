# Adding Tests to a New Package

When creating a new package, it's crucial to **add tests** to maintain code
quality and prevent regressions. This guide will walk you through setting up
**Jest** for different types of packages.

---

## ⚙️ Setting Up Jest

### 📦 Install Dependencies

Depending on your package type, install the required dependencies in
`package.json`.

#### 📝 For **pure TypeScript** projects:

```json
{
  "devDependencies": {
    // ...other deps
    "@denali/jest-config": "*",
    "@types/jest": "^29.5.12",
    "ts-jest": "^29.2.4"
  }
}
```

#### ⚛️ For **React** projects:

```json
{
  "devDependencies": {
    // ...other deps
    "@denali/jest-config": "*",
    "@testing-library/dom": "^10.4.0",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/jest": "^29.5.12",
    "jest": "^29.7.0",
    "ts-jest": "^29.2.4"
  }
}
```

#### 🌍 For **Next.js** projects:

(Same as React, but also add the `jest-environment-jsdom` package)

```json
{
  "devDependencies": {
    // ...other deps
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

---

## 📁 Project Structure

Ensure your package has a **jest.config.ts** file at its root:

```text
/packages
  ├── example/
  │    ├── src/
  │    ├── jest.config.ts
  │    └── [other files]
```

---

## 🛠️ Configuring Jest

We have predefined Jest configurations in the `@denali/jest-config` package:

- **`jest-node.ts`** → For pure TypeScript packages
- **`jest-react.ts`** → For React packages
- **`jest-nextjs.ts`** → For Next.js projects

_See more about [shared Jest configurations](../configs/jest-configs.md)_

### 📝 Example Jest Config for a **Node.js (TypeScript) package**:

```ts
// packages/mailing/jest.config.ts
import jestConfig from '@denali/jest-config/jest-node';
import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import tsConfig from './tsconfig.json';

const config: JestConfigWithTsJest = {
  ...jestConfig,
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  rootDir: './',
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  modulePaths: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
```

---

## 📌 Creating Tests

### 🏗️ Add a `tests` folder to your package:

```text
/packages
  ├── example/
  │    ├── src/
  │    ├── tests/
  │    ├── jest.config.ts
  │    └── [other files]
```

### 📝 Add a **dummy test** file (`tests/dummy.spec.ts`):

```ts
it('dummy test, delete after adding real tests', () => {
  expect(2 + 2).toBe(4);
});
```

✅ **Why a dummy test?** Jest **won't generate coverage reports** unless at
least one test exists. This ensures your setup is correct!

---

## 🚀 Running Tests

Add these **test scripts** to `package.json`:

```json
{
  "scripts": {
    "test:unit": "jest --verbose",
    "test:cov": "cross-env COLLECT_COVERAGE=true jest --verbose --runInBand"
  }
}
```

### 🔹 Script Breakdown:

- **`test:unit`** → Runs unit tests.
- **`test:cov`** → Runs tests **with coverage reports**.
  - `COLLECT_COVERAGE=true` ensures coverage data is generated.
  - `--runInBand` forces Jest to run tests sequentially.
    - 🔥 **Why?** Jest and Turbo run tasks in parallel. Without this flag, both
      will try to parallelize, **causing a slowdown** (e.g., 12+ minutes vs.
      ~30s).

---

## 🎯 Final Notes

- ✅ **Follow this setup for every new package** to ensure **consistent and
  reliable testing**.
- ⚡ **Leverage Jest’s built-in features** for mocking, snapshots, and async
  testing.
- 🚀 **Aim for high test coverage** to improve stability and maintainability!

Happy testing! 🧪✨
