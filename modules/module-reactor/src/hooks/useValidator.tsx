import { autorun } from 'mobx';
import { useEffect, useState } from 'react';
import { ActionValidationState, ValidationResult, Validator } from '../actions/validators/ActionValidator';

export interface UseValidatorProps {
  validator?: Validator;
}

export const useValidator = (props: UseValidatorProps) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    type: ActionValidationState.ALLOWED
  });

  useEffect(() => {
    if (props?.validator) {
      const disposer1 = autorun(() => {
        const result = props.validator();
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

export async function activateWithValidation<T>(
  validationResult: ValidationResult,
  activate: () => T | Promise<T>
): Promise<T | undefined> {
  if (validationResult.type === ActionValidationState.BLOCKED) {
    await validationResult.onActivate();
    return;
  }
  if (validationResult.type !== ActionValidationState.ALLOWED) {
    return;
  }
  return activate();
}
