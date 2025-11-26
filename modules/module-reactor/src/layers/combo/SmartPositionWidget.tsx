import * as React from 'react';
import { useRef } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react';
import { useDimensionObserver } from '../../hooks/useDimensionObserver';

export interface MousePosition {
  clientX: number;
  clientY: number;
}

export interface SmartPositionWidgetProps {
  position?: MousePosition;
  className?: any;
  animate?: boolean;
}

namespace S {
  export const Box = styled.div<{ animate?: boolean }>`
    position: absolute;
    ${(p) => (p.animate ? `transition: top 0.3s, left 0.3s` : '')};
  `;
}

export const SmartPositionWidget: React.FC<React.PropsWithChildren<SmartPositionWidgetProps>> = observer((props) => {
  const ref = useRef<HTMLDivElement>(null);

  const getStyle = (options: { width: number; height: number }): Partial<CSSStyleDeclaration> => {
    if (!props.position) {
      return { top: '50%', left: '50%' };
    }
    if (ref.current) {
      let x = props.position.clientX;
      if (x + options.width > document.body.offsetWidth) {
        x = x - options.width - 10;
      }

      let y = props.position.clientY;
      if (y + options.height > document.body.offsetHeight) {
        y = y - options.height - 10;
      }

      return {
        left: `${x}px`,
        top: `${y}px`
      };
    }
    return {
      left: `${props.position.clientX}px`,
      top: `${props.position.clientY}px`
    };
  };

  useDimensionObserver(
    {
      element: ref,
      changed: (dimensions) => {
        const s = getStyle(dimensions);
        ref.current.style.top = s.top;
        ref.current.style.left = s.left;
      }
    },
    [props.position?.clientX, props.position?.clientY]
  );

  return (
    <S.Box animate={props.animate} className={props.className} ref={ref}>
      {props.children}
    </S.Box>
  );
});
