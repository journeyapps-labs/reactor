import { AbstractDescendentContext } from './AbstractDescendentContext';
import { autorun, IReactionDisposer } from 'mobx';

export class ImmediateDescendentContext<E> extends AbstractDescendentContext<E> {
  listener_autorun: IReactionDisposer;

  activate() {
    this.listener_autorun = autorun(
      () => {
        this.loadEntities();
      },
      { name: `ImmediateDescendentContext:${this.options.presenter.definition.type}` }
    );
  }

  deactivate() {
    super.deactivate();
    this.listener_autorun?.();
  }
}
