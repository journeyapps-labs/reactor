# Reactor documentation

The documentation site combines a curated Reactor manual with generated package API reference.

From the repository root:

```bash
pnpm build:ts
pnpm --dir docs start
```

Build the static site with:

```bash
pnpm --dir docs build
```

Conceptual documentation lives in `docs/docs`. Generated API pages are produced from package declarations and should not be edited directly.
