import { Action, ActionEvent, ActionOptions, ActionListener, ActionGenerics, ActionComboBoxItem } from '../Action';
import { AbstractActionParameter } from './params/AbstractActionParameter';

export enum EntityActionParams {
  TARGET = 'target',
  SOURCE = 'source'
}

export interface ParameterizedActionEvent<Decoded extends { [parameter: string]: any } = {}> extends ActionEvent {
  entities?: Decoded;
  params?: { [parameter: string]: any };
}

export interface ParameterizedActionOptions extends ActionOptions {
  params?: AbstractActionParameter[];
}

export interface ParameterizedActionListener<E extends ParameterizedActionEvent = ParameterizedActionEvent>
  extends ActionListener<E> {
  willCollectParams?: (event: { payload: Partial<Omit<E, 'id'>> }) => any;
}

export interface ParameterizedActionGenerics extends ActionGenerics {
  OPTIONS: ParameterizedActionOptions;
  EVENT: ParameterizedActionEvent;
}

export abstract class ParameterizedAction<
  P extends Partial<ParameterizedActionGenerics> = Partial<ParameterizedActionGenerics>,
  T extends ParameterizedActionGenerics & P = ParameterizedActionGenerics & P
> extends Action<P, T, ParameterizedActionListener<T['EVENT']>> {
  constructor(options: P['OPTIONS']) {
    super(options);
    options.params?.forEach((p) => {
      p.setAction(this);
    });
  }

  getTypeDisplayName() {
    return 'Parameterized Action';
  }

  async collectParams(event: Omit<T['EVENT'], 'id'>) {
    for (let param of this.options.params) {
      if (!(await param.getValue(event))) {
        return false;
      }
    }
    return true;
  }

  async fireAction(event: Omit<T['EVENT'], 'id'>) {
    this.iterateListeners((cb) =>
      cb.willCollectParams?.({
        payload: event
      })
    );

    if (event.canceled) {
      this.logger.debug('Event was canceled when collecting params');
      return;
    }

    // ensure some defaults for these maps
    event.entities = event.entities || {};
    event.params = event.params || {};
    if (!(await this.collectParams(event))) {
      return false;
    }
    await super.fireAction(event);
  }
}
