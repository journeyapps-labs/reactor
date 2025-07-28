import * as React from 'react';
import styled from '@emotion/styled';
import { TableColumn } from './TableWidget';

export interface TableColumnWidgetProps {
  column: TableColumn;
}

namespace S {
  export const Container = styled.th<{ shrink: boolean }>`
    text-align: left;
    padding: 5px 10px;
    ${(p) => (p.shrink ? `width: 1%` : '')};
  `;
}

export class TableColumnWidget extends React.Component<TableColumnWidgetProps> {
  render() {
    return <S.Container shrink={this.props.column.shrink}>{this.props.column.display}</S.Container>;
  }
}
