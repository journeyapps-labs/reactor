import { AbstractSetting } from './AbstractSetting';
import { action, makeObservable, observable } from 'mobx';
import { EncodedEntity } from '../entities/components/encoder/EntityEncoderComponent';

export enum ToolbarPosition {
  HEADER_RIGHT = '/toolbars/header-right/items',
  LEFT = '/toolbars/left/items',
  RIGHT = '/toolbars/right/items'
}

export class ToolbarPreference extends AbstractSetting {
  @observable
  accessor items: Set<EncodedEntity>;

  defaults: EncodedEntity[];

  constructor(key: ToolbarPosition, defaults: EncodedEntity[] = []) {
    super({
      key: key
    });
    this.defaults = defaults;
    this.items = new Set();
  }

  get buttons(): EncodedEntity[] {
    return Array.from(this.items.values());
  }

  addButton(item: EncodedEntity) {
    this.items.add(item);
    this.save();
  }

  removeButton(item: EncodedEntity) {
    const found = Array.from(this.items.values()).find((i) => i.id === item.id);
    this.items.delete(found);
    this.save();
  }

  @action
  reset() {
    this.items.clear();
    for (let item of this.defaults) {
      this.items.add(item);
    }
  }

  serialize() {
    return {
      items: Array.from(this.items.values())
    };
  }

  @action
  deserialize(data: ReturnType<this['serialize']>) {
    data.items?.forEach((v) => {
      this.items.add(v);
    });
  }
}
