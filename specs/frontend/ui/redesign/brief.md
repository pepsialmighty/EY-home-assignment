# Brief — UI Redesign

## Goal

Replace the current unstyled frontend with a clean, professional UI using Tailwind CSS, matching the provided design screenshots.

## Technology

- **Styling:** Tailwind CSS — replaces all existing inline styles and the current index.css component styles
- All existing libraries (React Query, React Router, ReactFlow) are retained

## Layout & Navigation

- App shell has a fixed header: title "Family Tree Builder" + subtitle "Build and manage your family relationships", separated by a bottom border
- Below the header: three action buttons side by side — **Add Person** (dark/primary) | **Add Relationship** (light/secondary) | **Family Tree** (light/secondary)
- Clicking "Add Person" navigates to `/add-person`
- Clicking "Add Relationship" navigates to `/add-relationship`
- Clicking "Family Tree" navigates to `/tree`
- Every page (home, form pages, tree view) shows a "← Back" link at the top left that returns to the previous page or home (`/`)

## Home View (`/`)

### Empty State
- When no people exist, the stats cards are not shown
- A centered empty state message is displayed: "No people yet — click Add Person to get started"
- A prominent "Add Person" call-to-action button is shown within the empty state

### Stats Row (when people exist)
- Two cards side by side — **People** (total count) | **Relationships** (total count)
- Section header below stats: "Family Tree (N people, N relationships)"

### Person Cards
Each person is rendered as a card containing:
- **Name** (bold)
- **Age tag** derived from date of birth (e.g. "84 years old")
- **Location tag** if `placeOfBirth` is present (e.g. "Boston, MA")
- **Parents** displayed as secondary text (e.g. "Parents: Jane Doe, John Smith") — shown only when parents exist
- **Children** as pill tags with a `×` remove button on each — shown only when children exist; clicking `×` opens an inline confirmation before removing the relationship
- **Edit** button (pencil icon) on the far right of the card
- **Delete** button (trash icon) next to the edit button

### Inline Edit Mode
- Clicking **Edit** toggles the card into inline edit mode — Name, Date of Birth, and Place of Birth become editable inputs within the card
- A **Save** button and a **Cancel** button appear inline
- Submitting calls the update API; on success the card returns to view mode
- Field-level validation errors appear below the relevant input
- API errors appear as a styled error banner within the card
- Cancel discards changes without an API call

### Inline Delete Confirmation
- Clicking **Delete** does not use `window.confirm()`
- A styled confirmation prompt appears inline within the card: "Are you sure you want to delete [Name]?" with **Confirm** and **Cancel** buttons
- Confirming calls the delete API; the card is removed on success

### Relationship Deletion
- Each children pill has a `×` button
- Clicking `×` shows an inline confirmation within the card: "Remove [Child Name] as a child?" with **Confirm** and **Cancel**
- Confirming calls the delete relationship API
- This is the only way to remove a relationship — there is no separate delete relationship form

## Add Person Form (`/add-person`)

- Centered card, max ~600px wide
- Title: "Add New Person" + subtitle: "Enter the person's information to add them to the family tree"
- Fields: Name\*, Date of Birth\*, Place of Birth (optional) with placeholder text
- Two buttons: **Add Person** (primary, full-width) | **Cancel** (navigates back to `/`)
- Inline field errors shown after submit attempt
- On success: show a toast notification "Person added successfully", then navigate to `/`

## Add Relationship Form (`/add-relationship`)

- Centered card, same style as person forms
- Icon + title: "Add Parent-Child Relationship" + subtitle: "Select a parent and child to create a family relationship. Parents must be at least 15 years older than their children."
- Fields: **Parent\*** (styled dropdown, placeholder "Select parent...") | **Child\*** (styled dropdown, placeholder "Select child...")
- Note below Child dropdown: "People with 2 parents are not shown in the list"
- Two buttons: **Add Relationship** (primary) | **Cancel** (navigates back to `/`)
- Inline errors from API displayed below the form
- On success: show a toast notification "Relationship added successfully", then navigate to `/`

## Family Tree View (`/tree`)

- ReactFlow canvas retained (same library, same data source)
- Node and edge styles updated to match the new design aesthetic: cleaner node cards, consistent border-radius, neutral color palette
- Canvas container has a fixed height (e.g. `h-[600px]`) and is constrained to the page content width — no full-viewport overflow
- **Root ancestor filter:** a dropdown at the top of the tree view lists all root ancestors (people with no parents); selecting one renders only that person's lineage (their children, grandchildren, etc.); the canvas re-renders on selection change
- If no root ancestors exist, a message is shown: "No root ancestors found. Add people and relationships first."

## Toast Notifications

- A lightweight toast component appears at the top-right of the screen for ~3 seconds then auto-dismisses
- Used for: person added, relationship added, person updated, person deleted, relationship removed
- Success toasts: green accent
- Error toasts are not used — errors remain inline within the form/card

## Error & Validation Display

- Field-level validation errors appear directly below the relevant input, in red, after a submit attempt
- API errors appear as a styled error banner inside the card/form — not as a browser `alert()`
- Delete and relationship-removal confirmations use styled inline prompts — not `window.confirm()`
- Loading states show a disabled/spinner state on the submit button (e.g. "Saving...")
- All error messages use plain, human-readable language (not raw API error strings)

## Styling Rules

- Tailwind CSS throughout — no inline styles remain
- Consistent tokens: dark primary button (`bg-gray-900 text-white`), light secondary button (`bg-gray-100 text-gray-900`), `rounded-xl` cards, subtle `border border-gray-200` borders
- System font stack via Tailwind defaults
- No responsive breakpoints required (desktop-first is sufficient)
