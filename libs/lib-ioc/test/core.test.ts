import { afterEach, expect, it } from 'vitest';
import { Container, createDecorator } from '../src/Container';

class StoreB {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const container = new Container();
const inject = createDecorator(container);

class StoreA {
  @inject(StoreB)
  accessor store: StoreB;

  constructor() {}

  test() {
    this.store.name = 'changed';
  }
}

afterEach(() => {
  container.clear();
});

it('Should inject constants correctly', async () => {
  container.bindConstant(StoreB, new StoreB('test1'));
  await expect(async () => {
    container.bindConstant(StoreB, new StoreB('test1'));
  }).rejects.toThrow();
  const c1 = new StoreA();
  const c2 = new StoreA();
  c1.test();

  expect(c1.store.name).toEqual('changed');
  expect(c2.store.name).toEqual('changed');
});

it('Should inject factories correctly', async () => {
  container.bindFactory(StoreB, () => new StoreB('test2'));
  const c1 = new StoreA();
  const c2 = new StoreA();
  c1.test();

  expect(c1.store.name).toEqual('changed');
  expect(c2.store.name).toEqual('changed');
});
