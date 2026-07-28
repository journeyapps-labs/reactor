import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { size, Size, useReactorSize } from '../../hooks/useReactorSize';

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
    font-size: ${(props) => size(props, ['14px', '16px', '19px'])};
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
