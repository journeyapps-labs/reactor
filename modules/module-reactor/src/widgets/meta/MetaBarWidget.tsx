import * as React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ReadOnlyMetadataWidget, ReadOnlyMetadataWidgetProps } from './ReadOnlyMetadataWidget';
import { useWidthObserver } from '../../hooks/useWidthObserver';

export interface MetaBarOverflowOptions {
  forwardRef?: React.RefObject<HTMLElement>;
  fallback: React.ReactNode;
  overflowKey?: string;
  changed?: (overflowed: boolean) => void;
  forceOverflow?: boolean;
  observe?: boolean;
}

export interface MetaBarWidgetProps {
  meta?: ReadOnlyMetadataWidgetProps[];
  showIcons?: boolean;
  className?: any;
  overflow?: MetaBarOverflowOptions;
}

export const MetaBarWidget: React.FC<MetaBarWidgetProps> = (props) => {
  const [overflowed, setOverflowed] = useState(false);
  const [expandedMinWidth, setExpandedMinWidth] = useState(0);
  const width = useWidthObserver(props.overflow?.forwardRef);

  useEffect(() => {
    setOverflowed(false);
    setExpandedMinWidth(0);
  }, [props.overflow?.overflowKey]);

  useLayoutEffect(() => {
    if (props.overflow?.observe === false || props.overflow?.forceOverflow) {
      return;
    }
    const element = props.overflow?.forwardRef?.current;
    if (!element) {
      return;
    }

    if (overflowed) {
      if (expandedMinWidth > 0 && width >= expandedMinWidth) {
        setOverflowed(false);
      }
      return;
    }

    if (element.scrollWidth > element.clientWidth) {
      setExpandedMinWidth(element.scrollWidth);
      setOverflowed(true);
    }
  }, [width, overflowed, expandedMinWidth, props.meta, props.overflow]);

  useEffect(() => {
    props.overflow?.changed?.(props.overflow?.forceOverflow || overflowed);
  }, [overflowed, props.overflow]);

  const showFallback = props.overflow && (props.overflow.forceOverflow || overflowed);

  return (
    <S.Container className={props.className} $wrap={!props.overflow}>
      {showFallback
        ? props.overflow.fallback
        : (props.meta || [])
            .filter((f) => !!f)
            .map((value) => {
              return <S.PanelToolbarMeta showIcon={props.showIcons} {...value} key={value.label} />;
            })}
    </S.Container>
  );
};
namespace S {
  export const PanelToolbarMeta = styled(ReadOnlyMetadataWidget)``;

  export const Container = styled.div<{ $wrap: boolean }>`
    display: flex;
    flex-wrap: ${(p) => (p.$wrap ? 'wrap' : 'nowrap')};
    column-gap: 5px;
    row-gap: 5px;
  `;
}
