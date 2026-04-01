import * as React from 'react';
import { useMemo } from 'react';
import styled from '@emotion/styled';
import { CheckboxWidget } from '../forms/CheckboxWidget';
import { TableColumn, TableRow, TableWidget, TableWidgetProps } from './TableWidget';
import { SearchableTableColumn } from './SearchableTableWidget';
import { useMultiSelectTable } from './useMultiSelectTable';

export interface MultiSelectChangeEvent<T extends TableRow = TableRow> {
  rows: T[];
  rowKeys: string[];
}

export interface MultiSelectTableProps<T extends TableRow = TableRow> extends TableWidgetProps<T> {
  selectedRowKeys: string[];
  onSelectionChange?: (event: MultiSelectChangeEvent<T>) => any;
  allRows?: T[];
}

const SELECT_COLUMN_KEY = '__reactor_select__';

namespace S {
  export const CheckboxCell = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    margin: -8px -10px;
    padding: 8px 10px;
    user-select: none;
    cursor: pointer;
  `;
}

export function MultiSelectTableWidget<T extends TableRow = TableRow>(props: MultiSelectTableProps<T>) {
  const { selectedRowKeys, onSelectionChange, columns, rows, allRows, ...rest } = props;
  // Searchable tables pass the full data set separately so hidden rows can stay selected.
  const selectionRows = allRows || rows;

  const { computedRows, handleSelectionCellMouseDown, handleSelectionCellMouseEnter, toggleAll } = useMultiSelectTable({
    rows,
    selectionRows,
    selectedRowKeys,
    onSelectionChange
  });

  const computedColumns = useMemo<TableColumn[]>(() => {
    const hasAllRowsSelected = rows.length > 0 && rows.every((row) => selectedRowKeys.includes(row.key));

    // Multi-select owns the leading checkbox column and leaves the rest of the table API untouched.
    const selectColumn: SearchableTableColumn = {
      key: SELECT_COLUMN_KEY,
      display: (
        <S.CheckboxCell>
          <CheckboxWidget checked={hasAllRowsSelected} onChange={toggleAll} />
        </S.CheckboxCell>
      ),
      shrink: true,
      accessor: (cell, row: T) => (
        <S.CheckboxCell
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            handleSelectionCellMouseDown(row, event);
          }}
          onMouseEnter={() => {
            handleSelectionCellMouseEnter(row);
          }}
        >
          <CheckboxWidget checked={selectedRowKeys.includes(row.key)} onChange={() => undefined} />
        </S.CheckboxCell>
      )
    };

    return [selectColumn, ...columns];
  }, [columns, handleSelectionCellMouseDown, handleSelectionCellMouseEnter, rows.length, selectedRowKeys, toggleAll]);

  return <TableWidget {...rest} columns={computedColumns} rows={computedRows} />;
}
