# Spec: Tree Visualization

**Slice:** 4 of 8 — `planning/familyTree/mvp/slices.md`

## Behavior

The UI renders the family tree as an interactive hierarchy using `@xyflow/react` (ReactFlow). Parent-child relationships are shown as connecting edges, with parents above children. The visualization updates automatically when people or relationships change (via TanStack Query cache invalidation).

A **root ancestor filter** dropdown lists all people who have children but no parents of their own. Selecting one renders only that person's lineage (their descendants). The canvas re-renders on selection change. Unconnected people (no relationships at all) are not shown in the lineage view.

## Business Rules

- Only people who have at least one relationship (parent or child) appear in the lineage view
- Unconnected people (no relationships) are not shown — the lineage filter has no root to display them from
- The root ancestor filter shows only people who have children but no parents themselves
- If no root ancestors exist (no relationships defined), a message is shown: "No root ancestors found. Add relationships between people to see their lineage here."
- Parent nodes are rendered above child nodes
- The visualization reflects the current state of the data without requiring a page refresh

## Edge Cases

- No people in the database: display an empty state message
- A person with no parents and no children: not shown in the lineage view (no lineage root to include them)
- No relationships exist at all: display "No root ancestors found" message
- A large tree (many nodes): the layout must remain readable (scrollable/zoomable is acceptable)
- Multiple disconnected family trees: each root ancestor appears in the dropdown; selecting one shows that lineage

## Domain Models

- No new domain models — consumes `Person` and `Relationship` from prior slices

## API Surface

- No new endpoints — consumes `GET /api/people` and existing relationship data

## Success Criteria

- The tree view is accessible from the main navigation
- Root ancestor dropdown lists all people who have children but no parents
- Selecting a root ancestor renders only their descendants as nodes with connecting edges
- The tree updates automatically when data changes (via TanStack Query cache invalidation)
- Empty state is shown when no people exist
- "No root ancestors found" message shown when people exist but no relationships do
- The layout is a clear hierarchy (parents above children)

## Notes

- Uses `@xyflow/react` (ReactFlow) — library is confirmed and in use
- Canvas has a fixed height (`h-[600px]`) constrained to page content width
