# Shared TypeScript Configuration Files

The `@denali/typescript-configs` package provides shared TypeScript
configuration files to ensure consistency and reduce duplication across
projects. You can extend these configs in your package or application for a
streamlined setup.

---

## 📦 Available Configurations

These are the available TypeScript configurations you can extend based on your
project type:

### ✅ Recommended for Extension

- **`library`** → For Node.js libraries.
- **`node`** → For backend applications running on Node.js.
- **`react-library`** → For React-based libraries that share components, hooks,
  etc.
- **`nextjs`** → For Next.js applications.

### ⚠️ Not Recommended for Direct Extension

- **`base`** → A minimal TS configuration that all other configs extend. You can
  use this as a foundation to create a custom config, but it is **not
  recommended** to extend directly.

---

## 🔧 How to Extend a Configuration

To extend a shared TypeScript config in your package or app, update your
`tsconfig.json`:

```json
{
  "extends": "@denali/typescript-configs/node.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

You can override or customize specific TypeScript rules to fit your needs.

---

## 📥 Installing the Shared Config Package

Ensure the `@denali/typescript-configs` package is installed as a **dev
dependency**:

```sh
yarn workspace @denali/<app> add -D @denali/typescript-configs
```

or, in `package.json`:

```json
{
  "devDependencies": {
    "@denali/typescript-configs": "*"
  }
}
```

---

By using these shared configurations, you maintain **consistency, reduce setup
time, and improve maintainability** across the monorepo. 🚀
