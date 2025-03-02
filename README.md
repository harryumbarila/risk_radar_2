# Denali

[![forthebadge made-with-typescript](https://img.shields.io/badge/made_with-typescript-3078c6?labelColor=fff&style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![forthebadge made-with-typescript](https://img.shields.io/badge/made_with-javascript-%23F7DF1E?labelColor=000&style=for-the-badge&logo=javascript)](https://www.javascript.com)
[![forthebadge react-framework](https://img.shields.io/badge/made_with-React-61dafb?labelColor=32363e&style=for-the-badge&logo=react&logoColor=%2361DAFB&logoWidth=30)](https://reactjs.org/)
![Next JS](https://img.shields.io/badge/made_with-Next-black?style=for-the-badge&logo=next.js&logoColor=white)
[![forthebadge uses-husky](https://img.shields.io/badge/uses-Husky-ececec?labelColor=32363e&style=for-the-badge&logo=)](https://typicode.github.io/husky/)
[![forthebadge commitizen-friendly](https://img.shields.io/badge/commitizen-friendly-green?labelColor=32363e&style=for-the-badge&logo=git)](https://www.npmjs.com/package/commitizen)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)

Internal Dashboard for Talus, which integrates crecentview, risk radar, yellow
check.

- **Project Status:** In early development.

## Table of Contents

- [Tech Stack](#tech-stack-)
- [Prerequisites](#prerequisites-)
- [Version Control](#version-control-)
  - [Getting Started](#getting-started)
  - [Gitflow Workflow](#gitflow-workflow)
  - [Commit Formatting](#commit-formatting)
- [Project Development](#project-development-)
  - [Project Concepts: `workspaces`](#project-concepts-workspaces)
    - [`ui`](#ui)
    - [`web`](#web)
  - [Project Scripts](#project-scripts)
    - [`yarn workspace [package_name] add [dependencies]`](#yarn-workspace-packagename-add-dependencies)
    - [`yarn [script] --filter=[workspace]`](#yarn-script---filterworkspace)
    - [`yarn dev`](#yarn-dev)
    - [`yarn dev --filter=web`](#yarn-dev---filterweb)
    - [`yarn format`](#yarn-format)
    - [`yarn test`](#yarn-test)
    - [`yarn type-check`](#yarn-type-check)
    - [`yarn build`](#yarn-build)

# Tech Stack 🛠️

Exclusively relies on [Next.js](https://nextjs.org/) with

# Prerequisites 🔗

- **_Node.js_** version: >= 18.x
- **_Yarn CLI (Classic)_** (optional) version: >= 1.x

# Version Control 🔖

In terms of version control procedures will have in considerations the following
specifications in order to create a clean git log with the best practices known.

## Gitflow Workflow

For the workflow of the project in terms of creation of new features, bugs, and
other important aspect in the development or maintenance of project we will
based our operations applying the Gitflow branching model from which if you need
to refresh the concepts behind it you could look at the following resources.

**References:**

- [Gitflow Documentation](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow#:~:text=The%20overall%20flow%20of%20Gitflow,branch%20is%20created%20from%20main&text=When%20a%20feature%20is%20complete%20it%20is%20merged%20into%20the,branch%20is%20created%20from%20main)
- [Gitflow Utility CLI Tool](https://danielkummer.github.io/git-flow-cheatsheet/)

## Commit Formatting

For the commit formatting we'll going to follow through the recommendations of
Conventional commits in relation with Gitmoji to create the most specific and
recognizable as to read commits. This well handle the code review to be less
expensive time wise and provide us a good understand of all the members of the
team.

**References:**

- [Conventional Commits v1.0](https://www.conventionalcommits.org/en/v1.0.0/#summary)
- [Gitmoji Reference Book](https://gitmoji.dev/)

## Getting Started

In order to prepare your development setup right away first we must make sure to
have the proper info that we need for the project to work properly.

1. **First** we must confirm our _**node**_ version through the command
   `node -v`

2. Once you confirm to possess `node v18.x` make sure that you have `yarn` as a
   global dependency of your environment. To do so, run `npm install -g yarn`
   where `-g` represents as a flag environment variable that means a global
   installation for `npm`.

3. After installing _**yarn**_ run the script in the project `yarn install` or
   just `yarn` to install the _`node_modules/`_ with all the dependencies needed
   for the web app, this location of the project its called **root** and is
   often referred as `/` which is the home of the project sort of speak.

4. After installing _**yarn**_ dependencies, we proceed in building a `.env`
   file, for this purposes you are free to copy `.env.example` and renamed it to
   the previous mentioned file.

5. Once the dependencies of the **root** directory are setup alongside with the
   `.env` file, proceed to build the needed packages:

```bash

yarn build --filter=@denali/ui

```

7. Finally, test out your local instance of the web app:

```bash
## If yout want to run only the web app
yarn build --filter=@denali/ui

## If you want to run all packages that support dev mode
yarn dev
```

_P.S. In order to check accordingly debug errors at the TURBO console for the
project, you should establish your in your env variables the following value:_

```env
SENTRY_IGNORE_API_RESOLUTION_ERROR=1
```

_This value will help to ease the TURBO console consistent debug error from the
actual errors that you are possibly debugging in App. Only is meant to used for
development purposes, this value is cancelled and not accepted at all in an
`.env` file at production apps in any kind._

And that would be it. This steps would be updated if any possible configuration,
previous configuration is needed for continuing the development of the project.

# Project Development 👨‍💻

## Project Concepts: `workspaces`

This project makes use of `yarn workspaces` to enhance modularity and
reusability of the code, the following packages are part of the repo:

### `ui`

This packages serve as a supplementary library of our own custom components
provided for the web application in which the whole purpose of this library is
to establish a better maintainability approach and discharge responsibility of
the main app from the utilitarian collection of components.

### `web`

This package is basically the web application in which we developed and
customized as needed due requirements.

### `shared`

The `shared` package contains TypeScript types that are shared across multiple
apps or other packages within the project. It follows the TypeScript module
structure to ensure consistency and reusability across the codebase.

#### Example Directory Structure:

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

#### Example Usage:

**`shared/src/data/user.ts`**

```ts
export type User = {
  id: string;
  name: string;
  email: string;
};
```

**`shared/src/data/index.ts`**

```ts
export * from './user';
export * from './product';
```

**`shared/src/index.ts`**

```ts
export * from './data';
```

**Usage in Another Package:**

```ts
import { User } from '@denali/shared';

const newUser: User = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
};
```

This structure helps keep type definitions centralized, making it easier to
maintain and scale your project. 🚀

## Project Scripts

In the project directory, you can run using the alternative node package manager
`yarn` the following commands:

### `yarn workspace [package_name] add [dependencies]`

This script is made for install dependencies to an specific section or segment
of our monorepo project. Replace `[package_name]` by `web` or `ui` for example.
And same would go for `[dependencies]` in replacing by any needed npm dependency
that we would like to download for our project.

### `yarn [script] --filter=[workspace]`

Runs the desired `[script]` only in the specified `[workspace]`

### `yarn dev`

This command executes the development environment setup for all supported
packages and applications within the project. It initiates the necessary
processes for local development, such as starting development servers, watching
for changes, and enabling hot reloading where applicable.

### `yarn dev --filter=@denali/web`

Runs only the web app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will be handled through NextJS Framework runtime context.

### `yarn format`

Format all the files within the project, including packages and the web app.

### `yarn test`

This command runs test suites for packages that include or support tests,
ensuring the integrity and functionality of the codebase.

### `yarn type-check`

Perform a type check in all supported packages using the TypeScript compiler.
This command helps catch type-related errors and ensures type safety across the
project.

### `yarn build`

Builds the app for production to the `build` folder.
