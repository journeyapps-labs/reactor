import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface TablePillWidgetProps {
  special?: boolean;
}

namespace S {
  export const Container = themed.div<{ special: boolean }>`
    background: ${(p) => (p.special ? p.theme.table.pillsSpecial : p.theme.table.pills)};
    padding: 1px 6px;
    font-size: 13px;
    line-height: 16px;
    font-weight: ${(p) => (p.special ? 'bold' : 'normal')};
    vert-align: middle;
    color: ${(p) => p.theme.text.primary};
    text-transform: uppercase;
  `;
}

export class TablePillWidget extends React.Component<React.PropsWithChildren<TablePillWidgetProps>> {
  render() {
    return <S.Container special={this.props.special}>{this.props.children}</S.Container>;
  }
}
