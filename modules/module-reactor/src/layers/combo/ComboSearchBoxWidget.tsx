import * as React from 'react';
import { MouseEvent } from 'react';
import { FloatingPanelWidget } from '../../widgets/floating/FloatingPanelWidget';
import { ComboBoxWidget } from './ComboBoxWidget';
import { ComboBoxItem } from '../../stores/combo/ComboBoxDirectives';
import { observer } from 'mobx-react';
import { ControlledSearchWidget } from '../../widgets/search/ControlledSearchWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import styled from '@emotion/styled';
import { AttentionWrapperWidget } from '../../widgets/guide/AttentionWrapperWidget';
import { ReactorComponentType } from '../../stores/guide/selections/common';
import { COMBOBOX_ITEM_H_PADDING } from '../../layout';

export interface ComboSearchBoxWidgetProps {
  initialSelected?: string;
  items: ComboBoxItem[];
  searchChanged: (search: string) => any;
  selected: (selected: ComboBoxItem, event: MouseEvent) => any;
  loading?: boolean;
  hint?: string;
  title?: string;
}

namespace S {
  export const Hint = themed.div`
    color: ${(p) => p.theme.header.secondary};
    font-size: 12px;
    padding: 4px 10px;
    cursor: pointer;
  `;

  export const Title = themed.div`
    color: ${(p) => p.theme.combobox.text};
    font-size: 15px;
    font-weight: 500;
    padding: ${COMBOBOX_ITEM_H_PADDING}px 10px;
    padding-bottom: 0;
  `;

  export const Search = styled(ControlledSearchWidget)<{ highlight: boolean }>`
    margin: 10px;
    min-width: 200px;
    ${(p) => (p.highlight ? `border: solid 1px ${p.highlight}` : ``)};
  `;

  export const ComboBox = styled(ComboBoxWidget)`
    margin-top: 5px;
  `;
}

@observer
export class ComboSearchBoxWidget extends React.Component<ComboSearchBoxWidgetProps> {
  ref: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  getPlaceholder() {
    if (this.props.loading && this.props.items.length === 0) {
      return 'Loading...';
    }
  }

  getFooterHint() {
    if (this.props.hint) {
      return <S.Hint>{this.props.hint}</S.Hint>;
    }
    return null;
  }

  render() {
    return (
      <AttentionWrapperWidget
        forwardRef={this.ref}
        type={ReactorComponentType.COMBO_BOX}
        activated={(selection) => {
          return (
            <FloatingPanelWidget highlight={!!selection} forwardRef={this.ref} center={false}>
              {this.props.title ? <S.Title>{this.props.title}</S.Title> : null}
              <S.Search
                highlight={!!selection}
                loading={this.props.loading}
                focusOnMount={true}
                searchChanged={this.props.searchChanged}
              />
              <S.ComboBox
                initialSelected={this.props.initialSelected}
                placeholder={this.getPlaceholder()}
                items={this.props.items}
                selected={this.props.selected}
              />
              {this.getFooterHint()}
            </FloatingPanelWidget>
          );
        }}
      />
    );
  }
}
