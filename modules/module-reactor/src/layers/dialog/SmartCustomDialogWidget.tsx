import * as React from 'react';
import { DialogStore, CustomDialogDirective, ListenerCallback } from '../../stores/DialogStore';
import { inject } from '../../inversify.config';
import { DialogWidget } from './DialogWidget';
import { Btn } from '../../definitions/common';

export interface SmartCustomDialogWidgetProps {
  directive: CustomDialogDirective;
}

export interface SmartCustomDialogWidgetState {
  listener: ListenerCallback;
  listener_id: string;
}

export class SmartCustomDialogWidget extends React.Component<
  SmartCustomDialogWidgetProps,
  SmartCustomDialogWidgetState
> {
  @inject(DialogStore)
  accessor dialogStore: DialogStore;

  constructor(props) {
    super(props);
    this.state = {
      listener: null,
      listener_id: null
    };
  }

  render() {
    return (
      <DialogWidget
        buttonStyle={this.props.directive.buttonStyle}
        title={this.props.directive.title}
        desc={this.props.directive.message}
        markdown={this.props.directive.markdown}
        btns={this.props.directive.btns.map((btn) => {
          const btnTransformed = {
            ...btn,
            action: async (event, loading) => {
              if (this.state.listener) {
                loading?.(true);
                const valid = await this.state.listener(btnTransformed);
                loading?.(false);
                if (valid !== false) {
                  this.dialogStore.closeDialog(this.props.directive);
                }
              } else {
                this.dialogStore.closeDialog(this.props.directive);
              }
            }
          } as Btn;
          return btnTransformed;
        })}
      >
        {this.props.directive.generateUI({
          registerListener: (cb, id) => {
            if (!id || id !== this.state.listener_id) {
              // Cannot execute setState directly in the render cycle:
              // > Warning: Cannot update during an existing state transition (such as within `render`).
              // > Render methods should be a pure function of props and state.
              // It may be better to change hte API to decouple event registration from the render cycle completely.
              setImmediate(() => {
                this.setState({
                  listener: cb,
                  listener_id: id
                });
              });
            }
          },
          close: () => this.dialogStore.closeDialog(this.props.directive)
        })}
      </DialogWidget>
    );
  }
}
