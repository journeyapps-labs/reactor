import { ComponentBank } from '../banks/ComponentBank';
import { EntityHandlerComponent } from './EntityHandlerComponent';

export class EntityHandlerBank<T = any> extends ComponentBank<EntityHandlerComponent<T>> {
  getPreferred(): EntityHandlerComponent<T> | null {
    const handlers = this.getItems();
    return handlers.find((handler) => handler.preferred) || (handlers.length === 1 ? handlers[0] : null);
  }
}
