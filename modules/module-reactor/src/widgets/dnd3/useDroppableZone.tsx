import * as React from 'react';
import { useEffect, useState } from 'react';
import { AbstractDropZone } from '../../stores/dnd/zones/AbstractDropZone';
import { DNDStore } from '../../stores/dnd/DNDStore';
import { ioc } from '../../inversify.config';
import { useDroppableRaw } from './useDroppableRaw';

export interface UseDroppableZoneOptions<T extends AbstractDropZone> {
  forwardRef: React.RefObject<HTMLDivElement>;
  dropzone: T;
}

export const useDroppableZone = <T extends AbstractDropZone>(props: UseDroppableZoneOptions<T>) => {
  const [hint, setHint] = useState(false);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (!props.dropzone) {
      return;
    }
    const l1 = props.dropzone.registerListener({
      highlight: setHint
    });
    const l2 = ioc.get(DNDStore).registerDropZone(props.dropzone);
    return () => {
      l1();
      l2();
    };
  }, [props.dropzone]);

  useDroppableRaw<{ [key: string]: string }>(
    {
      forwardRef: props.forwardRef,
      dragover: () => {
        setHover(true);
      },
      dragexit: () => {
        setHover(false);
      },
      accepts: (mimes) => {
        return mimes.some((mime) => props.dropzone.acceptsMimeType(mime));
      },
      dropped: ({ entities, event }) => {
        props.dropzone.handleDrop({
          data: entities,
          position: event
        });
      }
    },
    [props.dropzone]
  );
  return {
    hint: !hover && hint,
    hover
  };
};
