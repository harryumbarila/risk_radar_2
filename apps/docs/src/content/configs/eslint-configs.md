# Shared ESLint Configuration Files

The `@denali/eslint-config` package provides shared ESLint configurations to
maintain **consistent code quality** across projects. These configurations help
enforce best practices and reduce setup time.

---

## 📦 Available Configurations

Choose the appropriate ESLint configuration based on your project type:

### ✅ Recommended for Extension

- **`node-ts`** → ESLint rules for Node.js applications using TypeScript.
- **`nextjs-ts`** → ESLint rules for Next.js apps using TypeScript.
- **`react-ts`** → ESLint rules for React applications using TypeScript.
- **`jest-overrides`** → ESLint rules for Jest in Node.js applications.
- **`jest-react-overrides`** → ESLint rules for Jest in React applications.

### ⚠️ Not Recommended for Direct Extension

- **`base`** → The core ESLint config that all other configs extend. It mainly
  enforces JavaScript rules.
- **`base-ts`** → A base ESLint config that extends `base` and adds
  TypeScript-specific rules. It is **not recommended** to extend directly.

---

## 🔧 How to Extend a Configuration

To extend a shared ESLint config, update your `.eslintrc.js`:

```js
module.exports = {
  extends: [
    '@denali/eslint-config/nextjs-ts',
    '@denali/eslint-config/jest-react-overrides',
  ],
};
```

You can **override specific rules** as needed to fit your project’s
requirements.

---

## 📥 Installing the Shared Config Package

Ensure the `@denali/eslint-config` package is installed as a **dev dependency**:

```sh
yarn add --dev @denali/eslint-config
```

or, in `package.json`:

```json
{
  "devDependencies": {
    "@denali/eslint-config": "*"
  }
}
```

---

By using these shared ESLint configurations, you ensure **code consistency,
maintainability, and adherence to best practices** across the monorepo. 🚀
