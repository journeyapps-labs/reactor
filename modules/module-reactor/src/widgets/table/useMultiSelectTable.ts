import * as React from 'react';
import { MouseEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import { TableRow } from './TableWidget';
import { MultiSelectChangeEvent } from './MultiSelectTableWidget';

export enum MultiSelectMode {
  SELECT = 'select',
  DESELECT = 'deselect'
}

interface DragSelectionState {
  mode: MultiSelectMode;
  touched: Set<string>;
}

export interface UseMultiSelectTableProps<T extends TableRow = TableRow> {
  rows: T[];
  selectionRows: T[];
  selectedRowKeys: string[];
  onSelectionChange?: (event: MultiSelectChangeEvent<T>) => any;
}

function getRowKeysForRange<T extends TableRow = TableRow>(params: {
  rows: T[];
  startKey: string;
  endKey: string;
}): string[] {
  const { rows, startKey, endKey } = params;
  const startIndex = rows.findIndex((row) => row.key === startKey);
  const endIndex = rows.findIndex((row) => row.key === endKey);

  if (startIndex === -1 || endIndex === -1) {
    return [];
  }

  const [from, to] = startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
  return rows.slice(from, to + 1).map((row) => row.key);
}

function getOrderedSelectedRowKeys<T extends TableRow = TableRow>(params: {
  rows: T[];
  selectedRowKeys: string[];
}): string[] {
  const { rows, selectedRowKeys } = params;
  const selectedKeySet = new Set(selectedRowKeys);
  return rows.filter((row) => selectedKeySet.has(row.key)).map((row) => row.key);
}

function getSelectedRowKeysForMode(params: {
  selectedRowKeys: string[];
  rowKey: string;
  mode: MultiSelectMode;
}): string[] {
  const { selectedRowKeys, rowKey, mode } = params;
  const nextSelectedRowKeys = new Set(selectedRowKeys);

  if (mode === MultiSelectMode.SELECT) {
    nextSelectedRowKeys.add(rowKey);
  } else {
    nextSelectedRowKeys.delete(rowKey);
  }

  return Array.from(nextSelectedRowKeys);
}

export function useMultiSelectTable<T extends TableRow = TableRow>(props: UseMultiSelectTableProps<T>) {
  const { rows, selectionRows, selectedRowKeys, onSelectionChange } = props;

  const dragSelectionRef = useRef<DragSelectionState | null>(null);
  const selectionAnchorKeyRef = useRef<string | null>(null);

  const commitSelectedRowKeys = useCallback(
    (nextSelectedRowKeys: string[]) => {
      if (!onSelectionChange) {
        return;
      }

      // Always emit rows in source-table order, even when selection changes are built from filtered views.
      const orderedRowKeys = getOrderedSelectedRowKeys({
        rows: selectionRows,
        selectedRowKeys: nextSelectedRowKeys
      });
      const selectedRows = selectionRows.filter((row) => orderedRowKeys.includes(row.key));

      onSelectionChange({
        rows: selectedRows,
        rowKeys: selectedRows.map((row) => row.key)
      });
    },
    [onSelectionChange, selectionRows]
  );

  useEffect(() => {
    const stopDragSelection = () => {
      dragSelectionRef.current = null;
    };

    window.addEventListener('mouseup', stopDragSelection);

    return () => {
      window.removeEventListener('mouseup', stopDragSelection);
    };
  }, []);

  const handleSelectionCellMouseDown = useCallback(
    (row: T, event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      // Shift extends from the last anchor across only the currently visible rows.
      if (event.shiftKey && selectionAnchorKeyRef.current) {
        commitSelectedRowKeys([
          ...selectedRowKeys,
          ...getRowKeysForRange({
            rows,
            startKey: selectionAnchorKeyRef.current!,
            endKey: row.key
          })
        ]);
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

      commitSelectedRowKeys(
        getSelectedRowKeysForMode({
          selectedRowKeys,
          rowKey: row.key,
          mode
        })
      );
    },
    [commitSelectedRowKeys, rows, selectedRowKeys]
  );

  const handleSelectionCellMouseEnter = useCallback(
    (row: T) => {
      const dragSelection = dragSelectionRef.current;

      if (!dragSelection || dragSelection.touched.has(row.key)) {
        return;
      }

      // Dragging "paints" selection mode across the first column without reprocessing the same row twice.
      dragSelection.touched.add(row.key);
      commitSelectedRowKeys(
        getSelectedRowKeysForMode({
          selectedRowKeys,
          rowKey: row.key,
          mode: dragSelection.mode
        })
      );
    },
    [commitSelectedRowKeys, selectedRowKeys]
  );

  const toggleAll = useCallback(() => {
    if (selectedRowKeys.length === rows.length) {
      const visibleRowKeys = new Set(rows.map((row) => row.key));
      commitSelectedRowKeys(selectedRowKeys.filter((rowKey) => !visibleRowKeys.has(rowKey)));
      return;
    }

    commitSelectedRowKeys([...selectedRowKeys, ...rows.map((row) => row.key)]);
  }, [commitSelectedRowKeys, rows, selectedRowKeys]);

  const computedRows = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        selected: selectedRowKeys.includes(row.key)
      })),
    [rows, selectedRowKeys]
  );

  return {
    computedRows,
    handleSelectionCellMouseDown,
    handleSelectionCellMouseEnter,
    toggleAll
  };
}
