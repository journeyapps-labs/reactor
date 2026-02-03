import { themed } from '../../stores/themes/reactor-theme-fragment';
import { Fonts } from '../../fonts';

export const TextArea = themed.textarea`
    font-family: ${Fonts.PRIMARY};
    outline: none;
    border: solid 1px ${(p) => p.theme.forms.inputBorder};
    border-radius: 3px;
    color: ${(p) => p.theme.forms.inputForeground};
    background: ${(p) => p.theme.forms.inputBackground};
    padding: 5px 10px;
    width: 100%;
    resize: vertical;
    box-sizing: border-box;
    font-size: 13px;
`;
