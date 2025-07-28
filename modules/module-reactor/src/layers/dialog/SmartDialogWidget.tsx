import * as React from 'react';
import {
  DialogStore,
  DialogType,
  CustomDialogDirective,
  DialogDirective,
  InputDialogDirective,
  ConfirmDialogDirective
} from '../../stores/DialogStore';
import { inject } from '../../inversify.config';
import { DialogWidget } from './DialogWidget';
import { InputDialogWidget } from './InputDialogWidget';
import { SmartCustomDialogWidget } from './SmartCustomDialogWidget';

export interface SmartDialogWidgetProps {
  directive: DialogDirective;
}

export class SmartDialogWidget extends React.Component<SmartDialogWidgetProps> {
  @inject(DialogStore)
  accessor dialogStore: DialogStore;
  deregister: () => void;

  componentDidMount() {
    this.deregister = this.dialogStore.registerListener({
      dialogWillHide: (event) => {
        if (event.directive.id == this.props.directive.id) {
          if (event.val == null && this.props.directive.type == DialogType.CONFIRM) {
            // Confirm dialogs should not be cancelable other than via their buttons
            event.preventDefault();
          }
        }
      }
    });
  }

  componentWillUnmount() {
    this.deregister?.();
  }

  render() {
    const directive = this.props.directive;
    if (directive.type === DialogType.CUSTOM) {
      return <SmartCustomDialogWidget directive={directive as CustomDialogDirective} />;
    }
    if (directive.type === DialogType.CONFIRM) {
      const casted = directive as ConfirmDialogDirective;
      return (
        <DialogWidget
          title={directive.title}
          desc={directive.message}
          markdown={directive.markdown}
          disableDescriptionOpacity={directive.disableDescriptionOpacity}
          btns={[
            {
              label: 'Cancel',
              action: () => {
                this.dialogStore.closeDialog(this.props.directive, false);
              },
              submitButton: false,
              ...(casted.noBtn || {})
            },
            {
              label: 'Continue',
              action: () => {
                this.dialogStore.closeDialog(this.props.directive, true);
              },
              submitButton: true,
              ...(casted.yesBtn || {})
            }
          ]}
        />
      );
    }
    if (directive.type === DialogType.MESSAGE || directive.type === DialogType.ERROR) {
      return (
        <DialogWidget
          title={directive.title}
          desc={directive.message}
          markdown={directive.markdown}
          menuItems={directive.menuItems}
          menuItemSelected={directive.menuItemSelected}
          btns={[
            {
              tooltip: 'Okay',
              icon: null,
              action: () => {
                this.dialogStore.closeDialog(this.props.directive);
              },
              submitButton: true
            }
          ]}
        />
      );
    }
    if (directive.type === DialogType.INPUT) {
      const inputDirective = directive as InputDialogDirective;
      return (
        <InputDialogWidget
          type={inputDirective.fieldType}
          title={inputDirective.title}
          desc={inputDirective.message}
          defaultValue=""
          submit={(value) => {
            // this will also forward the value through to the promise
            this.dialogStore.closeDialog(this.props.directive, value);
          }}
          markdown={inputDirective.markdown}
          transform={inputDirective.transformer}
          validate={inputDirective.validator}
          validationMessage={inputDirective.validationMessage}
          topContent={inputDirective.extraTopContent?.()}
          submitBtn={inputDirective.submitBtn}
          cancelBtn={inputDirective.cancelBtn}
        />
      );
    }
  }
}
