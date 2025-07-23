import * as React from 'react';
import { CoupledEntityDropZone } from '../../../stores/dnd/zones/CoupledEntityDropZone';
import { useDroppableZone } from '../useDroppableZone';
import { useState } from 'react';

export interface useDroppableEntityOptions<T> {
  forwardRef: React.RefObject<HTMLDivElement>;
  dropZoneEntity: any;
}

export const useDroppableEntity = <T>(props: useDroppableEntityOptions<T>) => {
  const [zone] = useState(() => {
    return new CoupledEntityDropZone(props.dropZoneEntity);
  });

  return useDroppableZone({
    dropzone: zone,
    forwardRef: props.forwardRef
  });
};
