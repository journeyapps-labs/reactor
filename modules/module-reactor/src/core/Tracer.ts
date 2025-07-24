import { ActionEvent, ActionSource } from '../actions/Action';

export interface UserAction {
  success: boolean;
  source: ActionSource;
  action_id: string;
  start_timestamp: string;
  end_timestamp: string;
  trace_id?: string;
}

export class ActionTrace {
  tracer: Tracer;
  event: ActionEvent;
  timestamp: Date;
  trace_id: string;

  constructor(tracer: Tracer, event: ActionEvent) {
    this.tracer = tracer;
    this.event = event;
    this.timestamp = new Date();
  }

  setTraceID(id: string) {
    this.trace_id = id;
  }

  end(success: boolean) {
    this.tracer.logAction({
      success,
      source: this.event.source,
      action_id: this.event.id,
      start_timestamp: this.timestamp.toISOString(),
      end_timestamp: new Date().toISOString(),
      trace_id: this.trace_id
    });
  }
}

export class Tracer {
  logAction(action: UserAction) {}

  createActionTrace(event: ActionEvent) {
    return new ActionTrace(this, event);
  }
}
