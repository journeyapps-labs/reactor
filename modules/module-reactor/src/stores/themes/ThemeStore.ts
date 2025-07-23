import { AbstractStore } from '../AbstractStore';
import * as _ from 'lodash';
import { ColorDefinition, GetTheme, ThemeFragment } from './ThemeFragment';
import { ProviderControl } from '../../settings/ProviderControl';
import { ThemeProvider } from '../../providers/ThemeProvider';
import { EntityDefinition } from '../../entities/EntityDefinition';

export enum Themes {
  OXIDE = 'oxide',
  REACTOR = 'reactor',
  REACTOR_LIGHT = 'reactor-light',
  JOURNEY = 'journey',
  SCARLET = 'scarlet',
  HEXAGON = 'hexagon'
}

export interface Theme {
  key: string;
  label: string;
  core: true;
  light: boolean;
}

export class ThemeStore extends AbstractStore {
  protected themes: Map<string, Theme>;
  protected _fragments: Set<ThemeFragment>;
  public selectedTheme: ProviderControl<Theme>;

  constructor() {
    super({
      name: 'THEME_STORE'
    });
    this.themes = new Map();
    this._fragments = new Set();
    this.registerTheme({
      key: Themes.REACTOR,
      label: 'Reactor',
      core: true,
      light: false
    });
    this.registerTheme({
      key: Themes.REACTOR_LIGHT,
      label: 'Reactor Light',
      core: true,
      light: true
    });
    this.registerTheme({
      key: Themes.OXIDE,
      label: 'OXIDE',
      core: true,
      light: false
    });
    this.registerTheme({
      key: Themes.JOURNEY,
      label: 'JourneyApps',
      core: true,
      light: false
    });
    this.registerTheme({
      key: Themes.SCARLET,
      label: 'Scarlet',
      core: true,
      light: false
    });
    this.registerTheme({
      key: Themes.HEXAGON,
      label: 'Hexagon',
      core: true,
      light: false
    });

    this.selectedTheme = this.addControl(
      new ProviderControl<Theme>({
        provider: new ThemeProvider(),
        defaultEntity: this.themes.get(Themes.REACTOR),
        category: 'User',
        key: 'selected-theme',
        name: 'Selected theme'
      })
    );
  }

  getAllColorDefinitions(): ColorDefinition[] {
    return _.flatMap(this.fragments, (f) => f.getDefinitions());
  }

  getThemes() {
    return Array.from(this.themes.values());
  }

  registerTheme(theme: Theme) {
    this.themes.set(theme.key, theme);
  }

  addThemeFragment(fragment: ThemeFragment) {
    this._fragments.add(fragment);
  }

  get fragments() {
    return Array.from(this._fragments.values());
  }

  getThemeValues = _.memoize((theme: string) => {
    return this.fragments.reduce(
      (prev, curr) => {
        prev = {
          ...prev,
          ...curr.getThemeValues(theme)
        };
        return prev;
      },
      { light: this.themes.get(theme).light }
    ) as any;
  });

  getEntityOverrides = _.memoize(
    (theme: string, entity: EntityDefinition) => {
      const found = this.fragments.map((i) => i.entityOverrides.get(theme)).find((o) => o?.entities[entity.type]);
      if (found) {
        return found.entities[entity.type];
      }
      return {
        iconColor: entity.iconColorDefault
      };
    },
    (theme, entity) => `${theme}-${entity.type}`
  );

  getCurrentEntityTheme(entity: EntityDefinition) {
    return this.getEntityOverrides(this.selectedTheme.entity.key, entity);
  }

  getCurrentTheme<T extends ThemeFragment>(fragment?: T): GetTheme<T> & { light: boolean } {
    return this.getThemeValues(this.selectedTheme.entity.key);
  }
}
