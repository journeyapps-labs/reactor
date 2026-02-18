---
"@journeyapps-labs/reactor-mod": minor
---

Modernized entity definition internals and improved dialog/form behavior.

- Added and expanded entity card presentation support, including richer describer-driven metadata rendering (`tags`, structured `labels`, and icon usage in cards).
- Extended the describer API surface:
  - `EntityDescription.tags?: string[]` for lightweight chip-style classification.
  - `EntityDescription.labels?: EntityLabel[]` for structured key/value metadata rendering.
  - `EntityLabel` metadata now supports visual semantics (`color`, `colorForeground`, `tooltip`, `active`) and inline icon descriptors (`name`, `color`, `spin`).
- Improved tree/card presenter UX parity with clearer empty states and search-result handling for entity collections.
- Refined searchable tree result plumbing to report concrete matched entities, improving determinism and simplifying no-result checks.
- Fixed searchable tree highlight lifecycle regressions (including nested tree/card contexts) to prevent initial match flicker/flash-out in active searches.
- Stabilized tree collection rendering updates to avoid unnecessary node regeneration during search-driven rerenders.
- Corrected deferred-force-update behavior used by tree widgets to prevent duplicate immediate+deferred update paths.
- Refactored `EntityDefinition` to use explicit component banks per concern instead of a single mixed component collection.
- Added reusable bank abstractions (`ComponentBank`, `PreferredSetBank`) and extracted concern-specific banks (`EntityEncoderBank`, `EntitySearchBank`).
- Improved preferred describer preference behavior using `SetSetting`-backed controls and cleaner per-definition setting integration.
- Reduced bank API indirection by standardizing on `getItems()`/`getPreferred()` usage.
- Improved Reactor initialization ordering to reduce startup races across workspace, prefs, and UX store setup.
- Fixed input-dialog initial value propagation so provided defaults are shown correctly.
- Fixed `ArrayInput` initialization so initial values render immediately (without needing extra user interaction).
- Improved dialog module imports to avoid root barrel coupling in dialog widget internals.
- Fixed card presenter overflow/bleed issues so nested tree content is clipped correctly within card bounds.
- Improved metadata/tag readability in card presenter output:
  - metadata icon colors now follow theme-aware foreground defaults more consistently.
  - tag chip styling was tuned to be less harsh while preserving contrast and readability.
- Refined built-in theme card borders across Reactor/Scarlet/Oxide/Journey and improved Reactor Light hierarchy/contrast balance for clearer panel/tray/header boundaries.
- Overhauled the Reactor Light theme palette to be easier on the eyes while improving structural clarity (surfaces, separators, metadata readability, and card/tag presentation).
- Fixed a tree-search clear regression where stale text matches could persist until hover, by ensuring tree leaf/node widgets perform a post-listener-registration refresh.
