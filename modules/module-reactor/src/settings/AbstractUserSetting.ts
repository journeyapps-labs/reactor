import { AbstractInteractiveControlOptions, AbstractInteractiveSetting } from './AbstractInteractiveSetting';
import { AbstractValueControl } from '../controls/AbstractValueControl';

type ControlValue<V extends AbstractValueControl> = V extends AbstractValueControl<infer Value> ? Value : never;

export abstract class AbstractUserSetting<
  V extends AbstractValueControl = AbstractValueControl,
  T extends AbstractInteractiveControlOptions = AbstractInteractiveControlOptions
> extends AbstractInteractiveSetting<T> {
  protected defaultValue: ControlValue<V>;

  constructor(
    options: T,
    protected control: V
  ) {
    super(options);
    this.defaultValue = control.value as ControlValue<V>;
  }

  setDefault(value: ControlValue<V>) {
    this.defaultValue = value;
    if (!this.initialized && !this.deserialized) {
      this.control.value = value;
    }
  }

  reset() {
    this.control.value = this.defaultValue;
  }

  generateControl(): React.JSX.Element {
    return this.control.representAsControl();
  }
}
