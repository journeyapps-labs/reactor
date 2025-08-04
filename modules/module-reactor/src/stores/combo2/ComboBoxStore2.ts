import { BaseObserver } from '@journeyapps-labs/common-utils';
import { ComboBoxDirective } from './ComboBoxDirective';
import { observable } from 'mobx';

export interface ComboBoxStore2Listener {
  directiveAdded: (directive: ComboBoxDirective) => any;
}

export class ComboBoxStore2 extends BaseObserver<ComboBoxStore2Listener> {
  @observable
  accessor directive: ComboBoxDirective;

  constructor() {
    super();
    this.directive = null;
  }

  /**
   *
   * @param directive SimpleComboBoxDirective | SearchEngineComboBoxDirective
   */
  async show<T extends ComboBoxDirective>(directive: T): Promise<T> {
    this.directive = directive;
    this.iterateListeners((cb) => cb.directiveAdded?.(directive));
    await new Promise<void>((resolve) => {
      const l = directive.registerListener({
        dismissed: () => {
          this.directive = null;
          resolve();
          l();
        }
      });
    });
    return directive;
  }
}
