# Denali

[![forthebadge made-with-typescript](https://img.shields.io/badge/made_with-typescript-3078c6?labelColor=fff&style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![forthebadge made-with-typescript](https://img.shields.io/badge/made_with-javascript-%23F7DF1E?labelColor=000&style=for-the-badge&logo=javascript)](https://www.javascript.com)
[![forthebadge react-framework](https://img.shields.io/badge/made_with-React-61dafb?labelColor=32363e&style=for-the-badge&logo=react&logoColor=%2361DAFB&logoWidth=30)](https://reactjs.org/)
![Next JS](https://img.shields.io/badge/made_with-Next-black?style=for-the-badge&logo=next.js&logoColor=white)
[![forthebadge uses-husky](https://img.shields.io/badge/uses-Husky-ececec?labelColor=32363e&style=for-the-badge&logo=)](https://typicode.github.io/husky/)
[![forthebadge commitizen-friendly](https://img.shields.io/badge/commitizen-friendly-green?labelColor=32363e&style=for-the-badge&logo=git)](https://www.npmjs.com/package/commitizen)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)

## Overview 🚀

Denali is an internal dashboard for **Talus**, integrating multiple applications
such as **CrescentView**, **Risk Radar**, and **Yellow Check**. It provides a
scalable and maintainable monorepo structure, leveraging modern development
tools.

- **Project Status:** 🚧 In early development.
- **Tech Stack:** Next.js, NestJS, TypeScript, React, Node.js, Yarn Workspaces,
  and Turborepo.

## 📖 Documentation

The documentation is powered by **Nextra**. It includes detailed information on
project structure, packages, and setup guides.

### 📌 Getting Started with Documentation

To install dependencies, run:

```sh
yarn
# or
yarn install
```

Then, start the documentation app with:

```sh
yarn docs
```

This will launch the documentation server, accessible at
[`localhost:3005`](http://localhost:3005), where you can explore all sections,
guides, and references.

## 🏗 Project Structure

Denali follows a monorepo structure using **Yarn Workspaces** and **Turborepo**
for optimized builds. The key directories include:

```
Root
├── .github           # GitHub Actions & workflows
├── .husky            # Git hooks for commit linting & formatting
├── apps              # Main applications (web & API)
│   ├── web           # Next.js frontend
│   ├── api           # NestJS backend
├── configs           # Shared configurations (ESLint, TypeScript, Jest)
│   ├── eslint-config
│   ├── jest-config
│   ├── typescript-config
├── docker            # Docker-related files
├── packages          # Reusable packages and shared modules
│   ├── ui            # Shared UI components (TailwindCSS-based)
│   ├── shared        # Common types & utilities
├── docs              # Documentation source (Nextra-powered)
├── package.json      # Root package.json (manages workspaces)
├── turbo.json        # Turborepo config for caching & task running
├── README.md         # This file 📌
```

For support or questions, check the documentation or open an issue. Happy
coding! 🚀
