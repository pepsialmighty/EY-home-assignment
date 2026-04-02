# Spec: Tree Visualization

**Slice:** 4 of 8 — `planning/familyTree/mvp/slices.md`

## Behavior

The UI renders the family tree as an interactive hierarchy. Each person is displayed as a node. Parent-child relationships are shown as connecting lines/edges. Users can see the full tree at a glance. The visualization updates in real time when people or relationships change.

## Business Rules

- Every person in the database appears in the visualization, even those with no relationships (isolated nodes)
- Parent nodes are rendered above child nodes
- The visualization reflects the current state of the data without requiring a page refresh

## Edge Cases

- No people in the database: display an empty state message
- A person with no parents and no children: shown as an isolated node
- A large tree (many nodes): the layout must remain readable (scrollable/zoomable is acceptable)
- Multiple disconnected family trees: all are shown in the same view

## Domain Models

- No new domain models — consumes `Person` and `Relationship` from prior slices

## API Surface

- No new endpoints — consumes `GET /api/people` and existing relationship data

## Success Criteria

- The tree view is accessible from the main navigation
- All people appear as nodes
- All parent-child relationships appear as edges
- The tree updates automatically when data changes (via TanStack Query cache invalidation)
- Empty state is shown when no people exist
- The layout is a clear hierarchy (parents above children)

## Notes

- Use a React-compatible tree/graph library (e.g. `react-d3-tree`, `@xyflow/react`, or CSS-based hierarchy)
- Library choice should be lightweight and not require a backend change
