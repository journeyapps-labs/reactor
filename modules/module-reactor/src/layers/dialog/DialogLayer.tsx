import * as React from 'react';
import * as _ from 'lodash';
import { DialogStore } from '../../stores/DialogStore';
import { inject } from '../../inversify.config';
import { SmartDialogWidget } from './SmartDialogWidget';
import { LayerDirective } from '../../stores/layer/LayerDirective';

export class DialogLayer extends LayerDirective {
  @inject(DialogStore)
  accessor dialogStore: DialogStore;

  getLayerContent(): React.JSX.Element {
    return (
      <>
        {this.dialogStore.directives.map((d) => {
          return <SmartDialogWidget directive={d} key={d.id} />;
        })}
      </>
    );
  }

  layerWillHide(): boolean {
    const currentDirective = _.last(this.dialogStore.directives);
    if (!currentDirective.preventDismiss) {
      this.dialogStore.closeDialog(currentDirective, null);
    }
    return this.dialogStore.directives.length === 0;
  }

  show(): boolean {
    return this.dialogStore.directives.length > 0;
  }

  transparent(): boolean {
    return false;
  }
}
