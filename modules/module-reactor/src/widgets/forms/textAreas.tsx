import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export const TextArea = themed.textarea`
    font-family: 'Source Sans Pro';
    outline: none;
    border: none;
    border-radius: 3px;
    color: ${(p) => p.theme.forms.inputForeground};
    background: ${(p) => p.theme.forms.inputBackground};
    padding: 5px 10px;
    width: 100%;
    resize: vertical;
    box-sizing: border-box;
    font-size: 13px;
`;
