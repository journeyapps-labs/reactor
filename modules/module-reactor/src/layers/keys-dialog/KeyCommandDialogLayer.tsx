import { KeyCommandDialogWidget } from './KeyCommandDialogWidget';
import React from 'react';
import { ShortcutStore } from '../../stores/shortcuts/ShortcutStore';
import { inject } from '../../inversify.config';
import { LayerDirective } from '../../stores/layer/LayerDirective';

export class KeyCommandDialogLayer extends LayerDirective {
  @inject(ShortcutStore)
  accessor store: ShortcutStore;

  getLayerContent(): React.JSX.Element {
    return (
      <KeyCommandDialogWidget
        save={(keys) => {
          this.store.showKeyCommandDialog.gotKeys(keys);
        }}
      />
    );
  }

  show(): boolean {
    return !!this.store.showKeyCommandDialog;
  }
}
