import { ActionValidator, ValidationResult } from './ActionValidator';

export class InlineActionValidator2 extends ActionValidator {
  protected validateFn: () => ValidationResult;

  constructor(validateFn: () => ValidationResult) {
    super();
    this.validateFn = validateFn;
  }

  validate(): ValidationResult {
    return this.validateFn();
  }
}
