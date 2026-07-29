---
title: Search, selection, and command palette
description: Resolve entities, search nested menus, and expose actions as commands.
---

# Search, selection, and command palette

Reactor has several search surfaces, but they share the same underlying idea: a search result is a description of something the user can select or activate. Entity definitions own domain lookup, combo boxes own transient choices, and the command palette combines registered search engines.

## Entity search

An entity definition registers one or more search engine components:

```ts
this.registerComponent(
  new SimpleEntitySearchEngineComponent<Project>({
    label: 'Projects',
    getEntities: async () => this.projectStore.projects
  })
);
```

The definition's describer supplies the visible name, icon, tags, and metadata. Callers can add a filter without learning where the entities came from:

```ts
const project = await projectDefinition.resolveOneEntity({
  event: mousePosition,
  filter: (candidate) => candidate.organizationId === organizationId
});
```

Entity controls, entity action parameters, and generic entity panels all use this contract.

## Action parameter resolution

`ProviderActionParameter` connects a parameter to an entity definition. It checks, in order:

1. a value already present in the action event;
2. a default supplied by the parameter;
3. interactive resolution through the entity definition.

Each candidate is placed into a candidate action event and validated before the user selects it. This is important for permissions and plan checks: the command palette can initially expose a context-free action, then gray out or omit entities that would make the resolved action invalid.

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

The command palette searches the canonical action name, aliases, and tags:

```ts
super({
  id: 'DELETE_PROJECT',
  name: 'Delete project',
  aliases: ['Remove project', 'Destroy project'],
  tags: ['project', 'cleanup'],
  behavior: ActionMacroBehavior.DELETE,
  icon: 'trash'
});
```

- The canonical `name` is always displayed.
- `aliases` are complete alternative names used only for matching.
- `tags` are compact searchable concepts and may be rendered by entity presenters.
- `hideFromCmdPallet` prevents the action from appearing as a command.

Selecting a parameterized command begins parameter resolution. Validation runs with the final resolved event before execution.

## Choosing the right search system

- Use an entity search component when finding domain objects.
- Use a combo box for a temporary list of choices or nested commands.
- Use a `SetControl` for a persistent value chosen from a known set.
- Register an action when the result represents reusable user intent.
- Add a command-palette search engine when the result is broader than an action or entity.

The Playground **Dialogs + Comboboxes** panel demonstrates hierarchical browsing, flattened nested search, and token highlighting.
