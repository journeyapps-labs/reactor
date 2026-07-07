import * as React from 'react';

import { MousePosition } from '../../layers/combo/SmartPositionWidget';
import { useLongPressContextMenu } from '../../hooks/useLongPressContextMenu';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { Fonts } from '../../fonts';

export interface MobileNavPillWidgetProps {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  onContextMenu?: (position: MousePosition) => any;
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
    color: ${(p) => (p.selected ? p.theme.mobileNavigation.selectedForeground : p.theme.mobileNavigation.foreground)};
    background: ${(p) =>
      p.selected ? p.theme.mobileNavigation.selectedBackground : p.theme.mobileNavigation.background};
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `;
}

export const MobileNavPillWidget: React.FC<MobileNavPillWidgetProps> = (props) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  useLongPressContextMenu(ref, props.onContextMenu, props.disabled);

  return (
    <S.Pill
      ref={ref}
      selected={props.selected}
      disabled={props.disabled}
      onClick={() => {
        if (props.disabled) {
          return;
        }
        props.onClick();
      }}
    >
      {props.children}
    </S.Pill>
  );
};
