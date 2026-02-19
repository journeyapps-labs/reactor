import { ActionStore, EntityAction, EntityActionEvent, ioc, inject } from '@journeyapps-labs/reactor-mod';
import { EditorTheme, MonacoThemeStore } from '../stores/MonacoThemeStore';
import { EditorThemeEntityDefinition } from '../entities/EditorThemeEntityDefinition';

export class ChangeEditorThemeAction extends EntityAction<EditorTheme> {
  static ID = 'CHANGE_EDITOR_THEME';
  static NAME = 'Change code theme';

  @inject(MonacoThemeStore)
  accessor reactorThemeStore: MonacoThemeStore;

  constructor() {
    super({
      name: ChangeEditorThemeAction.NAME,
      icon: 'paint-brush',
      id: ChangeEditorThemeAction.ID,
      target: EditorThemeEntityDefinition.TYPE
    });
  }

  protected async fireEvent(event: EntityActionEvent<EditorTheme>): Promise<any> {
    this.reactorThemeStore.selectedTheme.setItem(event.targetEntity);
  }

  static get() {
    return ioc.get(ActionStore).getAction<ChangeEditorThemeAction>(ChangeEditorThemeAction.NAME);
  }
}
