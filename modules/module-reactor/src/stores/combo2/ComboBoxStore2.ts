import { BaseObserver } from '@journeyapps-labs/common-utils';
import { ComboBoxDirective } from './ComboBoxDirective';
import { observable } from 'mobx';

export interface ComboBoxStore2Listener {
  directiveAdded: (directive: ComboBoxDirective) => any;
}

export class ComboBoxStore2 extends BaseObserver<ComboBoxStore2Listener> {
  @observable
  accessor directives: Set<ComboBoxDirective>;

  constructor() {
    super();
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
