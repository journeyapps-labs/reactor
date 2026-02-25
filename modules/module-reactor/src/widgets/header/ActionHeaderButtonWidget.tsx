import * as React from 'react';
import { useRef } from 'react';
import { HeaderButtonWidget } from './HeaderButtonWidget';
import { Action, ActionSource } from '../../actions/Action';
import { useDraggableEntity } from '../dnd3/entities/useDraggableEntity';
import { ioc } from '../../inversify.config';
import { System } from '../../core/System';

export interface ActionHeaderButtonWidgetProps {
  action: Action;
  remove: () => any;
  vertical: boolean;
}

export const ActionHeaderButtonWidget: React.FC<ActionHeaderButtonWidgetProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  useDraggableEntity({
    forwardRef: ref,
    entity: ioc.get(System).encodeEntity(props.action)
  });

  return (
    <HeaderButtonWidget
      vertical={props.vertical}
      remove={props.remove}
      btn={{
        forwardRef: ref,
        icon: props.action.options.icon,
        tooltip: props.action.options.name,
        action: (event) => {
          props.action.fireAction({
            source: ActionSource.BUTTON,
            position: event
          });
        }
      }}
    />
  );
};
