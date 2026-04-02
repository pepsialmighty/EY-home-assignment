# Spec — Slice 4: Add Person & Add Relationship Forms

## Goal

Restyle the two form pages as centered cards with professional inputs, validation, error display, and success toast notifications.

## Shared Form Card Behaviour

- Centered card, max ~600px wide, `rounded-xl` border, padding
- Submit button: primary style (dark background, white text), full width
- Cancel button: secondary style, navigates back to `/`
- Submit button shows "Saving..." and is disabled while the request is in flight
- Field-level validation errors appear in red directly below the relevant input, only after a submit attempt
- API errors appear as a styled error banner inside the card, in human-readable language (not raw error strings)
- On success: trigger a toast notification, then navigate to `/`

## Add Person Form (`/add-person`)

- Title: "Add New Person"
- Subtitle: "Enter the person's information to add them to the family tree"
- Fields:
  - **Name** (required) — text input, placeholder "Enter full name"
  - **Date of Birth** (required) — date input
  - **Place of Birth** (optional) — text input, placeholder "e.g., New York, USA"
- On success: toast "Person added successfully", navigate to `/`

## Add Relationship Form (`/add-relationship`)

- Icon + title: "Add Parent-Child Relationship"
- Subtitle: "Select a parent and child to create a family relationship. Parents must be at least 15 years older than their children."
- Fields:
  - **Parent** (required) — styled `<select>`, placeholder option "Select parent..."
  - **Child** (required) — styled `<select>`, placeholder option "Select child..."
- Note below Child dropdown: "People with 2 parents are not shown in the list"
- On success: toast "Relationship added successfully", navigate to `/`

## Acceptance Criteria

- Both forms render as centered cards with correct titles, subtitles, and fields
- Validation errors shown inline after submit attempt
- API errors shown as styled banner (not `alert()`)
- Submit button disabled and shows "Saving..." during submission
- Cancel navigates to `/`
- Success shows toast then navigates to `/`
- No inline styles; all Tailwind classes
- Existing `data-testid` attributes preserved on all inputs, selects, and buttons
