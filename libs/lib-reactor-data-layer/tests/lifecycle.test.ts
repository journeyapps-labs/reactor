import { expect, it } from 'vitest';
import { Collection } from '../src/Collection';
import { LifecycleCollection, LifecycleModel } from '../src';
import { autorun, configure, observable } from 'mobx';

configure({
  enforceActions: 'never'
});

export interface DummySerialized {
  id: string;
  label: string;
}

class DummyModel implements LifecycleModel<DummySerialized> {
  @observable
  accessor ser: DummySerialized;

  disposed: boolean;

  constructor(ser: DummySerialized) {
    this.ser = ser;
    this.disposed = false;
  }

  get key() {
    return this.ser.id;
  }

  dispose() {
    this.disposed = true;
  }

  patch(data: DummySerialized) {
    this.ser = data;
  }
}

it('Should correctly manage lifecycle', async () => {
  let generated: DummyModel[] = [];

  let collection = new Collection<DummySerialized>();
  let lifecycle_collection = new LifecycleCollection<DummySerialized, DummyModel>({
    collection: collection,
    generateModel: (ser: DummySerialized) => {
      const c = new DummyModel(ser);
      generated.push(c);
      return c;
    },
    getKeyForSerialized: (ser) => {
      return ser.id;
    }
  });

  expect(collection.items.length).toEqual(0);
  expect(lifecycle_collection.items.length).toEqual(0);

  let items = [];
  autorun(() => {
    items = [...lifecycle_collection.items];
  });

  await collection.load(async () => {
    return [
      {
        id: '1',
        label: 'a'
      }
    ];
  });

  expect(collection.items.length).toEqual(1);
  expect(lifecycle_collection.items.length).toEqual(1);
  expect(items.length).toEqual(1);
  expect(lifecycle_collection.items[0].disposed).toEqual(false);
  expect(generated.length).toEqual(1);

  // test patching
  await collection.load(async () => {
    return [
      {
        id: '1',
        label: 'b'
      }
    ];
  });

  expect(collection.items.length).toEqual(1);
  expect(lifecycle_collection.items.length).toEqual(1);
  expect(items.length).toEqual(1);
  expect(items[0].ser.label).toEqual('b');
  expect(lifecycle_collection.items[0].ser.label).toEqual('b');
  expect(lifecycle_collection.items[0].disposed).toEqual(false);
  expect(generated.length).toEqual(1);

  // create new item, old item should be disposed
  await collection.load(async () => {
    return [
      {
        id: '2',
        label: 'c'
      }
    ];
  });

  expect(collection.items.length).toEqual(1);
  expect(lifecycle_collection.items.length).toEqual(1);
  expect(items.length).toEqual(1);
  expect(lifecycle_collection.items[0].ser.label).toEqual('c');
  expect(items[0].ser.label).toEqual('c');
  expect(lifecycle_collection.items[0].disposed).toEqual(false);
  expect(generated[0].disposed).toEqual(true);
  expect(generated.length).toEqual(2);
});
