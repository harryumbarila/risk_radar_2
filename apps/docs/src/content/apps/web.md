# Denali Web App

This is the main web application built using the **TailAdmin** template, styled
with **Tailwind CSS**, and powered by **Next.js**. This is the app that users
will interact with. 🚀

---

## 📌 Features

✅ **Built with Next.js** – Fast, scalable, and SEO-friendly.  
✅ **Tailwind CSS** – Utility-first styling for easy customization.  
✅ **Modern UI** – Based on TailAdmin for a sleek and professional design.  
✅ **Optimized for Performance** – Ensuring smooth user experience.  
✅ **Modular & Maintainable** – Structured for scalability and reusability.

---

## 🚀 Getting Started

### 📦 Dependencies & Setup

This app is powered by **Yarn Workspaces** for efficient package management.
Check out our
[**Quickstart Guide**](../getting-started/development-quickstart.md) for a
smooth setup and development experience!

---

### 🔧 Development Mode

To start the development server, run:

```bash
yarn dev
```

This will launch the Next.js development server. Open your browser and navigate
to `http://localhost:3000/` to see the app in action.

---

### 🏗️ Building for Production

To create an optimized production build, run:

```bash
yarn build
```

This will generate an optimized output in the `.next/` directory.

---

### 🚀 Running in Production Mode

Once the build is complete, start the production server with:

```bash
yarn start
```

Your app will now be running in production mode. 🎯

---

## 🔧 Project Structure

```text
web-app/
├── src/
│   ├── app/            # App Router structure (server & client components)
│   │   ├── layout.tsx  # Root layout component
│   │   ├── page.tsx    # Main entry page
│   │   ├── (routes)/   # Other routes and nested layouts
│   ├── components/     # Reusable UI components
│   ├── styles/         # Global styles
│   ├── utils/          # Utility functions & helpers
├── public/             # Static assets (images, favicons, etc.)
├── tests/              # Unit tests
├── cypress/            # E2E tests
├── .env.example        # Environment variables template
├── package.json        # Dependencies & scripts
├── [root files]        # Configuration files (e.g., ESLint, Jest, Cypress, etc.)
```

---

## 🤝 Contributing

Check out our **[Contribution Guidelines](../contributing/to-frontend.md)** to
get started contributing.

---

## 📚 Useful Resources

📌 **Official Documentation:**

- [Next.js Docs](https://nextjs.org/docs) - Learn how Next.js works.
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Styling with Tailwind.
- [React Docs](https://react.dev/) - Learn the fundamentals of React.
