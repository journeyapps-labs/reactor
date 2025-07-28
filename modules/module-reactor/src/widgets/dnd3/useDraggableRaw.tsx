import * as React from 'react';
import { useEffect } from 'react';
import { ioc } from '../../inversify.config';
import { DNDStore } from '../../stores/dnd/DNDStore';

export interface EncodedDragResult {
  data: {
    [key: string]: string;
  };
  icon: Element;
}

export interface UseDraggableRawProps<T> {
  forwardRef: React.RefObject<HTMLDivElement>;
  multiple?: boolean;
  dragStart?: () => any;
  encode: () => EncodedDragResult;
}

export function useDraggableRaw<T>(props: UseDraggableRawProps<T>) {
  useEffect(() => {
    const dragStart = (event: DragEvent) => {
      props.dragStart?.();

      const mimes = props.encode();
      const validMimes = [];
      for (let i in mimes.data) {
        if (mimes.data[i]) {
          event.dataTransfer.setData(i, mimes.data[i]);
          validMimes.push(i);
        }
      }

      if (mimes.icon) {
        event.dataTransfer.setDragImage(mimes.icon, 30, 30);
      }

      ioc.get(DNDStore).dragEntity(validMimes);
    };
    const dragEnd = async (event: DragEvent) => {
      ioc.get(DNDStore).dragEntity([]);
    };

    props.forwardRef.current.addEventListener('dragstart', dragStart);
    props.forwardRef.current.addEventListener('dragend', dragEnd);

    props.forwardRef.current.setAttribute('draggable', 'true');

    return () => {
      props.forwardRef.current?.removeEventListener('dragstart', dragStart);
      props.forwardRef.current?.removeEventListener('dragend', dragEnd);
    };
  }, [props.forwardRef]);
}

export function DraggableRawWidget<T>(props: React.PropsWithChildren<UseDraggableRawProps<T>>) {
  useDraggableRaw(props);
  return props.children as React.JSX.Element;
}
