import type { Action, ActionEvent } from '../actions/Action';
import type { Tracer } from './Tracer';
import type { Provider } from '../providers/Provider';
import type { BaseObserverInterface } from '@journeyapps-labs/common-utils';

export interface SystemListener {
  actionWillFire?: (event: { action: Action; event: Partial<ActionEvent> }) => Promise<any>;
  actionFired?: (event: { action: Action; event: Partial<ActionEvent> }) => void;
}

export interface SystemInterface extends BaseObserverInterface<SystemListener> {
  tracer: Tracer;
  getProvider<P extends Provider>(type: string): P;
}
