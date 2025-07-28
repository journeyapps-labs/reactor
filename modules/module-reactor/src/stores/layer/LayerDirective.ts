import { autorun, IReactionDisposer } from 'mobx';
import { inject } from '../../inversify.config';
import { LayerManager, Layer, LayerOptions, LayerRenderEvent } from './LayerManager';

export interface DirectiveLayerOptions extends LayerOptions {
  layerWillHide: () => boolean;
}

export class DirectiveLayer extends Layer<DirectiveLayerOptions> {
  dispose(force: boolean = false) {
    if (force || this.options.layerWillHide()) {
      super.dispose();
    }
  }
}

export abstract class LayerDirective {
  @inject(LayerManager)
  accessor layerManager: LayerManager;

  private layer: DirectiveLayer;
  private disposer: IReactionDisposer;

  constructor() {
    this.layer = null;
  }

  abstract show(): boolean;
  abstract getLayerContent(event: LayerRenderEvent): React.JSX.Element;

  layerWillHide(): boolean {
    return true;
  }

  transparent(): boolean {
    return false;
  }

  dispose() {
    this.disposer?.();
  }

  alwaysOnTop() {
    return false;
  }

  install() {
    this.disposer = autorun(() => {
      const show = this.show();
      const transparent = this.transparent();
      if (!this.layer && !!show) {
        this.layer = new DirectiveLayer({
          render: (event) => {
            return this.getLayerContent(event);
          },
          alwaysOnTop: this.alwaysOnTop(),
          clickThrough: this.transparent(),
          layerWillHide: () => {
            return this.layerWillHide();
          }
        });
        const l = this.layer.registerListener({
          dispose: () => {
            this.layer = null;
            l();
          }
        });
        this.layerManager.registerLayer(this.layer);
      } else if (this.layer && !show) {
        this.layer?.dispose(true);
      } else if (this.layer) {
        this.layer.clickThrough = transparent;
      }
    });
  }
}
