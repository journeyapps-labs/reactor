import { autorun, observable, runInAction } from 'mobx';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ActionValidationState, ValidationResult, Validator } from '../actions/validators/ActionValidator';

export interface UseValidatorProps {
  validator?: Validator;
}

const allowed = (): ValidationResult => ({
  type: ActionValidationState.ALLOWED
});

export const useValidator = (props: UseValidatorProps) => {
  const [validator] = useState(() => observable.box<Validator | undefined>(props.validator, { deep: false }));
  const [validationResult, setValidationResult] = useState<ValidationResult>(() => props.validator?.() || allowed());

  useLayoutEffect(() => {
    runInAction(() => validator.set(props.validator));
  }, [props.validator, validator]);

  useEffect(() => {
    return autorun(() => {
      setValidationResult(validator.get()?.() || allowed());
    });
  }, [validator]);

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
