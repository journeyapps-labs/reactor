# @journeyapps-platform/ide-lib-server

## 2.0.1

### Patch Changes

- c5ab29e: Rework exported libs

## 2.0.0

### Major Changes

- ac217a8: Better separation of concerns and renaming of some of the functions that deal with working with reactor html vs raw html

### Patch Changes

- ef2076c: Upgrade all dependencies
- b7560ab: Fix the server not working with redis correctly
- Updated dependencies [ef2076c]
  - @journeyapps-labs/lib-reactor-utils@1.0.1
  - @journeyapps-platform/types-reactor@0.1.2

## 3.2.3

### Patch Changes

- fa315a8: Add error handling to boot sequence for problematic scripts
- Updated dependencies [fa315a8]
- Updated dependencies [d96ca8e]
  - @journeyapps-platform/ide-lib-reactor-utils@4.1.0

## 3.2.2

### Patch Changes

- 84a3445: bump dependencies
- Updated dependencies [84a3445]
  - @journeyapps-platform/ide-lib-reactor-utils@4.0.1
  - @journeyapps-platform/types-reactor@0.1.1

## 3.2.1

### Patch Changes

- Updated dependencies [7cdc18e]
  - @journeyapps-platform/ide-lib-reactor-utils@4.0.0

## 3.2.0

### Minor Changes

- df18629eb: - dont clear session data when setting up passport user profile
  - expose org_id accessor on UserSession to cater for forwards compatible $oid fixes

## 3.1.1

### Patch Changes

- 382dba73d: If no session is set, we should not attempt to populate user info

## 3.1.0

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

## 3.0.1

### Patch Changes

- Updated dependencies [b1a4badfb]
  - @journeyapps-platform/ide-lib-reactor-utils@3.1.0

## 3.0.0

### Major Changes

- 3e4bc89e: Break up entities into better packages and unify the utils packages

### Patch Changes

- Updated dependencies [3e4bc89e]
  - @journeyapps-platform/ide-lib-reactor-utils@3.0.0

## 2.0.0

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
  - @journeyapps-platform/ide-lib-utils@3.0.0

## 1.2.4

### Patch Changes

- Updated dependencies [b80827dc]
  - @journeyapps-platform/ide-lib-utils@2.3.0

## 1.2.3

### Patch Changes

- a6ed0713: Better logging on 500 errors when trying to serve index file
- Updated dependencies [b2b9f070]
  - @journeyapps-platform/ide-lib-utils@2.2.3
