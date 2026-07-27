import { ActionValidator, ValidationResult } from './ActionValidator';

export class InlineActionValidator<Event = unknown> extends ActionValidator<Event> {
  constructor(protected validateFn: (event?: Partial<Event>) => ValidationResult) {
    super();
  }

  validate(event?: Partial<Event>): ValidationResult {
    return this.validateFn(event);
  }
}
