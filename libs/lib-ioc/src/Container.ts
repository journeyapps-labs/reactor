export type Newable<T> = (new (...args: never[]) => T) | (abstract new (...args: never[]) => T);

export interface IFactory<T extends any = any> {
  get: () => T;
}

export class CacheFactory<T> implements IFactory<T> {
  cache: T;

  constructor(protected cb: () => T) {
    this.cache = null;
  }

  get() {
    if (!this.cache) {
      this.cache = this.cb();
    }
    return this.cache;
  }
}

export class Container {
  _mapping: Map<any, IFactory>;

  constructor() {
    this._mapping = new Map<any, IFactory>();
  }

  get<T>(s: Newable<T>): T {
    if (!this._mapping.has(s.name)) {
      throw new Error(`${s.name} not found`);
    }
    return this._mapping.get(s.name).get() as T;
  }

  clear() {
    this._mapping.clear();
  }

  unbind<T>(s: Newable<T>) {
    this._mapping.delete(s.name);
  }

  bind<T>(s: Newable<T>) {
    if (this._mapping.has(s.name)) {
      throw new Error(`${s.toString()} is already bound.`);
    }
    return {
      toConstantValue: (instance: T) => {
        this._mapping.set(s.name, {
          get: () => instance
        });
      }
    };
  }

  bindFactory<T>(s: Newable<T>, cb: () => T) {
    // @ts-ignore
    this.bind(s).toConstantValue(new CacheFactory(cb));
  }

  bindConstant<T>(s: Newable<T>, instance: T) {
    this.bind(s).toConstantValue(instance);
  }
}

export const createDecorator = (container: Container) => {
  return <T>(s: Newable<T>) => {
    let _this = this;
    return <C, V>(target, ctx: ClassAccessorDecoratorContext<C, V>): ClassAccessorDecoratorResult<C, any> => {
      if (ctx.kind === 'accessor') {
        return {
          get() {
            return container.get(s);
          },
          set(value: T) {},
          init(value: T): T {
            return null;
          }
        };
      }
    };
  };
};
