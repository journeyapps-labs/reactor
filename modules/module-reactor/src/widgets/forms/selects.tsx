import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export const Select = themed.select`
  outline: none;
  border: none;
  color: ${(p) => p.theme.text.primary};
  background: ${(p) => p.theme.panels.trayBackground};
  padding: 5px 10px;
  width: 100%;
  box-sizing: border-box;
  font-size: 15px;
`;
