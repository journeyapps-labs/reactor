---
sidebar_position: 1
title: Introduction to Reactor
---

# Reactor

Reactor is an application framework for ambitious, stateful web software. It provides the shell and shared runtime needed by IDEs, administration systems, data browsers, and other applications that behave more like installed software than a collection of web pages.

Instead of assembling routing, commands, panels, persistence, settings, and interaction patterns independently, a Reactor application installs modules into a common runtime.

## What Reactor provides

- **Modules** install capabilities into an application during a defined boot lifecycle.
- **Stores** own observable application state and asynchronous boot work.
- **Actions** describe user intent once and expose it through buttons, menus, shortcuts, and command palettes.
- **Workspaces and panels** provide persistent, rearrangeable application layouts.
- **Entities** connect domain objects to descriptions, actions, panels, search, trees, tables, and cards.
- **Widgets and themes** provide a consistent, responsive application interface.
- **Logging and diagnostics** expose the runtime hierarchy without coupling features to a particular application.

Reactor is best understood as an application operating system: modules install capabilities, stores provide services and state, and Reactor supplies the shared interaction and presentation environment.

## Where to begin

1. Follow [local development](./local-development.md) and [explore the sandbox](./exploring-the-sandbox.md).
2. [Build your first module](./first-module.md).
3. Read the [application model](../subsystems/application-model.md).
4. Go deeper with the subsystem guides for [modules and stores](../subsystems/modules-and-stores.md), [actions](../subsystems/actions-and-validation.md), [entities](../subsystems/entity-definitions.md), and [workspaces](../subsystems/workspaces-and-panels.md).

## Reference applications

The repository contains two useful examples:

- `demo/module-todos` is a small domain-oriented module with entities, actions, stores, panels, and workspace generation.
- `demo/module-playground` is a catalog of Reactor widgets and interaction systems.

The generated API reference is useful once you know which subsystem you need, but it is not intended to be the starting point.
