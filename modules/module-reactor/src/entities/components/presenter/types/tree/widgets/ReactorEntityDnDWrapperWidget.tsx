import { useDraggableEntity } from '../../../../../../widgets/dnd3/entities/useDraggableEntity';
import { useDroppableEntity } from '../../../../../../widgets/dnd3/entities/useDroppableEntity';
import { IBaseReactorTree } from '../../../../../../widgets/core-tree/reactor-tree/PatchTree';
import * as React from 'react';
import { EntityDefinition } from '../../../../../EntityDefinition';
import { observer } from 'mobx-react';
import { useEffect, useRef } from 'react';

export interface ReactorEntityDnDWrapperProps {
  entity: any;
  node: IBaseReactorTree;
  children: (ref: React.RefObject<HTMLDivElement>) => React.JSX.Element;
  definition: EntityDefinition;
}

export const ReactorEntityDnDWrapper: React.FC<ReactorEntityDnDWrapperProps> = observer((props) => {
  const ref = useRef<HTMLDivElement>(null);
  if (props.definition.getEncoders().length > 0) {
    useDraggableEntity({
      entity: props.definition.encode(props.entity),
      forwardRef: ref
    });
  }
  const { hint, hover } = useDroppableEntity({
    dropZoneEntity: props.entity,
    forwardRef: ref
  });
  useEffect(() => {
    if (hint || hover) {
      return props.node.addPropGenerator(() => {
        return {
          dropZoneHover: hover,
          dropZoneHint: hint
        };
      });
    }
  }, [hint, hover]);
  return props.children(ref);
});
