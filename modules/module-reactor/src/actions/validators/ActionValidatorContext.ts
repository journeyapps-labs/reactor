import { Action } from '../Action';
import { PassiveActionValidationState, ValidationResult } from './ActionValidator';
import { computed } from 'mobx';
import * as _ from 'lodash';

export interface Validator {
  validate(): ValidationResult;
}

export class ActionValidatorContext implements Validator {
  constructor(protected action: Action) {}

  @computed get busy() {
    return _.some(this.validators, (v) => v.busy);
  }

  get validators() {
    return this.action.options.validators || [];
  }

  validate() {
    const results: ValidationResult[] = [];
    for (const validator of this.validators) {
      results.push(validator.validate());
    }

    const priority = [
      PassiveActionValidationState.DISALLOWED,
      PassiveActionValidationState.DISABLED,
      PassiveActionValidationState.ALLOWED
    ];
    for (let check of priority) {
      let found = results.find((r) => r?.type === check);
      if (found) {
        return found;
      }
    }
    return {
      type: PassiveActionValidationState.ALLOWED
    };
  }

  validatePassively(): PassiveActionValidationState {
    return this.validate().type;
  }
}
