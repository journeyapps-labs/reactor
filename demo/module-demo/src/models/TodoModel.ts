import { BaseObserver } from '@journeyapps-labs/common-utils';
import { v4 } from 'uuid';

export interface TodoModelListener {
  deleted: () => any;
  becameActive: () => any;
}

export class TodoModel extends BaseObserver<TodoModelListener> {
  id: string;

  constructor(public name: string = '') {
    super();
    this.id = v4();
  }

  delete() {
    this.iterateListeners((cb) => cb.deleted?.());
  }

  makeActive() {
    this.iterateListeners((cb) => cb.becameActive?.());
  }
}
