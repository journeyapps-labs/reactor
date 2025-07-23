import * as React from 'react';
import ReactSwitch from 'react-switch';
import { ioc } from '../../inversify.config';

import { normalizeColorToHex } from '@journeyapps-labs/lib-reactor-utils';
import { ThemeStore } from '../../stores/themes/ThemeStore';
import { theme } from '../../stores/themes/reactor-theme-fragment';

export interface SwitchWidgetProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchWidgetProps> = (props) => {
  const currentTheme = ioc.get(ThemeStore).getCurrentTheme(theme);
  return (
    <ReactSwitch
      onHandleColor={normalizeColorToHex(currentTheme.forms.toggleHandleColor)}
      offHandleColor={normalizeColorToHex(currentTheme.forms.toggleHandleColor)}
      onColor={normalizeColorToHex(currentTheme.forms.toggleOnColor)}
      offColor={normalizeColorToHex(currentTheme.forms.checkbox)}
      height={12}
      width={30}
      onChange={props.onChange}
      checked={props.checked}
    />
  );
};
