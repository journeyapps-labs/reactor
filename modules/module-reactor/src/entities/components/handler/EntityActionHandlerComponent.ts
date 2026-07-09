import { EntityHandlerComponent, EntityHandlerComponentOptions } from './EntityHandlerComponent';
import { ComboBoxItem } from '../../../stores/combo/ComboBoxDirectives';
import { EntityAction } from '../../../actions/parameterized/EntityAction';
import { ioc } from '../../../inversify.config';
import { ActionStore } from '../../../stores/actions/ActionStore';

export class EntityActionHandlerComponent extends EntityHandlerComponent {
  constructor(
    protected actionID: string,
    options: EntityHandlerComponentOptions = {}
  ) {
    super(options);
  }

  getDescription(): ComboBoxItem {
    return this.getAction().representAsComboBoxItem();
  }

  protected getAction(): EntityAction {
    return ioc.get(ActionStore).getActionByID<EntityAction>(this.actionID);
  }

  getPreferredActionId(): string {
    return this.actionID;
  }

  openEntity(event) {
    return this.getAction().fireAction({
      targetEntity: event.entity,
      position: event.position,
      source: event.source
    });
  }
}
