import { ParameterizedAction, ParameterizedActionEvent } from './parameterized/ParameterizedAction';
import { System } from '../core/System';

export interface CurriedActionOptions {
  entities?: { [key: string]: any };
  params?: { [key: string]: any };
  action: ParameterizedAction;
}

export class CurriedAction extends ParameterizedAction {
  action: ParameterizedAction;
  entities: { [key: string]: any };
  params: { [key: string]: any };

  constructor(options: CurriedActionOptions) {
    super(options.action.options);
    this.action = options.action;
    this.entities = options.entities;
    this.params = options.params;
  }

  setApplication(app: System) {
    this.action.setApplication(app);
  }

  protected fireEvent(event: ParameterizedActionEvent): Promise<any> {
    // DO NOTHING
    return;
  }

  fireAction(event: ParameterizedActionEvent): Promise<any> {
    return this.action.fireAction({
      ...event,
      params: {
        ...(event.params || {}),
        ...(this.params || {})
      },
      entities: {
        ...(event.entities || {}),
        ...(this.entities || {})
      }
    });
  }
}
