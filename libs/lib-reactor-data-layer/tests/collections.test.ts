import { expect, it } from 'vitest';
import { Collection } from '../src/Collection';
import { configure } from 'mobx';

configure({
  enforceActions: 'never'
});

const sleep = (s: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, s);
  });

it('Should load and clear collections', async () => {
  let collection = new Collection<string>();

  expect(collection.loading).toEqual(false);
  expect(collection.failed).toEqual(false);
  expect(collection.items).toEqual([]);

  collection.load(async (event) => {
    await sleep(200);
    expect(event.aborted).toEqual(false);
    return ['test1'];
  });

  expect(collection.loading).toEqual(true);
  expect(collection.failed).toEqual(false);
  expect(collection.items).toEqual([]);

  await sleep(500);
  expect(collection.loading).toEqual(false);
  expect(collection.failed).toEqual(false);
  expect(collection.items).toEqual(['test1']);

  collection.clear();
  expect(collection.loading).toEqual(false);
  expect(collection.failed).toEqual(false);
  expect(collection.items).toEqual([]);

  expect(collection._listenerSize).toEqual(0);
});

it('Should abort collections', async () => {
  let collection = new Collection<string>();

  collection.load(async (event) => {
    await sleep(200);
    expect(event.aborted).toEqual(true);
    return ['test1'];
  });

  expect(collection.loading).toEqual(true);
  expect(collection.failed).toEqual(false);
  expect(collection.items).toEqual([]);

  collection.clear();
  await sleep(500);
  expect(collection.loading).toEqual(false);
  expect(collection.failed).toEqual(false);
  expect(collection.items).toEqual([]);

  expect(collection._listenerSize).toEqual(0);
});

it('Should rethrow errors when loading data after updating state', async () => {
  let collection = new Collection<string>();
  let ex: Error;

  collection
    .load(async (event) => {
      await sleep(200);
      throw new Error('test');
    })
    .catch((_ex) => {
      ex = _ex;
    });

  expect(collection.loading).toEqual(true);
  expect(collection.failed).toEqual(false);
  expect(collection.items).toEqual([]);

  collection.clear();
  await sleep(500);
  expect(collection.loading).toEqual(false);
  expect(collection.failed).toEqual(true);
  expect(collection.items).toEqual([]);

  expect(collection._listenerSize).toEqual(0);
  expect(ex).toBeTruthy();
  expect(ex.message).toEqual('test');
});
