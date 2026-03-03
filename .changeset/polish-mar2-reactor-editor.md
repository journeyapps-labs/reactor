---
'@journeyapps-labs/reactor-mod': minor
'@journeyapps-labs/reactor-mod-editor': minor
---

Polish tree rendering, command palette performance, color picker behavior, and editor suggest rendering integrations.

- Tree rendering: move reactor node rendering through node-level `renderWidget(event, renderChild)` hooks, export tree child render types, and preserve custom wrappers (including entity DnD wrappers) when rendering and searching.
- Command palette: reduce hover-driven rerenders by stabilizing category handlers and entry rendering (`PureComponent`/memoized entry wrappers), improving list interaction performance.
- Color picker: refresh overlay styling to match theme inputs/buttons, add reset/close controls, improve layering behavior, and refine update flow for picker interactions.
- Monaco/editor integration: add suggest renderer patch registration APIs, enable custom suggest icon/color transforms, and default inline suggest details on editor widgets while preserving consumer options.
- Editor module setup: normalize editor layer manager initialization for module-editor activation.
