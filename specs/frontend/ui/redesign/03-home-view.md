# Spec — Slice 3: Home View

## Goal

Restyle the home page (`/`) with an empty state, stats cards, a styled people list with parents/children display, inline edit, inline delete confirmation, and relationship removal.

## Empty State

- When the people list is empty, stats cards are hidden
- A centered empty state is shown: message "No people yet — click Add Person to get started" and a primary "Add Person" button linking to `/add-person`

## Stats Row (when people exist)

- Two cards side by side, each showing a large count and a label:
  - **People** — total count from the people query
  - **Relationships** — total count from the relationships query
- Cards: `rounded-xl`, border, centered text

## Section Header

- "Family Tree (N people, N relationships)" shown below the stats row

## Person Cards

Each person rendered as a `rounded-xl` bordered card containing:
- **Name** — bold, prominent
- **Age tag** — computed from `dateOfBirth` as "N years old", rendered as a small pill/badge
- **Location tag** — pill/badge, shown only when `placeOfBirth` is present
- **Parents** — secondary text "Parents: [Name], [Name]", shown only when parents exist
- **Children pills** — each child's name as a pill with a `×` remove button; shown only when children exist
- **Edit icon button** (pencil) — far right of card
- **Delete icon button** (trash) — next to edit icon

## Inline Edit Mode

- Clicking Edit switches the card into edit mode
- Name, Date of Birth, and Place of Birth become styled inputs within the card
- **Save** and **Cancel** buttons appear inline
- Submitting calls the update API; on success the card returns to view mode and shows a "Person updated successfully" toast
- Field-level validation errors appear below the relevant input
- API errors appear as a styled error banner within the card
- Cancel discards changes, returns to view mode, no API call

## Inline Delete Confirmation

- Clicking Delete does not use `window.confirm()`
- Styled confirmation prompt appears inline in the card: "Are you sure you want to delete [Name]?" with **Confirm** and **Cancel**
- Confirming calls the delete API; on success the card is removed and a "Person deleted" toast is shown
- Cancelling dismisses the prompt

## Relationship Removal

- Each children pill has a `×` button
- Clicking `×` shows an inline confirmation within the card: "Remove [Child Name] as a child?" with **Confirm** and **Cancel**
- Confirming calls the delete relationship API; on success the pill is removed and a "Relationship removed" toast is shown
- Cancelling dismisses the confirmation

## Acceptance Criteria

- Empty state renders when no people exist; stats/list hidden
- Stats cards show correct counts when people exist
- Person cards show name, age, location (when present), parents (when present), children pills (when present)
- Inline edit: fields editable, save calls API, cancel discards, toast on success
- Inline delete: no `window.confirm()`, styled prompt, toast on success
- Relationship removal: `×` on each pill, styled confirmation, toast on success
- All error messages human-readable; no raw API strings
- No inline styles; all Tailwind classes
- Existing `data-testid` attributes preserved on all interactive elements
- Inline delete confirm button carries `data-testid="btn-delete-confirm-{id}"` (required for E2E)
