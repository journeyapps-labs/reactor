import * as React from 'react';
import * as _ from 'lodash';
import { ComboBoxItem } from '../../stores/combo/ComboBoxDirectives';
import { ComboBoxItemWidget } from './ComboBoxItemWidget';
import { ListItemRenderEvent, ListItem } from '../../widgets/list/ControlledListWidget';
import { RawComboBoxWidget } from './RawComboBoxWidget';
import { MouseEvent } from 'react';
import { getTransparentColor } from '@journeyapps-labs/lib-reactor-utils';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { COMBOBOX_ITEM_H_PADDING } from '../../layout';

export interface ComboBoxWidgetProps {
  items: ComboBoxItem[];
  initialSelected?: string;
  selected: (selected: ComboBoxItem, event: MouseEvent) => any;
  className?;
  placeholder?: string;
  maxHeight?: number;
}

namespace S {
  export const Divider = themed.div`
    color: ${(p) => p.theme.combobox.text};
    margin: 4px ${COMBOBOX_ITEM_H_PADDING}px;
    font-size: 11px;
    border-bottom: solid 1px ${(p) => getTransparentColor(p.theme.combobox.text, 0.5)};
    opacity: 0.4;
  `;
}

export class ComboBoxWidget extends React.Component<ComboBoxWidgetProps> {
  listener: any;
  ref: React.RefObject<HTMLDivElement>;

  constructor(props: ComboBoxWidgetProps) {
    super(props);
    this.ref = React.createRef();
  }

  getGroups(): ListItem[] {
    const groups = _.groupBy(this.props.items, (item) => item.group);
    return _.flatMap(groups, (group, groupName) => {
      return _.map(group, (item, index) => {
        return {
          key: item.key,
          render: (event: ListItemRenderEvent) => {
            return (
              <React.Fragment key={item.key}>
                {/* only output a group if it's the first item, there is more than 1 group and the group is not 'undefined' */}
                {index === 0 && _.keys(groups).length > 1 && !!item.group ? <S.Divider>{groupName}</S.Divider> : null}
                <ComboBoxItemWidget
                  selected={event.selected}
                  item={item}
                  selectedEvent={(event) => {
                    this.props.selected(item, event);
                  }}
                  forwardRef={event.ref}
                  {...{
                    onMouseOver: () => {
                      event.select();
                    }
                  }}
                />
              </React.Fragment>
            );
          }
        };
      });
    });
  }

  render() {
    return (
      <RawComboBoxWidget
        {...this.props}
        selected={(selected) => {
          if (!selected) {
            this.props.selected(null, null);
            return;
          }
          this.props.selected(_.find(this.props.items, { key: selected.key }), null);
        }}
        items={this.getGroups()}
      />
    );
  }
}
