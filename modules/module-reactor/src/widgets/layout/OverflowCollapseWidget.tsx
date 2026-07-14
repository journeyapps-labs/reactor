import * as React from 'react';
import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useWidthObserver } from '../../hooks/useWidthObserver';

export interface OverflowCollapseWidgetProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  /** Defaults to true. Set false to render visible content against the right edge. */
  alignLeft?: boolean;
  className?: string;
  onOverflowChanged?: (overflowed: boolean) => void;
}

namespace S {
  export const Container = styled.div`
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
  `;

  export const Content = styled.div<{ $hidden: boolean }>`
    width: max-content;
    visibility: ${(p) => (p.$hidden ? 'hidden' : 'visible')};
  `;

  export const Sizer = styled.div`
    width: max-content;
    visibility: hidden;
    pointer-events: none;
  `;

  export const RightContent = styled.div`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: max-content;
  `;

  export const Fallback = styled.div`
    position: absolute;
    right: 0;
    top: 0;
  `;
}

/**
 * Shows a fallback when its full content does not fit its allocated width.
 *
 * The full content remains mounted in an absolute measurement layer. This
 * keeps its natural width stable without allowing it to alter the surrounding
 * flex layout while collapsed.
 */
export const OverflowCollapseWidget: React.FC<OverflowCollapseWidgetProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);
  const availableWidth = useWidthObserver(containerRef);
  useWidthObserver(measurementRef);
  const alignLeft = props.alignLeft ?? true;
  const contentWidth = measurementRef.current?.scrollWidth || 0;
  const overflowed = contentWidth > availableWidth + 1;

  useEffect(() => {
    props.onOverflowChanged?.(overflowed);
  }, [overflowed, props.onOverflowChanged]);

  return (
    <S.Container ref={containerRef} className={props.className}>
      {alignLeft ? (
        <S.Content ref={measurementRef} $hidden={overflowed} aria-hidden={overflowed}>
          {props.children}
        </S.Content>
      ) : (
        <S.Sizer ref={measurementRef} aria-hidden>
          {props.children}
        </S.Sizer>
      )}
      {!alignLeft && !overflowed ? <S.RightContent>{props.children}</S.RightContent> : null}
      {overflowed ? <S.Fallback>{props.fallback}</S.Fallback> : null}
    </S.Container>
  );
};
