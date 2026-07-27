import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { getReactorControlBorderRadius, size, Size, useReactorSize } from '../../hooks/useReactorSize';

const StyledSelect = themed.select<{ $size: Size }>`
  outline: none;
  border: none;
  color: ${(p) => p.theme.text.primary};
  background: ${(p) => p.theme.panels.trayBackground};
  padding: ${(p) => size(p, ['5px 10px', '7px 13px', '9px 16px'])};
  width: 100%;
  box-sizing: border-box;
  font-size: ${(p) => size(p, ['13px', '15px', '17px'])};
  border-radius: ${(p) => getReactorControlBorderRadius(p.$size)}px;
`;

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> & { size?: Size };

export const Select: React.FC<SelectProps> = (props) => {
  const { size: requestedSize, ...selectProps } = props;
  const size = useReactorSize(requestedSize);
  return <StyledSelect {...selectProps} $size={size} />;
};
