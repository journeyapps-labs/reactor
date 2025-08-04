import { BaseObserver } from '@journeyapps-labs/common-utils';
import { observable } from 'mobx';

export enum PassiveActionValidationState {
  ALLOWED = 'allowed',
  /**
   * Show in the UI but disable
   */
  DISABLED = 'disabled',
  /**
   * Hide from the UI completely
   */
  DISALLOWED = 'disallowed'
}

export enum ValidationDisabledReason {
  PLAN_LIMITS = 'plan_limits',
  PLAN_SETTING = 'plan_setting',
  AUTH = 'auth'
}

export interface ValidationResultAllowed {
  type: PassiveActionValidationState.ALLOWED;
}

export interface ValidationResultDisallowed {
  type: PassiveActionValidationState.DISALLOWED;
}

export interface ValidationResultDisabled {
  type: PassiveActionValidationState.DISABLED;
  reason?: ValidationDisabledReason;
}

export type ValidationResult = ValidationResultAllowed | ValidationResultDisallowed | ValidationResultDisabled;

export interface ActionValidatorListener {
  validationInProgress: () => any;
}

export abstract class ActionValidator extends BaseObserver<ActionValidatorListener> {
  @observable
  accessor busy: boolean;

  constructor() {
    super();
    this.busy = false;
  }

  abstract validate(): ValidationResult;
}
