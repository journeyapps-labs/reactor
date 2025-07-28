import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';

interface InputTransformedWidgetProps {
  inputValue: string;
  transformer: (inputText: string) => string;
  onSuggestionSelected?: (suggestion: string) => void;
  children?: (suggestion: string, onClick?: (suggestion: string) => void) => React.JSX.Element;
}

namespace S {
  export const Transformed = themed.div<{ clickable: boolean }>`
    cursor: ${(p) => (p.clickable ? 'pointer' : 'auto')};
    color: ${(p) => p.theme.combobox.text};
    margin-top: 6px;
    font-size: 14px;
    background: ${(p) => p.theme.combobox.backgroundSelected};
    padding: 5px 10px;
    border-radius: 3px;
    display: inline-block;
  `;
}

export const InputTransformedWidget: React.FC<InputTransformedWidgetProps> = (props) => {
  const suggestion = props.transformer(props.inputValue);
  return suggestion !== props.inputValue ? (
    <S.Transformed
      clickable={!!props.onSuggestionSelected}
      onClick={() => {
        props.onSuggestionSelected?.call(null, suggestion);
      }}
    >
      {props.children?.call(null, suggestion)}
    </S.Transformed>
  ) : null;
};
