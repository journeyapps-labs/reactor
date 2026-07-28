---
title: Application model
description: Reactor's kernel, boot lifecycle, modules, stores, and shared runtime.
---

# Application model

A Reactor application is a set of modules installed into one kernel. The kernel coordinates registration and initialization; the `System` tracks shared stores and entity definitions; the workspace runtime renders the resulting application.

## Boot sequence

Reactor boots in three phases:

1. **Construction** — modules and stores construct their initial synchronous state.
2. **Registration** — every module receives `ReactorModuleRegisterEvent`. Modules register stores and connect actions, panels, entities, themes, settings, and other capabilities.
3. **Initialization** — Reactor initializes all registered stores, then calls each module's `init()` method.

This ordering is intentional. Store constructors establish initial state. Registration allows stores and modules to discover one another. Store initialization performs deserialization and asynchronous boot work. Module initialization can then safely use ready stores and perform final startup behavior.

Reactor core renders the application during its module initialization. This means rendering happens after every store has initialized, while the root component itself is selected during registration.

## Shared runtime

Modules communicate through services registered in Reactor's IOC container:

```ts
register({ ioc, registerStore }: ReactorModuleRegisterEvent) {
  const workspaceStore = ioc.get(WorkspaceStore);
  const actionStore = ioc.get(ActionStore);

  registerStore(MyStore, new MyStore());
  actionStore.registerAction(new MyAction());
  workspaceStore.registerFactory(new MyPanelFactory());
}
```

Avoid treating the IOC container as application state. It locates long-lived services; observable state belongs in stores and models.

## The main concepts

- A **module** is an installation boundary.
- A **store** is a state and service boundary.
- An **action** is a reusable statement of user intent.
- A **panel** is a workspace-renderable capability.
- An **entity definition** teaches Reactor how to understand a domain object.
- A **widget** renders a shared interaction pattern.

These concepts are deliberately composable. For example, an entity definition can expose actions and panel factories; an action can be represented by several widgets; the same panel can appear in different workspace layouts.
