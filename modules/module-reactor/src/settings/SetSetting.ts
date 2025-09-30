import { SetControl, SetControlOption } from '../controls/SetControl';
import { SimpleComboBoxDirective } from '../stores/combo2/directives/simple/SimpleComboBoxDirective';
import { MousePosition } from '../widgets';
import { AbstractInteractiveControlOptions } from './AbstractInteractiveSetting';
import { AbstractUserSetting } from './AbstractUserSetting';
import { computed, observable } from 'mobx';

export interface SetSettingOptions extends AbstractInteractiveControlOptions {
  options: SetControlOption<string>[];
  value: string;
}

export class SetSetting extends AbstractUserSetting<SetControl, SetSettingOptions> {
  default: string;

  constructor(options: SetSettingOptions) {
    super(
      options,
      new SetControl({
        options: options.options,
        initialValue: options.value
      })
    );
    this.default = options.value;
    this.control.registerListener({
      valueChanged: (value) => {
        if (this.initialized) {
          this.save();
        }
      }
    });
  }

  showSelector(event: MousePosition) {
    this.control.select(event);
  }

  @computed get value() {
    return this.control.value;
  }

  protected deserialize(data) {
    this.control.value = data.value;
  }

  protected serialize() {
    return {
      value: this.control.value
    };
  }

  reset() {
    this.control.value = this.default;
  }
}
