---
sidebar_position: 3
title: Exploring the sandbox
---

# Exploring the sandbox

The Reactor sandbox is a real application assembled from the demo modules in this repository. It is both a visual catalog and a source-code reference: each panel demonstrates a framework concept using the same APIs an application module uses.

## Start it

```bash
pnpm demo:watch
```

Keep **Reactor Debug**, **Reactor Todos**, and **Reactor Playground** selected. The launcher always loads Reactor core and the Monaco editor, resolves module dependencies, and starts the demo server at [http://localhost:9527](http://localhost:9527).

## Understand what is loaded

- `modules/module-reactor` provides the application runtime and shared widgets.
- `modules/module-editor` adds Monaco editor capabilities.
- `modules/module-reactor-debug` adds runtime diagnostics.
- `demo/module-todos` supplies a small example domain.
- `demo/module-playground` installs the sandbox workspaces.

This is the normal Reactor composition model. The server loads module bundles, the kernel registers each module, and those modules contribute stores, actions, panels, entities, and workspaces.

## Suggested tour

Open the Playground workspace and visit these panels in order:

1. **Actions** — one action represented as buttons, controls, and combo-box items, including every validation state.
2. **Forms** — modeled inputs, validation, grouped fields, and responsive sizing.
3. **Cards** and **Surfaces** — shared layout and visual primitives.
4. **Tree search** — entity presentation and search behavior.
5. **Overlays** — anchored overlays and tooltip positioning.
6. **Guide** — guided workflows and attention targets.
7. **Dialogs + Comboboxes**, **Tabs**, **Tables**, and **Drag drop** — larger interaction systems.

Open the Todos workspace to see the systems working together rather than in isolation. Todo models are owned by a store, described by entity definitions, manipulated by actions, and rendered through generated entity panels and workspaces.

## Follow the source

The most useful entry points are:

```text
demo/module-playground/src/ReactorPlaygroundModule.ts
demo/module-playground/src/panels/PlaygroundActionsPanelWidget.tsx
demo/module-todos/src/ReactorTodosModule.ts
demo/module-todos/src/entities/TodoDefinition.ts
```

Start at a module's `register()` method. It acts as a table of contents for everything that module installs.
