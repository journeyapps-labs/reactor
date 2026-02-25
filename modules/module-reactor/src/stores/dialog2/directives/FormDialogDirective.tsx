import { observable } from 'mobx';
import { Btn } from '../../..';
import { FormModel } from '../../../forms/FormModel';
import { AbstractDialogDirective, AbstractDialogDirectiveOptions } from '../AbstractDialogDirective';
import * as React from 'react';

export interface FormDialogDirectiveOptions<T extends FormModel = FormModel> extends AbstractDialogDirectiveOptions {
  form: T;
  handler?: (form: T) => Promise<any>;
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
          try {
            loading(true);
            this.loading = true;
            if (this.options2.handler) {
              await this.options2.handler(this.form);
            }
            this.dispose(false);
          } finally {
            loading(false);
            this.loading = false;
          }
        }
      }
    ];
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
