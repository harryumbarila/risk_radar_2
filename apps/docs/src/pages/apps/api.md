# Denali API

This is the backend service powering the **Denali Web App**, built using
**NestJS** with a modular and scalable architecture. It follows **RESTful
principles** and ensures **high performance, security, and maintainability**. 🚀

---

## 📌 Features

✅ **NestJS Framework** – Modular, scalable, and highly maintainable.  
✅ **RESTful API** – Follows best practices for structured endpoints.  
✅ **TypeScript & Strong Typing** – Ensuring type safety across the project.  
✅ **Jest for Testing** – Comprehensive unit testing for stability.

---

## 🚀 Getting Started

### 📦 Dependencies & Setup

This app is powered by **Yarn Workspaces** for efficient package management.
Check out our
[**Quickstart Guide**](../getting-started/development-quickstart.md) for a
smooth setup and development experience!

---

### 🔧 Running in Development Mode

To start the development server, run:

```bash
yarn dev
```

This will launch the **NestJS** server, making your API available at
`http://localhost:3001/`.

---

### 🏗️ Building for Production

To generate an optimized production build, run:

```bash
yarn build
```

This will compile the **TypeScript** files into the `dist/` directory.

---

### 🚀 Running in Production Mode

Once the build is complete, start the production server with:

```bash
yarn start
```

Your API will now be running in production mode. 🎯

---

## 🔧 Project Structure

```text
api/
├── src/
│   ├── modules/         # Feature modules (e.g., users, products, auth)
│   │   ├── user/        # User module (controller, service, DTOs, etc.)
│   │   ├── auth/        # Authentication module (NextAuth integration)
│   │   ├── common/      # Shared utilities (filters, guards, pipes, etc.)
│   ├── main.ts          # API entry point
│   ├── app.module.ts    # Root application module
├── tests/               # Unit tests with Jest
├── .env.example         # Environment variables template
├── package.json         # Dependencies & scripts
├── [root files]         # Configuration files (e.g., ESLint, Jest, etc.)
```

---

## 🤝 Contributing

Check out our **[Contribution Guidelines](../contributing/to-backend.md)** to
start contributing to the backend.

---

## 📚 Useful Resources

📌 **Official Documentation:**

- [NestJS Docs](https://docs.nestjs.com/) - Learn how to build with NestJS.
- [Jest Docs](https://jestjs.io/) - Testing framework for unit tests.
- [Swagger Docs](https://swagger.io/) - API documentation generation.

---
