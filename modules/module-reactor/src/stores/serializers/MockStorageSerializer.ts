import { AbstractSerializer } from './AbstractSerializer';

export class MockStorageSerializer<T extends object = any> extends AbstractSerializer<T> {
  constructor(protected getData: () => T) {
    super();
  }

  async deserialize(): Promise<false | T> {
    return this.getData();
  }

  dispose(): any {}

  async serialize(data: object): Promise<boolean> {
    return true;
  }
}
