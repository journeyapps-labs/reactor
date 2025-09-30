import { ComboBoxItem } from '../../../combo/ComboBoxDirectives';
import { BaseComboBoxDirective, BaseComboBoxDirectiveOptions } from './BaseComboBoxDirective';

export interface MultiComboBoxDirectiveOptions<T extends ComboBoxItem = ComboBoxItem>
  extends BaseComboBoxDirectiveOptions<T> {
  selected?: string[];
}

export class MultiComboBoxDirective<T extends ComboBoxItem = ComboBoxItem> extends BaseComboBoxDirective<
  T,
  MultiComboBoxDirectiveOptions<T>
> {
  constructor(options: MultiComboBoxDirectiveOptions<T>) {
    super(options);
    if (options.selected) {
      options.items
        .filter((i) => options.selected.indexOf(i.key))
        .forEach((found) => {
          this.selected.add(found);
        });
    }
  }
}
