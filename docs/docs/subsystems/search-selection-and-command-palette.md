---
title: Search, selection, and command palette
description: Resolve entities, search nested menus, and expose actions as commands.
---

# Search, selection, and command palette

Reactor has several search surfaces, but they share the same underlying idea: a search result is a description of something the user can select or activate. Entity definitions own domain lookup, combo boxes own transient choices, and the command palette combines registered search engines.

:::note Mental model
Search finds choices. The action or control decides what happens after the user picks one.
:::

## Entity search

An entity definition registers one or more search engine components:

```ts
this.registerComponent(
  new SimpleEntitySearchEngineComponent<TodoModel>({
    label: 'Todos',
    getEntities: async () => this.todoStore.todos
  })
);
```

The definition's describer supplies the visible name, icon, tags, and metadata. Callers can add a filter without learning where the entities came from:

```ts
const todo = await todoDefinition.resolveOneEntity({
  event: mousePosition,
  filter: (candidate) => !candidate.archived
});
```

Entity controls, action parameters, and generated entity panels all use these registered search components.

## Action parameter resolution

`ProviderActionParameter` connects a parameter to an entity definition. It checks, in order:

1. a value already present in the action event;
2. a default supplied by the parameter;
3. interactive resolution through the entity definition.

Each candidate is added to a temporary action event and validated before the user selects it. A command can remain discoverable while unavailable targets are grayed out or omitted.

:::note Hidden complexity
The search engine does not need to know which action requested a value. The same search source can serve a form input, command parameter, control, or generated entity panel.
:::

## Combo boxes

Combo boxes render `ComboBoxItem` descriptors. Items can contain labels, icons, grouping, nested items, validators, and activation callbacks. Use controls and actions to generate descriptors where possible rather than wiring a second execution path.

Nested combo boxes stay hierarchical while browsing. Once the user searches, Reactor flattens matching leaves and renders breadcrumb-like labels:

```text
Coffee › Hot › Americano
Coffee › Cold › Iced latte
```

Nested flyouts are dismissed during search so the flattened result set becomes the single source of navigation. Search token matches are highlighted using the same token renderer used by entity trees.

For small menus, Reactor omits the search field. It becomes useful when the directive has enough descendant leaves to justify search, not merely because the top-level menu has groups.

## Command palette discovery

The command palette searches an action's name, aliases, and tags:

```ts
super({
  id: 'DELETE_TODO',
  name: 'Delete todo item',
  aliases: ['Remove todo item', 'Discard todo item'],
  tags: ['todo', 'cleanup'],
  behavior: ActionMacroBehavior.DELETE,
  icon: 'trash'
});
```

- `name` is always displayed.
- `aliases` are complete alternative names used only for matching.
- `tags` are compact searchable concepts and may be rendered by entity presenters.
- `hideFromCmdPallet` prevents the action from appearing as a command.

Selecting a parameterized command begins parameter resolution. Validation runs with the final resolved event before execution.

## Choosing the right search system

- Use an entity search component when finding domain objects.
- Use a combo box for a temporary list of choices or nested commands.
- Use a `SetControl` for a persistent value chosen from a known set.
- Register an action when the result runs behavior that should be available in more than one place.
- Add a command-palette search engine when the result is broader than an action or entity.

The Playground **Dialogs + Comboboxes** panel demonstrates hierarchical browsing, flattened nested search, and token highlighting.

:::warning Common pitfall
Do not fetch application data directly from a combo-box widget when the entity definition already provides search. The two searches will eventually disagree about filtering, loading, or validation.
:::

## Go deeper

<div className="doc-links">
  <a href="./entity-definitions">Entity search components</a>
  <a href="./actions-and-validation">Parameterized actions</a>
  <a href="./controls">Selection controls</a>
  <a href="../runtime/interaction-layers">Combo-box directives</a>
</div>
