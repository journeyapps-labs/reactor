import { CreateStyled } from './emotion';
import s from '@emotion/styled';
import * as _ from 'lodash';
import { EntityDefinition } from '../../entities/EntityDefinition';

const s2 = (comp, options) => {
  return s(comp, {
    ...(options ? options : {}),
    shouldForwardProp: (propName: string) => !propName.startsWith('$')
  });
};
for (let key in s) {
  s2[key] = s[key];
}

export interface ThemeFragmentStructure {
  [category: string]: {
    label: string;
    colors: {
      [key: string]: string;
    };
  };
}

export interface ThemeFragmentOptions<T extends ThemeFragmentStructure> {
  structure: T;
}

export type ThemeColors<T extends ThemeFragmentStructure = ThemeFragmentStructure> = {
  [P in keyof T]: {
    [C in keyof T[P]['colors']]: string;
  };
};

export type GetTheme<C extends ThemeFragment> = C extends ThemeFragment<infer T> ? ThemeColors<T> : unknown;

export interface ThemeValues<T extends ThemeFragmentStructure> {
  name: string;
  values: ThemeColors<T>;
}

export interface EntityThemeOverride {
  name: string;
  entities: {
    [entity_type: string]: {
      iconColor: string;
    };
  };
}

export interface ColorDefinition {
  key: string;
  label: string;
  category: string;
  categoryLabel: string;
}

export class ThemeFragment<T extends ThemeFragmentStructure = ThemeFragmentStructure> {
  themes: Map<string, ThemeValues<T>>;
  entityOverrides: Map<string, EntityThemeOverride>;

  constructor(protected options: ThemeFragmentOptions<T>) {
    this.themes = new Map();
    this.entityOverrides = new Map();
  }

  getDefinitions(): ColorDefinition[] {
    return _.flatMap(this.options.structure, (category, categoryKey: string) => {
      return _.map(category.colors, (colorLabel, colorKey) => {
        return {
          category: categoryKey,
          categoryLabel: category.label,
          key: colorKey,
          label: colorLabel
        } as ColorDefinition;
      });
    });
  }

  addEntityThemeOverride(theme: EntityThemeOverride) {
    this.entityOverrides.set(theme.name, theme);
  }

  addThemeValues(theme: ThemeValues<T>): ThemeColors<T> {
    this.themes.set(theme.name, theme);
    return theme.values;
  }

  getThemeValues(key: string) {
    return this.themes.get(key).values;
  }

  styled(): CreateStyled<ThemeColors<T> & { light: boolean }> {
    return s2 as any;
  }

  styledExtends<T2 extends ThemeFragment>(
    fragment: T2
  ): CreateStyled<ThemeColors<T> & GetTheme<T2> & { light: boolean }> {
    return s2 as any;
  }
}
