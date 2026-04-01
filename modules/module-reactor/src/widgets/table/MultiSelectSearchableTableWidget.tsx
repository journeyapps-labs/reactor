import * as React from 'react';
import { TableRow } from './TableWidget';
import { SearchableTableWidget, SearchableTableWidgetProps } from './SearchableTableWidget';
import { MultiSelectChangeEvent, MultiSelectTableWidget } from './MultiSelectTableWidget';

export interface MultiSelectSearchableTableWidgetProps<
  T extends TableRow = TableRow
> extends SearchableTableWidgetProps<T> {
  selectedRowKeys: string[];
  onSelectionChange?: (event: MultiSelectChangeEvent<T>) => any;
}

export function SearchableMultiSelectTableWidget<T extends TableRow = TableRow>(
  props: MultiSelectSearchableTableWidgetProps<T>
) {
  const { selectedRowKeys, onSelectionChange, tableFactory, tableFactoryProps, rows, ...rest } = props;

  return (
    <SearchableTableWidget
      {...rest}
      rows={rows}
      tableFactory={MultiSelectTableWidget}
      tableFactoryProps={{
        ...tableFactoryProps,
        allRows: rows,
        selectedRowKeys,
        onSelectionChange
      }}
    />
  );
}
