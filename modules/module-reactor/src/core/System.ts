import { ioc } from '../inversify.config';
import { observable } from 'mobx';
import { EntityDefinition } from '../entities/EntityDefinition';
import { EncodedEntity } from '../entities/components/encoder/EntityEncoderComponent';
import { AbstractStore } from '../stores/AbstractStore';
import { Newable } from '@journeyapps-labs/common-ioc';
import { ActionStore } from '../stores/actions/ActionStore';
import { ComboBoxStore2 } from '../stores/combo2/ComboBoxStore2';
import { Action } from '../actions/Action';

export interface SystemOptions {
  actionStore: ActionStore;
  comboBoxStore2: ComboBoxStore2;
}

export class System {
  @observable
  accessor ideName: string;

  // providers
  definitions: Map<string, EntityDefinition>;
  stores: Set<AbstractStore>;

  constructor(protected options: SystemOptions) {
    this.stores = new Set();
    this.definitions = new Map();
    this.ideName = 'Reactor';
  }

  //!--------------- STORES -----------------------

  addStore<T extends AbstractStore>(symbol: Newable<T>, store: T) {
    this.stores.add(store);
    ioc.bind(symbol).toConstantValue(store);
  }

  unbindStore<T extends AbstractStore>(symbol: Newable<T>) {
    this.stores.delete(ioc.get(symbol));
    ioc.unbind(symbol);
  }

  getStores(): AbstractStore[] {
    return Array.from(this.stores.values());
  }

  //!--------------- ENTITIES ---------------------

  getEntityDefinitions() {
    return Array.from(this.definitions.values());
  }

  registerDefinition(definition: EntityDefinition) {
    definition.setSystem(this);
    this.definitions.set(definition.type, definition);
  }

  getDefinition<T>(type: string): EntityDefinition<T> | null {
    return this.definitions.get(type);
  }

  getDefinitionForEntity<T>(entity: any): EntityDefinition<T> | null {
    if (entity == null) {
      return null;
    }
    return this.getEntityDefinitions().find((d) => d.matchEntity(entity)) || null;
  }

  decodeEntity<T>(entity: EncodedEntity): Promise<T> {
    const definition = this.getDefinition<T>(entity.type);
    if (!definition) {
      return null;
    }
    return definition.decode(entity);
  }

  encodeEntity(entity: any, throws = true) {
    const definition = this.getDefinitionForEntity(entity);
    if (!definition) {
      return null;
    }
    return definition.encode(entity, throws);
  }

  /**
   * @deprecated use actionStore directly
   * @param action
   */
  registerAction(action: Action) {
    this.options.actionStore.registerAction(action);
  }
}
