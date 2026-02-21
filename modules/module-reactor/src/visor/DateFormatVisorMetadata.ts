import { autorun } from 'mobx';
import { VisorMetadata } from '../stores/visor/VisorMetadata';
import { DateFormatPreference } from '../preferences/DateFormatPreference';
import { ComboBoxStore2 } from '../stores/combo2/ComboBoxStore2';
import { inject } from '../inversify.config';

export class DateFormatVisorMetadata extends VisorMetadata {
  @inject(ComboBoxStore2)
  accessor combostore: ComboBoxStore2;

  constructor() {
    super({
      key: 'DATE_FORMAT',
      displayName: 'Date format',
      displayDefault: true
    });
  }

  init() {
    autorun(() => {
      this.reportValue({
        value: DateFormatPreference.get().asLabel,
        onClick: (event) => {
          DateFormatPreference.get().showSelector(event);
        }
      });
    });
  }
}
