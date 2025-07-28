import { Action, ActionEvent } from '../../Action';
import { keyType, ShortcutChord, WorkspaceStore } from '../../../stores';
import { inject } from '../../../inversify.config';
import { WorkspaceTabModel } from '@projectstorm/react-workspaces-model-tabs';

export class CycleOpenTabsAction extends Action {
  @inject(WorkspaceStore)
  accessor workspaceStore: WorkspaceStore;

  constructor(protected left: boolean) {
    super({
      id: `CYCLE_OPEN_TABS_${left ? 'LEFT' : 'RIGHT'}`,
      name: `Cycle ${left ? 'left' : 'right'} through open tabs`,
      icon: left ? 'arrow-left' : 'arrow-right',
      hotkeys: [
        new ShortcutChord([
          {
            type: keyType.CTRL
          },
          {
            type: keyType.SHIFT
          },
          {
            key: left ? '{' : '}',
            type: keyType.STANDARD
          }
        ])
      ]
    });
  }

  protected async fireEvent(event: ActionEvent): Promise<boolean | void> {
    const tabGroup = this.workspaceStore
      .getRoot()
      .flatten()
      .find((w) => w instanceof WorkspaceTabModel) as WorkspaceTabModel;
    if (!tabGroup || !tabGroup.getSelected()) {
      return true;
    }

    let index = tabGroup.children.indexOf(tabGroup.getSelected());

    if (this.left) {
      index--;
      if (index < 0) {
        index = tabGroup.children.length - 1;
      }
    } else {
      index++;
      if (index > tabGroup.children.length - 1) {
        index = 0;
      }
    }

    tabGroup.setSelected(tabGroup.children[index]);

    return true;
  }
}
