import { computed, observable } from 'mobx';
import { AbstractDialogDirective } from './AbstractDialogDirective';
import { AbstractStore } from '../AbstractStore';

export class DialogStore2 extends AbstractStore {
  @observable
  protected accessor _directives: Set<AbstractDialogDirective>;

  constructor() {
    super({ name: 'DIALOG_STORE_2' });
    this._directives = new Set();
  }

  @computed
  get directives() {
    return Array.from(this._directives.values());
  }

  async showDialog<T extends AbstractDialogDirective>(directive: T): Promise<T | null> {
    let canceled = await new Promise<boolean>((resolve) => {
      let l1 = directive.registerListener({
        disposed: ({ canceled }) => {
          l1();
          this._directives.delete(directive);
          resolve(canceled);
        }
      });
      this._directives.add(directive);
    });
    if (canceled) {
      return null;
    }
    return directive;
  }
}
