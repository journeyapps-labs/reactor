import { observer } from 'mobx-react';
import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { LayerManager } from './LayerManager';
import { inject } from '../../inversify.config';
import { LayerWidgetErrorBoundary } from './LayerWidget';
import { WorkspaceStore } from '../workspace/WorkspaceStore';

namespace S {
  export const Container = styled.div`
    position: relative;
  `;
}

@observer
export class LayersWidget extends React.Component {
  // autorun methods need to be disposed of
  listener: any;

  @inject(LayerManager)
  accessor layerManager: LayerManager;

  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  componentWillUnmount(): void {
    window.removeEventListener('keydown', this.listener);
  }

  componentDidMount(): void {
    this.listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const layer = _.last(this.layerManager.getLayers());
        if (layer?.userCanExit()) {
          layer?.dispose();
        }
      }
    };
    window.addEventListener('keydown', this.listener);
  }

  render() {
    return (
      <S.Container>
        {_.map(this.layerManager.getLayers(), (layer, zIndex) => {
          const index =
            this.workspaceStore.engine.layerManager.layers.length +
            this.workspaceStore.engine.layerManager.initialZIndex +
            zIndex +
            1;

          return (
            <LayerWidgetErrorBoundary
              key={layer.id}
              clickThough={() => {
                return layer.clickThrough;
              }}
              hide={() => {
                if (layer.userCanExit()) {
                  layer.dispose();
                }
              }}
              zIndex={index}
            >
              {layer.options.render({
                index: zIndex,
                layer: layer
              })}
            </LayerWidgetErrorBoundary>
          );
        })}
      </S.Container>
    );
  }
}
