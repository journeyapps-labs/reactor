import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { Size, useReactorSize } from '../../hooks/useReactorSize';

const StyledSelect = themed.select<{ $size: Size }>`
  outline: none;
  border: none;
  color: ${(p) => p.theme.text.primary};
  background: ${(p) => p.theme.panels.trayBackground};
  padding: ${(p) => (p.$size === Size.SMALL ? '5px 10px' : p.$size === Size.LARGE ? '9px 16px' : '7px 13px')};
  width: 100%;
  box-sizing: border-box;
  font-size: ${(p) => (p.$size === Size.SMALL ? '13px' : p.$size === Size.LARGE ? '17px' : '15px')};
  border-radius: ${(p) => (p.$size === Size.SMALL ? '3px' : p.$size === Size.LARGE ? '7px' : '5px')};
`;

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> & { size?: Size };

export const Select: React.FC<SelectProps> = (props) => {
  const { size: requestedSize, ...selectProps } = props;
  const size = useReactorSize(requestedSize);
  return <StyledSelect {...selectProps} $size={size} />;
};
