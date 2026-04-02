# Review: Heroicons + Hover Effects

**Diff Base:** `HEAD~1`
**Review Source:** Agent
**Status:** DONE

## Diff Base Resolution

- [x] User selected: `HEAD~1` (commit `39f87f0` — "Replaced emoji icons with Heroicons and added hover/transition effects throughout.")

## Review Output

Changed files: `ui/src/App.tsx`, `ui/src/components/PersonForm.tsx`, `ui/src/views/AddPersonView.tsx`, `ui/src/views/AddRelationshipView.tsx`, `ui/src/views/PeopleView.tsx`, `ui/src/views/TreeView.tsx`, `ui/package.json`, `package-lock.json`.

The changes are focused and correct overall. Icons replaced cleanly, transitions applied consistently. Two minor issues worth flagging.

## Issue Triage

### Recommended

_None._

### Optional

- [ ] #1: `transition-all` on stats cards in [`PeopleView.tsx:137,142`](/ui/src/views/PeopleView.tsx#L137)
  - `transition-all` transitions every CSS property, which is heavier than needed. The rest of the codebase uses `transition-colors` or `transition-shadow` specifically.
  - Suggestion: Replace `transition-all` with `transition` (Tailwind's default shorthand — covers `box-shadow` and `border-color` among other common props).

- [ ] #2: Hover effects on non-interactive stats cards in [`PeopleView.tsx:137,142`](/ui/src/views/PeopleView.tsx#L137)
  - The stats cards are `<div>` elements with no click handler. A hover effect (shadow + border change) implies interactivity and may confuse users into thinking the cards are clickable.
  - Suggestion: Remove hover effects from the stats cards, or make them navigational links (e.g. People card → `/` filtered, or simply leave them as plain informational elements).

### False Positive

- [ ] #3: `cursor-pointer` on `<select>` in [`AddRelationshipView.tsx:57,78`](/ui/src/views/AddRelationshipView.tsx#L57) and [`TreeView.tsx:144`](/ui/src/views/TreeView.tsx#L144)
  - Browsers vary on the default cursor for `<select>` (some show `default`, some show `pointer`). Explicitly setting `cursor-pointer` ensures cross-browser consistency. Not an issue.

## Retainment

_Not applicable — this is a targeted enhancement commit, not a planned feature slice._

## Completion

- [x] Fixes applied (none selected)
- [x] Steps marked `DONE`
