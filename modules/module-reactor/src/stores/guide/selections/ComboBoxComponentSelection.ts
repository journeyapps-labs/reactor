import { ComponentSelection } from './ComponentSelection';
import { inject } from '../../../inversify.config';
import { ReactorComponentType } from './common';
import { ComboBoxStore } from '../../combo/ComboBoxStore';
import { ComboBoxStore2 } from '../../combo2/ComboBoxStore2';
import { ComboBoxItem } from '../../combo/ComboBoxDirectives';

export class ComboBoxComponentSelection extends ComponentSelection<{ label: string }> {
  @inject(ComboBoxStore)
  accessor comboBoxStore: ComboBoxStore;

  @inject(ComboBoxStore2)
  accessor comboBoxStore2: ComboBoxStore2;

  comboBoxListener1: () => any;
  comboBoxListener2: () => any;

  constructor(label: string) {
    super({
      type: ReactorComponentType.COMBO_BOX_ITEM,
      identifier: {
        label: label
      }
    });
  }

  lock(selected?: () => any) {
    const check = (items: ComboBoxItem[]) => {
      if (items[0]?.title === this.options.identifier.label) {
        selected?.();
      }
    };

    if (this.comboBoxStore2.directive) {
      this.comboBoxListener2 = this.comboBoxStore2.directive.registerListener({
        selectedItemsChanged: () => {
          check(this.comboBoxStore2.directive.getSelected());
        }
      });
    }

    this.comboBoxListener1 = this.comboBoxStore.registerListener({
      itemsSelected: (event) => {
        check(event.items);
      }
    });
  }

  dispose() {
    super.dispose();
    this.comboBoxListener1?.();
    this.comboBoxListener2?.();
  }
}
