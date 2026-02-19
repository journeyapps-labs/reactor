import { EntityEncoderComponent } from '../../entities/components/encoder/EntityEncoderComponent';
import { Action } from '../../actions/Action';
import { ioc } from '../../inversify.config';
import { ActionStore } from '../../stores/actions/ActionStore';

export interface EncodedAction {
  action: string;
}

export class ActionEntityEncoder extends EntityEncoderComponent<Action, EncodedAction> {
  async doDecode(entity: EncodedAction): Promise<Action> {
    return ioc.get(ActionStore).getActionByID(entity.action);
  }

  doEncode(entity: Action): EncodedAction {
    return {
      action: entity.options.id
    };
  }
}
