---
title: Workspaces and panels
description: Create renderable panels and persistent application layouts.
---

# Workspaces and panels

Panels are renderable application capabilities. Workspaces arrange panel models into persistent layouts containing tabs, splits, trays, and floating windows.

## Create a panel model and factory

```tsx
class TodoPanelModel extends ReactorPanelModel {
  constructor() {
    super('todos.list');
    this.setExpand(true, true);
  }
}

class TodoPanelFactory extends ReactorPanelFactory<TodoPanelModel> {
  constructor() {
    super({
      type: 'todos.list',
      name: 'Todos',
      icon: 'list',
      category: 'Todos',
      isMultiple: false,
      padding: true
    });
  }

  protected generatePanelContent(event: WorkspaceModelFactoryEvent<TodoPanelModel>) {
    return <TodoPanelWidget model={event.model} />;
  }

  protected _generateModel() {
    return new TodoPanelModel();
  }
}
```

Register the factory during module registration:

```ts
ioc.get(WorkspaceStore).registerFactory(new TodoPanelFactory());
```

Panel models should place serializable state in `toArray()` and restore it in `fromArray()`. Entity-backed state can use `encodeEntities()` and `decodeEntities()`.

## Generate a workspace

```ts
workspaceStore.registerWorkspaceGenerator({
  generateWorkspace: async () => {
    const root = workspaceStore.generateRootModel();
    root.addModel(new TodoPanelModel());

    return new WorkspaceModel({
      id: 'todos',
      name: 'Todos',
      model: root
    });
  }
});
```

Return a `WorkspaceGroup` to present several related layouts. Generators can independently support simple or advanced layout modes, and may return no workspace when a mode is not applicable.

Workspace state is persisted automatically. Layout changes are coalesced through a trailing debounced save.

## Immutable workspaces

Mark generated workspaces immutable when the application owns their structure. Immutable workspaces cannot be renamed, deleted, regrouped, reset, or replaced through import. Their layout is locked, while users can still activate existing panels and open additional content in floating windows.
