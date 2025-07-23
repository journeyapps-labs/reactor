import { ComboBoxDirective } from './ComboBoxDirective';
import { makeObservable, observable } from 'mobx';
import { BaseListener, BaseObserver } from '@journeyapps-labs/lib-reactor-utils';

export interface ComboBoxStore2Listener extends BaseListener {
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
