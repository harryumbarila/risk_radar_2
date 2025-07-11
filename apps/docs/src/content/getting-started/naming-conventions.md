# Directory & File Naming Conventions

Consistent naming improves **readability, maintainability, and cross-platform
compatibility**. Follow these conventions to ensure uniformity across the
project.

---

## 📁 Directory & File Naming

🔹 Use **kebab-case** (lowercase with hyphens) for all **files and
directories**:  
✅ **Recommended:** `user-profile.ts`, `api-routes/`, `auth-service/`,
`use-merchant-data.ts`, `switch-button.tsx`  
❌ **Avoid:** `UserProfile.ts`, `userProfile.ts`,
`apiRoutes/`,`useMerchantData.ts`, `SwitchButton.tsx`

### Why kebab-case?

✔ **Case-sensitive safe** – Prevents issues in case-sensitive file systems
(e.g., Linux).  
✔ **Git-friendly** – Avoids unnecessary file renaming when switching OS.  
✔ **Consistent** – Ensures uniformity across different environments and
command-line operations.  
✔ **Readable** – Improves clarity and readability, making file and directory
names easier to understand at a glance.

---

## 📦 Backend (NestJS API)

NestJS follows **PascalCase** for classes, DTOs, and providers, while using
**kebab-case** for files.

| Type            | Naming Convention       | Example              |
| --------------- | ----------------------- | -------------------- |
| **Modules**     | `feature.module.ts`     | `user.module.ts`     |
| **Controllers** | `feature.controller.ts` | `user.controller.ts` |
| **Services**    | `feature.service.ts`    | `user.service.ts`    |

---

## 🎨 Frontend (React & Next.js)

| Type           | Naming Convention             | Example        |
| -------------- | ----------------------------- | -------------- |
| **Components** | `PascalCase`                  | `UserProfile`  |
| **Hooks**      | `camelCase` with `use` prefix | `useAuth`      |
| **Context**    | `PascalCase`                  | `AuthProvider` |

🔹 **React components** must use **PascalCase** to differentiate them from
regular functions.  
🔹 **Hooks** should follow the `useCamelCase` convention.

---

## 🔧 Functions, Variables, and Constants

| Type          | Naming Convention  | Example              |
| ------------- | ------------------ | -------------------- |
| **Functions** | `camelCase`        | `fetchUserData()`    |
| **Variables** | `camelCase`        | `userName`           |
| **Constants** | `UPPER_SNAKE_CASE` | `MAX_LOGIN_ATTEMPTS` |

---

## 🔑 Key Takeaways

✅ Use **kebab-case** for files and directories.  
✅ **NestJS** follows **PascalCase** for classes and **kebab-case** for files.  
✅ **React components** use **PascalCase**, hooks use **camelCase**.  
✅ **Functions & variables** use `camelCase`, while constants use
`UPPER_SNAKE_CASE`.

By following these conventions, we ensure **consistency, maintainability, and
cross-platform compatibility**. 🚀
