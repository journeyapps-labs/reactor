---
title: Entity definitions
description: Teach Reactor how to display, find, open, and save references to your data.
---

# Entity definitions

An entity definition teaches Reactor about one kind of data in your application. Your model stays unchanged; the definition tells Reactor how to display, find, open, and save references to it.

:::note Mental model
Define an entity in one place, then reuse it in trees, cards, menus, search, panels, and action pickers.
:::

With a definition, Reactor can answer:

- What is this object called and which icon represents it?
- How can a user search for or select one?
- Which actions apply, and what happens when it opens?
- Can it be rendered as a tree node or card?
- How can a saved panel find this object again?
- Which child entities does it expose?
- Which contextual documentation is relevant?

## Identity and registration

```ts
export class TodoDefinition extends EntityDefinition<TodoModel> {
  @inject(TodoStore)
  accessor todoStore: TodoStore;

  constructor() {
    super({
      type: TodoEntities.TODO_ITEM,
      category: 'Demo items',
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
event.ioc.get(System).registerDefinition(new TodoDefinition());
```

The type string identifies this kind of entity. Reactor uses it to find the definition later.

## Add behavior to the entity

Components add one piece of behavior to the definition. A definition can have more than one component of the same kind. The Todo demo, for example, has simple and detailed descriptions plus several tree layouts.

One component is used by default. A generated entity panel can let users choose another.

### Description

```ts
this.registerComponent(
  new EntityDescriberComponent<TodoModel>({
    label: 'Simple',
    describe: (todo) => ({
      simpleName: todo.name,
      tags: todo.tags,
      labels: [
        { label: 'Sub-todos', value: `${todo.children.length}` },
        { label: 'Notes', value: `${todo.notes.length}` }
      ]
    })
  })
);
```

Descriptions are reused by trees, cards, combo boxes, search results, context menus, and headers.

Use `tags` for domain concepts and `labels` for structured metadata. Tree presenters can render each as pills or badges, limit visible tags, and let users group by supported description fields.

:::tip Pro tip
Return plain names, tags, labels, and icons. The tree, card, or picker will format them for the available space.
:::

### Search

```ts
this.registerComponent(
  new SimpleEntitySearchEngineComponent<TodoModel>({
    label: 'Todos',
    getEntities: async () => this.todoStore.todos
  })
);
```

Search components let forms, controls, and actions find todos without knowing how `TodoStore` stores them.

A definition can offer several searches, such as “recent todos” and “all todos.” One is used by default.

See [Search, selection, and command palette](./search-selection-and-command-palette.md) for candidate resolution and validation.

### Presentation and panels

```ts
this.registerComponent(
  new InlineTreePresenterComponent<TodoModel>({
    label: 'Tree: lazy',
    loadChildrenAsNodesAreOpened: true,
    cacheTreeEntities: true
  })
);
this.registerComponent(new EntityCardsPresenterComponent<TodoModel>());
this.registerComponent(
  new EntityPanelComponent<TodoModel>({
    label: 'Todos',
    getEntities: () => this.todoStore.rootTodos
  })
);
```

An entity panel generates a panel factory from registered presenters. The domain module does not need to hand-build another tree or card panel.

Presenter contexts remember choices such as grouping, description style, metadata display, and tree caching. A listener can also add nodes when a tree is generated.

### Actions and opening

Use `EntityActionHandlerComponent` to define how an entity opens. Use `registerAdditionalAction()` to add context actions. Reactor supplies the target entity in the action event.

A definition can have several open actions. A workspace can choose its preferred action, so clicking a todo can select it in one workspace and open a dialog in another.

### Save references

`InlineEntityEncoderComponent` saves a small reference and uses it to find the entity later:

```ts
this.registerComponent(
  new InlineEntityEncoderComponent<TodoModel, { id: string }>({
    version: 1,
    encode: (todo) => ({ id: todo.id }),
    decode: async ({ id }) => this.todoStore.todos.find((todo) => todo.id === id) || null
  })
);
```

Panels and batch selections use this when saved state refers to an entity.

:::warning Lifecycle note
Decoding may happen after a page reload. Make sure the store has loaded the entity before trying to return it.
:::

### Descendants

`DescendantLoadingEntityProviderComponent` describes relationships such as sub-todos and notes. A provider can expose:

- current descendants;
- a descendant entity type;
- loading state;
- refresh behavior;
- category metadata.

Trees and cards can then mix sub-todos and notes while using the right definition for each one.

:::note Hidden complexity
Lazy trees load children only when a node opens. Cached trees can reuse nodes after a refresh.
:::

### Documentation

`EntityDocsComponent` adds useful links for an entity. Generic entity panels can show those links without knowing what they point to.

## How the Todo example fits together

The Todo definition combines all of these pieces:

```ts
export class TodoDefinition extends EntityDefinition<TodoModel> {
  constructor() {
    super({
      type: TodoEntities.TODO_ITEM,
      label: 'Todo item',
      category: 'Demo items',
      icon: 'cube'
    });

    this.registerComponent(new EntityDescriberComponent({
      label: 'Simple',
      describe: (todo) => ({ simpleName: todo.name, tags: todo.tags })
    }));

    this.registerComponent(new SimpleEntitySearchEngineComponent({
      label: 'Todos',
      getEntities: async () => this.todoStore.todos
    }));

    this.registerComponent(new InlineTreePresenterComponent({
      label: 'Todo tree',
      loadChildrenAsNodesAreOpened: true
    }));

    this.registerComponent(new EntityPanelComponent({
      label: 'Todos',
      getEntities: () => this.todoStore.rootTodos
    }));

    this.registerComponent(new EntityActionHandlerComponent(SetCurrentTodoItemAction.ID));
    this.registerAdditionalAction(RenameTodoAction.ID);
  }
}
```

That one definition gives Reactor enough information to:

1. show a todo in a tree, card, picker, or menu;
2. find a todo when an action needs one;
3. generate a complete Todos panel;
4. select a todo when it is opened;
5. add **Rename todo** to its context menu.

The full demo also adds notes, sub-todos, alternate tree styles, encoding, documentation links, and another open action.

## Why use the entity system?

Without a definition, every tree, picker, and panel would need its own code for names, icons, search, menus, and opening. The definition keeps those rules together.

:::warning Common pitfall
Do not create a second definition just to change one view. Add another description, presenter, search, or open action to the existing definition.
:::

See `demo/module-todos/src/entities/TodoDefinition.ts` for the complete living example.

## Go deeper

<div className="doc-links">
  <a href="./actions-and-validation">Entity actions</a>
  <a href="./search-selection-and-command-palette">Entity resolution</a>
  <a href="./workspaces-and-panels">Generated panels</a>
  <a href="../advanced/data-collections">Asynchronous collections</a>
</div>
