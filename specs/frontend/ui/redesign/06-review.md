# Spec — Slice 6: Review

## Goal

Verify the completed redesign against the brief, remove dead code, and retain planning artifacts to `specs/`.

## Checklist

### Visual Consistency
- Header renders correctly on all routes
- Action buttons on home match primary/secondary styles
- "← Back" link present on all non-home routes
- Empty state renders on home when no people exist
- Stats cards show correct counts when people exist
- Person cards render name, age tag, location tag, parents, children pills correctly
- Children pill `×` removes relationship via inline confirmation
- Inline edit works: fields editable, save calls API, toast on success, cancel discards
- Inline delete confirmation works: no `window.confirm()`, styled prompt, toast on success
- Add Person and Add Relationship forms match card style, validation, error display, and toast on success
- Toast notifications appear at top-right, auto-dismiss after ~3 seconds
- Family Tree canvas is fixed-height and constrained — no overflow
- Root ancestor dropdown filters the canvas correctly

### Code Quality
- No inline `style` props remain anywhere in `ui/src/`
- No unused imports or dead components (e.g. old `ParentManager`, unused routes)
- No `window.confirm()` or `alert()` calls remain
- All existing `data-testid` attributes are intact

### Spec Retainment
- Copy `planning/frontend/ui/redesign/brief.md` → `specs/frontend/ui/redesign/brief.md`
- Copy each slice spec → `specs/frontend/ui/redesign/0N-slice-name.md`

## Acceptance Criteria

- All checklist items pass
- `vite build` exits with code 0
- No TypeScript errors (`tsc --noEmit` exits with code 0)
- Spec retainment complete
