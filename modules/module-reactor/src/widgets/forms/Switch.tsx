import * as React from 'react';
import { ioc } from '../../inversify.config';
import ReactSwitch from 'react-switch';
import { getDarkenedColor, normalizeColorToHex } from '@journeyapps-labs/lib-reactor-utils';
import { ThemeStore } from '../../stores/themes/ThemeStore';
import { styled, theme } from '../../stores/themes/reactor-theme-fragment';
import { observer } from 'mobx-react';

export interface SwitchWidgetProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchWidgetProps> = observer((props) => {
  const currentTheme = ioc.get(ThemeStore).getCurrentTheme(theme);
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
      onChange={props.onChange}
      checked={props.checked}
    />
  );
});

namespace S {
  export const SwitchComp = styled(ReactSwitch)<{ checked: boolean }>`
    .react-switch-bg {
      border: solid 1px ${(p) => (p.checked ? p.theme.forms.toggleOnColor : p.theme.forms.checkbox)};
    }
  `;
}
