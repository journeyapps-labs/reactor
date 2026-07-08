---
'@journeyapps-labs/reactor-mod': major
'@journeyapps-labs/reactor-mod-editor': minor
'@journeyapps-labs/lib-reactor-server': major
'@journeyapps-labs/lib-reactor-builder': patch
'@journeyapps-labs/lib-reactor-data-layer': patch
'@journeyapps-labs/lib-reactor-search': patch
'@journeyapps-labs/lib-reactor-utils': patch
---

Modernize Reactor workspaces and module packaging.

- Add the mobile Reactor shell, viewport-aware workspace rendering, workspace groups, and updated tab/header/workspace navigation APIs.
- Export JSON path helpers from `module-editor` for locating Monaco JSON AST nodes by path.
- Remove built-in server PWA/mobile middleware so apps can own static PWA assets and mobile routing themselves.
- Make module builds fail when webpack reports errors, restore Terser minification compatibility, and move pnpm override maintenance into `pnpm-workspace.yaml`.
- Declare missing direct dependencies, remove stale `@types/uuid` packages, and pin transitive dependency overrides for pnpm 11 compatibility.
