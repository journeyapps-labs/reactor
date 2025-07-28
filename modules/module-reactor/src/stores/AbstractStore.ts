import { BaseListener, BaseObserver, Logger } from '@journeyapps-labs/lib-reactor-utils';
import { AbstractSerializer } from './serializers/AbstractSerializer';
import { AbstractSetting } from '../settings/AbstractSetting';
import { observable } from 'mobx';

export interface AbstractStoreOptions<T> {
  name: string;
  serializer?: AbstractSerializer<T>;
  listenToExternalChanges?: boolean;
}

export interface AbstractStoreListener extends BaseListener {
  initialized: () => any;
}

export class AbstractStore<T = any, L extends AbstractStoreListener = AbstractStoreListener> extends BaseObserver<L> {
  private serializationListener;
  private _controls: Set<AbstractSetting>;
  protected logger: Logger;

  @observable
  accessor initialized: boolean;

  constructor(protected options: AbstractStoreOptions<T>) {
    super();
    this.initialized = false;
    this.logger = new Logger(`STORE:${options.name}`);
    this._controls = new Set();
    this.bootstrapSerializer();
  }

  private bootstrapSerializer() {
    if (this.options.listenToExternalChanges && this.options.serializer) {
      this.serializationListener = this.options.serializer.registerListener({
        gotExternalChanges: () => {
          this.runDeserialization();
        }
      });
    }
  }

  protected serialize(): T {
    return null;
  }

  protected deserialize(data: T) {
    // do nothing
  }

  private async runDeserialization() {
    if (!this.options.serializer) {
      return;
    }
    const data = await this.options.serializer.deserialize();
    if (data) {
      this.deserialize(data);
      return true;
    }
    return false;
  }

  async waitForReady() {
    if (!this.initialized) {
      await new Promise<void>((resolve) => {
        // @ts-ignore
        const l1 = this.registerListener({
          initialized: () => {
            l1();
            resolve();
          }
        });
      });
    }
  }

  protected async _init() {}

  public async init(): Promise<boolean> {
    const res = await this.runDeserialization();
    await this._init();
    this.initialized = true;
    this.iterateListeners((cb) => cb.initialized?.());
    return res;
  }

  protected addControl<T extends AbstractSetting>(control: T): T {
    this._controls.add(control);
    return control;
  }

  getControls(): AbstractSetting[] {
    return Array.from(this._controls.values());
  }

  updateOptions(options: Omit<AbstractStoreOptions<T>, 'name'>) {
    // run disposers
    this.options.serializer?.dispose?.();
    this.serializationListener?.();

    this.options = {
      ...this.options,
      ...options
    };
    this.bootstrapSerializer();
  }

  public async save() {
    const payload = this.serialize();
    if (!payload) {
      return;
    }
    await this.options.serializer.serialize(this.serialize());
  }
}
