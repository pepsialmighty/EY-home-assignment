# Spec — Slice 5: Family Tree View

## Goal

Restyle the ReactFlow family tree canvas with a fixed constrained container, a root ancestor filter, and improved node/edge aesthetics.

## Root Ancestor Filter

- A dropdown at the top of the tree view lists root ancestors — people with no parents **who have at least one child** (unconnected people with no relationships are excluded, as they have no lineage to display)
- The first root ancestor is selected by default on load
- Selecting a root ancestor renders only that person's lineage — their children, grandchildren, and so on
- Switching the dropdown re-renders the canvas for the selected lineage
- If no root ancestors exist, a styled message is shown: "No root ancestors found. Add people and relationships first."

## Canvas Container

- The ReactFlow canvas is wrapped in a container with a fixed height (e.g. `600px`) and full width of the page content area
- The container does not use `height: 100vh` — this resolves the current layout overflow issue
- The container has a `rounded-xl` border and subtle border color consistent with the design system

## Node Styling

- Person nodes are rendered as clean cards: white background, `rounded-lg` border, padding, subtle shadow
- Each node displays the person's name; date of birth shown as secondary text below
- Node border uses neutral color (e.g. `border-gray-200`); no default blue ReactFlow selection handles visible by default

## Node Layout

- Nodes are positioned using a top-down hierarchical layout — root ancestor at the top, each generation below it
- Nodes within the same generation are spread horizontally so no two nodes overlap
- Layout is computed client-side from the filtered edge set; no external layout library is required

## Edge Styling

- Edges use a neutral color (e.g. gray)
- Edge type: `smoothstep` for clean curved paths

## Empty & Error States

- Empty state (no people): styled message "No people yet. Add some using the Add Person button."
- Error state: styled message "Failed to load tree." — raw error strings not exposed to the user

## Acceptance Criteria

- Root ancestor dropdown renders and filters the canvas correctly
- Default selection is the first root ancestor
- Canvas renders within a fixed-height, content-width-constrained container; no `100vh`
- Nodes display person name and date of birth, styled consistently with design system
- Nodes are positioned via hierarchical layout — root at top, generations below, no overlapping nodes
- Edges are neutral-colored and use `smoothstep`
- Empty and error states use styled messages
- No inline styles; all Tailwind classes
- Existing `data-testid="tree-view"` and `data-testid="empty-tree"` attributes preserved
