import * as React from 'react';
import { Btn } from '../../..';
import { AbstractDialogDirective, AbstractDialogDirectiveOptions } from '../AbstractDialogDirective';

export interface InlineDialogDirectiveOptions extends AbstractDialogDirectiveOptions {
  generateContent: () => React.JSX.Element;
  buttons?: Btn[];
}

export class InlineDialogDirective extends AbstractDialogDirective {
  constructor(protected options2: InlineDialogDirectiveOptions) {
    super(options2);
  }

  generateContent(): React.JSX.Element {
    return this.options2.generateContent();
  }

  getButtons(): Btn[] {
    return (
      this.options2.buttons || [
        {
          label: 'Ok',
          action: () => {
            this.dispose(false);
          }
        }
      ]
    );
  }
}
