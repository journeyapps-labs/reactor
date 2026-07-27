import { ButtonControl } from './ButtonControl';
import type { Action } from '../actions/Action';

export type EventType<T> = T extends Action<any, infer TGenerics, any> ? TGenerics['EVENT'] : never;

export interface ActionButtonControlOptions<T extends Action> {
  action: T;
  getEventData?: () => Partial<EventType<T>>;
}

export class ActionButtonControl<T extends Action> extends ButtonControl {
  constructor(options: ActionButtonControlOptions<T>) {
    super({
      btn: () => options.action.representAsButton(options.getEventData?.() || {})
    });
  }
}
