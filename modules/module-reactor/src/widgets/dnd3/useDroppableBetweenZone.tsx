import { useDroppableZone, UseDroppableZoneOptions } from './useDroppableZone';
import * as React from 'react';
import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useDroppableRaw } from './useDroppableRaw';
import { AbstractDropZone } from '../../stores/dnd/zones/AbstractDropZone';

export interface UseDroppableBetweenZoneOption<T extends AbstractDropZone> extends UseDroppableZoneOptions<T> {
  children: React.JSX.Element[];
  vertical: boolean;
  setIndex: (zone: T, index: number) => any;
}

export const useDroppableBetweenZone = <T extends AbstractDropZone>(props: UseDroppableBetweenZoneOption<T>) => {
  const { hint, hover } = useDroppableZone({
    ...props
  });
  const children = [];
  const ref = useRef(props.dropzone);
  ref.current = props.dropzone;

  props.children.forEach((c, index) => {
    children.push(
      <ExpandZoneWidget
        dragEvent={(entered) => {
          if (entered) {
            props.setIndex(ref.current, index);
          }
        }}
        key={`expand-${index}`}
        vertical={props.vertical}
        hint={hint || hover}
      />,
      c
    );
  });

  return {
    hint,
    hover,
    children
  };
};

export interface ExpandZoneWidgetProps {
  hint: boolean;
  vertical: boolean;
  dragEvent: (entered: boolean) => any;
}

export const ExpandZoneWidget: React.FC<ExpandZoneWidgetProps> = (props) => {
  const ref = useRef(null);
  const [expand, setExpand] = useState(false);
  useDroppableRaw({
    key: 'expand-zone',
    forwardRef: ref,
    accepts: () => true,
    dragover: () => {
      setExpand(true);
      props.dragEvent(true);
    },
    dragexit: () => {
      setExpand(false);
      props.dragEvent(false);
    }
  });

  let amount = 0;
  if (props.hint) {
    amount = 2;
  }
  if (expand) {
    amount = 30;
  }
  if (props.vertical) {
    return (
      <S.ContainerVertical amount={amount}>
        <S.ChildVertical show={amount > 0} ref={ref} />
      </S.ContainerVertical>
    );
  }
  return (
    <S.ContainerHorizontal amount={amount}>
      <S.ChildHorizontal show={amount > 0} ref={ref} />
    </S.ContainerHorizontal>
  );
};
namespace S {
  export const ContainerVertical = styled.div<{ amount: number }>`
    height: ${(p) => p.amount}px;
    width: 100%;
    transition: height 0.5s;
    position: relative;
  `;

  export const ContainerHorizontal = styled.div<{ amount: number }>`
    width: ${(p) => p.amount}px;
    height: 100%;
    transition: width 0.5s;
    position: relative;
  `;

  const amount = 13;

  export const ChildVertical = styled.div<{ show: boolean }>`
    position: absolute;
    top: -${amount}px;
    bottom: -${amount}px;
    width: 100%;
    visibility: ${(p) => (p.show ? 'visible' : 'hidden')};
  `;

  export const ChildHorizontal = styled.div<{ show: boolean }>`
    position: absolute;
    left: -${amount}px;
    right: -${amount}px;
    height: 100%;
    visibility: ${(p) => (p.show ? 'visible' : 'hidden')};
  `;
}
