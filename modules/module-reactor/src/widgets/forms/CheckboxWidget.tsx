import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { Size, useReactorSize } from '../../hooks/useReactorSize';

export interface CheckboxWidgetProps {
  checked: boolean;
  onChange: (checked: boolean) => any;
  className?: any;
  size?: Size;
}
namespace S {
  export const Icon = themed(FontAwesomeIcon)<{ checked: boolean; $size: Size }>`
    color: ${(props) => (props.checked ? props.theme.forms.checkboxChecked : props.theme.forms.checkbox)};
    cursor: pointer;
    user-select: none;
    font-size: ${(props) => (props.$size === Size.SMALL ? '14px' : props.$size === Size.LARGE ? '19px' : '16px')};
  `;
}

export const CheckboxWidget: React.FC<CheckboxWidgetProps> = (props) => {
  const size = useReactorSize(props.size);
  return (
    <div
      className={props.className}
      onClick={(event) => {
        event.stopPropagation();
        props.onChange?.(!props.checked);
      }}
    >
      <S.Icon $size={size} checked={props.checked} icon={props.checked ? 'check-square' : 'square'} />
    </div>
  );
};
