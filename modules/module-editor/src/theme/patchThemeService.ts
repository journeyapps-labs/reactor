import { StandaloneServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices';
import { IConfigurationService } from 'monaco-editor/esm/vs/platform/configuration/common/configuration';
import { IThemeService } from 'monaco-editor/esm/vs/platform/theme/common/themeService';

interface ITokenStyle {
  readonly foreground?: number;
  readonly bold?: boolean;
  readonly underline?: boolean;
  readonly italic?: boolean;
}

/**
 * Patch standaloneThemeService to implement semantic highlighting.
 *
 * This may eventually become redundant when Monaco implements proper support.
 *
 * Based on: https://github.com/TypeFox/monaco-languageclient/issues/209#issuecomment-619531624
 * Tracking feature: https://github.com/microsoft/monaco-editor/issues/1833
 */
export function patchThemeService() {
  const s = StandaloneServices.get(IConfigurationService);
  s.updateValues([
    [
      'editor.semanticHighlighting',
      {
        enabled: true
      }
    ]
  ]);

  const ThemeClass = StandaloneServices.get(IThemeService)._theme.constructor;

  /**
   *
   * @param type
   * @param modifiers
   * @param modelLanguage - undefined for now, will include the language later in a future version
   */
  ThemeClass.prototype.getTokenStyleMetadata = function (
    type: string,
    modifiers: string[],
    modelLanguage?: string
  ): ITokenStyle {
    // Map to the default textmate-based style, based on the theme
    let rule = registry.match(type, modifiers);
    if (!rule) {
      return undefined;
    }
    const mapped = rule.scopes[0];

    const defaultStyle = this.tokenTheme._root.match(mapped);
    if (defaultStyle == null) {
      return undefined;
    }
    const style = {
      foreground: defaultStyle._foreground,
      // If background is supported: background: style._background,
      italic: (defaultStyle._fontStyle & 1) != 0,
      bold: (defaultStyle._fontStyle & 2) != 0,
      underline: (defaultStyle._fontStyle & 4) != 0
    };

    // ### Custom additions
    // A better solution would be to implement `semanticTokenColors`, and define that in the themes.
    // However, that is a lot more work than just defining some logic here.
    if (modifiers.includes('async')) {
      style.italic = true;
    }

    return style;
  };
}

interface TokenRule {
  modifiers: string[];
  scopes: string[];
}

class TokenRule {
  constructor(
    public modifiers: string[],
    public scopes: string[]
  ) {}

  matches(modifiers: string[]) {
    for (let modifier of this.modifiers) {
      if (!modifiers.includes(modifier)) {
        return false;
      }
    }
    return true;
  }
}

class TokenRegistry {
  private tokens: Record<string, TokenRule[]> = {};

  registerMap(selector: string, scopes: string[]) {
    const [token, ...modifiers] = selector.split('.');
    if (!(token in this.tokens)) {
      this.tokens[token] = [];
    }
    this.tokens[token].push(new TokenRule(modifiers, scopes));
    this.tokens[token].sort((a, b) => {
      // Prioritize rules with the most modifiers
      return b.modifiers.length - a.modifiers.length;
    });
  }

  match(token: string, modifiers: string[]) {
    if (!(token in this.tokens)) {
      return undefined;
    }
    const rules = this.tokens[token];
    if (!rules) {
      return undefined;
    }
    for (let rule of rules) {
      if (rule.matches(modifiers)) {
        return rule;
      }
    }
    return undefined;
  }
}

// Source: https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#semantic-token-scope-map
// Also see: https://github.com/microsoft/vscode/blob/602d2a217c6fd4c25afc14467ead4eae0c7923ce/src/vs/platform/theme/common/tokenClassificationRegistry.ts
const MAP: Record<string, string[]> = {
  namespace: ['entity.name.namespace'],
  type: ['entity.name.type'],
  'type.defaultLibrary': ['support.type'],
  struct: ['storage.type.struct'],
  class: ['entity.name.type.class'],
  'class.defaultLibrary': ['support.class'],
  interface: ['entity.name.type.interface'],
  enum: ['entity.name.type.enum'],
  function: ['entity.name.function'],
  'function.defaultLibrary': ['support.function'],
  member: ['entity.name.function.member'],
  macro: ['entity.name.other.preprocessor.macro'],
  variable: ['variable.other.readwrite', 'entity.name.variable'],
  'variable.readonly': ['variable.other.constant'],
  parameter: ['variable.parameter'],
  property: ['variable.other.property'],
  'property.readonly': ['variable.other.constant.property'],
  enumMember: ['variable.other.enummember'],
  event: ['variable.other.event']
};

// Source: https://github.com/microsoft/vscode/blob/1495b3c0677c1f2901bc90707ae7b0b5929a9c11/extensions/javascript/package.json#L93
const JS_OVERRIDES = {
  property: ['variable.other.property.js'],
  'property.readonly': ['variable.other.constant.property.js'],
  variable: ['variable.other.readwrite.js'],
  'variable.readonly': ['variable.other.constant.object.js'],
  function: ['entity.name.function.js'],
  namespace: ['entity.name.type.module.js'],
  'variable.defaultLibrary': ['support.variable.js'],
  'function.defaultLibrary': ['support.function.js']
};

// We keep the overrides separate, to better keep track of them
const JOURNEY_OVERRIDES = {
  // Add custom overrides here
};

const combined = {
  ...MAP,
  ...JS_OVERRIDES,
  ...JOURNEY_OVERRIDES
};

const registry = new TokenRegistry();
for (let selector in combined) {
  if (combined[selector]) {
    registry.registerMap(selector, combined[selector]);
  }
}
