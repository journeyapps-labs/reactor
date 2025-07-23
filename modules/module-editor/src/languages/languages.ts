const js = require('../../media/javascript.tmLanguage');
const xml = require('../../media/xml.tmLanguage');
const jxml = require('../../media/jxml.tmLanguage');
const json = require('../../media/json.tmLanguage');
const html = require('../../media/html.tmLanguage');
const css = require('../../media/css.tmLanguage');
const markdown = require('../../media/markdown.tmLanguage');
const yaml = require('../../media/yaml.tmLanguage');
const sql = require('../../media/sql.tmLanguage');
const handlebars = require('../../media/handlebars.tmLanguage');
const typescript = require('../../media/typescript.tmLanguage');
const regularExpressions = require('../../media/regularExpressions.tmLanguage');
import * as monaco from 'monaco-editor';

export enum MonacoLanguages {
  JSON = 'json',
  JAVASCRIPT = 'javascript',
  XML = 'xml',
  JXML = 'jxml',
  HTML = 'html',
  CSS = 'css',
  YAML = 'yaml',
  MARKDOWN = 'markdown',
  SQL = 'sql',
  TS = 'typescript',
  HANDLEBARS = 'handlebars'
}

export enum MonacoLanguageScopes {
  JAVASCRIPT = 'source.js',
  XML = 'text.xml',
  JXML = 'text.jxml',
  JSON = 'source.json',
  HTML = 'text.html.basic',
  CSS = 'source.css',
  YAML = 'source.yaml',
  MARKDOWN = 'text.html.markdown',
  SQL = 'source.sql',
  TS = 'source.ts',
  REGEX = 'source.js.regexp',
  HANDLEBARS = 'handlebars.html'
}

export interface GrammerMappingEntry {
  format: 'json' | 'plist';
  url: string;
  monaco?: MonacoLanguages;
  language?: Partial<monaco.languages.ILanguageExtensionPoint>;
  hook?: () => any;
}

export interface GrammerMappingType {
  [key: string]: GrammerMappingEntry;
}

// Actual extension lookup occurs in
// lib-utils/src/paths.ts#getIdealLanguageFromPath
export const GrammerMapping: GrammerMappingType = {
  [MonacoLanguageScopes.JAVASCRIPT]: {
    format: 'json',
    url: js,
    monaco: MonacoLanguages.JAVASCRIPT
  },
  [MonacoLanguageScopes.XML]: {
    format: 'json',
    url: xml,
    monaco: MonacoLanguages.XML,
    language: {
      id: 'xml',
      extensions: ['.xml', '.dtd', '.ascx', '.csproj', '.config', '.wxi', '.wxl', '.wxs', '.xaml', '.svg', '.svgz'],
      firstLine: '(\\<\\?xml.*)|(\\<svg)|(\\<\\!doctype\\s+svg)',
      aliases: ['XML', 'xml'],
      mimetypes: ['text/xml', 'application/xml', 'application/xaml+xml', 'application/xml-dtd']
    }
  },
  [MonacoLanguageScopes.JXML]: {
    format: 'json',
    url: jxml,
    monaco: MonacoLanguages.JXML,
    language: {
      id: 'jxml',
      extensions: ['.view.xml'],
      firstLine: '(\\<\\?xml.*)|(\\<svg)|(\\<\\!doctype\\s+svg)',
      aliases: [],
      mimetypes: ['application/xml']
    }
  },
  [MonacoLanguageScopes.JSON]: {
    format: 'plist',
    url: json,
    monaco: MonacoLanguages.JSON,
    hook: () => {
      monaco.languages.json.jsonDefaults.setModeConfiguration({
        ...monaco.languages.json.jsonDefaults.modeConfiguration,
        tokens: false
      });
    }
  },
  [MonacoLanguageScopes.HTML]: {
    format: 'json',
    url: html,
    monaco: MonacoLanguages.HTML,
    language: {
      extensions: ['.html', '.htm', '.shtml', '.xhtml', '.mdoc', '.jsp', '.asp', '.aspx', '.jshtm'],
      aliases: ['HTML', 'htm', 'html', 'xhtml'],
      mimetypes: ['text/html', 'text/x-jshtm', 'text/template', 'text/ng-template']
    }
  },
  [MonacoLanguageScopes.HANDLEBARS]: {
    format: 'plist',
    url: handlebars,
    monaco: MonacoLanguages.HANDLEBARS,
    language: {
      extensions: ['.handlebars'],
      aliases: ['handlebars'],
      mimetypes: ['text/html']
    }
  },
  [MonacoLanguageScopes.CSS]: {
    format: 'plist',
    url: css,
    monaco: MonacoLanguages.CSS,
    language: {
      extensions: ['.css', '.scss'],
      aliases: ['CSS', 'css'],
      mimetypes: ['text/css']
    }
  },
  [MonacoLanguageScopes.YAML]: {
    format: 'json',
    url: yaml,
    monaco: MonacoLanguages.YAML,
    language: {
      extensions: ['.yaml', '.yml', '.lock'],
      aliases: ['YAML', 'yaml', 'YML', 'yml'],
      mimetypes: ['application/x-yaml']
    }
  },
  [MonacoLanguageScopes.MARKDOWN]: {
    format: 'plist',
    url: markdown,
    monaco: MonacoLanguages.MARKDOWN,
    language: {
      extensions: ['.md', '.markdown', '.mdown', '.mkdn', '.mkd', '.mdwn', '.mdtxt', '.mdtext'],
      aliases: ['Markdown', 'markdown']
    }
  },
  [MonacoLanguageScopes.SQL]: {
    format: 'plist',
    url: sql,
    monaco: MonacoLanguages.SQL,
    language: {
      extensions: ['.sql'],
      aliases: ['SQL']
    }
  },
  [MonacoLanguageScopes.TS]: {
    format: 'plist',
    url: typescript,
    monaco: MonacoLanguages.TS,
    language: {
      extensions: ['.ts', '.js', '.tsx', '.jsx'],
      aliases: ['TypeScript', 'JavaScript']
    }
  },
  [MonacoLanguageScopes.REGEX]: {
    format: 'plist',
    url: regularExpressions
  }
};
