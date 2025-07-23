import { Action, ActionEvent } from '../Action';
import { UXStore } from '../../stores/UXStore';
import { inject, ioc } from '../../inversify.config';
import * as _ from 'lodash';
import { keyType, ShortcutChord } from '../../stores/shortcuts/Shortcut';
import { System } from '../../core/System';

export class TabAction extends Action {
  @inject(UXStore)
  accessor uxStore: UXStore;

  left: boolean;

  static NAME_LEFT = 'TAB_ACTION_LEFT';
  static NAME_RIGHT = 'TAB_ACTION_RIGHT';

  constructor(left: boolean) {
    super({
      id: left ? TabAction.NAME_LEFT : TabAction.NAME_RIGHT,
      name: `Tab ${left ? 'left' : 'right'}`,
      icon: {
        chars: left ? 'TL' : 'TR'
      },
      hotkeys: [
        new ShortcutChord([
          { type: keyType.META },
          { type: keyType.CTRL },
          { type: keyType.STANDARD, key: left ? '[' : ']' }
        ])
      ],
      hideFromCmdPallet: true,
      exemptFromExclusiveExecutionLock: true
    });
    this.left = left;
  }

  static get(left: boolean) {
    return ioc.get(System).getActionByID<TabAction>(left ? TabAction.NAME_LEFT : TabAction.NAME_RIGHT);
  }

  protected async fireEvent(event: ActionEvent): Promise<any> {
    const stack = _.last(this.uxStore.tabStack);
    if (!stack) {
      return;
    }
    if (this.left) {
      stack.tabLeft();
    } else {
      stack.tabRight();
    }
  }
}
