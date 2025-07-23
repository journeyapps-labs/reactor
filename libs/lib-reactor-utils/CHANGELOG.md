# @journeyapps-platform/ide-lib-reactor-utils

## 1.0.1

### Patch Changes

- ef2076c: Upgrade all dependencies

## 4.1.0

### Minor Changes

- d96ca8e: - New utils for parsing and working with displaying dates

### Patch Changes

- fa315a8: Add safeguards to TokenWrapper fetching a token, to prevent a deadlock

## 4.0.1

### Patch Changes

- 84a3445: bump dependencies

## 4.0.0

### Major Changes

- 7cdc18e: - Moved to stage3 decorators
  - Migrated to new mobx decorator styles
  - Removed inversify in favor of our own ioc library which is now compatible with stage 3 decorators
  - renamed lazyInject to inject
  - ranamed iocContainer to ioc

## 3.2.0

### Minor Changes

- 685192524: - Made Token provisioning much better, with much less code
  - Introduced SDK types for the different reactor modules
  - introduce SDK clients for each module for better separation of concerns
  - Make boot -> app selection slightly more robust and dont overlay welcome dialogs ontop of app not found dialogs
  - use types correctly in the server (from the sdk types)

## 3.1.0

### Minor Changes

- b1a4badfb: - Reactor panels have new encode and decode methods for transcoding entities using the entitity definition system.
  - UI fixes for buttons, cards and tabs

## 3.0.0

### Major Changes

- 3e4bc89e: Break up entities into better packages and unify the utils packages

## 2.0.1

### Patch Changes

- 3997e69c: - UI and UX fixes

## 2.0.0

### Major Changes

- 02e4c147: - Reworked Trees
  - improved presenters
  - improved the core-tree api
  - new methods to observer render and attached state
  - upgraded all dependencies

### Minor Changes

- d4ad9ef0: Added `AbstractPresenterContext` for managing presenter instance state.

## 1.3.1

### Patch Changes

- 44fb7057: Moved `PaginatedCollection` to Reactor module
- 4cebc941: [fix] bug with binary files from templates not being created
  [fix] bug with advanced attributes autocomplete not initializing correctly on mount
  [improve] the changesets PR workflow
  [improve] remove react-router
