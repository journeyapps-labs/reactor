import { Request, Response } from 'express';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import { CheerioAPI, load } from 'cheerio';

_.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;

const readFileCached = _.memoize(async (fileName: string) => {
  return await fs.promises.readFile(fileName, 'utf8');
});

export interface CreateHtmlGeneratorOptions {
  domTransform?: (data: CheerioAPI) => void;
  indexFile: string;
  templateVars?: {};
  title: string;
}

export const createHtmlGenerator = async (options: CreateHtmlGeneratorOptions) => {
  let index_data = await readFileCached(options.indexFile);

  // append the core stuff the to head which deals with ENV variables
  let index_fragment = await readFileCached(path.join(__dirname, '../media/core-fragment.html'));
  const $ = load(index_data);
  $('head').prepend(`<title>${options.title}</title>`);
  $('head').prepend(index_fragment);

  // optionally mutate even more
  options.domTransform?.($);

  // now turn it into a template so we can do variable substitution
  const template = _.template($.html());
  return (env: Record<string, string> = {}) => {
    return template({
      ENV: escapeEnv({
        ...env,
        NODE_ENV: process.env.NODE_ENV || 'development'
      }),
      ...(options.templateVars || {})
    });
  };
};

export interface CreateBaseIndexMiddlewareOptions extends CreateHtmlGeneratorOptions {
  transform?: (req: Request, res: Response, content: string) => Promise<string>;
  getEnv?: (req: Request) => Record<string, string | undefined>;
}

export const createBaseIndexMiddleware = async (options: CreateBaseIndexMiddlewareOptions) => {
  const generator = await createHtmlGenerator(options);
  return async (req: Request, res: Response) => {
    try {
      let env: Record<string, string | undefined> = options.getEnv?.(req) || {};
      let index_data = generator(env);
      if (options.transform) {
        index_data = await options.transform?.(req, res, index_data);
      }
      res.send(index_data);
      res.end();
    } catch (err) {
      res.status(500).end();
    }
  };
};

/**
 * Escape environment variables to protect against XSS.
 *
 * The resulting value is both valid JSON and valid JS, and is safe to inject directly in a <script> tag.
 */
export function escapeEnv(values: Record<string, string | undefined>): string {
  for (let value of Object.values(values)) {
    if (value != null && typeof value != 'string') {
      // This is not expected to happen. We just do this as an extra safety check, to avoid injecting nested values.
      throw new Error(`Invalid environment variable: ${value}`);
    }
  }
  return escapeForHtmlScript(values);
}

export function escapeForHtmlScript(value: any): string {
  /*
    Some background: https://dzone.com/articles/preventing-xss-vulnerabilities-when-developing-rub
    https://portswigger.net/web-security/cross-site-scripting/preventing
    Values injected in a <script> tag needs to be escaped for:
    1. JavaScript: JSON.stringify covers this.
    2. HTML: </script> in the middle of a JSON string still breaks out of the script. Using unicode escape sequences
    covers this. At minimum, '<' and '>' should be escaped. Being extra cautious, we escape most characters except for a small allow-list.
  */
  const jsSafe = JSON.stringify(value);
  // Our allow-list includes valid JSON control characters, allowing this to work on objects in addition to strings.

  return jsSafe.replace(/[^\w. ",:{}\\\[\]]/gi, (c) => '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4));
}
