import * as React from 'react';
import { TabBadgeDirective } from './GenericTabSelectionWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface TabBadgeWidgetProps {
  directive: TabBadgeDirective;
}

namespace S {
  export const TabBadge = themed.div<{ color: string }>`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    margin-right: 2px;
    padding: 2px;

    font-size: 12px;
    height: 16px;
    min-width: 16px;
    text-align: center;
    line-height: 12px;
    font-family: monospace;

    border-radius: 8px;
    background-color: ${(p) => p.color};
    color: ${(p) => p.theme.text.primary};
    `;
}

export const TabBadgeWidget: React.FC<TabBadgeWidgetProps> = (props) => {
  return <S.TabBadge color={props.directive.color}>{props.directive.content}</S.TabBadge>;
};
