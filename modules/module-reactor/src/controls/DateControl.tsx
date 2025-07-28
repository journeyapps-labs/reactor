import * as React from 'react';
import { useEffect } from 'react';
import { AbstractValueControl, AbstractValueControlOptions } from './AbstractValueControl';
import { Btn } from '../definitions/common';
import { useForceUpdate } from '../hooks/useForceUpdate';
import { RepresentAsComboBoxItemsEvent, RepresentAsControlOptions } from './AbstractControl';
import { DateTimePickerType, DateTimePickerWidget } from '../widgets/forms/dates/DateTimePickerWidget';
import { ComboBoxItem, DialogStore } from '../stores/index';
import { DateTimeButtonWidget, ReactorIcon } from '../widgets/index';
import { makeObservable, observable } from 'mobx';
import { DateInput, FormModel } from '../forms/index';
import { ioc } from '../inversify.config';
import { styled } from '../stores/themes/reactor-theme-fragment';

export interface DateControlOptions extends AbstractValueControlOptions<Date> {
  type: DateTimePickerType;
}

export class DateControl extends AbstractValueControl<Date, DateControlOptions> {
  @observable
  accessor valid: boolean;

  constructor(options: DateControlOptions) {
    super(options);
    this.valid = true;
  }

  representAsBtn(): Btn {
    return {
      label: this.label,
      icon: this.icon,
      action: async () => {
        const value = await this.getDateFromDialog();
        if (value) {
          this.value = value;
        }
      }
    };
  }

  get label() {
    if (this.dateControlType === DateTimePickerType.TIME) {
      return 'Input a time';
    }
    return 'Select a date';
  }

  get icon(): ReactorIcon {
    if (this.dateControlType === DateTimePickerType.TIME) {
      return 'clock';
    }
    return 'calendar-days';
  }

  async getDateFromDialog(): Promise<Date | null> {
    const form = new FormModel<{ date: Date }>();
    form.addInput(
      new DateInput({
        name: 'date',
        label: '',
        value: this.value,
        type: this.options.type
      })
    );
    const result = await ioc.get(DialogStore).showFormDialog({
      title: this.label,
      form: form
    });
    if (!result) {
      return null;
    }
    return form.value().date;
  }

  representAsComboBoxItems(options: RepresentAsComboBoxItemsEvent | undefined): ComboBoxItem[] {
    return [
      {
        title: options.label,
        icon: this.icon,
        key: options.label,
        action: async () => {
          const value = await this.getDateFromDialog();
          if (value) {
            this.value = value;
          }
        }
      }
    ];
  }

  representAsControl(options?: RepresentAsControlOptions): React.JSX.Element {
    return <DateControlWidget control={this} />;
  }

  get dateControlType() {
    return this.options.type;
  }
}

export interface DateControlWidgetProps {
  control: DateControl;
}

export const DateControlWidget: React.FC<DateControlWidgetProps> = (props) => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    return props.control.registerListener({
      valueChanged: () => {
        forceUpdate();
      }
    });
  }, []);

  return (
    <DateTimeButtonWidget
      type={props.control.dateControlType}
      date={props.control.value}
      validityChanged={(valid) => {
        props.control.valid = valid;
      }}
      dateChanged={(date) => {
        props.control.value = date;
      }}
    />
  );
};
