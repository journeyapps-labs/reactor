# @journeyapps-labs/reactor-mod

## 5.0.2

### Patch Changes

- 70533b4: Improve tree and descendant-loading behavior in Reactor widgets.
  - Refactor core tree node rendering into smaller widget/hook-focused modules for maintainability.
  - Add descendant loading error badges with actionable feedback handling.
  - Improve searchable entity/core tree behavior and related tree presenter integrations.
  - Align tree/demo-facing icon and state handling updates used by the current branch.

## 5.0.1

### Patch Changes

- 17f54d8: Refine tree rendering and search behavior, and expand demo coverage.
  - Update core tree/search internals in `reactor-mod` with the latest tree-system refactors and presenter integration adjustments.

## 5.0.0

### Major Changes

- 53bb55b: Expanded built-in theming and completed major editor/core migration off deprecated systems.
  - Added a new built-in core theme: `Bunny` (purple-forward), including registration, module wiring, and exports.
  - Refined core dark-theme polish for `Reactor` and `JourneyApps` to improve surface hierarchy, readability, card/table integration, and accent consistency.
  - Continued `Reactor Light` comfort pass with better separator clarity, softened contrast, and improved metadata/tag readability.
  - Tuned card metadata/tag chip styling to be more theme-aware and less visually harsh across light/dark themes.
  - Made card selection emphasis theme-specific across built-ins so selected states follow each theme accent language (for example Scarlet red, Journey orange, Bunny purple) instead of a shared blue treatment.
  - Improved selected tree-row background consistency across built-in themes, including Reactor-specific behavior where selection fill should remain subtle/neutral.
  - Refined panel/search icon contrast in light mode (including search-history affordances and tray glyph balance) for clearer visibility without reintroducing harsh saturation.
  - Polished status-card presentation in Reactor-family themes with better surface/background pairing and clearer border separation.
  - Improved table row striping behavior so even/odd row backgrounds are consistently rendered and easier to scan.
  - Reduced divider/separator intensity on key cards and settings surfaces so section boundaries read clearly without overpowering content.
  - Added safer theme-fragment resolution fallback logic to avoid hard runtime failures when a fragment lacks a requested theme key.
  - Added editor theme coupling for `Bunny` and guarded editor theme sync paths to avoid undefined selection/serialization regressions.
  - Updated action retrieval helpers in editor/demo/core touchpoints to use `ActionStore` directly.

  Breaking/migration notes:
  - Replaced editor theme provider workflow with entity-definition workflow (`EditorThemeEntityDefinition`) and migrated editor theme selection setting from `ProviderControl` to `EntitySetting`.
  - Removed legacy `EditorThemeProvider` usage and registration in editor module bootstrap.

- a96420d: Modernized core entity/action internals and removed deprecated provider + legacy DnD surfaces.
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

  Breaking/migration notes:
  - Removed deprecated provider-based flows from core/editor paths and migrated key selections to entity definitions (`Workspace`, `EditorTheme`).
  - `System` is no longer the action access surface in active code paths; action lookup/registration now goes through `ActionStore`.
  - Migrated remaining legacy drag/drop integrations in active widget paths to `dnd3` hooks (`useDraggableEntity` / `useDraggableRaw`), and removed old `dnd`/`dnd2` usage from migrated surfaces.
  - Updated built-in and demo/editor module wiring to register and resolve actions through `ActionStore` instead of legacy `System` action helpers.

### Minor Changes

- 489e215: Implemented nested combobox behavior in `combo2`, improved keyboard/list ergonomics, and expanded demo coverage.

  ### Combo2 / nested comboboxes
  - Updated `ComboBoxStore2` and `ComboBox2Layer` flow to support rendering multiple active directives at once.
  - Added stable directive identity to `ComboBoxDirective` to improve multi-directive rendering behavior.
  - Extended simple directive behavior to open child directives from item `children` and support cascading nested menus.
  - Updated combobox item model usage to better support nested/right-content rendering paths.

  ### Combobox/list component cleanup
  - Refactored `ComboBoxItemWidget` with cleaner composition and right-side indicator handling for nested entries.
  - Converted `ComboBoxWidget` and `ControlledListWidget` to functional implementations and simplified selection/hover flow.
  - Added reusable `useKeyboardContext` hook and integrated it into list navigation.
  - Adjusted `RawComboBoxWidget` / `MultiDirectiveComboWidget` integration for updated hover payloads and keyboard flow.
  - Minor dimension observer update to support positioning updates used by nested menus.

  ### Entity-system menu shaping
  - Updated entity context-menu assembly in `EntityDefinition`:
    - deduplicates actions by action id before render,
    - supports grouped top-level action branches when multiple action groups exist,
    - keeps docs in nested resources structure.
  - Improved guide combo selection tracking for combo2 multi-directive behavior.

  ### Theme polish for combobox selection state
  - Updated Reactor and Hexagon combobox selected backgrounds to use theme-consistent accent styles.

  ### Demo updates
  - Expanded demo combobox panel with richer nested menu scenarios.
  - Added real entity-driven context-menu demo coverage.
  - Added demo todo actions (`RenameTodoAction`, `DuplicateTodoAction`) and grouped action metadata to exercise grouped nested menus.
  - Updated demo todo definition/model wiring to support richer nested and entity-menu behavior.

### Patch Changes

- 9fcd0a4: Re-export `EmptyReactorPanelModel` from the package index so consumers can construct it from `@journeyapps-labs/reactor-mod`.
- abd47fc: package bumps
- Updated dependencies [abd47fc]
  - @journeyapps-labs/lib-reactor-utils@2.0.9
  - @journeyapps-labs/lib-reactor-search@1.0.10

## 4.0.2

### Patch Changes

- 2bea4b2: - Fix issue with workspace deserialization race condition causing overconstraint check to fail
  - Remove lots of dead imports and dead code
  - Provide fallback font until primary font has loaded
- 2bea4b2: Bump all dependenciess
- Updated dependencies [2bea4b2]
  - @journeyapps-labs/lib-reactor-utils@2.0.8
  - @journeyapps-labs/lib-reactor-search@1.0.9

## 4.0.1

### Patch Changes

- e6ff8ce: Bump all dependencies
- Updated dependencies [e6ff8ce]
  - @journeyapps-labs/lib-reactor-utils@2.0.7
  - @journeyapps-labs/lib-reactor-search@1.0.8

## 4.0.0

### Major Changes

- 0b471b5: Deserialization in AbstractStore needs to be considered async in order to emit when deserilization occured.

## 3.0.3

### Patch Changes

- 7f06677: Update and ensure action validation in additionalButtons

## 3.0.2

### Patch Changes

- 9fe67f3: Small bug with positioning not being set with the SmartPositionWidget

## 3.0.1

### Patch Changes

- b691ff0: Fix issues with module-editor due to new monaco changes
- Updated dependencies [b691ff0]
  - @journeyapps-labs/lib-reactor-utils@2.0.6
  - @journeyapps-labs/lib-reactor-search@1.0.7

## 3.0.0

### Major Changes

- 2b3fd96: help buttons were removed, as they were mot used for the meta icons

### Patch Changes

- 2b3fd96: Bump all dependencies
- 2b3fd96: Fixed a positioning issue with the dimension observer
- Updated dependencies [2b3fd96]
  - @journeyapps-labs/lib-reactor-utils@2.0.5
  - @journeyapps-labs/lib-reactor-search@1.0.6

## 2.1.1

### Patch Changes

- 9f8ab19: Make sure that MultiSelectInput has values to enumerate over

## 2.1.0

### Minor Changes

- 6ab9986: - Added MultiSelectInput
  - Added MultiComboBoxDirective
  - Fixed TextAreaInput styling

### Patch Changes

- 1bd2ef3: Bump all dependencies
- Updated dependencies [1bd2ef3]
  - @journeyapps-labs/lib-reactor-search@1.0.5
  - @journeyapps-labs/lib-reactor-utils@2.0.4

## 2.0.0

### Major Changes

- 49b70e1: - Date inputs can now accept null
  - Improved nested panel serialization checks
  - Date controls now respect date display options configured in Reactor

### Patch Changes

- 5eb207d: All deps upgraded

## 1.2.3

### Patch Changes

- cb8db2f: - bump all dependencies
  - fix an issue where workspace constraint system may activate on an empty model causing an error
  - improve theme colors for table row buttons
  - update column display type to accept JSX.Element
- Updated dependencies [cb8db2f]
  - @journeyapps-labs/lib-reactor-utils@2.0.3
  - @journeyapps-labs/lib-reactor-search@1.0.4

## 1.2.2

### Patch Changes

- 4596785: - Improve themes, specifically input fields now have borders
  - Add support for SVG images as ImageMediaType
  - Consolidate the Switch component everywhere in Reactor
  - Improve the ImageInput and add the ability to clear images
- 4596785: Bump all dependencies
- Updated dependencies [4596785]
  - @journeyapps-labs/lib-reactor-utils@2.0.2
  - @journeyapps-labs/lib-reactor-search@1.0.3

## 1.2.1

### Patch Changes

- 26c9fad: Fix an issue where showDialog would hang if no handler was provided to the FormDialogDirective

## 1.2.0

### Minor Changes

- 0612bc5: Fix a positioning bug for SmartPositionWidget by introducing a new useDimensionObserver hook to track position every 10ms

### Patch Changes

- f4006d1: Bumped dependencies
- Updated dependencies [f4006d1]
  - @journeyapps-labs/lib-reactor-utils@2.0.1
  - @journeyapps-labs/lib-reactor-search@1.0.2

## 1.1.1

### Patch Changes

- e40a220: Add more libraries to the exported list

## 1.1.0

### Minor Changes

- d38098f: New createLogger function and also move to the new labs libraries

### Patch Changes

- Updated dependencies [d38098f]
- Updated dependencies [d38098f]
  - @journeyapps-labs/lib-reactor-search@1.0.1
  - @journeyapps-labs/lib-reactor-utils@2.0.0

## 1.0.1

### Patch Changes

- 46d4bf9: Fix an issue with the react version not matching the react-dom version
