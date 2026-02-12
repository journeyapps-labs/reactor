import { autorun } from 'mobx';
import { AbstractDescendentContext } from './AbstractDescendentContext';

/**
 * This loads entities as tree nodes are opened. This allows Reactor to render fragments of otherwise enormously
 * large trees.
 */
export class LazyDescendentContext<E> extends AbstractDescendentContext<E> {
  listener_attach: () => any;
  listener_autorun: () => any;

  activate() {
    if (!this.options.node.collapsed) {
      this.setupEntities();
    }
    this.listener_attach = this.options.node.registerListener({
      collapsedChanged: () => {
        if (!this.options.node.collapsed) {
          this.setupEntities();
        }
      },
      attachedChanged: () => {
        if (!this.options.node.collapsed) {
          this.setupEntities();
        } else {
          this.listener_autorun?.();
          this.listener_parent?.();
        }
      }
    });
  }

  deactivate() {
    super.deactivate();
    this.listener_autorun?.();
    this.listener_attach?.();
  }

  setupEntities() {
    this.listener_autorun = autorun(
      () => {
        this.loadEntities();
      },
      { name: `LazyDescendentContext:${this.options.presenter.definition.type}` }
    );
  }
}
