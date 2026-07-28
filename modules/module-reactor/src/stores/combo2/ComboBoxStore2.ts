import { ComboBoxDirective } from './ComboBoxDirective';
import { observable } from 'mobx';
import { AbstractStore, AbstractStoreListener } from '../AbstractStore';

export interface ComboBoxStore2Listener extends AbstractStoreListener {
  directiveAdded: (directive: ComboBoxDirective) => any;
}

export class ComboBoxStore2 extends AbstractStore<ComboBoxStore2Listener> {
  @observable
  accessor directives: Set<ComboBoxDirective>;

  constructor() {
    super({ name: 'COMBO_BOX_STORE_2' });
    this.directives = observable.set<ComboBoxDirective>() as unknown as Set<ComboBoxDirective>;
  }

  /**
   *
   * @param directive SimpleComboBoxDirective | SearchEngineComboBoxDirective
   */
  async show<T extends ComboBoxDirective>(directive: T): Promise<T> {
    this.directives.add(directive);
    this.iterateListeners((cb) => cb.directiveAdded?.(directive));

    await new Promise<void>((resolve) => {
      const l = directive.registerListener({
        dismissed: () => {
          this.directives.delete(directive);
          resolve();
          l();
        }
      });
    });
    return directive;
  }
}
