---
'@journeyapps-labs/reactor-mod': minor
---

Improve between-zone drag and drop UX and add a dedicated playground demo for it.

- Added drag target highlighting for `useDroppableBetweenZone` using DnD theme hover colors.
- Added shared gap configuration fields for between-zone hooks/widgets:
  - `gap_standard`
  - `gap_hint`
  - `gap_expand`
- Added automatic hiding of the two drop zones around the currently dragged child.
- Added support for rendering an end-of-list between-zone drop target.
- Added `useDraggingElement` to centralize drag source element tracking.
- Added a new `Drag + Drop` playground panel with vertical and horizontal demos and reorder reset.
