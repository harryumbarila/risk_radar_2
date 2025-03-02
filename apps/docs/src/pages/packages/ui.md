# UI Components Package

The `ui` package contains shared **React components** and common **TailAdmin**
components used across frontend applications. This ensures **consistency** and
**reusability** throughout the codebase.

---

## 📂 Directory & File Structure

🔹 We recommend using **kebab-case** for file and directory names to ensure:

- ✅ **Better readability.**
- ✅ **Avoidance of issues** with case-insensitive file systems (e.g., macOS &
  Windows).
- ✅ **Prevention of Git misidentifying renames.**
- ✅ **Consistency** across different environments & command-line operations.

### 📌 Example Directory Structure:

```text
ui/
│── src/
│   ├── common/
│   │   ├── accordions/
│   │   ├── avatars/
│   │   ├── buttons/
│   │   │   ├── button.tsx
│   │   │   ├── index.ts
│   │   ├── cards/
│   │   ├── checkboxes/
│   │   ├── index.ts
│   ├── navigation/
│   │   ├── user-nav.tsx
│   │   ├── index.ts
│   ├── index.ts
│── package.json
│── tsconfig.json
```

---

## ✨ Adding a New Component

When adding a new component, follow these steps:

#### 1️⃣ Create the component file (`ui/src/common/buttons/button.tsx`):

```tsx
import React from 'react';

type ButtonProps = {
  label: string;
  onClick: () => void;
};

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button onClick={onClick} className="btn">
      {label}
    </button>
  );
};
```

#### 2️⃣ Export the component in its folder (`ui/src/common/buttons/index.ts`):

```ts
export * from './button';
```

#### 3️⃣ Link it in the main index file (`ui/src/index.ts`):

```ts
export * from './common/buttons';
export * from './navigation';
```

---

## 📌 Using UI Components in Another Package

When using components in another project, you can import them directly or
configure TypeScript paths to simplify imports.

```tsx
import { Button } from '@denali/ui';
// or if using TypeScript path aliases:
import { Button } from '@/ui/common/buttons';

const MyComponent = () => {
  return <Button label="Click Me" onClick={() => alert('Hello!')} />;
};
```

---

This structure keeps components **centralized**, making the project easier to
maintain and scale. 💡
