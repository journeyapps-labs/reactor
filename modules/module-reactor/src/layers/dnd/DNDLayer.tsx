import { Layer, LayerRenderEvent } from '../../stores/layer/LayerManager';
import { LayerDirective } from '../../stores/layer/LayerDirective';

export class DNDLayer extends LayerDirective {
  getLayerContent(event: LayerRenderEvent): React.JSX.Element {
    return undefined;
  }

  show(): boolean {
    return false;
  }
}
