# Shared Jest Configuration Files

The `@denali/jest-config` package provides **pre-configured Jest setups** for
different project types, making it easy to integrate **consistent and optimized
testing** across the monorepo.

---

## 📦 Available Configurations

Choose the appropriate Jest configuration based on your project type:

- **`jest-node`** → Jest configuration for **Node.js applications or packages**.
- **`jest-nextjs`** → Jest configuration for **Next.js applications**.
- **`jest-react`** → Jest configuration for **React applications or packages**.

---

## 🔧 How to Use a Jest Config

To use a shared Jest configuration, import it in your `jest.config.ts` (or
`jest.config.js`):

```ts
import createJestConfig from '@denali/jest-config/jest-nextjs';

const config = createJestConfig({
  // Custom Jest options
});

export default config;
```

You can **pass additional Jest options** inside the `createJestConfig` function
to customize the setup for your application.

---

## 📥 Installing the Shared Jest Config Package

Ensure the `@denali/jest-config` package is installed as a **dev dependency**:

```sh
yarn add --dev @denali/jest-config
```

or, in `package.json`:

```json
{
  "devDependencies": {
    "@denali/jest-config": "*"
  }
}
```

---

By using these shared Jest configurations, you ensure **a streamlined and
standardized testing environment** across the monorepo. 🚀
