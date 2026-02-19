import { AbstractStore } from '../AbstractStore';
import * as _ from 'lodash';
import { ColorDefinition, GetTheme, ThemeFragment } from './ThemeFragment';
import { EntitySetting } from '../../settings/EntitySetting';
import { EntityDefinition } from '../../entities/EntityDefinition';
import { ReactorEntities } from '../../entities-reactor/ReactorEntities';

export enum Themes {
  OXIDE = 'oxide',
  REACTOR = 'reactor',
  REACTOR_DARK = 'reactor-dark',
  REACTOR_LIGHT = 'reactor-light',
  JOURNEY = 'journey',
  SCARLET = 'scarlet',
  HEXAGON = 'hexagon',
  BUNNY = 'bunny'
}

export class Theme {
  key: string;
  label: string;
  core: true;
  light: boolean;

  constructor(theme: { key: string; label: string; core: true; light: boolean }) {
    this.key = theme.key;
    this.label = theme.label;
    this.core = theme.core;
    this.light = theme.light;
  }
}

export class ThemeStore extends AbstractStore {
  protected themes: Map<string, Theme>;
  protected _fragments: Set<ThemeFragment>;
  public selectedTheme: EntitySetting<Theme>;

  constructor() {
    super({
      name: 'THEME_STORE'
    });
    this.themes = new Map();
    this._fragments = new Set();
    this.registerTheme(
      new Theme({
        key: Themes.REACTOR,
        label: 'Reactor',
        core: true,
        light: false
      })
    );
    this.registerTheme(
      new Theme({
        key: Themes.REACTOR_DARK,
        label: 'Reactor dark',
        core: true,
        light: false
      })
    );
    this.registerTheme(
      new Theme({
        key: Themes.REACTOR_LIGHT,
        label: 'Reactor Light',
        core: true,
        light: true
      })
    );
    this.registerTheme(
      new Theme({
        key: Themes.OXIDE,
        label: 'OXIDE',
        core: true,
        light: false
      })
    );
    this.registerTheme(
      new Theme({
        key: Themes.JOURNEY,
        label: 'JourneyApps',
        core: true,
        light: false
      })
    );
    this.registerTheme(
      new Theme({
        key: Themes.SCARLET,
        label: 'Scarlet',
        core: true,
        light: false
      })
    );
    this.registerTheme(
      new Theme({
        key: Themes.HEXAGON,
        label: 'Hexagon',
        core: true,
        light: false
      })
    );
    this.registerTheme(
      new Theme({
        key: Themes.BUNNY,
        label: 'Bunny',
        core: true,
        light: false
      })
    );

    this.selectedTheme = this.addControl(
      new EntitySetting<Theme>({
        type: ReactorEntities.THEME,
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

  getThemeByKey(key: string): Theme {
    return this.themes.get(key);
  }

  setSelectedTheme(theme: Theme) {
    this.selectedTheme.setItem(theme);
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
    const selectedThemeKey = this.selectedTheme.entity.key;
    return this.getEntityOverrides(selectedThemeKey, entity);
  }

  getCurrentTheme<T extends ThemeFragment>(fragment?: T): GetTheme<T> & { light: boolean } {
    const selectedThemeKey = this.selectedTheme.entity.key;
    return this.getThemeValues(selectedThemeKey);
  }
}
