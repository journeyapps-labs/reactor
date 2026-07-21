import * as React from 'react';
import styled from '@emotion/styled';
import { TableColumn } from './TableWidget';
import { Size } from '../../hooks/useReactorSize';

export interface TableColumnWidgetProps {
  column: TableColumn;
  size: Size;
}

namespace S {
  export const Container = styled.th<{ shrink: boolean; $size: Size }>`
    text-align: left;
    padding: ${(p) => (p.$size === Size.SMALL ? '4px 8px' : p.$size === Size.LARGE ? '7px 12px' : '5px 10px')};
    font-size: ${(p) => (p.$size === Size.SMALL ? '13px' : p.$size === Size.LARGE ? '15px' : '14px')};
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
