import * as React from 'react';
import { useDraggableRaw } from '../useDraggableRaw';
import { ioc } from '../../../inversify.config';
import { BatchStore } from '../../../stores/batch/BatchStore';
import { EncodedEntity } from '../../../entities/components/encoder/EntityEncoderComponent';
import { constructMimeFromEncodedEntity } from '../../../stores/dnd/zones/AbstractEntityDropZone';

export interface UseDraggableEntityProps {
  forwardRef: React.RefObject<HTMLDivElement>;
  entity: EncodedEntity;
}

export const useDraggableEntity = (props: UseDraggableEntityProps) => {
  const batchStore = ioc.get(BatchStore);

  useDraggableRaw({
    forwardRef: props.forwardRef,
    dragStart: () => {
      if (!batchStore.isSelected(props.entity)) {
        batchStore.selectOne(props.entity);
      }
    },
    encode: () => {
      return {
        data: batchStore.selections.reduce((prev, cur) => {
          prev[constructMimeFromEncodedEntity(cur)] = JSON.stringify(cur);
          return prev;
        }, {}),
        icon: batchStore.getSelectionIconRef()
      };
    }
  });
};
