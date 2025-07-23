# @journeyapps-platform/ide-lib-reactor

## 1.0.2

### Patch Changes

- 6672f44: exported modules are now named differently

## 1.0.1

### Patch Changes

- ef2076c: Upgrade all dependencies
- ac217a8: Hotfixes due to some library upgrades
- Updated dependencies [ef2076c]
- Updated dependencies [ac217a8]
  - @journeyapps-labs/lib-reactor-search@1.0.1
  - @journeyapps-labs/lib-reactor-utils@1.0.1
  - @journeyapps-labs/lib-ioc@1.0.1

## 8.5.0

### Minor Changes

- 7e565ed: - Allow tooltips on form inputs
  - Allow tracing for flight log on form dialog directives
- 6a2c5c8: If graphs contain thresholds, set the domain on the Y axis, to include the threshold.
- d96ca8e: - New widgets for displaying dates in more configurable ways
  - New preferences for storing date format, showing timezone and which locale to use
  - New visor metadata for these new settings
- c0c21bc: - New DialogStore2 which works with directives
  - New FormDialogDirective
  - Improvements to the FloatingPanelButtons which are used in dialogs so that they can now display tooltips
- 68866d7: Added the ability to set the sortKey for DescendantEntity category nodes

### Patch Changes

- 1cb2755: Number inputs now validate their values correctly
- b6eb31b: - Trees now have a hover event
  - Tree presenters are now given the hover field as a secondary parameter
- d1f06a6: - DescendentEntityProvider now passes all category options to its tree leaf except for the right click handler
  - Fixed boolean inputs not hiding when told to hide
- Updated dependencies [fa315a8]
- Updated dependencies [d96ca8e]
  - @journeyapps-platform/ide-lib-reactor-utils@4.1.0
  - @journeyapps-platform/ide-lib-reactor-search@2.0.2

## 8.4.1

### Patch Changes

- 7122f57: Bumped runtime, rc, etc. package versions

## 8.4.0

### Minor Changes

- 19a5f27: Add `realtime` property to graph values allowing graphs to indicate realtime data with an animated section

## 8.3.0

### Minor Changes

- 560861f: New function to redirect to admin portal plans page
- 63b87ed: Type (Generics) improvements to the controls with new helper methods making it easier to typecast

### Patch Changes

- be41988: Make icons fixed width to help with alignment issues

## 8.2.0

### Minor Changes

- f23d2df: - autoSelectIsolatedTarget parameter on entity actions to select the first entity if there is an applicable simple search engine component
  - autoSelectIsolatedItem on ProviderActionParameter
  - new autoSelectIsolatedItem function on SimpleEntitySearchEngine

### Patch Changes

- 559c7e9: Fix an issue with button validators holding stale references

## 8.1.0

### Minor Changes

- 3fe8b93: Added TextAreaInput for long text inputs.

## 8.0.0

### Major Changes

- c84adf8: Input dialog submitText option changed to submitButton and cancelButton

### Patch Changes

- f5fe2b0: Markdown now renders in input dialogs if provided

## 7.1.1

### Patch Changes

- f6cccd8: - Fixed weird scroll-with-mouse issue in the cmd palette where other items would fight to scroll into view
  - Fix normal reactor shortcuts not serializing correctly

## 7.1.0

### Minor Changes

- a9a489c: [sugar] InlineTreepresenter can now specifiy whether cached nodes are used via cachedTreeEntities field
- 0722b6e: - Fixed refreshDescendants not being called correctly when no sub-category node was provided

## 7.0.0

### Major Changes

- 84a3445: Remove overconstain setting since Reactor is smart about this now

### Patch Changes

- 84a3445: bump dependencies
- Updated dependencies [84a3445]
  - @journeyapps-platform/ide-lib-reactor-builder@3.0.1
  - @journeyapps-platform/ide-lib-reactor-search@2.0.1
  - @journeyapps-platform/ide-lib-reactor-utils@4.0.1
  - @journeyapps-platform/types-reactor@0.1.1
  - @journeyapps-platform/ide-lib-ioc@1.0.1

## 6.1.0

### Minor Changes

- d94d0c6: Add new `batch_concurrency` option on `EntityAction` which defaults to 1

### Patch Changes

- d94d0c6: 2 second debug delay was still sitting in the batch processor loop code

## 6.0.0

### Major Changes

- 7cdc18e: - Moved to stage3 decorators
  - Migrated to new mobx decorator styles
  - Removed inversify in favor of our own ioc library which is now compatible with stage 3 decorators
  - renamed lazyInject to inject
  - ranamed iocContainer to ioc

### Minor Changes

- 28baf64: - new 'trace' field on panel buttons which enables tracing on the button automatically (similarly to action tracing)

### Patch Changes

- 28b7253: Make a few more widgets more reactive
- d1415dd: - [fix] race condition with importing previously exported settings
  - [fix] rendering issue with new monaco sticky breadcrumb
- ca1be0e: - Cosmetic: improve button icons and padding
  - Cosmetic: Swap out react-gravatar with react-avatar
  - Cosmetic: add sorting icons to set inputs
- Updated dependencies [7cdc18e]
  - @journeyapps-platform/ide-lib-reactor-builder@3.0.0
  - @journeyapps-platform/ide-lib-reactor-search@2.0.0
  - @journeyapps-platform/ide-lib-reactor-utils@4.0.0
  - @journeyapps-platform/ide-lib-ioc@1.0.0

## 5.3.0

### Minor Changes

- 32ac3fc87: - Option to render boolean inputs inline as checkboxes
  - Option to specify element spacing on form model rendering
  - Improve jank with ArrayInput constantly regenerating its children causing focus to be lost
  - Cosmetic improvements to the InputContainerWidget
  - Desc can be provided to InputContainerWidget, as well as all form inputs
- 801b1816d: - btns can now accept a simplified validator
  - combo action parameter is now given the event position
  - btn validation improvements
- 961157369: Show tooltips for validator errors
- 275a8e335: - new theme property for plan borders
  - plan SUPPORT_EMAIL environment variable

## 5.2.0

### Minor Changes

- 545c74462: Add new highlight field to Btn base interface to callout a button

### Patch Changes

- 545c74462: Fix issues with the tab indicator accent bar

## 5.1.0

### Minor Changes

- b5f1569d6: Added DateControl and DateInput

## 5.0.0

### Major Changes

- 6f7123461: - [feature] ButtonControl
  - [feature] ActionButtonControl
  - [breaking] action validdation now returns validation result

### Minor Changes

- 782050bf5: Add context generated event to the AbstractEntityTreePresenter

## 4.5.1

### Patch Changes

- 8ef898569: Improve styles, Fix the recently introduced number input and some internal refactoring around how forms render their children.

## 4.5.0

### Minor Changes

- 685192524: - Made Token provisioning much better, with much less code
  - Introduced SDK types for the different reactor modules
  - introduce SDK clients for each module for better separation of concerns
  - Make boot -> app selection slightly more robust and dont overlay welcome dialogs ontop of app not found dialogs
  - use types correctly in the server (from the sdk types)

### Patch Changes

- Updated dependencies [685192524]
  - @journeyapps-platform/ide-lib-reactor-utils@3.2.0
  - @journeyapps-platform/types-reactor@0.1.0
  - @journeyapps-platform/ide-lib-reactor-search@1.0.2

## 4.4.0

### Minor Changes

- 478094f49: - [added] ArraySetInput
  - [added] ArrayInput
  - [added] GroupInput
  - [added] NumberInput
  - [added] LifecycleCollection which can intellegently handle the lifecycle of models based on raw data
  - [improved] Various improvements to the Reactor entity definition components, particularly with search and comboboxes
  - [improved] OXIDE module will now filter apps according to feature flags

## 4.3.0

### Minor Changes

- c15a6151e: Guide completion events for flight log, have been moved to reactor so it can be logged for all guides across all modules
- 0622fe9c6: - Informative step was moved to the core reactor module
  - improvements were made to the guide system with bug fixes
  - added support for links in the tooltip steps
  - reworked the editor guide highlighting system

## 4.2.0

### Minor Changes

- d31ebcb86: New flag in the SimpleEntitySearchEngineComponent to disable further filtering search results with the matcher
- 2471587f6: ColumnFormModel can be rendered as two standard divisions using a new mode field set to DIVISIONS

### Patch Changes

- f88c128fc: If multiple search engines are registered, use the provided name for the combobox directive

## 4.1.0

### Minor Changes

- b1a4badfb: - Reactor panels have new encode and decode methods for transcoding entities using the entitity definition system.
  - UI fixes for buttons, cards and tabs

### Patch Changes

- Updated dependencies [b1a4badfb]
  - @journeyapps-platform/ide-lib-reactor-utils@3.1.0
  - @journeyapps-platform/ide-lib-clients@3.0.1
  - @journeyapps-platform/ide-lib-reactor-search@1.0.1

## 4.0.0

### Major Changes

- 3e4bc89e: Break up entities into better packages and unify the utils packages

### Patch Changes

- Updated dependencies [3e4bc89e]
  - @journeyapps-platform/ide-lib-reactor-search@1.0.0
  - @journeyapps-platform/ide-lib-reactor-utils@3.0.0
  - @journeyapps-platform/ide-lib-clients@3.0.0

## 3.2.0

### Minor Changes

- 211577bb: - [new] Columns Form Model
  - [new] API to disable overconstrained workspace checks

## 3.1.2

### Patch Changes

- 3997e69c: - UI and UX fixes
- Updated dependencies [3997e69c]
  - @journeyapps-platform/ide-lib-reactor-utils@2.0.1

## 3.1.1

### Patch Changes

- 7038274d: Fixed issue with infinite expired session dialogs stacking

## 3.1.0

### Minor Changes

- 1c8b31d5: - Can now add static buttons to entity panel toolbars

## 3.0.0

### Major Changes

- 02e4c147: - Reworked Trees
  - improved presenters
  - improved the core-tree api
  - new methods to observer render and attached state
  - upgraded all dependencies

### Minor Changes

- d4ad9ef0: Added `AbstractPresenterContext` for managing presenter instance state.

### Patch Changes

- Updated dependencies [02e4c147]
- Updated dependencies [d4ad9ef0]
  - @journeyapps-platform/ide-lib-reactor-builder@2.0.0
  - @journeyapps-platform/ide-lib-reactor-utils@2.0.0
  - @journeyapps-platform/ide-lib-clients@2.0.0
  - @journeyapps-platform/ide-lib-utils@3.0.0

## 2.6.0

### Minor Changes

- b80827dc: - [added] Controls can now have their options updated
  - [added] SelectInput can now update its options

### Patch Changes

- Updated dependencies [b80827dc]
  - @journeyapps-platform/ide-lib-utils@2.3.0
  - @journeyapps-platform/ide-lib-clients@1.2.4

## 2.5.1

### Patch Changes

- 44fb7057: Moved `PaginatedCollection` to Reactor module
- 4cebc941: [fix] bug with binary files from templates not being created
  [fix] bug with advanced attributes autocomplete not initializing correctly on mount
  [improve] the changesets PR workflow
  [improve] remove react-router
- Updated dependencies [44fb7057]
- Updated dependencies [4cebc941]
- Updated dependencies [b2b9f070]
  - @journeyapps-platform/ide-lib-reactor-utils@1.3.1
  - @journeyapps-platform/ide-lib-clients@1.2.3
  - @journeyapps-platform/ide-lib-utils@2.2.3
