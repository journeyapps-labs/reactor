import * as React from 'react';
import { SearchWidget, SearchWidgetProps } from './SearchWidget';

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
              this.props.searchChanged(search);
            }
          );
        }}
      />
    );
  }
}
