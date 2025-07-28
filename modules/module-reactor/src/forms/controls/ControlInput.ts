import { FormInput, FormInputGenerics, FormInputListener, FormInputRenderOptions } from '../FormInput';
import { AbstractValueControl } from '../../controls/AbstractValueControl';

export interface ControlInputInputListener<T> extends FormInputListener<T> {}

export interface ControlInputGenerics<T = any> extends FormInputGenerics {
  LISTENER: ControlInputInputListener<T>;
  VALUE: T;
}

export class ControlInput<G extends ControlInputGenerics> extends FormInput<G> {
  private valueChangingFromControl: boolean;

  constructor(
    options: G['OPTIONS'],
    public control: AbstractValueControl<G['VALUE']>
  ) {
    super(options);
    this.valueChangingFromControl = false;

    control.registerListener({
      valueChanged: (value) => {
        this.valueChangingFromControl = true;
        this.setValue(value);
        this.valueChangingFromControl = false;
      }
    });
  }

  setValue(value: G['VALUE']) {
    if (!this.valueChangingFromControl) {
      this.control.value = value;
      return;
    }
    super.setValue(value);
  }

  renderControl(options: FormInputRenderOptions): React.JSX.Element {
    return this.control.representAsControl();
  }
}
