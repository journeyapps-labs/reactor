import { ActionValidator, PassiveActionValidationState, ValidationResult } from '../../validators/ActionValidator';
import { AdvancedWorkspacePreference } from '../../../preferences/AdvancedWorkspacePreference';

export class WorkspaceActionValidator extends ActionValidator {
  validate(): ValidationResult {
    return {
      type: AdvancedWorkspacePreference.enabled()
        ? PassiveActionValidationState.ALLOWED
        : PassiveActionValidationState.DISALLOWED
    };
  }
}
