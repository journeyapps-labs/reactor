import * as React from 'react';
import { useEffect, useRef } from 'react';

export interface UseDroppableRawOptions<T extends { [key: string]: any } = {}> {
  dropped?: (event: { files: File[]; entities: T; event: DragEvent }) => any;
  dragover?: () => any;
  dragexit?: () => any;
  accepts: (mimes: readonly string[]) => boolean;
  forwardRef: React.RefObject<HTMLDivElement>;
  key?: string;
}

export const useDroppableRaw = <T extends { [key: string]: string } = {}>(
  props: UseDroppableRawOptions<T>,
  deps = []
) => {
  const timerHandle = useRef<any>(null);
  useEffect(() => {
    const dragOver = (event: DragEvent) => {
      if (props.accepts(event.dataTransfer.types)) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'link';
        if (timerHandle.current) {
          clearTimeout(timerHandle.current);
        } else {
          props.dragover?.();
        }
        timerHandle.current = setTimeout(() => {
          props.dragexit?.();
          timerHandle.current = null;
        }, 50);
      }
    };

    const drop = async (event: DragEvent) => {
      let files = [];
      let res = {} as any;
      for (let mime of event.dataTransfer.types) {
        res[mime] = event.dataTransfer.getData(mime);
      }

      if (event.dataTransfer.files) {
        files = Array.from(event.dataTransfer.files);
      }

      try {
        event.preventDefault();
        props.dropped?.({
          files,
          entities: res,
          event
        });
      } catch (ex) {
        console.warn(`Failed to deserialize draggable object`, ex);
      }
    };

    props.forwardRef.current.addEventListener('dragover', dragOver);
    props.forwardRef.current.addEventListener('drop', drop);

    return () => {
      props.forwardRef.current?.removeEventListener('dragover', dragOver);
      props.forwardRef.current?.removeEventListener('drop', drop);
    };
  }, [props.forwardRef, ...deps]);
};
