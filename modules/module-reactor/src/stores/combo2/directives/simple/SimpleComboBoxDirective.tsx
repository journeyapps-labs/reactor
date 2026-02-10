import { ComboBoxItem } from '../../../combo/ComboBoxDirectives';
import { BaseComboBoxDirective, BaseComboBoxDirectiveOptions } from './BaseComboBoxDirective';

export interface SimpleComboBoxDirectiveOptions<
  T extends ComboBoxItem = ComboBoxItem
> extends BaseComboBoxDirectiveOptions<T> {
  selected?: string;
}

export class SimpleComboBoxDirective<T extends ComboBoxItem = ComboBoxItem> extends BaseComboBoxDirective<
  T,
  SimpleComboBoxDirectiveOptions<T>
> {
  constructor(options: SimpleComboBoxDirectiveOptions<T>) {
    super(options);
    if (options.selected) {
      let found = options.items.find((i) => i.key === options.selected);
      if (found) {
        this.selected.add(found);
      }
    }
  }

  getSelectedItem(): T | null {
    return this.getSelected()[0] || null;
  }

  setSelected(items: T[]) {
    super.setSelected(items);
    this.dismiss();
  }
}
