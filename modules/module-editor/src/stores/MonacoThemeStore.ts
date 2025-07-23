import { COUPLED_IDE_THEMES, DARK_THEME, normalizeVSCodeTheme, VSIXTheme } from '../theme/theme-utils';
import {
  AbstractStore,
  ioc,
  ProviderControl,
  ProviderControlOptions,
  Themes,
  ThemeStore
} from '@journeyapps-labs/reactor-mod';
import * as _ from 'lodash';
import * as monaco from 'monaco-editor';
import { EditorThemeProvider } from '../providers/EditorThemeProvider';
import { StoredThemesSettings } from '../settings/StoredThemesSettings';
import * as uuid from 'uuid';

export interface EditorTheme {
  label: string;
  theme: monaco.editor.IStandaloneThemeData;
  key: string;
  system: boolean;
  compatibility: boolean;
}

export class EditorThemeControl extends ProviderControl<EditorTheme> {
  store: MonacoThemeStore;

  constructor(options: ProviderControlOptions<EditorTheme>, store: MonacoThemeStore) {
    super(options);
    this.store = store;
  }

  async reset() {
    // this ensures that resets cause the editor theme to follow the selected IDE theme
    const selectedTheme = await ioc.get(ThemeStore).selectedTheme.waitForReady();
    this.setItem(await this.store.getMonacoThemeForReactorTheme(selectedTheme.entity.key));
  }
}

export class MonacoThemeStore extends AbstractStore {
  selectedTheme: ProviderControl<EditorTheme>;
  storedThemes: StoredThemesSettings;
  additionalThemes: Map<string, string>;

  constructor() {
    super({
      name: 'MONACO_THEME_STORE'
    });
    this.additionalThemes = new Map();
    this.selectedTheme = this.addControl(
      new EditorThemeControl(
        {
          provider: new EditorThemeProvider(this),
          defaultEntity: this.getSystemThemes()[Themes.REACTOR],
          category: 'User',
          key: 'selected-editor-theme',
          name: 'Selected code theme',
          description: 'This is the syntax-color theme in the IDE',
          changed: (item) => {
            if (!!item) {
              monaco.editor.defineTheme(DARK_THEME, item.theme);
            }
          }
        },
        this
      )
    );
    this.storedThemes = this.addControl(new StoredThemesSettings());
  }

  clone(): EditorTheme {
    const editorTheme: EditorTheme = {
      theme: this.selectedTheme.entity.theme,
      key: uuid.v4(),
      label: `${this.selectedTheme.entity.label} copy`,
      system: false,
      compatibility: this.selectedTheme.entity.compatibility
    };
    this.storedThemes.themes.push(editorTheme);
    this.storedThemes.save();
    this.selectedTheme.setItem(editorTheme);
    return editorTheme;
  }

  patchTheme(editorTheme: EditorTheme) {
    const index = _.findIndex(this.storedThemes.themes, { key: editorTheme.key });
    this.storedThemes.themes[index] = editorTheme;
    this.storedThemes.save();
    this.selectedTheme.setItem(editorTheme);
    this.selectedTheme.save();
    monaco.editor.defineTheme(DARK_THEME, editorTheme.theme);
  }

  deleteTheme(editorTheme: EditorTheme) {
    if (this.selectedTheme.entity.key === editorTheme.key) {
      this.selectedTheme.setItem(_.values(this.getSystemThemes())[0]);
    }

    // delete theme
    const index = _.findIndex(this.storedThemes.themes, { key: editorTheme.key });
    this.storedThemes.themes.splice(index, 1);
    this.storedThemes.save();
  }

  addTheme(theme: VSIXTheme) {
    const editorTheme: EditorTheme = {
      theme: normalizeVSCodeTheme(theme),
      key: uuid.v4(),
      label: theme.name,
      system: false,
      compatibility: false
    };
    this.storedThemes.themes.push(editorTheme);
    this.storedThemes.save();
    this.selectedTheme.setItem(editorTheme);
  }

  getMonacoThemeForReactorTheme(theme: string) {
    const themeOb = this.getSystemThemes()[theme];
    if (themeOb) {
      return themeOb;
    }

    return this.getSystemThemes()[this.additionalThemes.get(theme)];
  }

  getSystemThemes(): { [key: string]: EditorTheme } {
    return _.mapKeys(
      [
        {
          key: Themes.JOURNEY,
          label: 'Journey dark',
          theme: COUPLED_IDE_THEMES[Themes.JOURNEY],
          system: true,
          compatibility: false
        },
        {
          key: Themes.REACTOR,
          label: 'Reactor dark',
          theme: COUPLED_IDE_THEMES[Themes.REACTOR],
          system: true,
          compatibility: false
        },
        {
          key: Themes.OXIDE,
          label: 'OXIDE dark',
          theme: COUPLED_IDE_THEMES[Themes.OXIDE],
          system: true,
          compatibility: true
        },
        {
          key: Themes.SCARLET,
          label: 'Scarlet',
          theme: COUPLED_IDE_THEMES[Themes.SCARLET],
          system: true,
          compatibility: true
        },
        {
          key: Themes.HEXAGON,
          label: 'Ayu Mirage',
          theme: COUPLED_IDE_THEMES[Themes.HEXAGON],
          system: true,
          compatibility: true
        },
        {
          key: Themes.REACTOR_LIGHT,
          label: 'Ayu Light',
          theme: COUPLED_IDE_THEMES[Themes.REACTOR_LIGHT],
          system: true,
          compatibility: true
        }
      ],
      (m) => m.key
    );
  }

  async getTheme(key: string): Promise<EditorTheme> {
    await this.storedThemes.waitForReady();
    return this.getThemes()[key] || null;
  }

  getThemes(): { [key: string]: EditorTheme } {
    return {
      ...this.getSystemThemes(),
      ..._.mapKeys(this.storedThemes.themes, (t) => t.key)
    };
  }
}
