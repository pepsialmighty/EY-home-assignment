# Spec — Slice 2: App Shell & Navigation

## Goal

Establish the global page layout, header, action buttons, and back navigation present on every route.

## Layout

- A top-level page wrapper constrains content to a max width (matching the current `#root` width of ~1126px), centered, with vertical padding
- A fixed header at the top of every page contains:
  - "Family Tree Builder" as the primary title
  - "Build and manage your family relationships" as a subtitle below it
  - A bottom border separating the header from page content
- Below the header on the home page (`/`): three side-by-side action buttons
  - **Add Person** — primary style (dark background, white text)
  - **Add Relationship** — secondary style (light background, dark text)
  - **Family Tree** — secondary style
- Every page other than home (`/`) displays a "← Back" link at the top left of the content area, navigating back to `/`

## Routes

- `/` — home (people list, defined in Slice 3)
- `/add-person` — add person form (defined in Slice 4)
- `/add-relationship` — add relationship form (defined in Slice 4)
- `/tree` — family tree view (defined in Slice 5)

## Acceptance Criteria

- Header renders on all four routes
- Action buttons render only on `/`; each navigates to the correct route
- "← Back" link renders on `/add-person`, `/add-relationship`, and `/tree`; clicking it returns to `/`
- No inline styles remain in `App.tsx`
- All Tailwind classes; no inline `style` props
