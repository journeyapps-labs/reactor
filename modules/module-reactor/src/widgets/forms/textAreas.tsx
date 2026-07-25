import { themed } from '../../stores/themes/reactor-theme-fragment';
import { Fonts } from '../../fonts';
import * as React from 'react';
import { size, Size, useReactorSize } from '../../hooks/useReactorSize';

const StyledTextArea = themed.textarea<{ $size: Size }>`
    font-family: ${Fonts.PRIMARY};
    outline: none;
    border: solid 1px ${(p) => p.theme.forms.inputBorder};
    border-radius: ${(p) => size(p, ['3px', '5px', '7px'])};
    color: ${(p) => p.theme.forms.inputForeground};
    background: ${(p) => p.theme.forms.inputBackground};
    padding: ${(p) => size(p, ['5px 10px', '7px 13px', '9px 16px'])};
    width: 100%;
    resize: vertical;
    box-sizing: border-box;
    font-size: ${(p) => size(p, ['13px', '15px', '17px'])};
`;

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { size?: Size };

export const TextArea: React.FC<TextAreaProps> = (props) => {
  const { size: requestedSize, ...textAreaProps } = props;
  const size = useReactorSize(requestedSize);
  return <StyledTextArea {...textAreaProps} $size={size} />;
};
