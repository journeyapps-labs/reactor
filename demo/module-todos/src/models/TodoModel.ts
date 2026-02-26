import { BaseObserver } from '@journeyapps-labs/common-utils';
import { v4 } from 'uuid';
import { computed, observable } from 'mobx';
import { TodoNoteModel } from './TodoNoteModel';

export interface TodoModelListener {
  deleted: () => any;
  becameActive: () => any;
  childAdded: (event: { child: TodoModel }) => any;
  childRemoved: (event: { child: TodoModel }) => any;
  noteAdded: (event: { note: TodoNoteModel }) => any;
  noteRemoved: (event: { note: TodoNoteModel }) => any;
}

export class TodoModel extends BaseObserver<TodoModelListener> {
  id: string;
  parent: TodoModel | null;

  @observable
  protected accessor _children: Set<TodoModel>;
  @observable
  protected accessor _notes: Set<TodoNoteModel>;

  @observable
  accessor name: string;

  constructor(name: string = '') {
    super();
    this.name = name;
    this.id = v4();
    this.parent = null;
    this._children = new Set<TodoModel>();
    this._notes = new Set<TodoNoteModel>();
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

  addNote(note: TodoNoteModel) {
    note.parent = this;
    this._notes.add(note);
    this.iterateListeners((cb) =>
      cb.noteAdded?.({
        note
      })
    );
  }

  removeNote(note: TodoNoteModel) {
    if (!this._notes.has(note)) {
      return;
    }
    this._notes.delete(note);
    note.parent = null;
    this.iterateListeners((cb) =>
      cb.noteRemoved?.({
        note
      })
    );
  }

  @computed
  get children() {
    return Array.from(this._children.values());
  }

  @computed
  get notes() {
    return Array.from(this._notes.values());
  }

  async loadNotes(simulateError: boolean = false): Promise<TodoNoteModel[]> {
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
    if (simulateError) {
      throw new Error('There was a (simulated) server error trying to load notes.');
    }
    // Simulate a DB refresh by replacing the backing collection with fresh instances.
    this._notes = new Set(this.notes);
    return this.notes;
  }
}
