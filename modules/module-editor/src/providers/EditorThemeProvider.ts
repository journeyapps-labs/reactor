import { SimpleProvider, SerializedEntity } from '@journeyapps-labs/reactor-mod';
import { EditorTheme, MonacoThemeStore } from '../stores/MonacoThemeStore';
import * as _ from 'lodash';
import { SearchEvent } from '@journeyapps-labs/lib-reactor-search';

export interface SerializedEditorTheme extends SerializedEntity {
  themeID: string;
}

export class EditorThemeProvider extends SimpleProvider<EditorTheme, SerializedEditorTheme> {
  static TYPE = 'editor-theme';

  themeStore: MonacoThemeStore;

  constructor(store: MonacoThemeStore) {
    super({
      cmdPallet: false,
      icon: 'paint-brush',
      displayName: 'Editor theme',
      type: EditorThemeProvider.TYPE
    });
    this.themeStore = store;
  }

  serialize(entity: EditorTheme): SerializedEditorTheme {
    return {
      ...super.serialize(entity),
      display: entity.label,
      themeID: entity.key
    };
  }

  async deserialize(entity: SerializedEditorTheme): Promise<EditorTheme> {
    return this.themeStore.getTheme(entity.themeID);
  }

  async getEntities(event: SearchEvent): Promise<EditorTheme[]> {
    return _.filter(this.themeStore.getThemes(), (theme) => {
      return !!event.matches(theme.label);
    });
  }
}
