import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface CheckboxWidgetProps {
  checked: boolean;
  onChange: (checked: boolean) => any;
  className?: any;
}
namespace S {
  export const Icon = themed(FontAwesomeIcon)<{ checked: boolean }>`
    color: ${(props) => (props.checked ? props.theme.forms.checkboxChecked : props.theme.forms.checkbox)};
    cursor: pointer;
    user-select: none;
  `;
}

export const CheckboxWidget: React.FC<CheckboxWidgetProps> = (props) => {
  return (
    <div
      className={props.className}
      onClick={(event) => {
        event.stopPropagation();
        props.onChange?.(!props.checked);
      }}
    >
      <S.Icon checked={props.checked} icon={props.checked ? 'check-square' : 'square'} />
    </div>
  );
};
