import * as React from 'react';

import { themed } from '../../stores/themes/reactor-theme-fragment';
import { Fonts } from '../../fonts';

export interface MobileNavPillWidgetProps {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

namespace S {
  export const Pill = themed.button<{ selected: boolean }>`
    flex-shrink: 0;
    border: 0;
    border-radius: 999px;
    padding: 5px 10px;
    font-family: ${Fonts.PRIMARY};
    font-size: 13px;
    line-height: 16px;
    color: ${(p) => (p.selected ? p.theme.combobox.text : p.theme.workspaceSubMenu.foreground)};
    background: ${(p) => (p.selected ? p.theme.tabs.selectedBackground : p.theme.workspaceSubMenu.background)};
  `;
}

export const MobileNavPillWidget: React.FC<MobileNavPillWidgetProps> = (props) => {
  return (
    <S.Pill selected={props.selected} onClick={props.onClick}>
      {props.children}
    </S.Pill>
  );
};
