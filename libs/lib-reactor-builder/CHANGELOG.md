# @journeyapps-platform/ide-lib-reactor-builder

## 2.0.1

### Patch Changes

- c5ab29e: Rework exported libs

## 2.0.0

### Major Changes

- ac217a8: Libraries are now bundled as self contained modules in the same way that VSCode bundles libraries

### Patch Changes

- ef2076c: Upgrade all dependencies

## 3.0.1

### Patch Changes

- 84a3445: bump dependencies

## 3.0.0

### Major Changes

- 7cdc18e: - Moved to stage3 decorators
  - Migrated to new mobx decorator styles
  - Removed inversify in favor of our own ioc library which is now compatible with stage 3 decorators
  - renamed lazyInject to inject
  - ranamed iocContainer to ioc

## 2.0.0

### Major Changes

- 02e4c147: - Reworked Trees
  - improved presenters
  - improved the core-tree api
  - new methods to observer render and attached state
  - upgraded all dependencies

### Minor Changes

- d4ad9ef0: Added `AbstractPresenterContext` for managing presenter instance state.
