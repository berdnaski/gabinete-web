# Como criar componentes

## Stack

- **React 19** (sem `forwardRef`)
- **TypeScript** strict
- **Tailwind CSS v4** com `@theme` e CSS variables
- **Tailwind Merge** (`tailwind-merge`) para merge de classes
- **Lucide React** ou **Phosphor Icons** para ícones

## Nomenclatura

- Arquivos: **lowercase com hífens** → `user-card.tsx`, `use-modal.ts`
- **Sempre named exports**, nunca default export
- Não criar barrel files (`index.ts`) para pastas internas

## TypeScript

```tsx
// ✅ Estender ComponentProps + VariantProps
export interface ButtonProps
  extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {}

// ✅ Import type para tipos
import type { ComponentProps } from "react";
import type { VariantProps } from "tailwind-variants";

// ❌ Não usar React.FC nem any
```
