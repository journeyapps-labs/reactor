---
'@journeyapps-labs/reactor-mod': minor
---

Add shared sizing and anchored-overlay systems, extend the workspace and card APIs, and improve Reactor's desktop and mobile UI.

### New APIs

- Add `Size`, `ReactorSizeProvider`, `useReactorSize`, and `getReactorBorderRadius`. Components resolve their size from an explicit `size` prop, the nearest provider, or a viewport-aware default (`SMALL` on desktop and `MEDIUM` on mobile). Cards, forms, inputs, selects, text areas, switches, checkboxes, search, tables, tabs, metadata, and panel buttons now participate in this sizing system.
- Add `AnchoredOverlayStore`, `AnchoredOverlayPlacement`, `AnchoredOverlayLayer`, and `useAnchoredOverlay`. Overlays can be anchored to an element, placed automatically or on a requested side, configured as click-through, grouped by source, and automatically repositioned when their anchor resizes, scrolls, or moves.
- Add `ReactorTooltipWidget`, backed by anchored overlays, and migrate Reactor's built-in tooltips and guide callouts away from `balloon-css`. Tooltips now use Reactor theme tokens and remain correctly positioned inside layered and scrollable interfaces.
- Add `MarkdownWidget` for consistently themed, size-aware Markdown content with external links opened in a new tab.
- Add `hideError` and `size` to `FormInputOptions`, allowing nested controls to own validation-message rendering without clearing the input's invalid state.
- Add per-entity card actions through `EntityCardsPresenterComponentOptions.btns`. `EntityCardsPresenterContext.renderCard()` also provides a customization point for replacing the default card renderer.
- Action button representations now keep a live validation context. `ActionButtonWidget.render` receives that validator as its second argument, so custom action renderers can share Reactor's dynamic enabled and disabled state.

### Workspaces and panels

- Add serializable `immutable` workspaces and workspace groups. Immutable workspaces cannot be renamed, cloned, deleted, regrouped, reset, or replaced through import; their layout stays locked while existing panels can still be activated and new content opens in floating windows.
- Simple and advanced workspace generator callbacks are now independently optional and may return `null` or `undefined`, allowing modules to support only the layout modes they can generate.
- Add maximize and restore state to `ReactorWindowModel`. Floating windows now expose maximize and restore title-bar actions and toggle that state when their title is double-clicked.
- Replace the panel factory `fullscreen` option with `renderTitlebar`. Setting `renderTitlebar: false` hides the panel title bar consistently in tab, floating-window, and mobile panel presentations.

### UI and behavior

- Rework mobile dialogs as bottom-aligned panels with a backdrop, bounded height, internal scrolling, and safer event handling.
- Make card actions visible on hover on desktop and persistently visible on mobile, prevent action clicks from triggering the card, and propagate responsive sizing through card content.
- Improve sizing, spacing, borders, hover and selected states, overflow behavior, and mobile presentation across guides, cards, tables, forms, headers, tabs, trees, trays, surfaces, metadata, and workspace controls.
