export class ComponentBank<T> {
  protected items: Set<T>;

  constructor() {
    this.items = new Set();
  }

  register(item: T): T {
    this.items.add(item);
    this.onItemRegistered(item);
    return item;
  }

  getItems(): T[] {
    return Array.from(this.items.values());
  }

  getFirst(): T | null {
    return this.getItems()[0] || null;
  }

  find(predicate: (item: T) => boolean): T | null {
    return this.getItems().find(predicate) || null;
  }

  protected onItemRegistered(item: T) {}
}
