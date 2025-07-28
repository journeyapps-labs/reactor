import * as React from 'react';
import { HeaderButtonWidget } from './HeaderButtonWidget';
import { Action, ActionSource } from '../../actions/Action';
import { DraggableWidget } from '../dnd/DraggableWidget';

export interface ActionHeaderButtonWidgetProps {
  action: Action;
  remove: () => any;
  vertical: boolean;
}

export class ActionHeaderButtonWidget extends React.Component<ActionHeaderButtonWidgetProps> {
  ref: React.RefObject<HTMLDivElement>;

  constructor(props: ActionHeaderButtonWidgetProps) {
    super(props);
    this.ref = React.createRef();
  }

  render() {
    return (
      <DraggableWidget forwardRef={this.ref} action={this.props.action}>
        <HeaderButtonWidget
          vertical={this.props.vertical}
          remove={this.props.remove}
          btn={{
            forwardRef: this.ref,
            icon: this.props.action.options.icon,
            tooltip: this.props.action.options.name,
            action: (event) => {
              this.props.action.fireAction({
                source: ActionSource.BUTTON,
                position: event
              });
            }
          }}
        />
      </DraggableWidget>
    );
  }
}
