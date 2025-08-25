import { themed } from '../../stores/themes/reactor-theme-fragment';

export const Input = themed.input`
  outline: none;
  color: ${(p) => p.theme.forms.inputForeground};
  background: ${(p) => p.theme.forms.inputBackground};
  border: solid 1px ${(p) => p.theme.forms.inputBorder};
  padding: 5px 10px;
  width: 100%;
  box-sizing: border-box;
  font-size: 13px;
  border-radius: 3px;
`;
