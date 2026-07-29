---
title: Settings and persistence
description: Model user settings and persist application-owned state.
---

# Settings and persistence

Reactor separates transient application state, user settings, and persisted store state. Settings model individual choices through controls. Persisted stores own larger serialized state and participate in the Reactor store lifecycle.

## Settings

`AbstractSetting` owns a stable key, serialization version, readiness state, and update notifications. Interactive settings wrap controls so the same value can appear in the settings panel and elsewhere in the UI.

Common setting types include:

- `BooleanSetting`
- `SetSetting`
- `EntitySetting`
- `ToolbarPreference`

Register user-facing settings with `PrefsStore`:

```ts
prefsStore.registerPreference(
  new BooleanSetting({
    key: 'show-archived-projects',
    name: 'Show archived projects',
    category: 'Projects',
    checked: false
  })
);
```

Call `waitForReady()` before using a setting from code that may run during boot. A `serializeID` invalidates persisted data after an incompatible schema change.

## Persisted stores

Use `AbstractPersistedStore` when persistence belongs to a store rather than one setting. The store:

- deserializes before its persisted initialization hook;
- exposes `save()`;
- listens for external changes when supported by the serializer;
- logs restore and save activity through the store logger.

Store constructors should still establish usable defaults. Deserialization replaces or augments those defaults during Reactor initialization.

Workspace persistence follows the same principle. Layout changes trigger a trailing debounced save so a burst of model updates produces one persisted snapshot.

Themes use the settings system for the selected theme, but their extension model is documented separately in [Themes](./themes.md).
