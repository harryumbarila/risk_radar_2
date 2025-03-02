# How to Add a New Application

Follow these steps to create a new application within the monorepo. This ensures
consistency, maintainability, and ease of integration.

---

## 1. Navigate to the Apps Directory 📂

Move into the `apps/` folder to create your new application:

```shell
cd apps
```

## 2. Create a New Folder for Your Application ✨

```sh
mkdir my-new-app
cd my-new-app
```

## 3. Initialize the Application 🚀

Use the appropriate template based on your application type (e.g., Next.js,
NestJS, Express):

```shell
npx create-next-app@latest .
```

This sets up the application with the necessary dependencies and configuration.
Ensure the application name follows the monorepo’s naming conventions
(`@denali/<name>`).

---

## 4. Configure Scripts 🔨

If required, add scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

Customize scripts as needed for your application type.

---

## 5. Set Up TypeScript Configuration 🔧

Ensure TypeScript is correctly configured by adding a `tsconfig.json` file. You
can extend from the shared
[**Denali TypeScript configs**](../configs/typescript-configs.md):

```json
{
  "extends": "@denali/typescript-configs/app.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

For applications that require separate build configurations, also create a
`tsconfig.build.json`:

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["tests", "**/*.test.ts"]
}
```

---

## 6. Set Up ESLint Configuration 🎨

To ensure consistent code quality, add an `.eslintrc.json` file. Extend from the
[**shared Denali ESLint configs**](../configs/eslint-configs.md):

```json
{
  "extends": "@denali/eslint-configs/app",
  "rules": {
    "no-console": "warn"
  }
}
```

---

## 7. Install Dependencies 📥

Add necessary dependencies:

```shell
yarn add some-dependency
yarn add --dev some-dev-dependency
```

---

## 8. Link Shared Packages 🔗

Use Yarn Workspaces to link shared packages within the monorepo:

```shell
yarn workspace @denali/<name> add @denali/ui
```

---

## 9. Run the Application ▶️

Start the development server:

```shell
yarn dev
```

---

## 10. Test the Application ✅

- Set up a testing framework like **Jest** to ensure reliability. See more about
  [setting up testing](../testing/adding-tests-to-new-app.md).

---

## 11. Document the Application 📚

- Add relevant data into the [introduction](../) documentation.
- Update the `apps/docs` directory with relevant information about your new
  application. See more about
  [contributing to documentation](../contributing/to-documentation.md).

---

✅ That's it! You’ve successfully added a new application to the monorepo! 🎉
