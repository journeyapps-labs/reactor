import * as React from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface TablePillWidgetProps {
  special?: boolean;
  value?: React.ReactNode;
}

namespace S {
  export const Container = themed.div`
    border-radius: 4px;
    display: inline-flex;
    overflow: hidden;
    vertical-align: middle;
  `;

  export const Segment = themed.div<{ special: boolean }>`
    background: ${(p) => (p.special ? p.theme.table.pillsSpecial : p.theme.table.pills)};
    padding: 1px 6px;
    font-size: 13px;
    line-height: 16px;
    font-weight: ${(p) => (p.special ? 'bold' : 'normal')};
    color: ${(p) => p.theme.text.primary};
    text-transform: uppercase;
  `;
}

export class TablePillWidget extends React.Component<React.PropsWithChildren<TablePillWidgetProps>> {
  render() {
    return (
      <S.Container>
        <S.Segment special={!this.props.value && !!this.props.special}>{this.props.children}</S.Segment>
        {this.props.value ? <S.Segment special={true}>{this.props.value}</S.Segment> : null}
      </S.Container>
    );
  }
}
