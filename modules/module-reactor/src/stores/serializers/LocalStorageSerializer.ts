import { AbstractSerializer } from './AbstractSerializer';

export interface LocalStorageSerializerOptions {
  key: string;
}

export class LocalStorageSerializer<T = object> extends AbstractSerializer<T> {
  fireChanges: boolean;
  listener: (e: StorageEvent) => any;

  constructor(protected options: LocalStorageSerializerOptions) {
    super();
    this.fireChanges = true;
    this.listener = (e) => {
      if (e.key === options.key) {
        if (!this.fireChanges) {
          this.fireChanges = true;
          return;
        }
        this.iterateListeners((c) => {
          c?.gotExternalChanges();
        });
      }
    };
    window.addEventListener('storage', this.listener);
  }

  async serialize(data: T): Promise<boolean> {
    this.fireChanges = false;
    window.localStorage.setItem(this.options.key, JSON.stringify(data));
    return true;
  }

  async deserialize(): Promise<T | false> {
    try {
      return JSON.parse(window.localStorage.getItem(this.options.key));
    } catch (ex) {
      return false;
    }
  }

  dispose(): any {
    window.removeEventListener('storage', this.listener);
  }
}
