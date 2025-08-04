import { Action, ActionEvent } from '../actions/Action';
import { Tracer } from './Tracer';
import { Provider } from '../providers/Provider';
import { BaseObserverInterface } from '@journeyapps-labs/common-utils';

export interface SystemListener {
  actionWillFire?: (event: { action: Action; event: Partial<ActionEvent> }) => Promise<any>;
  actionFired?: (event: { action: Action; event: Partial<ActionEvent> }) => void;
}

export interface SystemInterface extends BaseObserverInterface<SystemListener> {
  tracer: Tracer;
  getProvider<P extends Provider>(type: string): P;
}
