# Development Quickstart

To set up your development environment, follow these steps to ensure everything
is properly configured.

#### 1. Verify Node.js Version 🔍

Ensure you have Node.js `>= 22` installed by running:

```shell
node -v
```

You should see an output like:

```shell
❯ node -v
v22.14.0
```

#### 2. Install Yarn 📥

Make sure Yarn is installed globally:

```shell
npm install -g yarn
```

Verify the installation by checking the version:

```shell
yarn -v
```

You should see an output like:

```shell
❯ yarn -v
1.22.22
```

#### 3. Install Dependencies 📦

Navigate to the project root and install all required dependencies:

```shell
yarn install
```

Alternatively, you can simply run:

```shell
yarn
```

#### 4. Configure Environment Variables 🔧

Each application requires a `.env` file. Use the provided `.env.example` files
as templates. Copy and rename them to `.env`, then update the values as needed.

#### 5. Run the Applications 🚀

Once everything is set up, you can start all applications simultaneously with:

```shell
yarn dev
```

To run a specific application individually, use:

```shell
yarn workspace @denali/web dev
```

✅ That's it! Your development environment is now ready.

---

_This guide will be updated if any additional configuration steps are required._
