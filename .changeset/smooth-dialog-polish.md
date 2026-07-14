---
'@journeyapps-labs/reactor-mod': minor
---

Add tree metadata and tag presentation controls:

- Add `TagDisplayMode` and `MetadataDisplayMode` options for tree presenters, including compact badge rendering, pill rendering, and responsive overflow handling.
- Render entity tags and metadata directly in tree nodes, including nested descendants, with configurable tag limits and an overflow menu.
- Add metadata-label grouping options alongside existing tree grouping modes.
- Add the fragment-aware `useTheme(fragment?)` hook, defaulting to Reactor's theme fragment.

Improve Reactor interface polish:

- Constrain desktop dialogs to the viewport and use Reactor scrollbars for overflow content.
- Improve mobile panel navigation, toolbar visibility, controls, and compact tree detail rendering.
- Improve theme-driven tree badge, overflow, and scrollbar colors.
