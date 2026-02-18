import { EntityEncoderComponent } from '../../entities/components/encoder/EntityEncoderComponent';
import { Action } from '../../actions/Action';

export interface EncodedAction {
  action: string;
}

export class ActionEntityEncoder extends EntityEncoderComponent<Action, EncodedAction> {
  async doDecode(entity: EncodedAction): Promise<Action> {
    return this.system.getActionByID(entity.action);
  }

  doEncode(entity: Action): EncodedAction {
    return {
      action: entity.options.id
    };
  }
}
