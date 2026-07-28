---
title: Modules and stores
description: Define modules, register stores, and manage asynchronous or persisted state.
---

# Modules and stores

## Define a module

A module extends `AbstractReactorModule` and implements registration and initialization:

```ts
export class TodosModule extends AbstractReactorModule {
  constructor() {
    super({ name: 'Todos' });
  }

  register(event: ReactorModuleRegisterEvent) {
    const { ioc } = event;

    event.registerStore(TodoStore, new TodoStore());
    ioc.get(ActionStore).registerAction(new CreateTodoAction());
    ioc.get(WorkspaceStore).registerFactory(new TodoPanelFactory());
  }

  async init({ ioc }: ReactorModuleInitEvent) {
    await ioc.get(TodoStore).loadInitialData();
  }
}
```

Use `register()` to describe what the module contributes. Use `init()` only for work that must happen after every registered store is ready.

## Define a store

Stores construct usable initial state synchronously. Override `_init()` for asynchronous boot work:

```ts
export class TodoStore extends AbstractStore {
  @observable accessor todos: Todo[] = [];

  constructor() {
    super({ name: 'TODO_STORE' });
  }

  protected async _init() {
    this.todos = await loadTodos();
  }
}
```

Always register stores through the module event. Reactor then:

- binds the store into IOC;
- gives it a child of the module logger;
- initializes it exactly once during boot;
- exposes it through `System.getStores()`.

Call `waitForReady()` when code can run both during and after boot and needs to wait for a particular store.

## Persisted stores

Use `AbstractPersistedStore` when a store owns serialized state:

```ts
interface SavedState {
  selectedId?: string;
}

export class SelectionStore extends AbstractPersistedStore<SavedState> {
  @observable accessor selectedId?: string;

  constructor() {
    super({
      name: 'SELECTION_STORE',
      serializer: new LocalStorageSerializer({ key: 'selection' })
    });
  }

  protected serialize(): SavedState {
    return { selectedId: this.selectedId };
  }

  protected async deserialize(data: SavedState) {
    this.selectedId = data.selectedId;
  }

  protected async _initPersisted(deserialized: boolean) {
    if (!deserialized) this.selectedId = undefined;
  }
}
```

The base class deserializes before `_initPersisted()` and provides `save()`, external-change listening, and persistence logging.
