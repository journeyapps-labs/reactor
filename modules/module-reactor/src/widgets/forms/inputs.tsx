import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { Size, useReactorSize } from '../../hooks/useReactorSize';

const StyledInput = themed.input<{ $size: Size }>`
  outline: none;
  color: ${(p) => p.theme.forms.inputForeground};
  background: ${(p) => p.theme.forms.inputBackground};
  border: solid 1px ${(p) => p.theme.forms.inputBorder};
  padding: ${(p) => (p.$size === Size.SMALL ? '5px 10px' : p.$size === Size.LARGE ? '9px 16px' : '7px 13px')};
  width: 100%;
  box-sizing: border-box;
  font-size: ${(p) => (p.$size === Size.SMALL ? '13px' : p.$size === Size.LARGE ? '17px' : '15px')};
  line-height: ${(p) => (p.$size === Size.SMALL ? '18px' : p.$size === Size.LARGE ? '24px' : '21px')};
  border-radius: ${(p) => (p.$size === Size.SMALL ? '3px' : p.$size === Size.LARGE ? '7px' : '5px')};
`;

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & { size?: Size };

export const Input: React.FC<InputProps> = (props) => {
  const { size: requestedSize, ...inputProps } = props;
  const size = useReactorSize(requestedSize);
  return <StyledInput {...inputProps} $size={size} />;
};
