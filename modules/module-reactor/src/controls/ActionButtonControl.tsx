import * as React from 'react';
import { ButtonControl } from './ButtonControl';
import { RepresentAsControlOptions } from './AbstractControl';
import type { Action } from '../actions/Action';
import { ActionValidationState, ValidationResult, Validator } from '../actions/validators/ActionValidator';
import { observer } from 'mobx-react';

export type EventType<T> = T extends Action<any, infer TGenerics, any> ? TGenerics['EVENT'] : never;

export type E = EventType<Action>;

export interface ActionButtonControlOptions<T extends Action> {
  action: T;
  getEventData?: () => Partial<EventType<T>>;
}

export class ActionButtonControl<T extends Action> extends ButtonControl {
  constructor(protected options2: ActionButtonControlOptions<T>) {
    super({
      btn: () => options2.action.representAsButton(options2.getEventData?.() || {})
    });
  }

  representAsControl(options: RepresentAsControlOptions): React.JSX.Element {
    return (
      <ActionButtonWidget
        validator={() => this.options2.action.validate(this.options2.getEventData?.() || {})}
        render={() => super.representAsControl(options)}
      />
    );
  }
}

export interface ActionButtonWidgetProps {
  validator: Validator;
  render: (result: ValidationResult, validator: Validator) => React.JSX.Element;
}

export const ActionButtonWidget = observer((props: ActionButtonWidgetProps) => {
  const result = props.validator();
  if (result.type === ActionValidationState.HIDDEN) {
    return null;
  }

  return props.render(result, props.validator);
});
