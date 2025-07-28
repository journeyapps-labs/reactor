import * as React from 'react';
import { useEffect } from 'react';
import { EntityReactorNode, EntityReactorNodeOptions } from '../EntityReactorNode';
import { EntityReactorLeaf } from '../EntityReactorLeaf';
import { observer } from 'mobx-react';

export interface ReactorEntityWrapperWidgetProps {
  options: EntityReactorNodeOptions;
  node: EntityReactorNode | EntityReactorLeaf;
  forwardRef: React.RefObject<HTMLDivElement>;
}

export const ReactorEntityWrapperWidget: React.FC<React.PropsWithChildren<ReactorEntityWrapperWidgetProps>> = observer(
  (props) => {
    useEffect(() => {
      return props.options.events?.registerListener({
        selectEntity: (entity) => {
          if (entity !== props.options.entity) {
            return;
          }
          props.forwardRef?.current?.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    }, []);
    return props.children;
  }
);
