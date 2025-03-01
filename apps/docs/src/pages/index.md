# Introduction

Welcome to **Denali**! 🎉

This monorepo powers the internal **Talus Dashboard**, integrating
**CrescentView**, **Risk Radar**, and **Yellow Check** into a unified, scalable,
and maintainable structure.

Built with **modern tools** like:  
✅ **Turborepo** for optimized builds  
✅ **Yarn Workspaces** for efficient package management  
✅ **TypeScript** for type safety  
✅ **Modular Architecture** for reusability and scalability

Let’s dive into the key components! 👇

---

## 🏗️ Project Structure

```
Root
├── .github        # 🤖 GitHub Workflows & Actions
├── .husky         # 🔧 Git Hooks for Code Quality
├── apps           # 🏛️ Core Applications (Frontend & Backend)
│   ├── web        # 🎨 Next.js Frontend
│   ├── api        # ⚙️ NestJS Backend
├── configs        # ⚙️ Shared Configurations (ESLint, Jest, TS)
│   ├── eslint-config
│   ├── jest-config
│   ├── typescript-config
├── docker         # 📦 Docker Configurations
├── packages       # 📦 Shared Libraries & Modules
│   ├── ui         # 🎨 Reusable UI Components
│   ├── shared     # 🔄 Shared Types & Utilities
├── [root files]   # 📑 Other config files
```

---

## 📦 Applications (`apps/`)

| App                       | Description                                                       |
| ------------------------- | ----------------------------------------------------------------- |
| **🖥️ [web](./apps/web/)** | The **Next.js frontend** responsible for UI & client interactions |
| **⚙️ [api](./apps/api/)** | The **NestJS backend**, handling business logic & data operations |

---

## 📂 Reusable Packages (`packages/`)

| Package                             | Description                                                     |
| ----------------------------------- | --------------------------------------------------------------- |
| **🎨 [ui](./packages/ui/)**         | Reusable UI components, styled with **TailwindCSS**             |
| **🔄 [shared](./packages/shared/)** | Centralized **types & utilities** for type safety & consistency |

---

## ⚙️ Shared Configurations (`configs/`)

| Config                                                    | Description                                         |
| --------------------------------------------------------- | --------------------------------------------------- |
| **🔍 [eslint-config](./configs/eslint-configs/)**         | Shared **ESLint rules** for consistent code quality |
| **🛠️ [typescript-config](./configs/typescript-configs/)** | TypeScript settings for a unified dev experience    |
| **🧪 [jest-config](./configs/jest-configs/)**             | Pre-configured **Jest settings** for testing        |

---

## 📑 Root Files

The **root directory** contains essential configuration files to **maintain
consistency, enforce best practices, and streamline workflows**:

| File                      | Purpose                                                    |
| ------------------------- | ---------------------------------------------------------- |
| 📝 **.commitlintrc.json** | Enforces **conventional commit messages**                  |
| ✍️ **.czrc**              | Configures **Commitizen** for commit guidance              |
| 🚫 **.gitignore**         | Defines files ignored by **Git**                           |
| 🔍 **.lintstagedrc.cjs**  | Runs linters on **staged files** before committing         |
| ✨ **.prettierrc.json**   | Defines **Prettier formatting rules**                      |
| 🚀 **turbo.json**         | **Turborepo configuration** for build optimization         |
| 📜 **package.json**       | Stores **project metadata, dependencies & scripts**        |
| 🔐 **yarn.lock**          | Locks dependency versions for **consistent installations** |

---

## 🔑 Key Takeaways

✅ **Monorepo-powered by Turborepo** for efficiency ⚡  
✅ **Shared logic lives in `packages/`** for reusability ♻️  
✅ **Modular applications in `apps/`** for scalability 🏗️  
✅ **Centralized CI/CD and configurations** for easy maintenance 📦

📌 _For more details, refer to the specific documentation for each package and
application in the project._

Happy coding! 🎉🚀
