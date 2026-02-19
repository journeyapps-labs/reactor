import { EntityHandlerComponent, OpenEntityEvent } from '../../entities/components/handler/EntityHandlerComponent';
import { Action } from '../../actions/Action';
import { ComboBoxItem } from '../../stores/combo/ComboBoxDirectives';

export class ActionEntityHandler extends EntityHandlerComponent<Action> {
  openEntity(event: OpenEntityEvent<Action>) {
    return event.entity.fireAction(event);
  }

  getDescription(entity: Action): Omit<ComboBoxItem, 'key'> {
    return {
      title: `Fire Action: ${entity.options.name}`
    };
  }
}
