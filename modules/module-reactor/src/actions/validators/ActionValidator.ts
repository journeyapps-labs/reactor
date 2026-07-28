import type { ReactorIcon } from '../../widgets/icons/IconWidget';

export enum ActionValidationState {
  ALLOWED = 'allowed',
  /**
   * Validation requires action parameters that have not been resolved yet.
   * Deferred validation must not prevent a parameterized action from being launched.
   */
  DEFERRED = 'deferred',
  /**
   * Validation has not completed yet
   */
  PENDING = 'pending',
  /**
   * Show in the UI but disable
   */
  DISABLED = 'disabled',
  /**
   * Prevent execution but allow activation of a remediation flow
   */
  BLOCKED = 'blocked',
  /**
   * Hide from the UI completely
   */
  HIDDEN = 'hidden'
}

export interface ValidationIndicator {
  icon?: ReactorIcon;
  value?: string;
  background?: string;
  foreground?: string;
  tooltip?: string;
}

export interface ValidationResultAllowed {
  type: ActionValidationState.ALLOWED;
}

export interface ValidationResultDeferred {
  type: ActionValidationState.DEFERRED;
  message?: string;
}

export interface ValidationResultPending {
  type: ActionValidationState.PENDING;
  message?: string;
}

export interface ValidationResultHidden {
  type: ActionValidationState.HIDDEN;
}

export interface ValidationResultDisabled {
  type: ActionValidationState.DISABLED;
  message?: string;
}

export interface ValidationResultBlocked {
  type: ActionValidationState.BLOCKED;
  message?: string;
  indicator?: ValidationIndicator;
  onActivate: () => void | Promise<void>;
}

export type ValidationResult =
  | ValidationResultAllowed
  | ValidationResultDeferred
  | ValidationResultPending
  | ValidationResultHidden
  | ValidationResultDisabled
  | ValidationResultBlocked;

export type Validator = () => ValidationResult;

export abstract class ActionValidator<Event = unknown> {
  abstract validate(event?: Partial<Event>): ValidationResult;
}
