import * as React from 'react';
import { SearchWidget, SearchWidgetProps } from './SearchWidget';
import * as _ from 'lodash';

export interface ControlledSearchWidgetProps extends Omit<SearchWidgetProps, 'search'> {
  searchChanged: (search: string) => any;
  className?;
  initialValue?: string;
}

export interface ControlledSearchWidgetState {
  value: string;
}

export class ControlledSearchWidget extends React.Component<ControlledSearchWidgetProps, ControlledSearchWidgetState> {
  constructor(props: ControlledSearchWidgetProps) {
    super(props);
    this.state = {
      value: props.initialValue || null
    };
  }

  buffer = _.debounce(
    () => {
      this.props.searchChanged(this.state.value);
    },
    200,
    {
      leading: false,
      trailing: true
    }
  );

  render() {
    return (
      <SearchWidget
        {...this.props}
        search={this.state.value}
        searchChanged={(search) => {
          this.setState(
            {
              value: search
            },
            () => {
              this.buffer();
            }
          );
        }}
      />
    );
  }
}
