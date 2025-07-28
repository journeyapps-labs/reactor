import { ParameterizedAction, ParameterizedActionEvent } from '../ParameterizedAction';

export interface AbstractActionParameterOptions {
  name: string;
  description?: string;
  /**
   * @default true
   */
  required?: boolean;

  getDefault?: () => any;
}

export abstract class AbstractActionParameter<
  OPTIONS extends AbstractActionParameterOptions = AbstractActionParameterOptions,
  T extends any = any
> {
  options: OPTIONS;
  action: ParameterizedAction;

  constructor(options: OPTIONS) {
    this.options = {
      ...options,
      required: options.required == null ? true : options.required
    };
  }

  abstract getValue(event: Omit<ParameterizedActionEvent, 'id'>): Promise<boolean>;

  setAction(action: ParameterizedAction) {
    this.action = action;
  }
}
