# Terminal Constitution

## Core Rules

1. **Quoted absolute paths** — Always use quoted absolute paths
2. **Exit codes** — Always check; read full error output on failure
3. **Capture output** — Commands marked `[capture: name]` use the capture pattern (see below)
4. **No memory commands** — Copy commands from this file; do not use internal training memory

### Capture Pattern

Commands marked `[capture: name]` **must** use this pattern:

```bash
f=/tmp/<name>-$(date +%Y%m%d-%H%M%S).txt; echo "$f"; <command> > "$f" 2>&1
```

## Common Commands

### Frontend (`ui/` directory)

```bash
cd ui && npm ci
cd ui && npm run dev                    # Dev server: http://localhost:3000
cd ui && npm run build                  # [capture: ui-build]
cd ui && npm run check-types            # [capture: ui-check-types]
cd ui && npm test                       # [capture: ui-test]
cd ui && npm run lint                   # [capture: ui-lint]
```

### Backend (`api/` directory)

```bash
cd api && npm ci
cd api && npm run dev                   # Dev server: http://localhost:5000
cd api && npm run build                 # [capture: api-build]
cd api && npm test                      # [capture: api-test]
cd api && npm run lint                  # [capture: api-lint]
```

### Application Run

```bash
cd api && npm run dev     # Backend:  http://localhost:5000
cd ui && npm run dev      # Frontend: http://localhost:3000
```

**CRITICAL:** These are long-running servers. Always run as background tasks.

## Anti-Patterns

- **DO NOT** run commands from memory — copy from this file
- **DO NOT** assume a command succeeded without checking exit code
- **DO NOT** leave servers running when not actively interacting
