# @journeyapps-labs/reactor-mod

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
