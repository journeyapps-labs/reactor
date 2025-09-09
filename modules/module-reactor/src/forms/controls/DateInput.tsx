import { FormInputOptions } from '../FormInput';
import { ControlInput, ControlInputGenerics } from './ControlInput';
import { DateTimePickerType } from '../../widgets/forms/dates/DateTimePickerWidget';
import { DateControl } from '../../controls/DateControl';
import { autorun, IReactionDisposer } from 'mobx';

export interface DateInputOptions extends FormInputOptions {
  type: DateTimePickerType;
}

export class DateInput extends ControlInput<
  {
    OPTIONS: DateInputOptions;
  } & ControlInputGenerics<Date>
> {
  reactionDisposer: IReactionDisposer;

  constructor(options: DateInputOptions) {
    super(
      options,
      new DateControl({
        initialValue: options.value,
        type: options.type
      })
    );
    this.reactionDisposer = autorun(() => {
      let valid = (this.control as DateControl)?.valid;
      this.setError(this.control.value && valid ? null : 'Invalid date');
    });
  }

  dispose() {
    super.dispose();
    this.reactionDisposer?.();
  }
}
