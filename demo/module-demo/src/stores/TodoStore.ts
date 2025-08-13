import { TodoModel } from '../models/TodoModel';
import { computed, observable } from 'mobx';

export class TodoStore {
  @observable
  protected accessor _todos: Set<TodoModel>;

  @observable
  accessor activeTodo: TodoModel;

  constructor() {
    this._todos = new Set<TodoModel>();
    this.activeTodo = null;
  }

  addTodo(todo: TodoModel) {
    let l1 = todo.registerListener({
      deleted: () => {
        this._todos.delete(todo);
        l1();
      },
      becameActive: () => {
        this.activeTodo = todo;
      }
    });
    this._todos.add(todo);
  }

  @computed
  get todos() {
    return Array.from(this._todos.values());
  }
}
