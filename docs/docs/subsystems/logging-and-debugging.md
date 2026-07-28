---
title: Logging and debugging
description: Use hierarchical logging and the Reactor Debug module.
---

# Logging and debugging

Reactor uses hierarchical loggers. A module owns a root logger; registered stores inherit a child logger; registered actions inherit from `ActionStore`. This produces names such as:

```text
Reactor core:Workspace
Reactor core:Actions:Create workspace
Monaco editor:Monaco
```

## Log from modules and stores

Modules can use their logger directly:

```ts
this.logger.info('Connected to project', project.id);
```

Stores receive a public `logger` when registered:

```ts
this.logger.debug('Refreshing projects', { organizationId });
this.logger.warn('Project metadata is incomplete', project.id);
this.logger.error('Failed to refresh projects', error);
```

Choose levels by operational meaning:

- `DEBUG` for detailed execution and state transitions.
- `INFO` for meaningful lifecycle or user-visible operations.
- `WARN` for degraded behavior Reactor can recover from.
- `ERROR` for failed operations requiring investigation.

Use structured arguments instead of building one large string. Color tokens remain compatible with browser and Node transports:

```ts
logger.info('Import complete', Log.green('success'), { imported: count });
```

## Reactor Debug module

Install `@journeyapps-labs/reactor-mod-debug` as an application module to add the **Reactor debug: Logging** panel.

The panel can:

- search the logger hierarchy;
- change the global level;
- override one logger's level;
- isolate a logger and its children;
- reset individual overrides back to inheritance.

Configuration is applied immediately and persisted in browser local storage. Resetting preserves the selected global level.

The demo launcher lists Reactor Debug as an optional module and selects it by default.
