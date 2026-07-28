---
'@journeyapps-labs/reactor-mod': major
'@journeyapps-labs/reactor-mod-debug': minor
'@journeyapps-labs/reactor-mod-editor': patch
'@journeyapps-labs/lib-reactor-utils': patch
'@journeyapps-labs/lib-reactor-data-layer': patch
'@journeyapps-labs/lib-reactor-server': patch
---

Give each Reactor module its own hierarchical logger and replace the module lifecycle's raw IOC argument with distinct `ReactorModuleRegisterEvent` and `ReactorModuleInitEvent` values. Only the registration event exposes `registerStore()`, which registers a store through `System` and gives it a child of the module logger. Registered stores are initialized exactly once before module initialization begins.

Replace explicit Editor store registration and initialization with the module-managed lifecycle.

Split serializer behavior into `AbstractPersistedStore`; `AbstractStore` now contains only common store lifecycle, logging, readiness, and controls.

Move all Reactor, Editor, and demo stores onto the shared store lifecycle and add hierarchical logging for registration, initialization, persistence, and key store operations.

Add a `LoggerStore` registry with inherited INFO-level defaults and persisted per-logger overrides. A new Reactor debug module provides a searchable logging panel exposing the module, store, and action logger tree with effective levels, explicit inheritance controls, global level selection, isolation, and reset.

Route Reactor, Editor, utility, data-layer, and Node server diagnostics through structured loggers with operationally meaningful levels and contextual payloads. Direct console output remains only where the console is the CLI interface or part of displayed example code.
