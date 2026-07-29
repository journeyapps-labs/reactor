---
title: Themes
description: Define theme identities, typed fragments, values, and styled Reactor widgets.
---

# Themes

Reactor themes are composed from fragments. A theme identifies a complete visual variant such as Reactor Dark or JourneyApps. A theme fragment declares the colors owned by one subsystem and supplies values for each supported theme.

This lets modules extend the visual system without adding every product-specific color to Reactor core.

## Themes and fragments

`ThemeStore` owns:

- registered `Theme` identities;
- the currently selected theme;
- registered `ThemeFragment` instances;
- the combined values produced by those fragments;
- optional entity appearance overrides.

A fragment starts by declaring its typed color structure:

```ts
export const todoTheme = new ThemeFragment({
  structure: {
    todo: {
      label: 'Todos',
      colors: {
        accent: 'Todo accent',
        background: 'Todo surface background',
        foreground: 'Todo surface foreground'
      }
    }
  }
});
```

The category label and color labels are human-readable definitions. The object keys form the API used by widgets.

## Add values for themes

Register values independently for each theme:

```ts
todoTheme.addThemeValues({
  name: Themes.REACTOR_DARK,
  values: {
    todo: {
      accent: '#7c5cff',
      background: '#17131f',
      foreground: '#f4efff'
    }
  }
});

todoTheme.addThemeValues({
  name: Themes.REACTOR_LIGHT,
  values: {
    todo: {
      accent: '#5639d7',
      background: '#ffffff',
      foreground: '#211b2d'
    }
  }
});
```

Register the fragment with `ThemeStore` during module registration:

```ts
event.ioc.get(ThemeStore).addThemeFragment(todoTheme);
```

When an exact theme value is absent, a fragment falls back to its `reactor` values and then its first registered values. A fragment must therefore provide at least one complete set.

## Consume theme values

Use the fragment's typed styled helper:

```ts
const styled = todoTheme.styled();

const TodoSurface = styled.div`
  color: ${(props) => props.theme.todo.foreground};
  background: ${(props) => props.theme.todo.background};
  border-color: ${(props) => props.theme.todo.accent};
`;
```

Use `styledExtends()` when a widget needs values from its module fragment and another fragment. For imperative code, ask `ThemeStore` for the current values of the fragment.

Prefer theme values over hard-coded foreground/background pairs. A single hard-coded color may look acceptable in one dark theme while becoming unreadable in another theme or in light mode.

## Register a theme identity

Applications can add a named theme:

```ts
themeStore.registerTheme(
  new Theme({
    key: 'company-dark',
    label: 'Company Dark',
    core: true,
    light: false
  })
);
```

Every fragment used by the application should then supply values for that key or have an intentional fallback.

## Theme selection

The selected theme is an `EntitySetting<Theme>`. `ChangeThemeAction` is an entity action targeting themes, so theme selection participates in Reactor's entity search, action, control, command-palette, and settings systems.

A module can install an additional theme action or entity describer without changing `ThemeStore`.

## Entity overrides

Fragments can register entity theme overrides for visual details such as entity icon colors. Use these when an entity type has a meaningful theme-specific appearance. General entity descriptions and application state still belong in the entity definition, not the theme.

## Product-specific fragments

Product modules should own product colors and names. Reactor core defines the fragment shape; application modules provide its values.

The Playground **Cards**, **Surfaces**, **Forms**, **Buttons**, and **Trees** panels are useful for reviewing a theme across widgets and Reactor sizes.

:::note Mental model
A theme is an identity. A fragment is one module's typed contribution to every supported identity.
:::

:::warning Common pitfall
Do not add application-specific colors to Reactor's core fragment merely because a core widget displays them. Let the owning module define a fragment and pass its colors to the widget.
:::

## Go deeper

<div className="doc-links">
  <a href="../runtime/application-shell">Application branding</a>
  <a href="./ui-system">Shared surfaces</a>
  <a href="./entity-definitions">Entity appearance overrides</a>
</div>
