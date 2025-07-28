import * as path from 'path';
// @ts-ignore
import { stat, writeFile } from 'fs/promises';
import * as _ from 'lodash';
import { args } from '../yargs';

export interface PackageDef {
  dependencies: { [key: string]: string };
  devDependencies: { [key: string]: string };
}

export interface FoundReactModules {
  path: string;
  package: PackageDef;
}

args.command<{ module: string; entry: boolean; watch: boolean }>(
  `sync-packages`,
  'sync reactor library versions',
  (y) => {
    return y;
  },
  async (yargs) => {
    const modulePath = process.cwd();
    const packagePath = path.join(modulePath, 'package.json');
    const packageJson: PackageDef = require(packagePath);

    // !------ find the reactor modules ------
    const foundModules = new Map<string, FoundReactModules>();
    for (let dependency of Object.keys(packageJson.dependencies)) {
      let dependencyPath = path.join(modulePath, 'node_modules', dependency);
      let reactorConfPath = path.join(dependencyPath, 'reactor.config.json');
      try {
        await stat(reactorConfPath);
        const depPackageFile = require(path.join(dependencyPath, 'package.json'));
        foundModules.set(dependency, {
          package: depPackageFile,
          path: dependencyPath
        });
      } catch (ex) {}
    }

    //!------- find the valid dependencies -------

    let dirty = false;
    for (let [moduleName, payload] of foundModules.entries()) {
      _.forEach(
        { ...(payload.package.dependencies || {}), ...(payload.package.devDependencies || {}) },
        (version, name) => {
          // dont check reactor module versions
          if (foundModules.has(name)) {
            return;
          }
          if (version.indexOf('workspace') !== -1) {
            return;
          }

          // check everything else
          const sanitized = version.replace('^', '');

          if (packageJson.dependencies[name] && packageJson.dependencies[name] !== sanitized) {
            console.log(`patching dep [${name}] from ${packageJson.dependencies[name]} -> ${sanitized}`);
            packageJson.dependencies[name] = sanitized;
            dirty = true;
          } else if (packageJson.devDependencies[name] && packageJson.devDependencies[name] !== sanitized) {
            console.log(`patching dep [${name}] from ${packageJson.devDependencies[name]} -> ${sanitized}`);
            packageJson.devDependencies[name] = sanitized;
            dirty = true;
          }
        }
      );
    }

    // !------- patch ----------
    if (dirty) {
      await writeFile(packagePath, JSON.stringify(packageJson, null, '  '), {
        encoding: 'utf8',
        flag: 'w'
      });
      console.log('patched');
    }
  }
);
