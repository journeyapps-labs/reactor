import { ComponentSelection } from './ComponentSelection';
import { DialogStore } from '../../DialogStore';
import { inject } from '../../../inversify.config';
import { ReactorComponentType } from './common';

export class DialogComponentSelection extends ComponentSelection {
  @inject(DialogStore)
  accessor dialogStore: DialogStore;

  dialogListener: () => any;

  constructor() {
    super({
      type: ReactorComponentType.DIALOG
    });
  }

  lock() {
    this.dialogListener = this.dialogStore.registerListener({
      dialogWillHide: (event) => {
        if (!event.val) {
          event.preventDefault();
        }
      }
    });
  }

  dispose() {
    super.dispose();
    this.dialogListener?.();
  }
}
