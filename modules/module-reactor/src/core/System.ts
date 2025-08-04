import * as _ from 'lodash';
import { Action, ActionComboBoxItem, ActionEvent, ActionListener, ActionSource } from '../actions/Action';
import { EntityAction } from '../actions/parameterized/EntityAction';
import { ioc, inject } from '../inversify.config';
import { Provider, SerializedEntity } from '../providers/Provider';
import { observable } from 'mobx';
import { Tracer } from './Tracer';
import { ParameterizedAction } from '../actions/parameterized/ParameterizedAction';
import { ProviderActionParameter } from '../actions/parameterized/params/ProviderActionParameter';
import { SystemInterface, SystemListener } from './SystemInterface';
import { EntityDefinition } from '../entities/EntityDefinition';
import { EncodedEntity } from '../entities/components/encoder/EntityEncoderComponent';
import { AbstractStore } from '../stores';
import { ComboBoxStore2 } from '../stores/combo2/ComboBoxStore2';
import { SimpleComboBoxDirective } from '../stores/combo2/directives/SimpleComboBoxDirective';
import { MousePosition } from '../layers/combo/SmartPositionWidget';
import { Newable } from '@journeyapps-labs/common-ioc';
import { BaseObserver } from '@journeyapps-labs/common-utils';

export interface BaseActionSelectionParameters {
  event?: MousePosition;
  source: ActionSource;
  exclude?: string[];
  additional?: ParameterizedAction[];
}

export interface SerializedActionSelectionParameters extends BaseActionSelectionParameters {
  /**
   * Target entity
   */
  serializedEntity: SerializedEntity;
}

export interface DeserializedActionSelectionParameters extends BaseActionSelectionParameters {
  /**
   * Target entity
   */
  entity: any;
  type: string;
}

type StartEntityActionSelectionParameters = SerializedActionSelectionParameters | DeserializedActionSelectionParameters;

export interface BroadcastEvent {
  event: ActionEvent;
  action: string;
}

export class System extends BaseObserver<SystemListener> implements SystemInterface {
  @observable
  accessor actions: { [name: string]: Action };

  @observable
  accessor ideName: string;

  // providers
  providers: { [type: string]: Provider };
  definitions: Map<string, EntityDefinition>;
  actionListeners: Map<string, () => any>;
  broadcastChannel: BroadcastChannel;
  tracer: Tracer;
  stores: Set<AbstractStore>;

  @inject(ComboBoxStore2)
  accessor comboBoxStore2: ComboBoxStore2;

  constructor() {
    super();
    this.providers = {};
    this.actions = {};
    this.stores = new Set();
    this.definitions = new Map();
    this.actionListeners = new Map();
    this.ideName = 'Reactor';
    this.tracer = new Tracer();
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

  //!---------------------------------------------

  configureTracer(tracer: Tracer) {
    this.tracer = tracer;
  }

  broadcast(action: Action, event: ActionEvent) {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        action: action.options.name,
        event: {
          ...event,
          position: null
        }
      } as BroadcastEvent);
    }
  }

  async startEntityActionSelection(options: StartEntityActionSelectionParameters) {
    // parameter normlization
    let serialized = (options as SerializedActionSelectionParameters).serializedEntity;
    let deserialized = (options as DeserializedActionSelectionParameters).entity;
    if (!serialized) {
      options = options as DeserializedActionSelectionParameters;
      serialized = this.getProvider(options.type).serialize(options.entity);
    }

    let actions: Action[] = await this.getActionsForEntity(serialized);

    // optionally exclude actions
    options.exclude = options.exclude || [];

    // additional should be part of the excluded since we want to prioritize the curried versions
    if (options.additional) {
      options.exclude = options.exclude.concat(options.additional.map((a) => a.options.name));
    }

    actions = actions.filter((action) => {
      return options.exclude.indexOf(action.options.name) === -1;
    });

    if (options.additional) {
      actions = actions.concat(
        options.additional.map((a) => {
          a.setApplication(this);
          return a;
        })
      );
    }
    const provider = this.getProvider(serialized.type);
    const directive = await this.comboBoxStore2.show(
      new SimpleComboBoxDirective<ActionComboBoxItem>({
        event: options.event,
        items: _.sortBy(actions, (a) => a.options.name)
          .map((a) => a.representAsComboBoxItem())
          .filter((a) => !!a)
      })
    );
    const action = directive.getSelectedItem()?.actionObject;
    if (!action) {
      return;
    }

    if (!deserialized) {
      deserialized = await provider.deserialize(serialized);
    }

    if (action instanceof EntityAction) {
      await action.fireAction({
        source: ActionSource.BUTTON,
        position: options.event,
        targetEntity: deserialized
      } as any);
      return;
    }

    if (action instanceof ParameterizedAction) {
      for (let param of action.options.params) {
        if (param instanceof ProviderActionParameter) {
          await action.fireAction({
            source: ActionSource.BUTTON,
            position: options.event,
            entities: {
              [param.options.name]: deserialized
            }
          });
          return;
        }
      }
    }
  }

  //!--------------------- DEPRECATED PROVIDERS -------------------

  /**
   * @deprecated
   */
  registerProvider(provider: Provider) {
    provider.setApplication(this);
    if (this.actions[provider.options.type]) {
      throw new Error(`A provider with type ${provider.options.type} already exists`);
    }
    this.providers[provider.options.type] = provider;
  }

  /**
   * @deprecated
   */
  getProvider<P extends Provider>(type: string): P {
    return this.providers[type] as P;
  }

  // !------------------ ACTIONS --------------------

  getActions() {
    return _.values(this.actions);
  }

  unregisterAction(action: Action) {
    this.actionListeners.get(action.options.id)?.();
    this.actionListeners.delete(action.options.id);
    delete this.actions[action.options.name];
  }

  registerAction(action: Action) {
    action.setApplication(this);
    if (this.actions[action.options.name]) {
      throw new Error(`An action with name ${action.options.name} already exists`);
    }
    this.actions[action.options.name] = action;

    let common: Partial<ActionListener> = {
      didFire: (event) => {
        // delegate event to system
        this.iterateListeners((cb) => {
          cb.actionFired?.({
            action: action,
            event: event.payload
          });
        });
      },
      willFire: async (event) => {
        // delegate event to system
        return this.iterateAsyncListeners(async (cb) => {
          return cb.actionWillFire?.({
            action: action,
            event: event.payload
          });
        });
      }
    };
    let listener;
    if (action instanceof ParameterizedAction) {
      // ParameterizedAction's need to fire 'willFire' when they collect parameters
      listener = action.registerListener({
        didFire: common.didFire,
        willCollectParams: common.willFire
      });
    } else {
      listener = action.registerListener(common);
    }
    this.actionListeners.set(action.options.id, listener);
  }

  getActionByID<T extends Action>(id: string): T {
    return _.find(this.actions, (a) => a.options.id === id) as T;
  }

  getAction<T extends Action>(name: string): T {
    return this.actions[name] as T;
  }

  getActionsForEntityDecoded<T>(options: { entity: T; type: string }): EntityAction<T>[] {
    return _.filter(this.actions, (action) => {
      if (action instanceof EntityAction) {
        // search for actions which have a source entity matching the incoming entities
        return action.options.target === options.type;
      }
      if (action instanceof ParameterizedAction) {
        for (let param of action.options.params) {
          // find a parameter for our given input entity
          if (param instanceof ProviderActionParameter && param.options.type === options.type) {
            // we might need to filter this action out because the parameter doesnt want the input
            if (param.options.filter) {
              return !!param.options.filter(options.entity);
            }
            return true;
          }
        }
      }
    }) as EntityAction<T>[];
  }

  /**
   * @deprecated
   */
  async getActionsForEntity<T>(entity: SerializedEntity): Promise<EntityAction<T>[]> {
    const decoded = await this.getProvider(entity.type).deserialize(entity);

    return this.getActionsForEntityDecoded({
      entity: decoded,
      type: entity.type
    });
  }
}
