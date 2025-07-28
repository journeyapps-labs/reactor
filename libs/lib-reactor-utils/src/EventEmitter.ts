import { Disposable } from './Disposable';
import * as uuid from 'uuid';

export type SubscriberCallback<E> = (event: E) => void;
export type Subscriber<E> = {
  id: string;
  handler: SubscriberCallback<E>;
};

/**
 * Not to be confused with node's EventEmitter. This is a typed emitter
 */
export class EventEmitter<E> implements Disposable {
  subscribers: Subscriber<E>[] = [];

  private unsubscribe(id: string) {
    this.subscribers = this.subscribers.filter((subscriber) => {
      return subscriber.id !== id;
    });
  }

  subscribe(handler: SubscriberCallback<E>): Disposable {
    const id = uuid.v4();
    this.subscribers.push({
      id: id,
      handler: handler
    });

    return {
      dispose: () => {
        this.unsubscribe(id);
      }
    };
  }

  emit(event: E) {
    this.subscribers.forEach((subscriber) => {
      try {
        subscriber.handler(event);
      } catch (err) {
        console.error(err);
      }
    });
  }

  dispose() {
    this.subscribers = [];
  }
}
