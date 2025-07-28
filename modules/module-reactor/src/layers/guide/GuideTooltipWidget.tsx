import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { SmartPositionWidget } from '../combo/SmartPositionWidget';
import { ComponentSelection, ToolTipPositionHint } from '../../stores/guide/selections/ComponentSelection';
import { observer } from 'mobx-react';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { keyframes } from '@emotion/react';
import * as _ from 'lodash';
import { LAYER_ANIMATION_DURATION } from '../../stores/layer/LayerWidget';

export interface GuideTooltipWidgetProps {
  selection: ComponentSelection;
}

const boxLeft = 20;

namespace S {
  const animation = keyframes`
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  `;

  export const Container = styled.div<{ top: boolean }>`
    padding: 5px 10px;
    border-radius: 3px;
    position: relative;
    background: #050500;
    border: 1px solid ${(p) => p.theme.guide.accent};
    color: white;
    font-size: 12px;
    cursor: pointer;
    max-width: 150px;

    &:after,
    &:before {
      ${(p) => (p.top ? `bottom: 100%` : 'top: 100%')};
      left: ${boxLeft}px;
      border: solid transparent;
      content: ' ';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }

    &:after {
      border-color: rgba(5, 5, 0, 0);
      ${(p) => (p.top ? `border-bottom-color` : 'border-top-color')} #050500;
      border-width: 10px;
      margin-left: -10px;
    }
    &:before {
      border-color: rgba(220, 245, 0, 0);
      ${(p) => (p.top ? `border-bottom-color` : 'border-top-color')} ${(p) => p.theme.guide.accent};
      border-width: 12px;
      margin-left: -12px;
    }
  `;

  export const AnimationContainer = styled.div`
    animation: ${animation} 0.5s forwards;
    animation-delay: ${LAYER_ANIMATION_DURATION / 1000}s;
    opacity: 0;
  `;
}

interface Size {
  w: number;
  h: number;
}

const TooltipWidget = (props: GuideTooltipWidgetProps & { arrowAbove: boolean }) => {
  if (_.isString(props.selection.tooltip)) {
    return (
      <S.Container
        top={props.arrowAbove}
        onClick={() => {
          props.selection.tooltip = null;
        }}
      >
        {props.selection.tooltip}
      </S.Container>
    );
  }
  return props.selection.tooltip.gen({
    above: props.arrowAbove
  });
};

const TooltipWrapperWidget: React.FC<React.PropsWithChildren<{ gotDimensions: (o: Size) => any }>> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const d = ref.current.getBoundingClientRect();
    props.gotDimensions({
      w: d.width,
      h: d.height
    });
  }, []);

  return <S.AnimationContainer ref={ref}>{props.children}</S.AnimationContainer>;
};

const POSITION_PADDING = 10;

const computePosition = (event: {
  screen: Size;
  size: Size;
  selection: ComponentSelection;
}): { x: number; y: number; pos: ToolTipPositionHint } => {
  const { rect } = event.selection;
  if (!_.isString(event.selection.tooltip)) {
    if (event.selection.tooltip.hint === ToolTipPositionHint.RIGHT) {
      return {
        x: rect.left + rect.width + POSITION_PADDING,
        y: rect.top,
        pos: ToolTipPositionHint.RIGHT
      };
    }
    if (event.selection.tooltip.hint === ToolTipPositionHint.BELOW) {
      return {
        x: rect.left,
        y: rect.top + rect.height + POSITION_PADDING,
        pos: ToolTipPositionHint.BELOW
      };
    }
  }

  const centerY = rect.top + rect.height / 2;

  // top or bottom
  let showAbove = centerY > event.screen.h / 2;

  let x: number = rect.left;
  let y: number = rect.top + rect.height + POSITION_PADDING;

  if (x + boxLeft > x + rect.width / 2) {
    x = x - boxLeft + rect.width / 2;
  }

  if (showAbove) {
    y = rect.top - event.size.h - POSITION_PADDING;
  }

  return {
    x,
    y,
    pos: showAbove ? ToolTipPositionHint.ABOVE : ToolTipPositionHint.BELOW
  };
};

export const GuideTooltipWidget = observer((props: GuideTooltipWidgetProps) => {
  const [size, setSize] = useState<Size>({
    w: 0,
    h: 0
  });

  if (!props.selection.rect || !props.selection.tooltip) {
    return null;
  }
  const screenDim = document.body.getBoundingClientRect();
  const { x, y, pos } = computePosition({
    screen: {
      h: screenDim.height,
      w: screenDim.width
    },
    selection: props.selection,
    size: size
  });

  return (
    <SmartPositionWidget
      position={{
        clientX: x,
        clientY: y
      }}
    >
      <TooltipWrapperWidget
        gotDimensions={(size) => {
          setSize(size);
        }}
      >
        <TooltipWidget arrowAbove={pos !== ToolTipPositionHint.ABOVE} selection={props.selection} />
      </TooltipWrapperWidget>
    </SmartPositionWidget>
  );
});
