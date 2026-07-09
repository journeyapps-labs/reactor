import { EntityHandlerComponent, EntityHandlerComponentOptions, OpenEntityEvent } from './EntityHandlerComponent';
import { ComboBoxItem } from '../../../stores/combo/ComboBoxDirectives';

export interface InlineEntityHandlerComponentOptions<T> extends EntityHandlerComponentOptions {
  cb: (event: OpenEntityEvent<T>) => any;
  desc: ComboBoxItem;
}

export class InlineEntityHandlerComponent<T extends any> extends EntityHandlerComponent<T> {
  constructor(protected options: InlineEntityHandlerComponentOptions<T>) {
    super(options);
  }

  getDescription(): ComboBoxItem {
    return this.options.desc;
  }

  async openEntity(event) {
    this.options.cb(event);
  }
}
