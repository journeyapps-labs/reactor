import { EntityDefinition } from './EntityDefinition';

export interface EntityDefinitionErrorOptions {
  message: string;
  definition: EntityDefinition;
  context?: Record<string, unknown>;
}

export class EntityDefinitionError extends Error {
  readonly context?: Record<string, unknown>;
  readonly definition: EntityDefinition;

  constructor(options: EntityDefinitionErrorOptions) {
    super(options.message);
    this.name = 'EntityDefinitionError';
    this.context = options.context;
    this.definition = options.definition;
  }
}
