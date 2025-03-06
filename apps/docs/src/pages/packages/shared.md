# Shared Types Package

The `shared` package contains **TypeScript types** that are used across multiple
applications and packages within the project. It follows a modular structure to
ensure **consistency** and **reusability** across the codebase.

---

## 📂 Directory & File Structure

🔹 We recommend using **kebab-case** for file and directory names. This ensures:

- ✅ Better readability.
- ✅ Avoidance of issues with case-insensitive file systems (e.g., macOS &
  Windows).
- ✅ Prevention of Git misidentifying renames.
- ✅ Consistency across different environments & command-line operations.

### 📌 Example Directory Structure:

```text
shared/
│── src/
│   ├── data/
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── index.ts
│   ├── index.ts
│── package.json
│── tsconfig.json
```

---

## ✨ Adding a New Type

When adding a new type, follow these steps:

1️⃣ **Create a corresponding file inside the related folder** (e.g., `data/`).  
2️⃣ **Export the new type in `index.ts` inside that folder.**  
3️⃣ **Link it to the main export (`shared/src/index.ts`).**

### 📌 Example:

#### **📝 `shared/src/data/user.ts`**

```ts
export type User = {
  id: string;
  name: string;
  email: string;
};
```

#### **🔗 `shared/src/data/index.ts`**

```ts
export * from './user';
export * from './product';
```

#### **🌍 `shared/src/index.ts`**

```ts
export * from './data';
```

---

## 📌 Using the Shared Types in Another Package

When using the shared types in another project, you can import them directly or
configure TypeScript paths to simplify imports.

```ts
import { User } from '@denali/shared';
// or if using TypeScript path aliases:
import { User } from '@/shared/users/dto/user-data';

const newUser: User = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
};
```

This structure keeps type definitions **centralized**, making it easier to
maintain and scale the project. 💡
