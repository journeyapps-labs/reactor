import * as React from 'react';
import { useState } from 'react';
import { useValidator } from '../hooks/useValidator';
import type { Action } from './Action';
import { PassiveActionValidationState, ValidationDisabledReason } from './validators/ActionValidator';
import { ActionShortcutPillsWidget } from '../panels/settings/keys/ActionShortcutPillsWidget';
import { styled } from '../stores/themes/reactor-theme-fragment';

export interface ActionMetaWidgetProps {
  action: Action;
}

export const ActionMetaWidget: React.FC<ActionMetaWidgetProps> = (props) => {
  const [validationContext] = useState(() => {
    return props.action.generateValidationContext();
  });

  const { validationResult } = useValidator({
    validator: validationContext
  });

  if (validationResult?.type === PassiveActionValidationState.DISABLED) {
    if (validationResult?.reason === ValidationDisabledReason.PLAN_LIMITS) {
      return <S.UpgradeContainer>Plan limit reached</S.UpgradeContainer>;
    }
    if (validationResult?.reason === ValidationDisabledReason.PLAN_SETTING) {
      return <S.UpgradeContainer>Not available on plan</S.UpgradeContainer>;
    }
    return <></>;
  }
  return <ActionShortcutPillsWidget action={props.action} />;
};
namespace S {
  export const UpgradeContainer = styled.div`
    background: ${(p) => p.theme.plan.background};
    color: ${(p) => p.theme.plan.foreground};
    padding: 2px 5px;
    border-radius: 3px;
    align-self: center;
    margin-left: 10px;
    cursor: pointer;
    font-size: 10px;
  `;
}
