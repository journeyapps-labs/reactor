#!/usr/bin/env node

const { globSync } = require('glob');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

let dep = {};

(async () => {
  const workspaces = yaml.load(
    await fs.promises.readFile(path.join(__dirname, '..', 'pnpm-workspace.yaml'), {
      encoding: 'utf8'
    })
  );

  for (let name of workspaces.packages) {
    const entries = globSync(name);
    entries.forEach((e) => {
      try {
        const file = require(path.join(__dirname, '..', e, 'package.json'));
        dep = {
          ...dep,
          ...file.dependencies
        };
      } catch (ex) {
        // can happen if checked-out on a branch with a module folder thats empty
      }
    });
  }

  const rootPackage = require(path.join(__dirname, '../package.json'));
  for (let k in rootPackage.pnpm?.overrides || {}) {
    let existing = rootPackage.pnpm.overrides[k];
    if (dep[k] && existing !== dep[k]) {
      rootPackage.pnpm.overrides[k] = dep[k];
      console.log(`patching override [${k}] ${existing} -> ${dep[k]}`);
    }
  }
  await fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(rootPackage, null, 2));
  console.log('pnpm overrides are up to date!');
})();
