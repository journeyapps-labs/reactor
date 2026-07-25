import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { size, Size, useReactorSize } from '../../hooks/useReactorSize';

const StyledInput = themed.input<{ $size: Size }>`
  outline: none;
  color: ${(p) => p.theme.forms.inputForeground};
  background: ${(p) => p.theme.forms.inputBackground};
  border: solid 1px ${(p) => p.theme.forms.inputBorder};
  padding: ${(p) => size(p, ['5px 10px', '7px 13px', '9px 16px'])};
  width: 100%;
  box-sizing: border-box;
  font-size: ${(p) => size(p, ['13px', '15px', '17px'])};
  line-height: ${(p) => size(p, ['18px', '21px', '24px'])};
  border-radius: ${(p) => size(p, ['3px', '5px', '7px'])};
`;

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & { size?: Size };

export const Input: React.FC<InputProps> = (props) => {
  const { size: requestedSize, ...inputProps } = props;
  const size = useReactorSize(requestedSize);
  return <StyledInput {...inputProps} $size={size} />;
};
