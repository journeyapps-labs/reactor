import { RepresentAsComboBoxItemsEvent } from './AbstractControl';
import { ComboBoxItem } from '../stores/combo/ComboBoxDirectives';
import * as React from 'react';
import { useEffect } from 'react';
import { useForceUpdate } from '../hooks/useForceUpdate';
import { inject, ioc } from '../inversify.config';
import { ComboBoxStore2 } from '../stores/combo2/ComboBoxStore2';
import { v4 } from 'uuid';
import { Btn } from '../definitions/common';
import { ThemeStore } from '../stores/themes/ThemeStore';
import { theme } from '../stores/themes/reactor-theme-fragment';
import { AbstractValueControl, AbstractValueControlOptions } from './AbstractValueControl';
import { ReactorIcon } from '../widgets/icons/IconWidget';
import { MousePosition } from '../layers/combo/SmartPositionWidget';
import { PanelButtonWidget } from '../widgets/forms/PanelButtonWidget';
import { SimpleComboBoxDirective } from '../stores/combo2/directives/simple/SimpleComboBoxDirective';

export interface SetControlOption<T extends string> {
  key: T;
  label: string;
  icon?: ReactorIcon;
}

export interface SetControlOptions<T extends string> extends AbstractValueControlOptions<T> {
  options: SetControlOption<T>[];
  disabled?: boolean;
  tooltip?: string;
}

export class SetControl<T extends string = string> extends AbstractValueControl<T, SetControlOptions<T>> {
  @inject(ComboBoxStore2)
  accessor comboBoxStore: ComboBoxStore2;

  @inject(ThemeStore)
  accessor themeStore: ThemeStore;

  get tooltip() {
    return this.options.tooltip;
  }

  get disabled() {
    return this.options.disabled;
  }

  representAsComboBoxItems(options: RepresentAsComboBoxItemsEvent = {}): ComboBoxItem[] {
    const id = v4();
    return this.options.options.map((o) => {
      const selected = o.key === this.value;
      return {
        key: `${id}-${o.key}`,
        title: o.label,
        group: options.label,
        icon: selected ? 'check-square' : 'square',
        color: selected ? this.themeStore.getCurrentTheme(theme).status.success : null,
        action: async () => {
          this.value = o.key;
        }
      };
    });
  }

  select(event: MousePosition) {
    if (this.options.disabled) {
      return;
    }
    ioc.get(ComboBoxStore2).show(
      new SimpleComboBoxDirective({
        items: this.representAsComboBoxItems(),
        event: event
      })
    );
  }

  getSelectedOption() {
    return this.options.options.find((o) => o.key === this.value);
  }

  representAsControl(): React.JSX.Element {
    return <SetControlWidget control={this} />;
  }

  representAsBtn(): Btn {
    if (this.options.options.length <= 2) {
      const other = this.options.options.find((o) => o.key !== this.value);

      return {
        icon: other.icon,
        label: other.label,
        tooltip: other.label,
        action: () => {
          this.value = this.options.options.find((o) => o.key !== this.value).key;
        }
      };
    }

    return {
      action: (event) => {
        this.select(event);
      }
    };
  }
}

export interface SetControlWidgetProps {
  control: SetControl;
}

export const SetControlWidget: React.FC<SetControlWidgetProps> = (props) => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    return props.control.registerListener({
      valueChanged: () => {
        forceUpdate();
      },
      optionsUpdated: () => {
        forceUpdate();
      }
    });
  }, []);

  return (
    <PanelButtonWidget
      label={props.control.getSelectedOption()?.label || 'na'}
      tooltip={props.control.tooltip}
      disabled={props.control.disabled}
      icon="sort"
      action={(event) => {
        props.control.select(event);
      }}
    />
  );
};
