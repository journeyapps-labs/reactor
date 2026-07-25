import * as React from 'react';
import styled from '@emotion/styled';
import { TableColumn } from './TableWidget';
import { size, Size } from '../../hooks/useReactorSize';

export interface TableColumnWidgetProps {
  column: TableColumn;
  size: Size;
}

namespace S {
  export const Container = styled.th<{ shrink: boolean; $size: Size }>`
    text-align: left;
    padding: ${(p) => size(p, ['4px 8px', '5px 10px', '7px 12px'])};
    font-size: ${(p) => size(p, ['13px', '14px', '15px'])};
    ${(p) => (p.shrink ? `width: 1%` : '')};
  `;
}

export class TableColumnWidget extends React.Component<TableColumnWidgetProps> {
  render() {
    return (
      <S.Container shrink={this.props.column.shrink} $size={this.props.size}>
        {this.props.column.display}
      </S.Container>
    );
  }
}
