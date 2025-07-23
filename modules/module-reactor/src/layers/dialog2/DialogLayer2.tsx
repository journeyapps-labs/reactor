import * as React from 'react';
import { inject } from '../../inversify.config';
import { LayerDirective } from '../../stores/layer/LayerDirective';
import { DialogStore2 } from '../../stores/dialog2/DialogStore2';

export class DialogLayer2 extends LayerDirective {
  @inject(DialogStore2)
  accessor dialogStore: DialogStore2;

  show() {
    return this.dialogStore.directives.length > 0;
  }

  getLayerContent(): React.JSX.Element {
    return (
      <>
        {this.dialogStore.directives.map((d) => {
          return <React.Fragment key={d.id}>{d.generateWidget()}</React.Fragment>;
        })}
      </>
    );
  }

  layerWillHide() {
    this.dialogStore.directives.forEach((d) => {
      d.dispose();
    });
    return true;
  }
}
