# How to Create a New Package

Follow these steps to create a new package within the monorepo. This ensures
consistency, maintainability, and ease of integration.

---

## 1. Navigate to the Packages Directory 📂

Move into the `packages/` folder to create your new package:

```shell
cd packages
```

## 2. Create a New Folder for Your Package ✨

```sh
mkdir my-new-package
cd my-new-package
```

## 3. Initialize the Package 📦

Generate a `package.json` file:

```shell
yarn init -y
```

This will create a minimal package setup. Update the `package.json` file as
needed. Ensure the package name follows the monorepo's naming conventions
(`@denali/<name>`).

---

## 4. Set Up TypeScript Configuration 🔧

If your package uses TypeScript, add a `tsconfig.json` file. You can extend from
the shared [**Denali TypeScript configs**](../configs/typescript-configs.md) to
maintain consistency across the monorepo:

```json
{
  "extends": "@denali/typescript-configs/node.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

For packages that require separate build configurations, also create a
`tsconfig.build.json`:

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["tests", "**/*.test.ts"]
}
```

You can customize compiler options as needed for your specific package.

---

## 5. Set Up ESLint Configuration 🎨

To ensure consistent code quality, add an `.eslintrc.json` file. Extend from the
[**shared Denali ESLint configs**](../configs/eslint-configs.md) to inherit best
practices:

```json
{
  "extends": "@denali/eslint-configs/node-ts",
  "rules": {
    "no-console": "warn"
  }
}
```

You can override or add specific ESLint rules depending on the package’s needs.

---

## 6. Install Dependencies 📥

Add necessary dependencies:

```shell
yarn add some-dependency
yarn add --dev some-dev-dependency
```

---

## 7. Write Your Code 📝

- Place your source files inside a `src/` directory.
- Ensure all public exports are available through `index.ts`.

```ts
// packages/my-new-package/src/my-function.ts
export const myFunction = () => {
  return true;
};
```

```ts
// packages/my-new-package/src/index.ts
export * from './my-function';
```

---

## 8. Configure Package Scripts 🔨

If required, add scripts to `package.json`:

```json
{
  "scripts": {
    "build": "tsc"
  }
}
```

---

## 9. Link the Package Within the Monorepo 🔗

Ensure it's recognized by Yarn Workspaces:

```shell
yarn workspace my-new-package run <script>
```

---

## 10. Test the Package ✅

- Set up a testing framework like **Jest** to ensure reliability. See more about
  [setting up testing](../testing/adding-tests-to-new-package.mdØ)

---

## 11. Document the Package 📚

- Add relevant data into the [introduction](../) documentation.
- Update the project documentation in `apps/docs` as needed. See more about
  [contributing to documentation](../contributing/to-documentation.md)

---

✅ That's it! You’ve successfully created a new package within the monorepo! 🎉
