import { themed } from '../../stores/themes/reactor-theme-fragment';
import { Fonts } from '../../fonts';
import * as React from 'react';
import { Size, useReactorSize } from '../../hooks/useReactorSize';

const StyledTextArea = themed.textarea<{ $size: Size }>`
    font-family: ${Fonts.PRIMARY};
    outline: none;
    border: solid 1px ${(p) => p.theme.forms.inputBorder};
    border-radius: ${(p) => (p.$size === Size.SMALL ? '3px' : p.$size === Size.LARGE ? '7px' : '5px')};
    color: ${(p) => p.theme.forms.inputForeground};
    background: ${(p) => p.theme.forms.inputBackground};
    padding: ${(p) => (p.$size === Size.SMALL ? '5px 10px' : p.$size === Size.LARGE ? '9px 16px' : '7px 13px')};
    width: 100%;
    resize: vertical;
    box-sizing: border-box;
    font-size: ${(p) => (p.$size === Size.SMALL ? '13px' : p.$size === Size.LARGE ? '17px' : '15px')};
`;

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { size?: Size };

export const TextArea: React.FC<TextAreaProps> = (props) => {
  const { size: requestedSize, ...textAreaProps } = props;
  const size = useReactorSize(requestedSize);
  return <StyledTextArea {...textAreaProps} $size={size} />;
};
