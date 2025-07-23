import flight_log_types from '@journeyapps-platform/types-flight-log';
import { ActionEvent } from '../actions/Action';

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

  end(status: flight_log_types.ACTION_STATUS) {
    this.tracer.logAction({
      status: status,
      source: this.event.source,
      action_id: this.event.id,
      start_timestamp: this.timestamp.toISOString(),
      end_timestamp: new Date().toISOString(),
      trace_id: this.trace_id
    });
  }
}

export class Tracer {
  logAction(action: Omit<flight_log_types.UserAction, 'app_id' | 'user_id' | 'service_name'>) {}

  createActionTrace(event: ActionEvent) {
    return new ActionTrace(this, event);
  }
}
