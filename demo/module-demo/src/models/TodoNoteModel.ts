import { v4 } from 'uuid';
import { observable } from 'mobx';
import { TodoModel } from './TodoModel';

export class TodoNoteModel {
  id: string;
  parent: TodoModel | null;

  @observable
  accessor text: string;

  constructor(text: string) {
    this.id = v4();
    this.text = text;
    this.parent = null;
  }
}
