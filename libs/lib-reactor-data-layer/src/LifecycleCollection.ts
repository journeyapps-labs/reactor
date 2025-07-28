import { Collection } from './Collection';
import { autorun, computed, IReactionDisposer, makeObservable, observable } from 'mobx';
import * as _ from 'lodash';

export interface LifecycleModel<Serialized> {
  key: string;

  dispose();

  patch(data: Serialized);
}

export interface LifecycleCollectionOptions<Serialized, Model extends LifecycleModel<Serialized>> {
  collection: Collection<Serialized>;
  generateModel: (d: Serialized) => Model;
  getKeyForSerialized: (s: Serialized) => string;
}

/**
 * Wraps an existing collection with data-to-model conversion, and is smart about creating / patching and deleting
 * models based on how the wrapping collection loads items
 */
export class LifecycleCollection<Serialized, Model extends LifecycleModel<Serialized>> {
  @observable
  accessor _items: Map<string, Model>;

  reaction: IReactionDisposer;

  constructor(protected options: LifecycleCollectionOptions<Serialized, Model>) {
    this._items = new Map();
    this.reaction = autorun(
      () => {
        const items = options.collection.items.reduce((prev, cur) => {
          const key = options.getKeyForSerialized(cur);
          if (!key) {
            console.error(`Missing key for lifecycle item, check that the 'get key()' accessor is implemented.`);
            return prev;
          }
          prev[options.getKeyForSerialized(cur)] = cur;
          return prev;
        }, {});
        const incomingKeys = Object.keys(items);
        let existingKeys = Array.from(this._items.keys());

        _.difference(existingKeys, incomingKeys).forEach((m) => {
          if (this._items.has(m)) {
            this._items.get(m).dispose();
            this._items.delete(m);
          }
        });

        _.intersection(incomingKeys, existingKeys).forEach((key: string) => {
          this._items.get(key)?.patch(items[key]);
        });

        _.difference(incomingKeys, existingKeys).map((k) => {
          const model = options.generateModel(items[k]);
          this._items.set(model.key, model);
        });
      },
      {
        name: 'LifecycleCollection'
      }
    );
  }

  get collection() {
    return this.options.collection;
  }

  @computed get items(): Model[] {
    return Array.from(this._items.values());
  }

  @computed get loading() {
    return this.options.collection.loading;
  }

  dispose() {
    this.reaction();
    this.items.forEach((i) => {
      i.dispose();
    });
  }
}
