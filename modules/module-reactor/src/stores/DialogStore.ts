import { observable } from 'mobx';
import { Btn } from '../definitions/common';
import * as uuid from 'uuid';
import * as _ from 'lodash';
import { ComboBoxItem } from './combo/ComboBoxDirectives';
import { FormModel } from '../forms/FormModel';
import { InputDialogType } from '../layers/dialog/InputDialogWidget';
import * as React from 'react';
import { BaseObserver } from '@journeyapps-labs/common-utils';

export enum DialogType {
  MESSAGE = 'message',
  ERROR = 'error',
  INPUT = 'input',
  CONFIRM = 'confirm',
  CUSTOM = 'custom'
}

export interface DialogDirective {
  id: string;
  type: DialogType;
  title: string;
  message?: string;
  markdown?: string;
  disableDescriptionOpacity?: boolean;
  /**
   * Prevent dismissing dialog by clicking on the backdrop.
   */
  preventDismiss?: boolean;
  menuItems?: ComboBoxItem[];
  menuItemSelected?: (selected: ComboBoxItem) => any;
  resolve: (val?: any) => any;
}

export interface InputDialogDirective extends DialogDirective {
  value: string;
  extraTopContent?: () => React.JSX.Element;
  transformer?: (value: string) => string;
  validator?: (value: string) => boolean;
  submitBtn?: Partial<Btn>;
  cancelBtn?: Partial<Btn>;
  validationMessage?: string;
  fieldType?: InputDialogType;
}

export interface ConfirmDialogDirective extends DialogDirective {
  yesBtn?: Partial<Btn>;
  noBtn?: Partial<Btn>;
}

export enum DialogButtonStyle {
  MICRO = 'micro',
  PANEL = 'panel'
}

export interface CustomDialogDirective extends DialogDirective {
  btns: Omit<Btn, 'action'>[];
  buttonStyle?: DialogButtonStyle;
  generateUI: (options: CustomDialogOptionsEvent) => React.JSX.Element;
}

export type CommonDialogOptions = Omit<DialogDirective, 'type' | 'id' | 'resolve'>;

export interface MessageDialogOptions extends CommonDialogOptions {}

export interface InputDialogOptions extends CommonDialogOptions {
  extraTopContent?: () => React.JSX.Element;
  transformer?: (value: string) => string;
  validator?: (value: string) => boolean;
  initialValue?: string;
  submitBtn?: Partial<Btn>;
  cancelBtn?: Partial<Btn>;
  validationMessage?: string;
  fieldType?: InputDialogType;
}

export interface ConfirmDialogOptions extends MessageDialogOptions {
  yesBtn?: Partial<Btn>;
  noBtn?: Partial<Btn>;
}

export type ListenerCallback = (btn: Btn) => Promise<boolean>;

export interface CustomDialogOptionsEvent {
  registerListener: (cb: ListenerCallback, id?: string) => any;
  close: () => void;
}

export interface CustomDialogOptions extends CommonDialogOptions {
  btns?: Omit<Btn, 'action'>[];
  buttonStyle?: DialogButtonStyle;
  generateUI: (options: CustomDialogOptionsEvent) => React.JSX.Element;
  preventDismiss?: boolean;
}

export interface NotificationDialogHandler {
  close: () => any;
}

export interface DialogHideEvent {
  directive: DialogDirective;
  btn?: Btn;
  preventDefault?: () => any;
  val?: any;
}

export interface DialogListener {
  dialogWillHide: (event: DialogHideEvent) => any;
}

export class DialogStore extends BaseObserver<DialogListener> {
  @observable
  accessor directives: DialogDirective[];

  constructor() {
    super();
    this.directives = [];
  }

  closeDialog(directive: DialogDirective, val?: any, btn?: Btn) {
    let prevented = false;
    this.iterateListeners((l) =>
      l.dialogWillHide({
        btn: btn,
        val: val,
        directive: directive,
        preventDefault: () => {
          prevented = true;
        }
      })
    );

    // close event has been intercepted
    if (prevented) {
      return;
    }

    // always fly safe
    if (directive.resolve) {
      directive.resolve(val);
    }
    const index = _.findIndex(this.directives, { id: directive.id });
    if (index !== -1) {
      this.directives.splice(index, 1);
    }
  }

  showFormDialog<T extends FormModel>(options: { model: T } & CommonDialogOptions): Promise<T | null>;
  /**
   * @deprecated use model instead
   * @param options
   */
  showFormDialog<T = {}>(
    options: {
      /**
       * @deprecated use model instead
       */ form: FormModel<T>;
    } & CommonDialogOptions
  ): Promise<FormModel<T> | null>;
  async showFormDialog<T = {}>(
    options: {
      form?: FormModel<T>;
      model?: FormModel<T>;
    } & CommonDialogOptions
  ): Promise<FormModel<T> | null> {
    let res: FormModel<T> = null;
    const form = options.model || options.form;
    await this.showCustomDialog({
      ...options,
      btns: [
        {
          label: 'Cancel'
        },
        {
          label: 'Save',
          submitButton: true
        }
      ],
      generateUI: (event) => {
        event.registerListener(async (btn) => {
          if (btn.label === 'Save') {
            if (form.isValid()) {
              res = form;
              return true;
            }
            return false;
          }
          return true;
        }, 'form');
        return form.render();
      }
    });
    return res;
  }

  showCustomDialog(options: CustomDialogOptions) {
    return new Promise((resolve) => {
      this.directives.push({
        ...options,
        btns:
          options.btns?.length > 0
            ? options.btns
            : [
                {
                  label: 'Ok'
                }
              ],
        id: uuid.v4(),
        buttonStyle: options.buttonStyle || DialogButtonStyle.MICRO,
        resolve: resolve,
        type: DialogType.CUSTOM,
        preventDismiss: options.preventDismiss
      } as CustomDialogDirective);
    });
  }

  showErrorDialog(options: CommonDialogOptions) {
    return new Promise((resolve) => {
      this.directives.push({
        ...options,
        id: uuid.v4(),
        resolve: resolve,
        type: DialogType.ERROR
      });
    });
  }

  showConfirmDialog(options: ConfirmDialogOptions): Promise<boolean | null> {
    return new Promise((resolve) => {
      this.directives.push({
        ...options,
        id: uuid.v4(),
        resolve: resolve,
        type: DialogType.CONFIRM
      });
    });
  }

  showNotificationDialog(options: MessageDialogOptions): NotificationDialogHandler {
    const directive: DialogDirective = {
      ...options,
      id: uuid.v4(),
      resolve: null,
      type: DialogType.MESSAGE
    };
    this.directives.push(directive);
    return {
      close: () => {
        this.closeDialog(directive);
      }
    };
  }

  showMessageDialog(options: MessageDialogOptions): Promise<void> {
    return new Promise((resolve) => {
      this.directives.push({
        ...options,
        id: uuid.v4(),
        resolve: resolve,
        type: DialogType.MESSAGE
      });
    });
  }

  showInputDialog(options: InputDialogOptions): Promise<string | null> {
    return new Promise((resolve) => {
      const directive = {
        ...options,
        id: uuid.v4(),
        value: options.initialValue,
        resolve: (value) => {
          resolve(value || null);
        },
        type: DialogType.INPUT
      };

      this.directives.push(directive);
    });
  }
}
