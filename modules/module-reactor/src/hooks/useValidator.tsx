import { autorun } from 'mobx';
import { useEffect, useState } from 'react';
import {
  PassiveActionValidationState,
  ValidationDisabledReason,
  ValidationResult
} from '../actions/validators/ActionValidator';
import { Validator } from '../actions/validators/ActionValidatorContext';
import { ioc } from '../inversify.config';
import { NotificationStore, NotificationType } from '../stores/NotificationStore';
import { ENV } from '../env';
import { Btn } from '../definitions/common';

export interface UseValidatorProps {
  validator: Validator;
}

export const useValidator = (props: UseValidatorProps) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    type: PassiveActionValidationState.ALLOWED
  });

  useEffect(() => {
    if (props?.validator) {
      const disposer1 = autorun(() => {
        const result = props.validator.validate();
        setValidationResult(result);
      });
      return () => {
        disposer1();
      };
    }
  }, [props.validator]);
  return {
    validationResult
  };
};

export function processCallbackWithValidation<T>(cb: () => T, validationResult?: ValidationResult): T {
  if (validationResult?.type === PassiveActionValidationState.DISABLED) {
    if (validationResult?.reason === ValidationDisabledReason.PLAN_LIMITS) {
      showPlanLimitMessage(PlanLimitMessageType.LIMIT_REACHED);
    }
    if (validationResult?.reason === ValidationDisabledReason.PLAN_SETTING) {
      showPlanLimitMessage(PlanLimitMessageType.NOT_ENABLED);
    }
    return;
  }
  return cb();
}

export const redirectToPlansPage = () => {
  window.open(`${ENV.ADMIN_PORTAL_URL}/admin/${ENV.USER_ORG}/plans`, '_blank');
};

export enum PlanLimitMessageType {
  LIMIT_REACHED = 'limit-reached',
  LIMIT_EXCEEDED = 'limit-exceeded',
  NOT_ENABLED = 'not-enabled'
}

export const showPlanLimitMessage = (type: PlanLimitMessageType = PlanLimitMessageType.LIMIT_REACHED) => {
  let btn = {
    label: 'Click here to upgrade',
    action: () => {
      redirectToPlansPage();
    }
  } as Btn;

  if (type === PlanLimitMessageType.LIMIT_REACHED) {
    ioc.get(NotificationStore).showNotification({
      type: NotificationType.INSERT_COIN,
      title: 'Plan limit reached',
      description:
        'This action cannot be performed as you have reached the maximum quota within your current organization.',
      btns: [btn]
    });
    return;
  }

  if (type === PlanLimitMessageType.NOT_ENABLED) {
    ioc.get(NotificationStore).showNotification({
      type: NotificationType.INSERT_COIN,
      title: 'Not available on plan',
      description:
        'This action cannot be performed as it is not available on any of the plans within your current organization.',
      btns: [btn]
    });
    return;
  }

  ioc.get(NotificationStore).showNotification({
    type: NotificationType.INSERT_COIN,
    title: 'Outside plan limits',
    description: 'This action cannot be performed as it falls outside of your current organization plan limits.',
    btns: [btn]
  });
};
