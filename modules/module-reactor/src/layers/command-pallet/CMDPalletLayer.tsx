import * as React from 'react';
import { CMDPalletStore } from '../../stores';
import { inject } from '../../inversify.config';
import { SmartCMDPalletWidget } from './SmartCMDPalletWidget';
import { LayerDirective } from '../../stores/layer/LayerDirective';
import { DNDStore } from '../../stores/dnd/DNDStore';

export class CMDPalletLayer extends LayerDirective {
  @inject(CMDPalletStore)
  accessor cmdPalletStore: CMDPalletStore;

  @inject(DNDStore)
  accessor dndStore: DNDStore;

  getLayerContent(isTop): React.JSX.Element {
    return <SmartCMDPalletWidget selected={this.cmdPalletStore.show} focused={!!isTop} />;
  }

  transparent(): boolean {
    return !!this.dndStore.draggingEntity;
  }

  show(): boolean {
    return !!this.cmdPalletStore.show;
  }

  layerWillHide(): boolean {
    this.cmdPalletStore.showPallet(false);
    return true;
  }
}
