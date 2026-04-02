# Spec — Slice 1: Tailwind Setup

## Goal

Integrate Tailwind CSS v3 into the `ui/` project so all subsequent slices can use utility classes.

## Acceptance Criteria

- `tailwindcss`, `postcss`, and `autoprefixer` are installed as dev dependencies in `ui/package.json`
- `tailwind.config.js` and `postcss.config.js` exist in `ui/` with content paths covering `src/**/*.{ts,tsx}`
- Tailwind directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`) are present in the global CSS entry point
- Existing CSS custom properties (color tokens, font variables) in `index.css` that are still referenced elsewhere are preserved; purely structural/component styles that will be replaced by Tailwind are removed
- `vite build` completes with exit code 0
- `vite dev` serves the app without console errors related to CSS or PostCSS
