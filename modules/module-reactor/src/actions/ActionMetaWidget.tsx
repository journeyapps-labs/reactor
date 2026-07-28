import * as React from 'react';
import { useMemo } from 'react';
import { useValidator } from '../hooks/useValidator';
import type { Action } from './Action';
import { ActionValidationState } from './validators/ActionValidator';
import { ActionShortcutPillsWidget } from '../panels/settings/keys/ActionShortcutPillsWidget';
import { TreeBadgeWidget } from '../widgets/tree/TreeBadgeWidget';

export interface ActionMetaWidgetProps<T extends Action = Action> {
  action: T;
  eventData?: Parameters<T['validate']>[0];
}

export const ActionMetaWidget: React.FC<ActionMetaWidgetProps> = (props) => {
  const validator = useMemo(() => () => props.action.validate(props.eventData || {}), [props.action, props.eventData]);

  const { validationResult } = useValidator({
    validator
  });

  if (validationResult.type === ActionValidationState.BLOCKED && validationResult.indicator) {
    return <TreeBadgeWidget {...validationResult.indicator} />;
  }
  if (validationResult.type === ActionValidationState.ALLOWED) {
    return <ActionShortcutPillsWidget action={props.action} />;
  }
  return null;
};
