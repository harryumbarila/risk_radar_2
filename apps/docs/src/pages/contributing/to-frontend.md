# Contributing to the Frontend

To maintain a **scalable, maintainable, and efficient** frontend codebase,
follow this guideline when developing new features or making improvements.

---

## 🏗️ **Before Development**

### 🔍 Understand the Requirement

Before writing any code, ensure you fully understand the feature's
requirements:  
✔️ Clarify any doubts with the team.  
✔️ Analyze if the feature fits within the existing structure or requires
adjustments.  
✔️ Consider potential edge cases and dependencies.  
✔️ Consider outlining an implementation plan to assess potential risks and
ensure a smooth development process.

📌 **Example:**  
If a feature involves handling user profiles, check if there's already an
existing component, hook or utils that might handle logic you need.

---

### 🏡 Evaluate Scope & Architecture

If the feature is large and consists of multiple related functionalities (e.g.,
mailing, statistics, etc.):  
✔️ Ensure separation of concerns and promote **reusability** across services.  
✔️ **Group** related files into a dedicated directory to maintain structure and
clarity.  
✔️ If the feature is big enough to have its own scaffolding, **consider moving
it to its own package** and adding its corresponding documentation. See more
about [adding a new package](../contributing/adding-a-new-package.md)

📌 **Example:**

- A **mailing system** that manages email templates and sending →
  `packages/mailing/`

```
/packages
  ├── mailing/
  │    ├── templates/
  │    ├── mail-service.ts
  │    ├── template-renderer.ts
  │    ├── index.ts
  │    └── [root files]

```

---

### 📦 Install Dependencies (If Needed)

If a new library is required:  
✔️ Use **Yarn** to install it in the appropriate workspace.  
✔️ Ensure it does not duplicate existing functionality.  
✔️ Check if an existing library in the project already provides the needed
functionality to avoid duplicates (e.g., use **date-fns** that is installed,
instead of adding **moment.js**).

📌 **Example:**  
Adding **date-fns** for date manipulation:

```sh
yarn workspace @denali/web add date-fns
# Or to add as a dev dependency
yarn workspace @denali/web add -D @jest/types
```

---

## 🛠️ **During Development**

### 🏷️ Define & Manage Types

✔️ Define **TypeScript types** early to ensure type safety.  
✔️ If types need to be **shared across the project**, add them to the
[`shared`](../packages/shared.md) package instead of keeping them local.

📌 **Example Shared Response Dto:**

```ts
// packages/shared/src/response/cars/dto/car-details.ts

export type CarDetailsResponseDto = {
  id: string; // Unique identifier for the car
  make: string; // e.g., "Toyota", "Ford"
  model: string; // e.g., "Corolla", "Mustang"
  year: number; // Manufacturing year, e.g., 2022
  color: string; // e.g., "Red", "Black"
  createdAt: string; // ISO timestamp of when the car was added
  updatedAt: string; // ISO timestamp of the last update
};
```

---

### 🧩 Component-Based Thinking

✔️ Break the UI into **small, reusable components**.  
✔️ Components should be **200–300 lines max**; if larger, refactor and split
them.  
✔️ Organize components properly.  
✔️ If a piece of UI **will be used in multiple pages**, extract it into a
**reusable component** to avoid code duplication.

- Place components inside the **`components/`** folder.
- Prefer **arrow function components** and use the `FC` type from React to
  ensure proper handling of props and maintain consistency.
- Each component should have its **own folder** named after its responsibility.
- If a feature requires multiple components, **group them into a dedicated
  subfolder** for that feature.
- If a component is **reused across the application** and does not contain
  client-specific logic (hooks, services, libs, etc.), consider adding it to the
  [`ui`](../packages/ui.md) package instead of the web app itself.

📌 **Example Folder Structure:**

```
/components
  ├── button/
  │    ├── button.tsx
  │    └── index.ts
  ├── dashboard/
  │    ├── dashboard-card.tsx
  │    └── dashboard-summary.tsx
```

📌 **Example Button Component:**

```tsx
// components/button/button.tsx
import React from 'react';

type ButtonProps = {
  label: string;
  onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};

export default Button;
```

---

### 🔄 Hooks & Data Management

✔️ If the feature involves data fetching or state, consider creating a **custom
hook** (e.g., `useCarData`).  
✔️ Hooks should encapsulate logic related to **data fetching, transformations,
and state management**.  
✔️ Keep **business logic** separate from UI logic for maintainability.

📌 Example: Fetching car data using a custom hook

```tsx
// apps/web/src/hooks/useCarData.ts

import { useQuery } from '@tanstack/react-query';
import { CarResponseDto } from '@denali/shared/response/dto/car';
import axios from 'axios';

const fetchCarData = async (): Promise<CarResponseDto[]> => {
  const { data } = await axios.get('/api/cars');
  return data;
};

export const useCarData = () => {
  return useQuery({
    queryKey: ['cars'],
    queryFn: fetchCarData,
  });
};
```

---

### 📄 Creating Pages in Next.js

When adding a new page to the Next.js application:  
✔️ Place it inside the `/app` directory following the **app router
structure**.  
✔️ **Use layouts** (`layout.tsx`) when possible to avoid redundant UI code.  
✔️ Load data using **server components**, **hooks** or **React Query** when
applicable.  
✔️ If the page shares code with other pages, **extract it into a component**
instead of duplicating it.

- Keep pages **lightweight**, moving business logic to hooks or utilities,
  ensuring that pages are responsible only for rendering and structuring
  components. Avoid placing complex UI elements (e.g., charts, tables, or forms)
  directly in the page file—these should be created as separate components.

📌 **Example Page Structure:**

```
/app
 ├── dashboard/
 │    ├── layout.tsx  (Defines shared layout)
 │    ├── page.tsx    (Main page component)
 │    ├── settings/
 │    │    └── page.tsx
```

📌 **Example Dashboard Page:**

```tsx
// app/dashboard/page.tsx
import React from 'react';
import DashboardCard from '@/components/dashboard/dashboard-card';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardCard title="Revenue" value="$10,000" />
    </div>
  );
};

export default DashboardPage;
```

---

### 🛡️ Utility Functions

✔️ Any reusable functions (like formatters, validators, or helpers) should go
inside the **`utils/`** folder.  
✔️ Organize utilities based on their purpose.  
✔️ **Preferably, create unit tests** for all utility functions to ensure
reliability.

- Formatting functions → `utils/currency-formatter.ts`
- API-related helpers → `utils/api-response-parser.ts`
- Date/time utilities → `utils/date-to-text.ts`

📌 **Example Utility Folder Structure:**

```
/utils
  ├── currency-formatter.ts
  ├── api-response-parser.ts
  └── date-to-text.ts
```

📌 **Example Utility Function:**

```tsx
// utils/currency-formatter.ts
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
```

---

### ✅ Testing

✔️ Add **unit tests** for components, hooks, and utilities.  
✔️ Use **Jest** and **React Testing Library** for functional coverage.  
✔️ If needed, implement **end-to-end tests** with **Cypress** to validate
workflows.

#### 🧪 Unit Tests

- Unit tests are located in **`apps/web/tests`**.
- Follow the **same project folder structure** inside `tests` to keep
  organization consistent.
- The naming convention for test files should be **`<filename>.spec.ts`** or
  **`<filename>.spec.tsx`** (depending on the file type).
- Focus on testing component rendering, logic, and edge cases.

📌 **Example: Testing a Button component**

```typescript
// apps/web/tests/components/button.spec.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

test("renders button with correct label", () => {
  render(<Button label="Click me" />);
  expect(screen.getByText("Click me")).toBeInTheDocument();
});
```

#### 🏁 End-to-End (E2E) Tests

- E2E test files are located in **`apps/cypress/e2e`**.
- The naming convention for E2E test files follows **`<feature>.spec.cy.ts`**.
- Use Cypress to simulate user interactions and validate workflows.

📌 **Example: Testing the login page flow**

```typescript
// apps/cypress/e2e/login.spec.cy.ts
describe('Login Page', () => {
  it('allows users to log in', () => {
    cy.visit('/login');
    cy.get("input[name='email']").type('user@example.com');
    cy.get("input[name='password']").type('password123');
    cy.get("button[type='submit']").click();
    cy.url().should('include', '/dashboard');
  });
});
```

#### 🔧 Cypress Fixtures & Custom Commands

- Fixtures (mocked test data) can be stored in **`apps/cypress/fixtures`**.
- Custom Cypress commands (e.g., reusable login actions) can be added to
  **`apps/cypress/support`**.

📌 **Example: Creating a Cypress fixture**

```json
// apps/cypress/fixtures/user.json
{
  "email": "user@example.com",
  "password": "password123"
}
```

📌 **Example: Custom Cypress command for login**

```typescript
// apps/cypress/support/commands.ts
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get("input[name='email']").type(email);
  cy.get("input[name='password']").type(password);
  cy.get("button[type='submit']").click();
});
```

---

## 📚 Useful Resources

📌 **Official Documentation:**

- [Next.js Docs](https://nextjs.org/docs) - Learn how Next.js works.
- [Next.js Routing](https://nextjs.org/docs/pages/building-your-application/routing) -
  Learn about Next.js routing functionalities
- [Next.js App Router](https://nextjs.org/docs/app) - More about app router
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Styling with Tailwind.
- [React Docs](https://react.dev/) - Learn the fundamentals of React.
- [React Using TypeScript](https://react.dev/learn/typescript) - Useful
  documentation about React and common TypeScript use cases

---

By following this guideline, we ensure a **structured, scalable, and
maintainable** frontend codebase.

🚀 **Happy Coding!** 🎨💻
