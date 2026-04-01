import * as React from 'react';
import styled from '@emotion/styled';
import { TableRow, TableColumn } from './TableWidget';
import * as _ from 'lodash';
import { MouseEvent } from 'react';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface TableRowsWidgetProps<T extends TableRow = TableRow> {
  rows: T[];
  cols: TableColumn[];
  onContextMenu: (event: MouseEvent, row: T) => any;
}

namespace S {
  export const Row = themed.tr<{ selected: boolean }>`
    background: ${(p) => (p.selected ? p.theme.table.selectedEven : p.theme.table.even)};

    &:nth-of-type(odd) {
      background: ${(p) => (p.selected ? p.theme.table.selectedOdd : p.theme.table.odd)};
    }
  `;

  export const Cell = styled.td`
    padding: 8px 10px;
    font-size: 14px;
  `;

  export const Max = styled.div``;
}

export class TableRowsWidget<T extends TableRow = TableRow> extends React.Component<TableRowsWidgetProps<T>> {
  getCell(col: TableColumn, row: T) {
    const val = col.accessor(row.cells[col.key], row);
    if (React.isValidElement(val)) {
      return val;
    }

    if (col.length) {
      let v = `${val}`;
      if (v.length > col.length) {
        return <S.Max title={v}>{v.substring(9, col.length)}...</S.Max>;
      }
    }
    return val;
  }

  render() {
    return (
      <>
        {_.map(this.props.rows, (row) => {
          return (
            <S.Row
              onContextMenu={(event) => {
                if (this.props.onContextMenu) {
                  event.persist();
                  event.preventDefault();
                  this.props.onContextMenu(event, row);
                }
              }}
              selected={!!row.selected}
              key={row.key}
            >
              {_.map(this.props.cols, (col) => {
                return <S.Cell key={col.key}>{this.getCell(col, row)}</S.Cell>;
              })}
            </S.Row>
          );
        })}
      </>
    );
  }
}
