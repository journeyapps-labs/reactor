import { ReactorModuleConfig } from './ReactorConfig';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

export interface ReactorModuleOptions {
  directory: string;
  resolveGlobalEnv: (key: string) => string;
}

export class ReactorModule {
  protected confFile: string;
  protected conf?: ReactorModuleConfig;
  protected confPackage?: { name: string };
  protected fragment: string | null;

  constructor(public options: ReactorModuleOptions) {
    this.confFile = path.join(options.directory, 'reactor.config.json');
    this.confPackage = require(path.join(options.directory, 'package.json'));
    this.fragment = null;
    if (fs.existsSync(this.confFile)) {
      this.conf = require(this.confFile);
    } else {
      throw new Error(`No config file for ${options.directory} at ${this.confFile}`);
    }
  }

  getEnvs(): object {
    return this.config.env.reduce((prev: any, cur) => {
      prev[cur] = this.options.resolveGlobalEnv(cur);
      return prev;
    }, {});
  }

  get name() {
    return this.config.name;
  }

  get packageJson(): { name: string } {
    return this.confPackage;
  }

  get config(): ReactorModuleConfig {
    return {
      ...this.conf,
      env: this.conf.env ?? [],
      pwa: this.conf.pwa
        ? {
            manifest: path.join(this.options.directory, this.conf.pwa.manifest),
            serviceWorker: path.join(this.options.directory, this.conf.pwa.serviceWorker),
            other: _.mapValues(this.conf.pwa.other || {}, (val, key) => {
              return path.join(this.options.directory, val);
            })
          }
        : undefined
    };
  }

  get loaderPayload(): { fragmentData: string; background: string } | null {
    if (this.config.loader) {
      if (!this.fragment) {
        this.fragment = fs.readFileSync(path.join(path.dirname(this.confFile), this.config.loader.fragment), {
          encoding: 'utf-8'
        });
      }

      return {
        background: this.config.loader.backgroundColor,
        fragmentData: this.fragment
      };
    }
    return null;
  }
}

export const loadModules = (options: { env: { MODULES: string[] } & { [key: string]: any } }): ReactorModule[] => {
  return options.env.MODULES.map((m) => {
    let directory = path.join(process.cwd(), m);
    if (m.startsWith('@')) {
      // this should be the directory that contains the reactor config file
      directory = path.resolve(path.dirname(require.resolve(m, { paths: [process.cwd()] })), '..');
    }
    console.info(`Loaded module: ${directory}`);

    return new ReactorModule({
      resolveGlobalEnv: (key) => {
        return options.env[key] as string;
      },
      directory: directory
    });
  });
};
