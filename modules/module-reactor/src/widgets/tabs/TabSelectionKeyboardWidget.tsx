import * as React from 'react';
import * as _ from 'lodash';
import { TabSelectionWidget } from './TabSelectionWidget';
import { TabSelectionWidgetProps } from './GenericTabSelectionWidget';
import * as uuid from 'uuid';
import { UXStore } from '../../stores/UXStore';
import { inject } from '../../inversify.config';

export interface TabSelectionKeyboardWidgetState {
  id: string;
}

export class TabSelectionKeyboardWidget extends React.Component<
  TabSelectionWidgetProps,
  TabSelectionKeyboardWidgetState
> {
  listener: any;

  @inject(UXStore)
  accessor uxStore: UXStore;

  constructor(props: TabSelectionWidgetProps) {
    super(props);
    this.state = {
      id: uuid.v4()
    };
  }

  componentWillUnmount(): void {
    this.listener?.();
  }

  componentDidMount(): void {
    this.listener = this.uxStore.pushTabListener({
      tabLeft: () => {
        let index = _.findIndex(this.props.tabs, { key: this.props.selected });
        if (index > 0) {
          this.props.tabSelected(this.props.tabs[index - 1].key);
        }
      },
      tabRight: () => {
        let index = _.findIndex(this.props.tabs, { key: this.props.selected });
        if (index < this.props.tabs.length - 1) {
          this.props.tabSelected(this.props.tabs[index + 1].key);
        }
      }
    });
  }

  render() {
    return <TabSelectionWidget {...this.props} />;
  }
}
