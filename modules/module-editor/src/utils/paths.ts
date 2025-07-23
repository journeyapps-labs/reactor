import type * as monaco from 'monaco-editor';
const LOCAL_URI_PREFIX = 'file:///';
import * as _ from 'lodash';
import { extname } from 'path';

export interface BranchFile {
  appID: string;
  branch: string;
  path: string;
}

// file:///12341-234-1234/test3_-4.1234/1234/1234/1234/1234
// file:///<app_id>/<branch>/<path>
const pathRegex = /^\/([\w|\d|-]*)\/([^\/]*)\/(.*)$/;

const _uriToPath = _.memoize((path: string) => {
  const matches = pathRegex.exec(path);
  if (matches) {
    return {
      appID: matches[1],
      branch: decodeURIComponent(matches[2]),
      path: matches[3]
    };
  }
});
/**
 * Take a Monaco model URI, and covert it to a path in the local repo.
 * If the URI does not reference a valid local path, null is returned.
 * No checks are performed on whether or not the referenced file exists.
 */
export const uriToPath = (uri: monaco.Uri): BranchFile | null => {
  // monaco.Uri#toString() is broken - a path of "%2F" in uri.path is turned into "%252F".
  // `uri.path` bypasses that.
  if (uri.toString().startsWith(LOCAL_URI_PREFIX)) {
    return _uriToPath(uri.path);
  } else {
    return null;
  }
};

/**
 * Given a local filename, return a monaco Uri.
 * @param path The local path, e.g. schema.xml or mobile/main.js
 */
export function pathToUri(path: BranchFile, _monaco: typeof monaco): monaco.Uri {
  // monaco.Uri.parse is broken, and won't be fixed. A URL of "file:///some%2Fbranch" is turned into { path: "/some/branch" }.
  // monaco.Uri.file avoids keeps the path intact.
  // https://github.com/microsoft/vscode/issues/45515
  return _monaco.Uri.file(`/${path.appID}/${encodeURIComponent(path.branch)}/${path.path}`);
}

const getIdealLanguageFromPath = _.memoize((path) => {
  const ext = extname(path);
  switch (ext) {
    case '.html':
    case '.htm': {
      return 'html';
    }
    case '.js': {
      return 'javascript';
    }
    case '.json': {
      return 'json';
    }
    case '.md': {
      return 'markdown';
    }
    case '.ts': {
      return 'typescript';
    }
    case '.tsx': {
      return 'typescript';
    }
    case '.jsx': {
      return 'typescript';
    }
    case '.css': {
      return 'css';
    }
    case '.scss': {
      // This mapping is not perfect, but it's decent at least.
      return 'css';
    }
    case '.handlebars': {
      return 'handlebars';
    }
    case '.xml': {
      if (path.endsWith('.view.xml') || path.endsWith('schema.xml')) {
        return 'jxml';
      }
      return 'xml';
    }
    case '.py': {
      return 'python';
    }
    case '.yml':
    case '.yaml':
    case '.lock': {
      return 'yaml';
    }
    default: {
      return 'text';
    }
  }
});

/**
 * Given a path or filename return a language based on the file extension. Optionally accepts a file_length
 * parameter (1 char = 2 bytes) which, if too large, will result in 'text' being returned regardless of
 * language
 */
export function getLanguageFromFile(file: string, file_length?: number) {
  const mime = getIdealLanguageFromPath(file);

  // html can be impossibly large to parse
  const MAX_CONTENT_LENGTH = 250 * 1024;
  if (mime === 'html' && file_length && file_length * 2 > MAX_CONTENT_LENGTH) {
    return 'text';
  }

  return mime;
}
