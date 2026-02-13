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
- Refactored `EntityDefinition` to use explicit component banks per concern instead of a single mixed component collection.
- Added reusable bank abstractions (`ComponentBank`, `PreferredSetBank`) and extracted concern-specific banks (`EntityEncoderBank`, `EntitySearchBank`).
- Improved preferred describer preference behavior using `SetSetting`-backed controls and cleaner per-definition setting integration.
- Reduced bank API indirection by standardizing on `getItems()`/`getPreferred()` usage.
- Improved Reactor initialization ordering to reduce startup races across workspace, prefs, and UX store setup.
- Fixed input-dialog initial value propagation so provided defaults are shown correctly.
- Fixed `ArrayInput` initialization so initial values render immediately (without needing extra user interaction).
- Improved dialog module imports to avoid root barrel coupling in dialog widget internals.
