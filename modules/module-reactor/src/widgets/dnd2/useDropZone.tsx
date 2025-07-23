import * as React from 'react';
import { JOURNEY_MIME } from '../dnd/DraggableWidget';
import { Provider, SerializedEntity } from '../../providers/Provider';
import { useEffect } from 'react';
import { MousePosition } from '../../layers/combo/SmartPositionWidget';

export interface UseDropZoneProps {
  providers: Provider[];
  dropped?: (entity, position: MousePosition) => any;
  forwardRef: React.RefObject<HTMLDivElement>;
}

/**
 * @deprecated
 */
export const useDropZone = (props: UseDropZoneProps) => {
  useEffect(() => {
    const dragOver = (event: DragEvent) => {
      let found = false;
      for (let i = 0; i < event.dataTransfer.types.length; ++i) {
        // allow the effect
        if (event.dataTransfer.types[i] === JOURNEY_MIME) {
          found = true;
        }
      }

      if (!found) {
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };
    const drop = async (event: DragEvent) => {
      let data = event.dataTransfer.getData(JOURNEY_MIME);
      let object = JSON.parse(data) as SerializedEntity;

      const provider = props.providers.find((f) => f.options.type === object.type);
      if (provider) {
        props.dropped(await provider.deserialize(object), event);
      }
    };

    props.forwardRef.current.addEventListener('dragover', dragOver);
    props.forwardRef.current.addEventListener('drop', drop);

    return () => {
      props.forwardRef.current?.removeEventListener('dragover', dragOver);
      props.forwardRef.current?.removeEventListener('drop', drop);
    };
  }, [props.forwardRef]);
};
