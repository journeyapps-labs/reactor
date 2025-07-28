import * as React from 'react';
import * as _ from 'lodash';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { ControlledListWidget, ListItem } from '../../widgets/list/ControlledListWidget';

export interface RawComboBoxWidgetProps {
  items: ListItem[];
  initialSelected?: string;
  selected: (item: ListItem) => any;
  hovered?: (item: ListItem) => any;
  placeholder?: string;
  maxHeight?: number;
}

export class RawComboBoxWidget extends React.Component<RawComboBoxWidgetProps> {
  getPlaceholder() {
    if (this.props.items.length === 0) {
      return <S.Placeholder>{this.props.placeholder || 'No items to select'}</S.Placeholder>;
    }
    return null;
  }

  getControlledList() {
    return (
      <ControlledListWidget
        useKeyboard={true}
        initialSelected={this.props.initialSelected}
        hovered={this.props.hovered}
        selected={(item) => {
          // dont want to close here just yet
          if (!item) {
            return;
          }
          const itemFound = _.find(this.props.items, { key: item.key });
          this.props.selected(itemFound || null);
        }}
        items={this.props.items}
      />
    );
  }

  render() {
    return (
      <S.Box maxHeight={this.props.maxHeight || 300}>
        {this.getPlaceholder()}
        {this.getControlledList()}
      </S.Box>
    );
  }
}

namespace S {
  export const Box = themed.div<{ maxHeight: number }>`
    user-select: none;
    max-height: ${(p) => p.maxHeight}px;
    overflow-y: auto;

    ::-webkit-scrollbar {
      width: 10px;
      padding-left: 3px;
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      border-left: solid 2px ${(p) => p.theme.combobox.background};
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
    }
  `;

  export const Placeholder = themed.div`
    color: white;
    opacity: 0.5;
    font-style: italic;
    font-size: 12px;
    padding: 4px 10px;
    transition: background-color 0.2s, color 0.2s;
  `;
}
