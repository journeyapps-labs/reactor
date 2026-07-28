---
'@journeyapps-labs/reactor-mod': minor
'@journeyapps-labs/lib-reactor-server': minor
---

Add deferred action validation so parameterized actions can resolve their inputs before final validation. Entity action context now flows through right-click menus and command-palette entity resolution, where unavailable candidates are validated live and disabled with validation metadata.

Allow deployments to configure the default Reactor root log level with the module-declared `REACTOR_LOG_LEVEL` environment variable. Reactor server modules now fail at startup when a declared public environment variable is missing, and the server/environment workflow is documented.
