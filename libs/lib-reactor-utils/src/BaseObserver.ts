import { v1 } from 'uuid';

export interface BaseObserverInterface<T extends BaseListener> {
  registerListener(listener: Partial<T>): () => void;
  iterateListeners(cb: (listener: Partial<T>) => any);
}

export interface BaseListener {}

export class BaseObserver<T extends BaseListener> implements BaseObserverInterface<T> {
  protected listeners: Map<string, Partial<T>>;

  constructor() {
    this.listeners = new Map();
  }

  get _listenerSize() {
    return this.listeners.size;
  }

  registerListener(listener: Partial<T>): () => void {
    const id = v1();
    this.listeners.set(id, listener);
    return () => {
      this.listeners.delete(id);
    };
  }

  iterateListeners(cb: (listener: Partial<T>) => any) {
    for (let i of this.listeners.values()) {
      cb(i);
    }
  }

  async iterateAsyncListeners(cb: (listener: Partial<T>) => Promise<any>) {
    for (let i of this.listeners.values()) {
      await cb(i);
    }
  }
}
