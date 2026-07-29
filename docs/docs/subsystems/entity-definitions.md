---
title: Entity definitions
description: Connect application domain objects to Reactor's generic capabilities.
---

# Entity definitions

An entity definition teaches Reactor how to understand one kind of domain object. The domain model remains application-owned; the definition connects it to Reactor's generic search, action, panel, tree, card, and serialization systems.

With a definition, Reactor can answer:

- What is this object called and which icon represents it?
- How can a user search for or select one?
- Which actions apply to it, and what happens when it opens?
- Can it be rendered as a tree node or card?
- How is a persistent reference encoded and restored?
- Does it expose child entities?

## Identity and registration

```ts
export class TodoDefinition extends EntityDefinition<TodoModel> {
  constructor() {
    super({
      type: 'todo-item',
      category: 'Todos',
      label: 'Todo item',
      icon: 'cube',
      iconColor: 'cyan'
    });
  }

  matchEntity(entity: unknown): boolean {
    return entity instanceof TodoModel;
  }

  getEntityUID(todo: TodoModel): string {
    return todo.id;
  }
}
```

Register definitions through `System` during module registration:

```ts
ioc.get(System).registerDefinition(new TodoDefinition());
```

## Capability components

Definitions are assembled from focused components.

### Description

```ts
this.registerComponent(
  new EntityDescriberComponent<TodoModel>({
    label: 'Default',
    describe: (todo) => ({ simpleName: todo.name, tags: todo.tags })
  })
);
```

Descriptions are reused by trees, cards, combo boxes, search results, context menus, and headers.

`tags` should describe the entity in application terms. Use `labels` for structured metadata:

```ts
describe: (project) => ({
  simpleName: project.name,
  tags: project.tags,
  labels: [
    { label: 'Organization', value: project.organizationName },
    { label: 'Status', value: project.status }
  ]
});
```

Tree presenters can render tags as badges or pills, limit the visible tag count, and allow users to group by tags. Metadata has its own display configuration, so implementation details do not need to be disguised as tags.

### Search

```ts
this.registerComponent(
  new SimpleEntitySearchEngineComponent<TodoModel>({
    label: 'Todos',
    getEntities: async () => this.todoStore.todos
  })
);
```

Search components allow entity pickers and action parameters to resolve objects without knowing how the application stores them.

Search engines are collected in an `EntitySearchBank`. A preferred engine supplies the default experience, while applications can expose several engines for different data sources or scopes. Provider-backed action parameters use the same search infrastructure.

### Presentation and panels

```ts
this.registerComponent(new InlineTreePresenterComponent<TodoModel>());
this.registerComponent(new EntityCardsPresenterComponent<TodoModel>());
this.registerComponent(
  new EntityPanelComponent<TodoModel>({
    label: 'Todos',
    getEntities: () => this.todoStore.rootTodos
  })
);
```

An entity panel can generate a panel factory using the registered presenters. This lets the Todo module build a workspace from its definition instead of hand-writing every presentation.

### Actions and opening

Use `EntityActionHandlerComponent` to define how an entity opens. Use `registerAdditionalAction()` to add context actions. Reactor supplies the target entity in the action event.

### Persistence

`InlineEntityEncoderComponent` converts an entity to a stable value and resolves it later. Panel models use these encoders when persisted layouts refer to application objects.

### Descendants

`DescendantLoadingEntityProviderComponent` describes relationships such as sub-todos and notes. Tree and card presenters can display nested objects without coupling themselves to the Todo model.

## Why use the entity system?

Entity definitions prevent every UI surface from independently reimplementing names, icons, lookup, actions, and navigation. Add a capability once and every compatible Reactor surface can use it.

See `demo/module-todos/src/entities/TodoDefinition.ts` for a complete example.
