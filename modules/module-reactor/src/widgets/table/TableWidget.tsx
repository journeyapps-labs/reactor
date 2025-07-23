import * as React from 'react';
import { MouseEvent } from 'react';
import * as _ from 'lodash';
import { TableColumnWidget } from './TableColumnWidget';
import { observer } from 'mobx-react';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { TableRowsWidget } from './TableRowsWidget';
import { TableRowsGroupWidget, TableRowsGroupWidgetProps } from './TableRowsGroupWidget';

export interface TableColumn {
  display: string;
  key: string;
  accessor?: (cell: any, row: TableRow) => React.JSX.Element | string;
  noWrap?: boolean;
  shrink?: boolean;
  length?: number;
}

export interface TableRow {
  cells: { [key: string]: any };
  key: string;
  groupKey?: string;
}

export interface TableWidgetProps<T extends TableRow = TableRow> {
  columns: TableColumn[];
  rows: T[];
  renderGroup?: (event: { rows: T[]; groupKey: string }) => Partial<TableRowsGroupWidgetProps>;
  onContextMenu?: (event: MouseEvent, row: T) => any;
}

namespace S {
  export const Table = themed.table`
    color: ${(p) => p.theme.table.text};
    border-spacing: 0;
    width: 100%;
  `;

  export const ColumnsRow = themed.tr`
    background: ${(p) => p.theme.table.columnBackground};
    color: ${(p) => p.theme.table.columnForeground};
  `;

  export const NoWrap = themed.div`
    display: flex;
    white-space: nowrap;
  `;
}

@observer
export class TableWidget<T extends TableRow = TableRow> extends React.Component<TableWidgetProps<T>> {
  getColumns(): TableColumn[] {
    return _.map(this.props.columns, (col) => {
      let accessor = col.accessor;

      // ensure a default accessor
      if (!accessor) {
        accessor = (cell: any, row) => {
          return `${cell}`;
        };
      }

      // additionally, no wrap?
      let finalAccessor = accessor;
      if (col.noWrap) {
        finalAccessor = (cell, row) => {
          return <S.NoWrap>{accessor(cell, row)}</S.NoWrap>;
        };
      }

      return {
        ...col,
        accessor: finalAccessor
      };
    });
  }

  render() {
    const cols = this.getColumns();
    const groups = _.groupBy(
      this.props.rows.filter((f) => !!f.groupKey),
      'groupKey'
    );

    return (
      <S.Table>
        <thead>
          <S.ColumnsRow>
            {_.map(cols, (col) => {
              return <TableColumnWidget column={col} key={col.key} />;
            })}
          </S.ColumnsRow>
        </thead>
        <tbody>
          {/* Ungrouped */}
          <TableRowsWidget
            rows={this.props.rows.filter((f) => !f.groupKey)}
            onContextMenu={this.props.onContextMenu}
            cols={cols}
          />

          {
            //grouped
            _.map(groups, (rows, key) => {
              const partial: Partial<TableRowsGroupWidgetProps> = this.props.renderGroup
                ? this.props.renderGroup({
                    groupKey: key,
                    rows: rows
                  })
                : { children: key };

              return (
                <TableRowsGroupWidget
                  key={key}
                  rows={rows}
                  onContextMenu={this.props.onContextMenu}
                  cols={cols}
                  {...partial}
                />
              );
            })
          }
        </tbody>
      </S.Table>
    );
  }
}
