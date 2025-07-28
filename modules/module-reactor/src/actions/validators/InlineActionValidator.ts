import { ActionValidator, PassiveActionValidationState, ValidationResult } from './ActionValidator';

/**
 * @deprecated use InlineActionValidator2
 */
export class InlineActionValidator extends ActionValidator {
  protected validateFn: () => PassiveActionValidationState;

  constructor(validateFn: () => PassiveActionValidationState) {
    super();
    this.validateFn = validateFn;
  }

  validate(): ValidationResult {
    return {
      type: this.validateFn()
    };
  }
}
