import * as React from 'react';
import { Btn } from '../../..';
import { AbstractDialogDirective, AbstractDialogDirectiveOptions } from '../AbstractDialogDirective';

export interface InlineDialogDirectiveOptions extends AbstractDialogDirectiveOptions {
  generateContent: () => React.JSX.Element;
  buttons?: Btn[];
}

export class InlineDialogDirective extends AbstractDialogDirective<InlineDialogDirectiveOptions> {
  constructor(options: InlineDialogDirectiveOptions) {
    super(options);
  }

  generateContent(): React.JSX.Element {
    return this.options.generateContent();
  }

  getButtons(): Btn[] {
    return (
      this.options.buttons || [
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
