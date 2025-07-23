import * as React from 'react';
import { LayerManager, Layer, LayerOptions } from './LayerManager';
import { ioc } from '../..';
import { useEffect, useState } from 'react';

export interface LayerDirectiveWidgetProps {
  children: () => React.JSX.Element;
  options?: Omit<LayerOptions, 'render'>;
  gotLayer?: (layer: Layer) => any;
}

export const LayerDirectiveWidget: React.FC<LayerDirectiveWidgetProps> = (props) => {
  const layerManager = ioc.get(LayerManager);
  const [layer, setLayer] = useState<Layer>(null);

  useEffect(() => {
    if (!layer) {
      const l = new Layer({
        render: () => {
          return props.children();
        },
        ...(props.options || {})
      });
      setLayer(l);
      layerManager.registerLayer(l);
      props.gotLayer?.(l);
    }
    return () => {
      layer?.dispose();
    };
  }, [layer]);

  return null;
};
