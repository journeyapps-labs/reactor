# @journeyapps-platform/ide-lib-reactor-data-layer

## 1.0.1

### Patch Changes

- ef2076c: Upgrade all dependencies
- Updated dependencies [ef2076c]
  - @journeyapps-labs/lib-reactor-search@1.0.1
  - @journeyapps-labs/lib-reactor-utils@1.0.1

## 2.1.1

### Patch Changes

- Updated dependencies [fa315a8]
- Updated dependencies [d96ca8e]
  - @journeyapps-platform/ide-lib-reactor-utils@4.1.0
  - @journeyapps-platform/ide-lib-reactor-search@2.0.2

## 2.1.0

### Minor Changes

- 6829c9c: Errors from load() calls on Collection are now rethrown

## 2.0.2

### Patch Changes

- 84a3445: bump dependencies
- Updated dependencies [84a3445]
  - @journeyapps-platform/ide-lib-reactor-search@2.0.1
  - @journeyapps-platform/ide-lib-reactor-utils@4.0.1

## 2.0.1

### Patch Changes

- 225bf4b: Fix paginated collection incorrectly always appending items when a new initialLoad or loadAll command is fired.

## 2.0.0

### Major Changes

- 7cdc18e: - Moved to stage3 decorators
  - Migrated to new mobx decorator styles
  - Removed inversify in favor of our own ioc library which is now compatible with stage 3 decorators
  - renamed lazyInject to inject
  - ranamed iocContainer to ioc

### Patch Changes

- Updated dependencies [7cdc18e]
  - @journeyapps-platform/ide-lib-reactor-search@2.0.0
  - @journeyapps-platform/ide-lib-reactor-utils@4.0.0

## 1.1.2

### Patch Changes

- 545c74462: Fix transform issues on sucessive paginated calls in the PaginatedCollection

## 1.1.1

### Patch Changes

- @journeyapps-platform/ide-lib-reactor-search@1.0.2

## 1.1.0

### Minor Changes

- 478094f49: - [added] ArraySetInput
  - [added] ArrayInput
  - [added] GroupInput
  - [added] NumberInput
  - [added] LifecycleCollection which can intellegently handle the lifecycle of models based on raw data
  - [improved] Various improvements to the Reactor entity definition components, particularly with search and comboboxes
  - [improved] OXIDE module will now filter apps according to feature flags

## 1.0.1

### Patch Changes

- @journeyapps-platform/ide-lib-reactor-search@1.0.1

## 1.0.0

### Major Changes

- 3e4bc89e: Break up entities into better packages and unify the utils packages

### Patch Changes

- Updated dependencies [3e4bc89e]
  - @journeyapps-platform/ide-lib-reactor-search@1.0.0
