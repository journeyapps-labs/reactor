import * as React from 'react';
import styled from '@emotion/styled';
import { TableRow, TableColumn } from './TableWidget';
import * as _ from 'lodash';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { MousePosition } from '../../layers/combo/SmartPositionWidget';
import { useLongPressContextMenu } from '../../hooks/useLongPressContextMenu';

export interface TableRowsWidgetProps<T extends TableRow = TableRow> {
  rows: T[];
  cols: TableColumn[];
  onContextMenu: (event: MousePosition, row: T) => any;
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

const TableRowContextMenu = <T extends TableRow>(props: {
  children: React.ReactNode;
  onContextMenu: (event: MousePosition, row: T) => any;
  row: T;
}) => {
  const showContextMenu = React.useCallback(
    (position: MousePosition) => {
      if (!props.onContextMenu) {
        return;
      }
      props.onContextMenu(position, props.row);
    },
    [props.onContextMenu, props.row]
  );
  const ref = React.useRef<HTMLTableRowElement>(null);
  useLongPressContextMenu(ref, showContextMenu, !props.onContextMenu);

  return (
    <S.Row ref={ref} selected={!!props.row.selected} key={props.row.key}>
      {props.children}
    </S.Row>
  );
};

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
            <TableRowContextMenu onContextMenu={this.props.onContextMenu} row={row} key={row.key}>
              {_.map(this.props.cols, (col) => {
                return <S.Cell key={col.key}>{this.getCell(col, row)}</S.Cell>;
              })}
            </TableRowContextMenu>
          );
        })}
      </>
    );
  }
}
