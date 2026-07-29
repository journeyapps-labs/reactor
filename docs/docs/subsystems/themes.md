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
export const projectTheme = new ThemeFragment({
  structure: {
    project: {
      label: 'Projects',
      colors: {
        accent: 'Project accent',
        background: 'Project surface background',
        foreground: 'Project surface foreground'
      }
    }
  }
});
```

The category label and color labels are human-readable definitions. The object keys form the API used by widgets.

## Add values for themes

Register values independently for each theme:

```ts
projectTheme.addThemeValues({
  name: Themes.REACTOR_DARK,
  values: {
    project: {
      accent: '#7c5cff',
      background: '#17131f',
      foreground: '#f4efff'
    }
  }
});

projectTheme.addThemeValues({
  name: Themes.REACTOR_LIGHT,
  values: {
    project: {
      accent: '#5639d7',
      background: '#ffffff',
      foreground: '#211b2d'
    }
  }
});
```

Register the fragment with `ThemeStore` during module registration:

```ts
event.ioc.get(ThemeStore).addThemeFragment(projectTheme);
```

When an exact theme value is absent, a fragment falls back to its `reactor` values and then its first registered values. A fragment must therefore provide at least one complete set.

## Consume theme values

Use the fragment's typed styled helper:

```ts
const styled = projectTheme.styled();

const ProjectSurface = styled.div`
  color: ${(props) => props.theme.project.foreground};
  background: ${(props) => props.theme.project.background};
  border-color: ${(props) => props.theme.project.accent};
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

Product modules should own product vocabulary. A plans module can define upgrade colors and branded indicators, while Reactor only needs generic concepts such as an action-validation indicator with an icon, background, foreground, and tooltip.

This is the same principle used throughout Reactor: the framework supplies a composable contract; modules supply domain meaning.

The Playground **Cards**, **Surfaces**, **Forms**, **Buttons**, and **Trees** panels are useful for reviewing a theme across widgets and Reactor sizes.
