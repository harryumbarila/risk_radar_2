# Contributing to Documentation

Our documentation is powered by **Nextra**, a modern documentation framework for
Next.js. This guide will help you contribute effectively.

---

## 📌 Getting Started

Nextra uses the **pages router** and `_meta.json` files to manage routing and
the sidebar structure. Below is an example structure of a documentation section:

```text
pages/
├── getting-started/
│   ├── _meta.json
│   ├── development-quickstart.mdx
│   ├── git-workflow.mdx
│   ├── useful-commands.md
├── packages/
│   ├── _meta.json
│   ├── shared.mdx
│   ├── ui.mdx
├── _app.mdx
├── _meta.json
├── index.mdx
```

The `_meta.json` file is used to define the order, indexing, and custom titles
for documentation pages. For example, if the folder structure looks like this:

```text
├── getting-started/
│   ├── _meta.json
│   ├── development-quickstart.mdx
│   ├── git-workflow.mdx
│   ├── useful-commands.md
```

To customize the order of pages and its titles inside a section, the
`_meta.json` inside that folder can be updated as follows:

```json
{
  "git-workflow": "Git Workflow",
  "development-quickstart": "Quickstart Guide",
  "useful-commands": "Useful Commands"
}
```

This ensures the sidebar displays pages in the desired order.

---

## 🎨 Using MDX Components

Nextra allows using custom React components in `.mdx` files.

📌 **Example:**

```mdx
import { Alert } from '@/ui/Alert';

<Alert type="info">This is an important note.</Alert>
```

Find reusable components in the [ui package](../packages/ui.md) and use them to
enhance documentation.

---

## 📂 Adding a New Section

1️⃣ Create a new folder inside `docs/` with a descriptive name.  
2️⃣ Add an `_meta.json` file inside it to define the section title.  
3️⃣ Create `.mdx` files inside the new folder for documentation pages.  
4️⃣ Update the root `_meta.json` to include the new section.

📌 **Example:**

Initially, the structure looks like this:

```text
pages/
├── getting-started/
│   ├── _meta.json
│   ├── development-quickstart.mdx
```

To add a new section, create a new folder and place the `.mdx` file inside it:

```text
pages/
├── getting-started/
│   ├── _meta.json
│   ├── development-quickstart.mdx
├── my-new-section/
│   ├── _meta.json    # Defines sidebar order and titles for this section
│   ├── example.mdx   # New documentation page

```

This structure ensures proper organization and allows Nextra to handle sidebar
navigation effectively.

---

## 📑 Adding a Subsection

Subsections can be organized within folders inside a section.

📌 **Example: Adding an "Auth" Subsection**

Let's say we have the following initial structure:

```text
/docs/
├── guides/
│   ├── _meta.json
│   ├── contributing.mdx
```

Now, we want to add an "Auth" subsection under Guides. To do this:

1️⃣ Create a new folder inside `guides/` for the subsection.  
2️⃣ Add a `_meta.json` file to define page order and titles.  
3️⃣ Add the necessary `.mdx` or `.md` files inside the new folder.

After making these changes, the structure will look like this:

```text
/docs/
├── guides/
│   ├── _meta.json
│   ├── contributing.mdx
│   ├── auth/
│   │   ├── _meta.json
│   │   ├── jwt-auth.mdx
│   │   ├── oauth.mdx
```

Now, update `guides/_meta.json` to register the Auth subsection:

```json
{
  "auth": "Authentication"
}
```

Then, inside `guides/auth/_meta.json`, define the pages within the **Auth**
subsection:

```json
{
  "jwt-auth": "JWT Authentication",
  "oauth": "OAuth"
}
```

This ensures that Authentication appears as a subsection in the sidebar, with
properly labeled pages under it.

---

## 📄 Adding a New Page

1️⃣ Navigate to the **`pages/`** directory.  
2️⃣ Create a new `.mdx` or `.md` file following the naming convention
(`kebab-case.mdx`).  
3️⃣ Add a title and content using **Markdown** and/or **MDX components**.  
4️⃣ Update the corresponding `_meta.json` file to include the new page. If
necessary, modify its title to ensure clarity and consistency in the sidebar
navigation.

📌 **Example: Adding "Config Customization" Page**

**`docs/getting-started/customization.mdx`**

```mdx
---
title: 'Customization'
---

# Customization Guide

Learn how to customize the project according to your needs.
```

Then, update the `_meta.json` file:

```json
{
  "introduction": "Introduction",
  "installation": "Installation",
  "customization": "Config Customization"
}
```

---

## ✅ Submitting Your Contribution

1️⃣ Ensure content is clear and concise.  
2️⃣ Follow Markdown & MDX best practices.  
3️⃣ Run the local server to preview your changes.  
4️⃣ Commit changes following conventional commits:

```bash
git commit -m "docs: add new guide on feature X"
```

5️⃣ Push changes & create a pull request.

---

## 💡 Best Practices

✅ Use **clear and concise** language.  
✅ Follow **consistent formatting**.  
✅ Add **examples and code snippets** where applicable.  
✅ Use **headings and lists** to improve readability.  
✅ Keep navigation **intuitive**.

---

## 📚 Additional Resources

📌 [Nextra Documentation](https://nextra.site/docs) – Learn more about Nextra.  
📌 [Markdown Guide](https://www.markdownguide.org/) – Improve your Markdown
skills.

Happy documenting! ✍️🚀
