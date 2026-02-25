import { EntityHandlerComponent, OpenEntityEvent } from './EntityHandlerComponent';
import { ComboBoxItem } from '../../../stores/combo/ComboBoxDirectives';

export interface InlineEntityHandlerComponentOptions<T> {
  cb: (event: OpenEntityEvent<T>) => any;
  desc: ComboBoxItem;
}

export class InlineEntityHandlerComponent<T extends any> extends EntityHandlerComponent<T> {
  constructor(protected options: InlineEntityHandlerComponentOptions<T>) {
    super();
  }

  getDescription(): ComboBoxItem {
    return this.options.desc;
  }

  async openEntity(event) {
    this.options.cb(event);
  }
}
