/**
 * @vitest-environment jsdom
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import * as monaco from 'monaco-editor';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import { JSONWorker } from 'monaco-editor/esm/vs/language/json/jsonWorker.js';
import {
  getMonacoJsonPathLocation,
  getMonacoJsonPathLocationFromDocument,
  parseMonacoJsonPath
} from '../../src/utils/json/monacoJsonPath';

const json = `{
  "thing": {
    "something": [
      {
        "other": "first"
      },
      {
        "other": "second"
      }
    ]
  },
  "flags": [
    "valid",
    "invalid"
  ]
}`;

const createJsonModel = () => {
  return monaco.editor.createModel(json, 'json', monaco.Uri.parse(`inmemory://model/${crypto.randomUUID()}.json`));
};

const createJsonWorker = (model: monaco.editor.ITextModel) => {
  return new JSONWorker(
    {
      getMirrorModels: () => [
        {
          uri: model.uri,
          version: model.getVersionId(),
          getValue: () => model.getValue()
        }
      ]
    },
    {
      languageId: 'json',
      languageSettings: monaco.languages.json.jsonDefaults.diagnosticsOptions
    }
  );
};

describe('monacoJsonPath', () => {
  const models: monaco.editor.ITextModel[] = [];
  let originalCSS: typeof globalThis.CSS;

  beforeAll(() => {
    originalCSS = globalThis.CSS;
    // Monaco expects CSS.escape, which is a browser API that jsdom does not currently implement.
    if (!globalThis.CSS) {
      Object.defineProperty(globalThis, 'CSS', {
        configurable: true,
        value: {}
      });
    }
    if (!globalThis.CSS.escape) {
      Object.defineProperty(globalThis.CSS, 'escape', {
        configurable: true,
        value: (value: string) => String(value)
      });
    }
  });

  afterAll(() => {
    Object.defineProperty(globalThis, 'CSS', {
      configurable: true,
      value: originalCSS
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    while (models.length) {
      models.pop()?.dispose();
    }
  });

  it('parses dotted paths with array indexes', () => {
    expect(parseMonacoJsonPath('thing.something[4].other')).toEqual(['thing', 'something', 4, 'other']);
    expect(parseMonacoJsonPath(['thing.something[4].other'])).toEqual(['thing', 'something', 4, 'other']);
    expect(parseMonacoJsonPath(['thing', 'something[4]', 'other'])).toEqual(['thing', 'something', 4, 'other']);
  });

  it('finds value locations from a Monaco JSON document', async () => {
    const model = createJsonModel();
    models.push(model);
    const worker = createJsonWorker(model);
    const document = await worker.parseJSONDocument(model.uri.toString());

    const location = getMonacoJsonPathLocationFromDocument(document, model, 'flags[1]');
    const offsetStart = json.indexOf('"invalid"');
    const position = model.getPositionAt(offsetStart);

    expect(location).toEqual({
      line: position.lineNumber,
      column: position.column,
      offsetStart,
      offsetEnd: offsetStart + '"invalid"'.length
    });
  });

  it('finds nested key and property locations from a Monaco JSON document', async () => {
    const model = createJsonModel();
    models.push(model);
    const worker = createJsonWorker(model);
    const document = await worker.parseJSONDocument(model.uri.toString());

    const keyLocation = getMonacoJsonPathLocationFromDocument(document, model, 'thing.something[1].other', {
      target: 'key'
    });
    const propertyLocation = getMonacoJsonPathLocationFromDocument(document, model, 'thing.something[1].other', {
      target: 'property'
    });

    const keyOffset = json.lastIndexOf('"other"', json.indexOf('"second"'));

    expect(keyLocation?.offsetStart).toBe(keyOffset);
    expect(keyLocation?.offsetEnd).toBe(keyOffset + '"other"'.length);
    expect(propertyLocation?.offsetStart).toBe(keyOffset);
    expect(propertyLocation?.offsetEnd).toBe(json.indexOf('"second"') + '"second"'.length);
  });

  it('can resolve locations through the async Monaco model helper', async () => {
    const model = createJsonModel();
    models.push(model);
    const worker = createJsonWorker(model);
    vi.spyOn(monaco.languages.json, 'getWorker').mockResolvedValue(async () => worker);

    const location = await getMonacoJsonPathLocation(model, 'thing.something[1].other');
    const offsetStart = json.indexOf('"second"');

    expect(location?.offsetStart).toBe(offsetStart);
    expect(location?.offsetEnd).toBe(offsetStart + '"second"'.length);
  });
});
