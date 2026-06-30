import * as monaco from 'monaco-editor';
import { json as monacoJson } from 'monaco-editor/esm/vs/editor/editor.main.js';
import type { json as MonacoJson } from 'monaco-editor/esm/vs/editor/editor.main.js';
import * as _ from 'lodash';

export type MonacoJsonPathSegment = string | number;
export type MonacoJsonPathInput = string | MonacoJsonPathSegment[];

export type MonacoJsonPathLocationTarget = 'node' | 'key' | 'value' | 'property';

export interface MonacoJsonPathLocationOptions {
  target?: MonacoJsonPathLocationTarget;
}

export interface MonacoJsonPathLocationFromDocumentOptions extends MonacoJsonPathLocationOptions {
  document: MonacoJson.JSONDocument | null;
  model: monaco.editor.ITextModel;
  path: MonacoJsonPathInput;
}

export interface MonacoJsonPathLocationRequest extends MonacoJsonPathLocationOptions {
  model: monaco.editor.ITextModel;
  path: MonacoJsonPathInput;
}

export interface MonacoJsonPathLocation {
  line: number;
  column: number;
  offsetStart: number;
  offsetEnd: number;
}

export interface MonacoJsonPathResult {
  node: MonacoJson.ASTNode;
  propertyNode?: MonacoJson.PropertyASTNode;
}

const isObjectNode = (node: MonacoJson.ASTNode): node is MonacoJson.ObjectASTNode => {
  return node.type === 'object';
};

const isArrayNode = (node: MonacoJson.ASTNode): node is MonacoJson.ArrayASTNode => {
  return node.type === 'array';
};

const parseJsonPathPart = (path: string): MonacoJsonPathSegment[] => {
  const segments: MonacoJsonPathSegment[] = [];
  let token = '';

  const pushToken = () => {
    if (token.length > 0) {
      segments.push(token);
      token = '';
    }
  };

  for (let i = 0; i < path.length; i++) {
    const char = path[i];

    if (char === '.') {
      pushToken();
      continue;
    }

    if (char === '[') {
      pushToken();
      const end = path.indexOf(']', i + 1);
      if (end < 0) {
        throw new Error(`Invalid JSON path "${path}": missing closing bracket`);
      }

      const index = path.slice(i + 1, end).trim();
      if (!/^\d+$/.test(index)) {
        throw new Error(`Invalid JSON path "${path}": array indexes must be numeric`);
      }

      segments.push(Number(index));
      i = end;
      continue;
    }

    token += char;
  }

  pushToken();
  return segments;
};

const parseJsonPathPartMemoized = _.memoize(parseJsonPathPart);

export const parseMonacoJsonPath = (path: MonacoJsonPathInput): MonacoJsonPathSegment[] => {
  if (Array.isArray(path)) {
    return path.flatMap((segment) => {
      return typeof segment === 'string' ? parseJsonPathPartMemoized(segment) : [segment];
    });
  }

  return parseJsonPathPartMemoized(path).slice();
};

const findObjectProperty = (node: MonacoJson.ObjectASTNode, key: string) => {
  return node.properties.find((property) => {
    return property.keyNode.value === key;
  });
};

export const findMonacoJsonPathNode = (
  root: MonacoJson.ASTNode | undefined,
  path: MonacoJsonPathInput
): MonacoJsonPathResult | null => {
  if (!root) {
    return null;
  }

  const segments = parseMonacoJsonPath(path);
  let node: MonacoJson.ASTNode | undefined = root;
  let propertyNode: MonacoJson.PropertyASTNode | undefined;

  for (const segment of segments) {
    if (typeof segment === 'string') {
      if (!isObjectNode(node)) {
        return null;
      }

      propertyNode = findObjectProperty(node, segment);
      node = propertyNode?.valueNode;
      if (!node) {
        return null;
      }
      continue;
    }

    if (!isArrayNode(node)) {
      return null;
    }

    propertyNode = undefined;
    node = node.items[segment];
    if (!node) {
      return null;
    }
  }

  return {
    node,
    propertyNode
  };
};

const getTargetNode = (result: MonacoJsonPathResult, target: MonacoJsonPathLocationTarget) => {
  if (target === 'key') {
    return result.propertyNode?.keyNode || result.node;
  }

  if (target === 'property') {
    return result.propertyNode || result.node;
  }

  return result.node;
};

export const getMonacoJsonPathLocationFromDocument = (
  options: MonacoJsonPathLocationFromDocumentOptions
): MonacoJsonPathLocation | null => {
  const { document, model, path } = options;
  const result = findMonacoJsonPathNode(document?.root, path);
  if (!result) {
    return null;
  }

  const target = getTargetNode(result, options.target || 'value');
  const position = model.getPositionAt(target.offset);

  return {
    line: position.lineNumber,
    column: position.column,
    offsetStart: target.offset,
    offsetEnd: target.offset + target.length
  };
};

export const getMonacoJsonPathLocation = async (
  options: MonacoJsonPathLocationRequest
): Promise<MonacoJsonPathLocation | null> => {
  const { model, path } = options;
  const workerAccessor = await monacoJson.getWorker();
  const worker = await workerAccessor(model.uri);
  const document = await worker.parseJSONDocument(model.uri.toString());
  return getMonacoJsonPathLocationFromDocument({
    ...options,
    document,
    model,
    path
  });
};

export const clearMonacoJsonPathCache = () => {
  parseJsonPathPartMemoized.cache.clear?.();
};
