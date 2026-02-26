# Demo Workspace

This folder contains runnable Reactor demos and a small interactive launcher.

## Modules

- `module-todos`: Todo entities, models, actions, notes, and seed data.
- `module-playground`: Playground workspace with tabs for UI demos.
- `module-custom-layout`: Custom layout demo.
- `module-stress-test`: Stress test demo entities.
- `server`: Demo web server.

## Run Demos

From the repository root:

1. `pnpm demo:watch`
2. Pick the modules you want to run when prompted.

For production-like startup (no nodemon):

1. `pnpm demo:start`
2. Pick the modules you want to run when prompted.

The launcher will:

- Always include core modules:
  - `../../modules/module-reactor`
  - `../../modules/module-editor`
- Ask you which demo modules to include.
- Set `MODULES` automatically before starting `demo/server`.
- Auto-include `module-todos` if `module-playground` is selected (dependency).