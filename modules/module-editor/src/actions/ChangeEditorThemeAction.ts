import { EntityAction, EntityActionEvent, System, ioc, inject } from '@journeyapps-labs/reactor-mod';
import { EditorTheme, MonacoThemeStore } from '../stores/MonacoThemeStore';
import { EditorThemeProvider } from '../providers/EditorThemeProvider';

export class ChangeEditorThemeAction extends EntityAction<EditorTheme> {
  static NAME = 'Change code theme';

  @inject(MonacoThemeStore)
  accessor reactorThemeStore: MonacoThemeStore;

  constructor() {
    super({
      name: ChangeEditorThemeAction.NAME,
      icon: 'paint-brush',
      id: 'CHANGE_EDITOR_THEME',
      target: EditorThemeProvider.TYPE
    });
  }

  protected async fireEvent(event: EntityActionEvent<EditorTheme>): Promise<any> {
    this.reactorThemeStore.selectedTheme.setItem(event.targetEntity);
  }

  static get() {
    return ioc.get(System).getAction<ChangeEditorThemeAction>(ChangeEditorThemeAction.NAME);
  }
}
