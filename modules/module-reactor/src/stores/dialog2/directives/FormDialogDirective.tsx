import { observable } from 'mobx';
import { ActionSource, Btn, ioc, System } from '../../..';
import { FormModel } from '../../../forms/FormModel';
import { AbstractDialogDirective, AbstractDialogDirectiveOptions } from '../AbstractDialogDirective';
import * as React from 'react';
import { ACTION_STATUS } from '@journeyapps-platform/types-flight-log';

export interface FormDialogDirectiveOptions<T extends FormModel = FormModel> extends AbstractDialogDirectiveOptions {
  form: T;
  handler?: (form: T) => Promise<any>;
  trace?: {
    enabled: boolean;
    context: string;
  };
}

export class FormDialogDirective<T extends FormModel = FormModel> extends AbstractDialogDirective {
  @observable
  accessor valid: boolean;

  constructor(protected options2: FormDialogDirectiveOptions<T>) {
    super(options2);
    this.valid = options2.form.isValid();
    options2.form.registerListener({
      errorsChanged: () => {
        this.valid = options2.form.isValid();
      }
    });
  }

  getButtons(): Btn[] {
    return [
      {
        label: 'Cancel',
        action: () => {
          this.dispose(true);
        }
      },
      {
        label: 'Save',
        icon: 'check',
        disabled: !this.valid,
        tooltip: !this.valid ? 'Fix any errors before saving.' : null,
        action: async (event, loading) => {
          loading(true);
          this.loading = true;
          if (this.options2.handler) {
            try {
              await this.options2.handler(this.form);
              if (this.options2.trace?.enabled) {
                this.submitTrace();
              }
              this.dispose(false);
            } finally {
              loading(false);
              this.loading = false;
            }
          }
        }
      }
    ];
  }

  submitTrace() {
    try {
      ioc.get(System).tracer.logAction({
        status: ACTION_STATUS.SUCCESS,
        source: ActionSource.BUTTON,
        action_id: `FORM_DIALOG.${this.options2.trace.context.toUpperCase()}`,
        start_timestamp: new Date().toISOString(),
        end_timestamp: new Date().toISOString()
      });
    } catch (ex) {}
  }

  get form(): T {
    return this.options2.form;
  }

  get value() {
    return this.form.value();
  }

  generateContent(): React.JSX.Element {
    return this.form.render();
  }
}
