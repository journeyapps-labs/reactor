import { AbstractControl, RepresentAsComboBoxItemsEvent } from './AbstractControl';
import { ComboBoxItem } from '../stores/combo/ComboBoxDirectives';
import * as React from 'react';
import { useEffect } from 'react';
import { getDarkenedColor, normalizeColorToHex } from '@journeyapps-labs/lib-reactor-utils';
import Switch from 'react-switch';
import { styled, theme } from '../stores/themes/reactor-theme-fragment';
import { ioc } from '../inversify.config';
import { ThemeStore } from '../stores/themes/ThemeStore';
import { useForceUpdate } from '../hooks/useForceUpdate';
import { v4 } from 'uuid';
import { CheckboxLabelWidget } from '../widgets/forms/CheckboxLabelWidget';
import { CheckboxWidget } from '../widgets/forms/CheckboxWidget';
import { Btn } from '../definitions/common';
import { AbstractValueControl } from './AbstractValueControl';

export interface RepresentAsCheckboxOptions {
  label?: string;
  disabled?: boolean;
}

export class BooleanControl extends AbstractValueControl<boolean> {
  representAsComboBoxItems(event: RepresentAsComboBoxItemsEvent = {}): ComboBoxItem[] {
    const id = v4();

    return [
      {
        key: id,
        title: event.label,
        icon: this.value ? 'check-square' : 'square',
        action: async () => {
          this.toggle();
        }
      }
    ];
  }

  toggle() {
    this.value = !this.value;
  }

  representAsControl(): React.JSX.Element {
    return <BooleanControlWidget checkbox={false} control={this} />;
  }

  representAsCheckbox(options: RepresentAsCheckboxOptions = {}): React.JSX.Element {
    return <BooleanControlWidget {...options} checkbox={true} control={this} />;
  }

  representAsBtn(): Btn {
    return {
      action: () => {
        this.toggle();
      }
    };
  }
}

export interface BooleanControlWidgetProps {
  control: BooleanControl;
  checkbox?: boolean;
  label?: string;
  disabled?: boolean;
}

export const BooleanControlWidget: React.FC<BooleanControlWidgetProps> = (props) => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    return props.control.registerListener({
      valueChanged: () => {
        forceUpdate();
      }
    });
  }, []);
  const currentTheme = ioc.get(ThemeStore).getCurrentTheme(theme);

  if (props.checkbox && props.label) {
    return (
      <CheckboxLabelWidget
        disabled={props.disabled}
        checked={props.control.value}
        onChange={(value) => {
          props.control.value = value;
        }}
        label={props.label}
      />
    );
  }

  if (props.checkbox) {
    return (
      <CheckboxWidget
        checked={props.control.value}
        onChange={(value) => {
          props.control.value = value;
        }}
      />
    );
  }

  return (
    <S.SwitchComp
      disabled={props.disabled}
      onHandleColor={normalizeColorToHex(currentTheme.forms.toggleHandleColor)}
      offHandleColor={normalizeColorToHex(currentTheme.forms.toggleHandleColor)}
      onColor={normalizeColorToHex(getDarkenedColor(currentTheme.forms.toggleOnColor, 0.5))}
      offColor={normalizeColorToHex(currentTheme.forms.checkbox)}
      handleDiameter={14}
      height={18}
      width={45}
      borderRadius={3}
      onChange={(checked) => {
        props.control.value = checked;
      }}
      checked={props.control.value}
    />
  );
};

namespace S {
  export const SwitchComp = styled(Switch)<{ checked: boolean }>`
    .react-switch-bg {
      border: solid 1px ${(p) => (p.checked ? p.theme.forms.toggleOnColor : p.theme.forms.checkbox)};
    }
  `;
}
