import { inject } from '../../../inversify.config';
import { ComboBoxItem } from '../../../stores/combo/ComboBoxDirectives';
import { ComboBoxStore2 } from '../../../stores/combo2/ComboBoxStore2';
import {
  SimpleComboBoxDirective,
  SimpleComboBoxDirectiveOptions
} from '../../../stores/combo2/directives/simple/SimpleComboBoxDirective';
import { ParameterizedActionEvent } from '../ParameterizedAction';
import { AbstractActionParameter, AbstractActionParameterOptions } from './AbstractActionParameter';

export interface SimpleComboParameterOptions<T extends ComboBoxItem> extends AbstractActionParameterOptions {
  comboOptions: SimpleComboBoxDirectiveOptions<T>;
}

export class SimpleComboActionParameter<T extends ComboBoxItem> extends AbstractActionParameter<
  SimpleComboParameterOptions<T>,
  string
> {
  @inject(ComboBoxStore2)
  accessor comboBoxStore2: ComboBoxStore2;

  async getValue(event: Omit<ParameterizedActionEvent, 'id'>): Promise<boolean> {
    const directive = await this.comboBoxStore2.show(
      new SimpleComboBoxDirective({
        ...this.options.comboOptions,
        event: event.position
      })
    );
    const item = directive.getSelectedItem();
    event.entities[this.options.name] = item.key;
    return true;
  }
}
