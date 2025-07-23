export enum TooltipPosition {
  TOP = 'up',
  LEFT = 'left',
  BOTTOM = 'down',
  BOTTOM_RIGHT = 'down-right',
  RIGHT = 'right'
}

export enum TooltipState {
  SHOW = 'SHOW'
}

export interface TooltipProps {
  tooltip?: string;
  tooltipPos?: TooltipPosition;
  tooltipState?: TooltipState;
}

export const setupTooltipProps = (props: Partial<TooltipProps>) => {
  if (props.tooltip) {
    return {
      'aria-label': props.tooltip,
      'data-balloon-pos': props.tooltipPos || TooltipPosition.TOP,
      ...(props.tooltipState === TooltipState.SHOW ? { 'data-balloon-visible': 'yes' } : {})
    };
  }
  return {};
};

import * as React from 'react';
import { useEffect, useState } from 'react';
import { MousePosition, SmartPositionWidget } from '../../layers/combo/SmartPositionWidget';
import { ioc } from '../../inversify.config';
import { Layer, LayerManager } from '../../stores/layer/LayerManager';
import { FloatingPanelWidget } from '../floating/FloatingPanelWidget';

export interface HoverWidgetProps {
  children: React.JSX.Element;
  getOverlay: () => React.JSX.Element;
  className?: any;
}

export const HoverWidget: React.FC<HoverWidgetProps> = (props) => {
  const [hoverPosition, setHoverPosition] = useState<MousePosition>();

  useEffect(() => {
    if (hoverPosition) {
      const layer = new Layer({
        render: () => {
          return (
            <SmartPositionWidget position={hoverPosition}>
              <FloatingPanelWidget center={false}>{props.getOverlay()}</FloatingPanelWidget>
            </SmartPositionWidget>
          );
        }
      });
      layer.registerListener({
        dispose: () => {
          setHoverPosition(null);
        }
      });
      ioc.get(LayerManager).registerLayer(layer);
      return () => {
        layer.dispose();
      };
    }
  }, [hoverPosition]);
  return (
    <div
      className={props.className}
      onMouseOver={(event) => {
        setHoverPosition({
          clientX: event.clientX,
          clientY: event.clientY
        });
      }}
    >
      {props.children}
    </div>
  );
};
