# @journeyapps-labs/lib-reactor-utils

## 2.0.11

### Patch Changes

- ad662fe: Modernize Reactor workspaces and module packaging.

  - Add the mobile Reactor shell, viewport-aware workspace rendering, workspace groups, and updated tab/header/workspace navigation APIs.
  - Export JSON path helpers from `module-editor` for locating Monaco JSON AST nodes by path.
  - Remove built-in server PWA/mobile middleware so apps can own static PWA assets and mobile routing themselves.
  - Make module builds fail when webpack reports errors, restore Terser minification compatibility, and move pnpm override maintenance into `pnpm-workspace.yaml`.
  - Declare missing direct dependencies, remove stale `@types/uuid` packages, and pin transitive dependency overrides for pnpm 11 compatibility.

## 2.0.10

### Patch Changes

- e7adc06: Bump deps

## 2.0.9

### Patch Changes

- abd47fc: package bumps

## 2.0.8

### Patch Changes

- 2bea4b2: Bump all dependenciess

## 2.0.7

### Patch Changes

- e6ff8ce: Bump all dependencies

## 2.0.6

### Patch Changes

- b691ff0: Fix issues with module-editor due to new monaco changes

## 2.0.5

### Patch Changes

- 2b3fd96: Bump all dependencies

## 2.0.4

### Patch Changes

- 1bd2ef3: Bump all dependencies

## 2.0.3

### Patch Changes

- cb8db2f: - bump all dependencies
  - fix an issue where workspace constraint system may activate on an empty model causing an error
  - improve theme colors for table row buttons
  - update column display type to accept JSX.Element

## 2.0.2

### Patch Changes

- 4596785: Bump all dependencies

## 2.0.1

### Patch Changes

- f4006d1: Bumped dependencies

## 2.0.0

### Major Changes

- d38098f: Move out common libs to JourneyApps labs common
