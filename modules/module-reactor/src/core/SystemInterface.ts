import { Action, ActionEvent } from '../actions/Action';
import { Tracer } from './Tracer';
import { Provider } from '../providers/Provider';
import { BaseListener, BaseObserverInterface } from '@journeyapps-labs/lib-reactor-utils';

export interface SystemListener extends BaseListener {
  actionWillFire?: (event: { action: Action; event: Partial<ActionEvent> }) => Promise<any>;
  actionFired?: (event: { action: Action; event: Partial<ActionEvent> }) => void;
}

export interface SystemInterface extends BaseObserverInterface<SystemListener> {
  tracer: Tracer;
  getProvider<P extends Provider>(type: string): P;
}
