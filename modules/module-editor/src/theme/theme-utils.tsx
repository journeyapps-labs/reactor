import * as monaco from 'monaco-editor';
import * as platform from 'monaco-editor/esm/vs/platform/registry/common/platform.js';
import { Extensions } from 'monaco-editor/esm/vs/platform/theme/common/colorRegistry.js';
import { Themes } from '@journeyapps-labs/reactor-mod';
import { colorToAHex } from '@journeyapps-labs/lib-reactor-utils';
import * as _ from 'lodash';

const THEME_JOURNEY = require('../../media/themes/journey.json5');
const THEME_REACTOR = require('../../media/themes/reactor.json5');
const THEME_OXIDE = require('../../media/themes/oxide.json5');
const THEME_SCARLET = require('../../media/themes/scarlet.json5');
const THEME_AYU_MIRAGE = require('../../media/themes/ayu-mirage.json5');
const THEME_AYU_LIGHT = require('../../media/themes/ayu-light.json5');

export type ColorContribution = {
  id: string;
  description: string;
  defaults: { dark: string; light: string; hc: string };
  needsTransparency: boolean;
  deprecationMessage: string;
};

export type ColorSchema = { description: string };

export type ColorRegistry = {
  colorsById: {
    [id: string]: ColorContribution;
  };
  colorSchema: {
    properties: {
      [id: string]: ColorSchema;
    };
  };
};

export type TokenColor = {
  name: string;
  scope: string;
  settings: {
    fontStyle: string;
    foreground: string;
    background: string;
  };
};

export type VSIXTheme = {
  name: string;
  tokenColors: TokenColor[];
  colors: { [key: string]: string };
};

export type VSIXPackage = {
  contributes: {
    themes: {
      label: string;
      path: string; //./themes/OneDark.json
      uiTheme: string; //'vs-dark'
    }[];
  };
};

export const normalizeVSCodeTheme = (themeObject: VSIXTheme): monaco.editor.IStandaloneThemeData => {
  const rules: monaco.editor.ITokenThemeRule[] = [];

  for (let token of themeObject.tokenColors) {
    // base theme
    if (!token.scope) {
      continue;
    }

    let scope: string[];
    if (Array.isArray(token.scope)) {
      scope = token.scope;
    } else {
      scope = token.scope.split(',').map((s) => s.trim());
    }

    if (scope.length === 0) {
      continue;
    }

    let foreground = colorToAHex(token.settings.foreground);
    let background = colorToAHex(token.settings.background);

    let tokenMapped = {};
    if (token.settings.fontStyle) {
      tokenMapped['fontStyle'] = token.settings.fontStyle;
    }
    if (foreground) {
      tokenMapped['foreground'] = foreground;
    }
    if (background) {
      tokenMapped['background'] = background;
    }

    scope.forEach((s) => {
      rules.push({ token: s, ...tokenMapped });
    });
  }

  return {
    base: 'vs-dark',
    inherit: true,
    colors: {
      ..._.pickBy(
        _.mapValues(themeObject.colors, (m) => {
          return colorToAHex(m);
        })
      ),
      'editor.background': colorToAHex(themeObject.colors['editor.background']) || '#00000000'
    },
    encodedTokensColors: [],
    rules: rules
  };
};

export const colorRegistry = (platform.Registry.data as Map<string, ColorRegistry>).get(Extensions.ColorContribution);

export const DARK_THEME = 'journey-dark';

export const COUPLED_IDE_THEMES = {
  [Themes.JOURNEY]: normalizeVSCodeTheme(THEME_JOURNEY.default),
  [Themes.REACTOR]: normalizeVSCodeTheme(THEME_REACTOR.default),
  [Themes.OXIDE]: normalizeVSCodeTheme(THEME_OXIDE.default),
  [Themes.SCARLET]: normalizeVSCodeTheme(THEME_SCARLET.default),
  [Themes.HEXAGON]: normalizeVSCodeTheme(THEME_AYU_MIRAGE.default),
  [Themes.REACTOR_LIGHT]: normalizeVSCodeTheme(THEME_AYU_LIGHT.default)
};
