---
"@journeyapps-labs/reactor-mod": minor
---

Implemented nested combobox behavior in `combo2`, improved keyboard/list ergonomics, and expanded demo coverage.

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
