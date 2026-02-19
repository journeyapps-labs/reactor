import { ParameterizedAction, ParameterizedActionEvent } from './parameterized/ParameterizedAction';
import { ActionStore } from '../stores/actions/ActionStore';

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

  setActionStore(app: ActionStore) {
    super.setActionStore(app);
    this.action.setActionStore(app);
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
