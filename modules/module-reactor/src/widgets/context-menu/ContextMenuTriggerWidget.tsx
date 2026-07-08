import * as React from 'react';
import { MousePosition } from '../../layers/combo/SmartPositionWidget';
import { useLongPressContextMenu } from '../../hooks/useLongPressContextMenu';

export interface ContextMenuTriggerWidgetProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => any;
  onContextMenu?: (position: MousePosition) => any;
}

export const ContextMenuTriggerWidget = React.forwardRef<
  HTMLDivElement,
  ContextMenuTriggerWidgetProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'onContextMenu'>
>((props, ref) => {
  const localRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => localRef.current);
  useLongPressContextMenu(localRef, props.onContextMenu, props.disabled);
  const { children, disabled, onClick, onContextMenu, ...rest } = props;

  return (
    <div
      {...rest}
      ref={localRef}
      onClick={(event) => {
        if (disabled) {
          return;
        }
        onClick?.(event);
      }}
    >
      {children}
    </div>
  );
});
