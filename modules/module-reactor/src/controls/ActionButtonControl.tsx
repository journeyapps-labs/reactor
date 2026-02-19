import * as React from 'react';
import { useEffect, useState } from 'react';
import { ButtonControl } from './ButtonControl';
import { RepresentAsControlOptions } from './AbstractControl';
import type { Action } from '../actions/Action';
import { PassiveActionValidationState, ValidationResult } from '../actions/validators/ActionValidator';
import { Btn } from '../definitions/common';
import { observer } from 'mobx-react';

export type EventType<T> = T extends Action<infer TResult> ? TResult['EVENT'] : never;

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

  representAsBtn(): Btn {
    return {
      ...super.representAsBtn(),
      validator: this.options2.action.generateValidationContext()
    };
  }

  representAsControl(options: RepresentAsControlOptions): React.JSX.Element {
    return <ActionButtonWidget action={this.options2.action} render={() => super.representAsControl(options)} />;
  }
}

export interface ActionButtonWidgetProps<T extends Action> {
  action: T;
  render: (result: ValidationResult) => React.JSX.Element;
}

export const ActionButtonWidget = observer(<T extends Action>(props: ActionButtonWidgetProps<T>) => {
  const [context] = useState(() => {
    return props.action.generateValidationContext();
  });

  const result = context.validate();
  if (result.type === PassiveActionValidationState.DISALLOWED) {
    return null;
  }

  return props.render(result);
});
