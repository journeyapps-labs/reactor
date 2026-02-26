#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DEMO_DIR = path.join(ROOT, 'demo');
const SERVER_DIR = path.join(DEMO_DIR, 'server');
const MODE = process.argv[2] === 'start' ? 'start' : 'watch';
const CORE_MODULES = ['../../modules/module-reactor', '../../modules/module-editor'];

const DEPENDENCIES = {
  'module-playground': ['module-todos']
};

function getDemoModules() {
  const dirs = fs
    .readdirSync(DEMO_DIR)
    .filter((entry) => entry.startsWith('module-'))
    .filter((entry) => fs.existsSync(path.join(DEMO_DIR, entry, 'reactor.config.json')));

  return dirs
    .map((dir) => {
      const configPath = path.join(DEMO_DIR, dir, 'reactor.config.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return {
        dir,
        slug: config.slug || dir,
        name: config.name || dir
      };
    })
    .sort((a, b) => a.dir.localeCompare(b.dir));
}

function applyDependencies(selectedDirs) {
  const result = new Set(selectedDirs);
  const addedByDependency = new Set();

  let changed = true;
  while (changed) {
    changed = false;
    for (const dir of Array.from(result)) {
      const deps = DEPENDENCIES[dir] || [];
      for (const dep of deps) {
        if (!result.has(dep)) {
          result.add(dep);
          addedByDependency.add(dep);
          changed = true;
        }
      }
    }
  }

  return {
    selected: Array.from(result),
    addedByDependency: Array.from(addedByDependency)
  };
}

async function selectModules(modules, defaultDirs) {
  const inquirerImport = await import('inquirer');
  const prompt = inquirerImport.default?.prompt || inquirerImport.prompt;

  const choices = modules.map((module) => ({
    name: module.dir === 'module-playground' ? `${module.name} [requires module-todos]` : `${module.name}`,
    value: module.dir,
    checked: defaultDirs.includes(module.dir)
  }));

  const { selectedModules } = await prompt([
    {
      type: 'checkbox',
      name: 'selectedModules',
      message: 'Select demo modules to run',
      choices,
      loop: false,
      pageSize: Math.max(8, choices.length)
    }
  ]);

  if (!selectedModules || selectedModules.length === 0) {
    return defaultDirs;
  }

  return selectedModules;
}

async function run() {
  const modules = getDemoModules();
  if (modules.length === 0) {
    throw new Error('No demo modules found under demo/module-*');
  }

  const defaultDirs = ['module-todos', 'module-playground'].filter((dir) => modules.some((m) => m.dir === dir));

  const selected = await selectModules(modules, defaultDirs);
  const dependencyResolution = applyDependencies(selected);
  const selectedWithDeps = dependencyResolution.selected;
  if (dependencyResolution.addedByDependency.length > 0) {
    console.log(`Auto-selected dependency module(s): ${dependencyResolution.addedByDependency.join(', ')}`);
  }

  const orderedSelected = modules
    .filter((m) => selectedWithDeps.includes(m.dir))
    .sort((a, b) => {
      if (a.dir === 'module-todos' && b.dir === 'module-playground') {
        return -1;
      }
      if (a.dir === 'module-playground' && b.dir === 'module-todos') {
        return 1;
      }
      return a.dir.localeCompare(b.dir);
    })
    .map((m) => `../${m.dir}`);

  const moduleValue = [...CORE_MODULES, ...orderedSelected].join(',');

  console.log(`Starting demo server in ${MODE} mode...`);
  console.log(`MODULES=${moduleValue}`);

  const child = spawn('pnpm', ['run', MODE], {
    cwd: SERVER_DIR,
    env: {
      ...process.env,
      MODULES: moduleValue
    },
    stdio: 'inherit'
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

run().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
