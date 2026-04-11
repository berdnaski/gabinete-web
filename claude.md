# AI Instructions: Development Standards & Architecture

This repository is built with **React** and **Vite**. As an AI Agent, you must strictly adhere to the following patterns, folder structures, and coding standards.

## 1. Core Tech Stack
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS + shadcn/ui
* **Data Fetching:** TanStack Query (React Query) + Axios
* **Form Management:** React Hook Form + Zod (Validation)

---

## 2. Component Guidelines
* **Function Declarations:** Always use `function` declarations for components, not arrow functions.
* **Exports:** Use **named exports** only.
* **Reusability:** Never recreate basic components (Buttons, Inputs, etc.) that already exist in `src/components/ui`. If a shadcn component is missing, you may install it using the shadcn CLI.
* **Styling:** Use the `className` prop with the `cn()` utility. **Never use inline styles**. For rare custom CSS, use `index.css` and reference the class.
* **Theming:** Support **Dark and Light modes** using shadcn/tailwind variables (e.g., `text-foreground`, `bg-background`).
* **Naming:** Use **kebab-case** for file names (e.g., `user-profile.tsx`) and **PascalCase** for component names.

---

## 3. Form Components & Integration
To separate UI from form logic:
* **Stateless UI:** Pure components in `src/components/ui` (display/events only).
* **Form-Integrated:** Wrappers in `src/components/form` that connect UI components to `react-hook-form` logic using `Controller` or `useFormContext`.
* **Validation:** Always use `zod` schemas. Define schemas in `src/schemas` for reusability and export the inferred type.

--- 

## 4. API & Data Fetching Architecture (Domain-Driven)
Requests must be organized by domain in `src/api/[domain]`:
* `index.ts`: Export a domain object (e.g., `AuthApi`) containing Axios calls.
* `types.ts`: TypeScript interfaces for the domain.
* `hooks/`: TanStack Query hooks (queries/mutations).

Example:
```typescript
export const AuthApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  }
};
```

---

## 5. Logic & Feedback
* **Separation of Concerns:** Keep components declarative. Move complex logic/data mapping into domain hooks or global hooks in `src/hooks`.
* **Feedback:** Use `toast` (sonner) for mutation feedback. Use generic dialogs for complex interactions.
* **Early Returns:** Use early returns to keep code flat and readable.

---

## 6. Project Structure
Maintain this exact hierarchy:

```text
src
├── api
│   ├── [domain-name]
│   │   ├── hooks.ts
│   │   ├── index.ts
│   │   └── types.ts 
|   index.ts <- axios instance
|   queryClient.ts <- tanstack query client instance
├── assets
├── components
│   ├── form           <-- Form-integrated components
│   ├── layout
│   ├── ui             <-- Stateless/shadcn components
├── contexts
├── hooks              <-- Global utility hooks
├── lib                <-- Shared config (cn utility)
├── pages
│   ├── private        <-- Authenticated routes
│   └── public         <-- Non-authenticated routes
├── routes
├── schemas            <-- Zod validation schemas
└── utils
```

**Note:** If unsure, check existing files to maintain consistency. Do not introduce new libraries without explicit instruction. Always plan first. 
