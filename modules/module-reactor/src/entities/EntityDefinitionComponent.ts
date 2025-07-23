import { EntityDefinition } from './EntityDefinition';
import { BaseListener, BaseObserver } from '@journeyapps-labs/lib-reactor-utils';

export abstract class EntityDefinitionComponent<T extends BaseListener = BaseListener> extends BaseObserver<T> {
  definition: EntityDefinition;

  constructor(public type: string) {
    super();
  }

  get system() {
    return this.definition.system;
  }

  setDefinition(definition: EntityDefinition) {
    this.definition = definition;
  }
}
