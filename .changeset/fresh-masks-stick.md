---
'@journeyapps-labs/reactor-mod': minor
'@journeyapps-labs/lib-reactor-server': minor
---

Add deferred action validation so parameterized actions can resolve their inputs before final validation. Entity action context now flows through right-click menus and command-palette entity resolution, where unavailable candidates are validated live and disabled with validation metadata. Actions now support searchable full-name aliases and tags in the command palette, with discovery tags inferred from action behavior. Nested comboboxes now search flattened leaf items with breadcrumb labels while preserving hierarchical browsing when the query is empty.

Allow deployments to configure the default Reactor root log level with the module-declared `REACTOR_LOG_LEVEL` environment variable. Reactor server modules now fail at startup when a declared public environment variable is missing, and the server/environment workflow is documented.

Expand the Reactor developer documentation with dedicated subsystem guides for actions, entities, search and selection, controls, forms, settings and persistence, themes, workspaces, UI, and debugging. Built-in and demo actions now expose semantic tags in action entity presenters.
