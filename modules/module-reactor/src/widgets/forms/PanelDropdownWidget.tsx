import * as React from 'react';
import { Btn } from '../../definitions/common';
import { ComboBoxItem } from '../../stores/combo/ComboBoxDirectives';
import { PanelButtonWidget } from './PanelButtonWidget';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { inject } from '../../inversify.config';

export interface PanelDropdownWidgetProps extends Partial<Btn> {
  items: ComboBoxItem[];
  selected: string;
  onChange: (item: ComboBoxItem) => any;
  className?: any;
}

export class PanelDropdownWidget extends React.Component<PanelDropdownWidgetProps> {
  @inject(ComboBoxStore)
  accessor comboBoxStore: ComboBoxStore;

  render() {
    return (
      <PanelButtonWidget
        icon="angle-down"
        {...this.props}
        label={this.props.label || this.props.items.find((f) => f.key === this.props.selected)?.title}
        action={async (event) => {
          const item = await this.comboBoxStore.showComboBox(this.props.items, event);
          if (item) {
            this.props.onChange(item);
          }
        }}
      />
    );
  }
}
