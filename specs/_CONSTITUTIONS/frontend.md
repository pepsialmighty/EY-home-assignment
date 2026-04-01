# Frontend Constitution

This constitution governs all frontend TypeScript/React development in the `ui/` folder.

## Technology

- **Framework:** React 18+ with TypeScript
- **Build:** Vite
- **Styling:** CSS Modules or Tailwind (keep it simple)
- **State:** React Query for server state, useState/useReducer for local
- **Testing:** Vitest + React Testing Library

## Project Structure

```
ui/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Root component
│   ├── components/           # Reusable components
│   ├── views/                # Page-level components
│   ├── hooks/                # Custom hooks
│   ├── api/                  # API client and query hooks
│   ├── types/                # Shared type definitions
│   └── utils/                # Utility functions
├── tests/                    # Test files
├── tsconfig.json
└── package.json
```

## Components

- Functional components with TypeScript
- Props interface defined in the same file or a colocated `types.ts`
- Use named exports

## Forms

- Use controlled components
- Client-side validation is for UX only — **server is source of truth**
- Show validation errors inline near the relevant field
- Submit buttons must always be **enabled** — show validation errors on submit

## API Queries

- Use React Query (TanStack Query) for data fetching
- Centralize API calls in `api/` directory
- Always handle loading and error states
- Invalidate relevant queries after mutations

## Styling

- Keep it clean and functional — this is a tech demo, not a design showcase
- Consistent spacing, readable typography, clear hierarchy
- Responsive is nice-to-have, not required

## Error Handling

- Display server validation errors clearly to the user
- Toast or inline messages for mutation results
- Never silently swallow errors

## Anti-Patterns

- **DO NOT** rely solely on client-side validation — server is source of truth
- **DO NOT** use `any` type
- **DO NOT** silently swallow API errors
- **DO NOT** disable submit buttons based on form validity — show errors on submit instead
