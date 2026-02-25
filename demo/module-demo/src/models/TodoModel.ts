import { BaseObserver } from '@journeyapps-labs/common-utils';
import { v4 } from 'uuid';
import { computed, observable } from 'mobx';

export interface TodoModelListener {
  deleted: () => any;
  becameActive: () => any;
  childAdded: (event: { child: TodoModel }) => any;
  childRemoved: (event: { child: TodoModel }) => any;
}

export class TodoModel extends BaseObserver<TodoModelListener> {
  id: string;
  parent: TodoModel | null;

  @observable
  protected accessor _children: Set<TodoModel>;

  @observable
  accessor name: string;

  constructor(name: string = '') {
    super();
    this.name = name;
    this.id = v4();
    this.parent = null;
    this._children = new Set<TodoModel>();
  }

  delete() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.iterateListeners((cb) => cb.deleted?.());
  }

  makeActive() {
    this.iterateListeners((cb) => cb.becameActive?.());
  }

  addChild(child: TodoModel) {
    child.parent = this;
    this._children.add(child);
    this.iterateListeners((cb) =>
      cb.childAdded?.({
        child
      })
    );
  }

  removeChild(child: TodoModel) {
    if (!this._children.has(child)) {
      return;
    }
    this._children.delete(child);
    child.parent = null;
    this.iterateListeners((cb) =>
      cb.childRemoved?.({
        child
      })
    );
  }

  @computed
  get children() {
    return Array.from(this._children.values());
  }
}
