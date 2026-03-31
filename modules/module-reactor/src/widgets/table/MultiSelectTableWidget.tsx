import * as React from 'react';
import styled from '@emotion/styled';
import { CheckboxWidget } from '../forms/CheckboxWidget';
import { TableColumn, TableRow, TableWidget, TableWidgetProps } from './TableWidget';
import { SearchableTableColumn } from './SearchableTableWidget';

export interface MultiSelectChangeEvent<T extends TableRow = TableRow> {
  rows: T[];
  rowKeys: string[];
}

export interface MultiSelectTableProps<T extends TableRow = TableRow> extends TableWidgetProps<T> {
  selectedRowKeys: string[];
  onSelectionChange?: (event: MultiSelectChangeEvent<T>) => any;
  allRows?: T[];
}

enum MultiSelectMode {
  SELECT = 'select',
  DESELECT = 'deselect'
}

interface DragSelectionState {
  mode: MultiSelectMode;
  touched: Set<string>;
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

function getRowKeysForRange<T extends TableRow = TableRow>(rows: T[], startKey: string, endKey: string): string[] {
  const startIndex = rows.findIndex((row) => row.key === startKey);
  const endIndex = rows.findIndex((row) => row.key === endKey);

  if (startIndex === -1 || endIndex === -1) {
    return [];
  }

  const [from, to] = startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
  return rows.slice(from, to + 1).map((row) => row.key);
}

function getOrderedSelectedRowKeys<T extends TableRow = TableRow>(rows: T[], selectedRowKeys: string[]): string[] {
  const selectedKeySet = new Set(selectedRowKeys);
  return rows.filter((row) => selectedKeySet.has(row.key)).map((row) => row.key);
}

export function MultiSelectTableWidget<T extends TableRow = TableRow>(props: MultiSelectTableProps<T>) {
  const { selectedRowKeys, onSelectionChange, columns, rows, allRows, ...rest } = props;
  const selectionRows = allRows || rows;

  const dragSelectionRef = React.useRef<DragSelectionState | null>(null);
  const selectionAnchorKeyRef = React.useRef<string | null>(null);

  const emitSelectionChange = React.useCallback(
    (nextSelectedRowKeys: string[]) => {
      if (!onSelectionChange) {
        return;
      }

      const orderedRowKeys = getOrderedSelectedRowKeys(selectionRows, nextSelectedRowKeys);
      const selectedKeySet = new Set(orderedRowKeys);
      const selectedRows = selectionRows.filter((row) => selectedKeySet.has(row.key));

      onSelectionChange({
        rows: selectedRows,
        rowKeys: selectedRows.map((row) => row.key)
      });
    },
    [onSelectionChange, selectionRows]
  );

  React.useEffect(() => {
    const stopDragSelection = () => {
      dragSelectionRef.current = null;
    };

    window.addEventListener('mouseup', stopDragSelection);

    return () => {
      window.removeEventListener('mouseup', stopDragSelection);
    };
  }, []);

  const updateSingleRowSelection = React.useCallback(
    (rowKey: string, selected: boolean) => {
      const nextSelectedRowKeys = new Set(selectedRowKeys);

      if (selected) {
        nextSelectedRowKeys.add(rowKey);
      } else {
        nextSelectedRowKeys.delete(rowKey);
      }

      emitSelectionChange(Array.from(nextSelectedRowKeys));
    },
    [emitSelectionChange, selectedRowKeys]
  );

  const selectRowRange = React.useCallback(
    (startKey: string, endKey: string) => {
      const nextSelectedRowKeys = new Set(selectedRowKeys);

      getRowKeysForRange(rows, startKey, endKey).forEach((rowKey) => {
        nextSelectedRowKeys.add(rowKey);
      });

      emitSelectionChange(Array.from(nextSelectedRowKeys));
    },
    [emitSelectionChange, rows, selectedRowKeys]
  );

  const handleSelectionCellMouseDown = React.useCallback(
    (row: T, event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.shiftKey && selectionAnchorKeyRef.current) {
        selectRowRange(selectionAnchorKeyRef.current, row.key);
        dragSelectionRef.current = null;
        return;
      }

      const isSelected = selectedRowKeys.includes(row.key);
      const mode = isSelected ? MultiSelectMode.DESELECT : MultiSelectMode.SELECT;

      selectionAnchorKeyRef.current = row.key;
      dragSelectionRef.current = {
        mode,
        touched: new Set([row.key])
      };

      updateSingleRowSelection(row.key, mode === MultiSelectMode.SELECT);
    },
    [selectRowRange, selectedRowKeys, updateSingleRowSelection]
  );

  const handleSelectionCellMouseEnter = React.useCallback(
    (row: T) => {
      const dragSelection = dragSelectionRef.current;

      if (!dragSelection || dragSelection.touched.has(row.key)) {
        return;
      }

      dragSelection.touched.add(row.key);
      updateSingleRowSelection(row.key, dragSelection.mode === MultiSelectMode.SELECT);
    },
    [updateSingleRowSelection]
  );

  const toggleAll = React.useCallback(() => {
    if (selectedRowKeys.length === rows.length) {
      const visibleRowKeys = new Set(rows.map((row) => row.key));
      emitSelectionChange(selectedRowKeys.filter((rowKey) => !visibleRowKeys.has(rowKey)));
      return;
    }

    emitSelectionChange([...selectedRowKeys, ...rows.map((row) => row.key)]);
  }, [emitSelectionChange, rows, selectedRowKeys]);

  const computedColumns = React.useMemo<TableColumn[]>(() => {
    const hasAllRowsSelected = rows.length > 0 && rows.every((row) => selectedRowKeys.includes(row.key));

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

  const computedRows = React.useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        selected: selectedRowKeys.includes(row.key)
      })),
    [rows, selectedRowKeys]
  );

  return <TableWidget {...rest} columns={computedColumns} rows={computedRows} />;
}
