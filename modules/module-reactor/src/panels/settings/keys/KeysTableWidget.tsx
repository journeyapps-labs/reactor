import * as React from 'react';
import * as _ from 'lodash';
import { TableRow } from '../../../widgets/table/TableWidget';
import { observer } from 'mobx-react';
import { inject } from '../../../inversify.config';
import { PossibleShortcutAction, ShortcutStore } from '../../../stores/shortcuts/ShortcutStore';
import { Shortcut } from '../../../stores/shortcuts/Shortcut';
import { ComboBoxStore } from '../../../stores/combo/ComboBoxStore';
import { KeyboardShortcutPillsWidget } from './KeyboardShortcutPillsWidget';
import styled from '@emotion/styled';
import { TableButtonWidget } from '../../../widgets/table/TableButtonWidget';
import { SearchableTableWidget } from '../../../widgets/table/SearchableTableWidget';

export enum KeyboardTableColumns {
  NAME = 'name',
  HOTKEYS = 'hotkeys',
  TYPE = 'type'
}

namespace S {
  export const Separator = styled.div`
    padding-left: 3px;
    padding-right: 3px;
  `;

  export const TableButton = styled(TableButtonWidget)`
    margin-left: 5px;
  `;
}

export interface KeysTableRow extends TableRow {
  shortcuts: Shortcut[];
  action: PossibleShortcutAction;
}

export interface KeysTableWidgetProps {
  showBoundOnly: boolean;
}

@observer
export class KeysTableWidget extends React.Component<React.PropsWithChildren<KeysTableWidgetProps>> {
  @inject(ShortcutStore)
  accessor shortcutStore: ShortcutStore;

  @inject(ComboBoxStore)
  accessor comboBoxStore: ComboBoxStore;

  getRows(): KeysTableRow[] {
    return _.chain(this.shortcutStore.getAllPossibleActions())
      .filter((action) => {
        if (this.props.showBoundOnly && action.shortcuts.length === 0) {
          return false;
        }
        return true;
      })
      .sortBy([(a) => a.label])
      .map((action) => {
        return {
          key: action.id,
          shortcuts: action.shortcuts,
          action: action,
          cells: {
            [KeyboardTableColumns.NAME]: action.label,
            [KeyboardTableColumns.HOTKEYS]: action.shortcuts,
            [KeyboardTableColumns.TYPE]: action.handler.options.type
          }
        } as KeysTableRow;
      })
      .value();
  }

  async createShortcut(row: KeysTableRow) {
    const chord = await this.shortcutStore.showShortcutDialog(row.action);
    if (chord != null) {
      const shortcut = row.action.handler.generateShortcut(row.action);
      row.action.handler.addShortcut(shortcut);
      shortcut.setChord(chord);
    }
  }

  render() {
    return (
      <SearchableTableWidget<KeysTableRow>
        onContextMenu={async (event, row: KeysTableRow) => {
          const action = await this.comboBoxStore.showComboBox(
            [
              {
                key: 'delete',
                title: 'Clear shortcuts',
                icon: 'trash'
              },
              {
                key: 'add',
                title: 'Add shortcut',
                icon: 'plus'
              }
            ],
            event
          );
          if (action?.key === 'delete') {
            row.shortcuts.forEach((s) => s.delete());
          }
          if (action?.key === 'add') {
            await this.createShortcut(row);
          }
        }}
        columns={[
          {
            key: KeyboardTableColumns.NAME,
            display: 'Action',
            accessorSearch: (name) => {
              return name;
            }
          },
          {
            key: KeyboardTableColumns.TYPE,
            display: 'Type',
            noWrap: true
          },
          {
            key: KeyboardTableColumns.HOTKEYS,
            display: 'Hotkeys',
            noWrap: true,
            accessor: (shortcuts: Shortcut[], row: KeysTableRow) => {
              return (
                <>
                  {shortcuts.map((shortcut, index) => {
                    return (
                      <React.Fragment key={shortcut.chord.uuid}>
                        <div
                          onContextMenu={async (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            event.persist();
                            const selection = await this.comboBoxStore.showComboBox(
                              [
                                {
                                  title: 'Delete shortcut',
                                  key: 'delete'
                                }
                              ],
                              event
                            );
                            if (selection?.key === 'delete') {
                              shortcut.delete();
                            }
                          }}
                        >
                          <KeyboardShortcutPillsWidget chord={shortcut.chord} />
                        </div>
                        {index !== shortcuts.length - 1 && shortcuts.length > 0 ? <S.Separator>,</S.Separator> : null}
                      </React.Fragment>
                    );
                  })}
                  {row.action.supportsMultipleShortcuts || row.shortcuts.length == 0 ? (
                    <S.TableButton
                      tooltip="add shortcut"
                      icon="plus"
                      action={async () => {
                        await this.createShortcut(row as KeysTableRow);
                      }}
                    />
                  ) : null}
                </>
              );
            }
          }
        ]}
        rows={this.getRows()}
      >
        {this.props.children}
      </SearchableTableWidget>
    );
  }
}
